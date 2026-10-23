import { mkdir, writeFile } from 'node:fs/promises';
import { getEnv, requireEnv } from '../config/env.js';
import { incrementMetric, isPaused } from '../db/control.js';
import { advance } from '../db/queue.js';
import type { ProspectStatus } from '../domain/status.js';
import { logger } from '../lib/logger.js';
import { acoesPara, classifyReply, type Categoria } from '../replies/classify.js';
import { block, prospectByEmail, reactivateDue, replyKnown, saveReply, setRetomar } from '../replies/store.js';
import { SnovClient } from '../snov/client.js';
import { parseReply } from '../snov/replies.js';
import { formatLead, notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'respostas' });
const SEIS_MESES_MS = 182 * 24 * 60 * 60 * 1000;

const STATUS: Record<Categoria, ProspectStatus> = {
  quer_ver: 'respondeu_quer_ver',
  interesse: 'respondeu_interesse',
  outro: 'respondeu_interesse',
  nao: 'respondeu_nao',
  descadastro: 'respondeu_descadastro',
  ausente: 'respondeu_ausente',
};

// Reads the campaign replies from Snov, classifies the new ones and acts on them.
// `--amostra` saves the raw replies to out/snov-respostas.json to check field names.
// With DRY_RUN=true it only classifies and writes out/respostas.md: no status change, no block.
async function main(): Promise<void> {
  const env = getEnv();
  requireEnv('ANTHROPIC_API_KEY');
  const campaignId = requireEnv('SNOV_CAMPAIGN_ID');
  if (await isPaused()) {
    log.warn('Sistema pausado (controle.pausado). Respostas não foram processadas.');
    return;
  }
  const snov = new SnovClient({ clientId: requireEnv('SNOV_CLIENT_ID'), clientSecret: requireEnv('SNOV_CLIENT_SECRET') });

  if (!env.DRY_RUN) {
    const reativados = await reactivateDue();
    if (reativados) log.info('Prospects "agora não" voltaram para a fila após 6 meses', { quantidade: reativados });
  }

  const brutas = await snov.getEmailReplies(campaignId);
  await mkdir('out', { recursive: true });
  if (process.argv.includes('--amostra')) {
    await writeFile('out/snov-respostas.json', JSON.stringify(brutas.slice(0, 5), null, 2));
    log.info('Amostra salva em out/snov-respostas.json', { respostas: brutas.length, campos: Object.keys(brutas[0] ?? {}) });
  }

  const linhas: string[] = [];
  for (const raw of brutas) {
    const r = parseReply(raw);
    if (!r) {
      log.warn('Resposta sem email ou texto reconhecível; confira com --amostra', { campos: Object.keys(raw) });
      continue;
    }
    if (await replyKnown(r.id)) continue;
    const p = await prospectByEmail(r.email);
    if (!p) {
      // `--teste`: replies from the addresses used in snov:teste are classified and announced, nothing is saved.
      if (process.argv.includes('--teste')) {
        const c = await classifyReply(env.MODEL_FAST, env.SENDER_BRAND, { empresa: r.email, texto: r.texto });
        const acoes = acoesPara(c);
        linhas.push(`| ${r.email} (teste) | ${r.texto.replace(/\s+/g, ' ').replace(/\|/g, '/').slice(0, 90)} | ${c.categoria} | ${c.confianca.toFixed(2)} | ${acoes.join(' + ')} | ${c.resumo.replace(/\|/g, '/')} |`);
        await notify(formatLead({ nome: null, empresa: 'Teste', dominio: null, email: r.email, categoria: c.categoria, resumo: c.resumo, texto: r.texto }));
        log.info('Resposta de teste classificada', { email: r.email, categoria: c.categoria, acoes });
      } else log.warn('Resposta de email que não está no banco', { email: r.email });
      continue;
    }
    const c = await classifyReply(env.MODEL_FAST, env.SENDER_BRAND, { empresa: p.empresa ?? p.dominio ?? r.email, texto: r.texto });
    const acoes = acoesPara(c);
    linhas.push(`| ${p.dominio ?? r.email} | ${r.texto.replace(/\s+/g, ' ').replace(/\|/g, '/').slice(0, 90)} | ${c.categoria} | ${c.confianca.toFixed(2)} | ${acoes.join(' + ')} | ${c.resumo.replace(/\|/g, '/')} |`);
    log.info('Resposta classificada', { dominio: p.dominio, categoria: c.categoria, confianca: c.confianca, acoes });
    if (acoes.includes('notificar_moura')) {
      await notify(formatLead({ nome: p.primeiro_nome ?? null, empresa: p.empresa, dominio: p.dominio, email: r.email, categoria: c.categoria, resumo: c.resumo, texto: r.texto }));
    }
    if (env.DRY_RUN) continue;

    await saveReply({ snov_id: r.id, prospect_id: p.id, texto: r.texto, recebida_em: r.recebida_em, c, acoes });
    await incrementMetric('respostas', 1);
    if (c.categoria === 'quer_ver' || c.categoria === 'interesse') await incrementMetric('positivas', 1);
    if (acoes.includes('bloquear')) {
      await snov.addToDoNotEmailList([r.email]);
      await block(r.email, p.dominio, `respondeu: ${c.resumo}`.slice(0, 300));
      await incrementMetric('descadastros', 1);
    }
    if (acoes.includes('retomar_6_meses')) await setRetomar(p.id, new Date(Date.now() + SEIS_MESES_MS));
    const destino = STATUS[c.categoria];
    try {
      await advance(p, destino);
    } catch (err) {
      log.warn('Status do prospect não mudou', { dominio: p.dominio, de: p.status, para: destino, err });
    }
    // gerar_esboco runs from the new status (esbocos).
  }

  await writeFile('out/respostas.md', [
    `# Respostas da campanha${env.DRY_RUN ? ' (prévia, DRY_RUN=true: nada foi alterado)' : ''}`, '',
    '| Site | Resposta | Categoria | Confiança | Ações | Resumo |', '| --- | --- | --- | ---: | --- | --- |',
    ...linhas, '',
  ].join('\n'));
  log.info('Relatório salvo em out/respostas.md', { novas: linhas.length, total_snov: brutas.length });
}

main().catch((err: unknown) => {
  log.error('respostas:ler falhou', { err });
  process.exitCode = 1;
});
