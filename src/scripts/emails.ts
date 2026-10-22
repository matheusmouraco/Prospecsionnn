import { mkdir, writeFile } from 'node:fs/promises';
import { getEnv, requireEnv } from '../config/env.js';
import { isPaused } from '../db/control.js';
import { advance, claimProspects, fail, release } from '../db/queue.js';
import { generateEmail, SemProblemasSuficientes } from '../email/generate.js';
import { renderEmailReport, type EmailReportItem } from '../email/report.js';
import { deleteUnsent, loadEmailInput, saveEmail } from '../email/store.js';
import { logger } from '../lib/logger.js';

const log = logger.child({ etapa: 'email' });

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

// Phase 4. `npm run emails -- --limit 10` writes the Snov custom fields for analyzed prospects,
// saves them in `emails`, moves them to email_pronto and writes out/emails.md. Nothing is sent.
// `--refazer` rewrites the emails already in email_pronto (not sent yet) in the current format.
async function main(): Promise<void> {
  const env = getEnv();
  requireEnv('ANTHROPIC_API_KEY');
  const limit = Number(arg('limit') ?? env.BATCH_SIZE);
  if (await isPaused()) {
    log.warn('Sistema pausado (controle.pausado). Nenhum email foi gerado.');
    return;
  }

  const refazer = process.argv.includes('--refazer');
  const batch = await claimProspects(refazer ? 'email_pronto' : 'analisado', limit);
  log.info('Prospects para escrever email', { quantidade: batch.length });
  const items: EmailReportItem[] = [];

  for (const p of batch) {
    try {
      if (!p.empresa_id) throw new Error('Prospect sem empresa');
      const dados = await loadEmailInput(p.empresa_id);
      const email = await generateEmail({ ...dados, primeiro_nome: p.primeiro_nome });
      if (refazer) await deleteUnsent(p.id);
      await saveEmail(p.id, email);
      if (refazer) await release(p);
      else await advance(p, 'email_pronto');
      items.push({ dominio: dados.dominio, primeiro_nome: p.primeiro_nome, email });
      log.info('Email pronto', { dominio: dados.dominio, tentativas: email.tentativas });
    } catch (err) {
      if (err instanceof SemProblemasSuficientes) log.warn('Sem problemas suficientes para o email', { prospect: p.id, err });
      else log.error('Falha ao gerar email', { prospect: p.id, err });
      await fail(p, err).catch((e: unknown) => log.error('Falha ao registrar erro', { err: e }));
    }
  }

  if (items.length) {
    await mkdir('out', { recursive: true });
    await writeFile('out/emails.md', renderEmailReport(items, env.SENDER_NAME, env.SENDER_BRAND));
    const custo = items.reduce((s, i) => s + i.email.custo_usd, 0);
    log.info('Relatório salvo em out/emails.md', { emails: items.length, custo_usd: Number(custo.toFixed(4)) });
  }
}

main().catch((err: unknown) => {
  log.error('emails falhou', { err });
  process.exitCode = 1;
});
