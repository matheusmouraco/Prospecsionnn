import { mkdir, writeFile } from 'node:fs/promises';
import { analyzeSite, type Analise } from '../analysis/analyze.js';
import { launchBrowser } from '../analysis/browser.js';
import { renderReport, type ReportItem } from '../analysis/report.js';
import { getEmpresa, saveAnalise } from '../analysis/store.js';
import { getEnv, requireEnv } from '../config/env.js';
import { isPaused } from '../db/control.js';
import { advance, claimProspects, fail, markInProgress, type ProspectRow } from '../db/queue.js';
import { logger } from '../lib/logger.js';

const OUT_DIR = 'out/analises';
const log = logger.child({ etapa: 'analise' });

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

// Phase 3. `npm run analyze -- --limit 10` analyzes queued prospects (status novo) and writes
// out/analises.md. `npm run analyze -- --dominio site.com.br` analyzes one site without touching the queue.
async function main(): Promise<void> {
  const env = getEnv();
  const pagespeedKey = requireEnv('PAGESPEED_API_KEY');
  requireEnv('ANTHROPIC_API_KEY');
  const limit = Number(arg('limit') ?? env.BATCH_SIZE);
  const dominio = arg('dominio');

  const browser = await launchBrowser();
  const items: ReportItem[] = [];
  const decide = (a: Analise) => (a.nota_site >= env.MIN_SITE_SCORE_TO_SKIP ? 'descartado_site_bom' : 'analisado') as ReportItem['decisao'];

  try {
    if (dominio) {
      const analise = await analyzeSite({ dominio, empresa: null, lista: null }, { browser, pagespeedKey, outDir: OUT_DIR });
      items.push({ analise, empresa: null, decisao: decide(analise) });
    } else {
      if (await isPaused()) {
        log.warn('Sistema pausado (controle.pausado). Nada foi analisado.');
        return;
      }
      // Stuck rows first (crashed mid-analysis, lock expired), then new ones.
      const stuck = await claimProspects('analisando', limit);
      const fresh = stuck.length < limit ? await claimProspects('novo', limit - stuck.length) : [];
      const batch: ProspectRow[] = [...stuck, ...fresh];
      log.info('Prospects para analisar', { quantidade: batch.length });

      for (const prospect of batch) {
        const p = { ...prospect };
        try {
          if (p.status === 'novo') {
            await markInProgress(p, 'analisando');
            p.status = 'analisando';
          }
          if (!p.empresa_id) throw new Error('Prospect sem empresa');
          const empresa = await getEmpresa(p.empresa_id);
          log.info('Analisando', { dominio: empresa.dominio });
          const analise = await analyzeSite(
            { dominio: empresa.dominio, empresa: empresa.nome, lista: p.lista_origem },
            { browser, pagespeedKey, outDir: OUT_DIR },
          );
          const decisao = decide(analise);
          await saveAnalise(empresa.id, analise);
          await advance(p, decisao);
          items.push({ analise, empresa: empresa.nome, decisao });
          log.info('Análise concluída', { dominio: empresa.dominio, nota: analise.nota_site, decisao, problemas: analise.problemas.length });
        } catch (err) {
          log.error('Falha na análise', { prospect: p.id, err });
          await fail(p, err).catch((e: unknown) => log.error('Falha ao registrar erro', { err: e }));
        }
      }
    }
  } finally {
    await browser.close();
  }

  if (items.length) {
    await mkdir('out', { recursive: true });
    await writeFile('out/analises.md', renderReport(items, env.MIN_SITE_SCORE_TO_SKIP));
    const custo = items.reduce((s, i) => s + i.analise.custo_usd, 0);
    log.info('Relatório salvo em out/analises.md', { sites: items.length, custo_usd: Number(custo.toFixed(3)) });
  }
}

main().catch((err: unknown) => {
  log.error('analyze falhou', { err });
  process.exitCode = 1;
});
