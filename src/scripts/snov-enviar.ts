import { mkdir, writeFile } from 'node:fs/promises';
import { getEnv, requireEnv } from '../config/env.js';
import { incrementMetric, isPaused } from '../db/control.js';
import { advance, claimProspects, fail } from '../db/queue.js';
import { logger } from '../lib/logger.js';
import { SnovClient } from '../snov/client.js';
import { enviadosHoje, isBlocked, loadEnvio, markSent, type EnvioPronto } from '../snov/outreach-store.js';

const log = logger.child({ etapa: 'envio' });

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

// Sends `email_pronto` prospects to the Snov outreach list (the campaign starts on its own).
// Respects MAX_NEW_PER_DAY. With DRY_RUN=true nothing is sent: it only writes out/envio.md.
async function main(): Promise<void> {
  const env = getEnv();
  const listId = requireEnv('SNOV_OUTREACH_LIST_ID');
  if (await isPaused()) {
    log.warn('Sistema pausado (controle.pausado). Nada foi enviado.');
    return;
  }
  const restante = Math.max(0, env.MAX_NEW_PER_DAY - (await enviadosHoje()));
  const limit = Math.min(restante, Number(arg('limit') ?? restante));
  if (!limit) {
    log.info('Limite diário de envios atingido', { max: env.MAX_NEW_PER_DAY });
    return;
  }

  const snov = env.DRY_RUN ? null : new SnovClient({ clientId: requireEnv('SNOV_CLIENT_ID'), clientSecret: requireEnv('SNOV_CLIENT_SECRET') });
  const batch = await claimProspects('email_pronto', limit);
  log.info(env.DRY_RUN ? 'Prévia de envio (DRY_RUN, nada será enviado)' : 'Enviando para a campanha', { quantidade: batch.length, lista: listId });

  const linhas: (EnvioPronto & { situacao: string })[] = [];
  for (const p of batch) {
    try {
      const e = await loadEnvio(p.id);
      if (await isBlocked(e.email, e.dominio)) {
        linhas.push({ ...e, situacao: 'bloqueado, não enviado' });
        continue;
      }
      if (!snov) {
        linhas.push({ ...e, situacao: 'prévia (DRY_RUN)' });
        continue;
      }
      const r = await snov.addProspectToList(listId, {
        email: e.email, firstName: e.primeiro_nome, companyName: e.empresa, companySite: e.dominio ? `https://${e.dominio}` : null, customFields: e.campos,
      });
      if (!r.ok) throw new Error(`Snov não confirmou a inclusão: ${JSON.stringify(r.raw).slice(0, 300)}`);
      await markSent(e.email_id);
      await advance(p, 'enviado_snov');
      await incrementMetric('enviados', 1);
      linhas.push({ ...e, situacao: r.updated && !r.added ? 'já existia no Snov, atualizado' : 'enviado' });
      log.info('Prospect na campanha', { dominio: e.dominio });
    } catch (err) {
      log.error('Falha no envio', { prospect: p.id, err });
      await fail(p, err);
    }
  }
  // In DRY_RUN the claimed prospects stay in email_pronto; the 15-minute lock simply expires.

  await mkdir('out', { recursive: true });
  await writeFile('out/envio.md', report(linhas, env.DRY_RUN));
  log.info('Relatório salvo em out/envio.md', { linhas: linhas.length });
}

function report(linhas: (EnvioPronto & { situacao: string })[], dry: boolean): string {
  const cel = (s: string) => s.replace(/\|/g, '/').replace(/\s+/g, ' ');
  return [
    `# Envio para o Snov${dry ? ' (prévia, DRY_RUN=true)' : ''}`, '',
    'Cada linha é o que vai para os custom fields do prospect no Snov.', '',
    ...linhas.flatMap((l) => [
      `## ${l.dominio ?? l.email} (${l.situacao})`, '',
      `- **Para:** ${l.email}`,
      ...Object.entries(l.campos).map(([k, v]) => `- **${k}:** ${cel(v)}`),
      '',
    ]),
  ].join('\n');
}

main().catch((err: unknown) => {
  log.error('snov:enviar falhou', { err });
  process.exitCode = 1;
});
