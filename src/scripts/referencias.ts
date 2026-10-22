import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser } from '../analysis/browser.js';
import { getEnv, requireEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { captureManual, captureReferencia, describeReferencia, listManuais, type Ficha } from '../references/capture.js';
import { loadLista } from '../references/list.js';
import { loadFichas } from '../references/select.js';

const log = logger.child({ etapa: 'referencias' });

// Captures every site in referencias/lista.txt and every image in referencias/manuais
// (prints + design notes). Already captured ones are skipped; `--refazer` recaptures all.
async function main(): Promise<void> {
  const env = getEnv();
  requireEnv('ANTHROPIC_API_KEY');
  const refazer = process.argv.includes('--refazer');
  const lista = await loadLista();
  const prontas = new Set((await loadFichas()).map((f) => f.slug));
  const pendentes = lista.filter((r) => refazer || !prontas.has(r.slug));
  const manuais = (await listManuais()).filter((m) => refazer || !prontas.has(m.ref.slug));
  log.info('Referências', { total: lista.length, a_capturar: pendentes.length, prints_manuais: manuais.length });

  const browser = await launchBrowser();
  const falhas: string[] = [];
  try {
    for (const ref of pendentes) {
      try {
        log.info('Capturando referência', { url: ref.url });
        const facts = await captureReferencia(browser, ref);
        const ficha = await describeReferencia(env.MODEL_FAST, ref, facts);
        log.info('Ficha pronta', { url: ref.url, segmentos: ficha.segmentos, nivel: ficha.nivel, animacao: ficha.bibliotecas });
      } catch (err) {
        falhas.push(ref.url);
        log.error('Falha ao capturar referência', { url: ref.url, err });
      }
    }
    for (const m of manuais) {
      try {
        log.info('Lendo print manual', { arquivo: m.ref.url });
        await captureManual(browser, m.ref, m.file);
        const ficha = await describeReferencia(env.MODEL_FAST, m.ref, null);
        log.info('Ficha pronta', { arquivo: m.ref.url, segmentos: ficha.segmentos, nivel: ficha.nivel });
      } catch (err) {
        falhas.push(m.ref.url);
        log.error('Falha ao ler print manual', { arquivo: m.ref.url, err });
      }
    }
  } finally {
    await browser.close();
  }

  const fichas = await loadFichas();
  await mkdir('out', { recursive: true });
  await writeFile('out/referencias.md', report(fichas, falhas));
  log.info('Catálogo salvo em out/referencias.md', { prontas: fichas.length, falhas: falhas.length });
}

function report(fichas: (Ficha & { slug: string })[], falhas: string[]): string {
  const sorted = [...fichas].sort((a, b) => b.nivel - a.nivel);
  return [
    '# Referências de design', '',
    '| Site | Segmentos | Nível | Favorito |', '| --- | --- | ---: | --- |',
    ...sorted.map((f) => `| ${f.url} | ${f.segmentos.join(', ')} | ${f.nivel} | ${f.favorito ? 'sim' : ''} |`),
    '',
    ...(falhas.length ? ['## Não capturadas', '', ...falhas.map((u) => `- ${u}`), ''] : []),
    ...sorted.flatMap((f) => [`## ${f.url}`, '', `- **Estilo:** ${f.estilo}`, `- **Tipografia:** ${f.tipografia}`, `- **Paleta:** ${f.paleta}`, `- **Padrões:** ${f.padroes.join('; ')}`, `- **Destaques:** ${f.destaques.join('; ')}`, `- **Movimento:** ${f.movimento ?? '-'} (${(f.bibliotecas ?? []).join(', ') || 'sem biblioteca'})`, '']),
  ].join('\n');
}

main().catch((err: unknown) => {
  log.error('referencias falhou', { err });
  process.exitCode = 1;
});
