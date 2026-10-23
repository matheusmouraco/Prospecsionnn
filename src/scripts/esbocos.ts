import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { launchBrowser } from '../analysis/browser.js';
import { getEnv, requireEnv } from '../config/env.js';
import { isPaused } from '../db/control.js';
import { createDraft, type Esboco } from '../draft/pipeline.js';
import { draftCandidates, empresaIdByDomain, loadDraftInput, saveDraft } from '../draft/store.js';
import { prints } from '../flow/lead-esboco.js';
import { logger } from '../lib/logger.js';
import { publicarEsboco } from '../publish/publicar.js';
import { sendMessageWithButtons, sendPhoto } from '../telegram/client.js';

const OUT_DIR = 'out/esbocos';
const log = logger.child({ etapa: 'esboco' });

// On the Mac each finished draft opens in the browser right away (off on the VPS or with --sem-abrir).
function abrir(dominio: string): void {
  if (process.platform !== 'darwin' || process.argv.includes('--sem-abrir')) return;
  spawn('open', [join(OUT_DIR, dominio, 'index.html')], { detached: true, stdio: 'ignore' }).unref();
}

// Each finished draft is published on DRAFT_BASE_URL (Moura's decision, --sem-publicar turns it off) and
// goes to Telegram with the desktop and phone prints and the link, so he reviews it from anywhere.
async function publicarEAvisar(dominio: string, nota: number, empresa: string): Promise<void> {
  const env = getEnv();
  let link: string | null = null;
  if (!process.argv.includes('--sem-publicar') && env.VERCEL_TOKEN) {
    try {
      link = await publicarEsboco(dominio);
      log.info('Esboço publicado', { dominio, link });
    } catch (err) {
      log.warn('Não consegui publicar o esboço', { dominio, err });
    }
  }
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID || process.argv.includes('--sem-telegram')) return;
  try {
    const p = await prints(dominio);
    await sendPhoto(env.TELEGRAM_CHAT_ID, p.desktop, `🎨 Esboço pronto: ${empresa} (${dominio}), nota ${nota}. Computador`);
    await sendPhoto(env.TELEGRAM_CHAT_ID, p.mobile, 'Celular');
    await sendMessageWithButtons(env.TELEGRAM_CHAT_ID, [
      `🎨 ${empresa}`,
      `Site atual: https://${dominio}`,
      link ? `Esboço no ar: ${link}` : 'Não consegui publicar; veja os prints acima.',
    ].join('\n'), [[{ texto: '✏️ Ajustar', dados: `/ajustar ${dominio}` }, { texto: '✅ Aprovar', dados: `/aprovar ${dominio}` }]]);
  } catch (err) {
    log.warn('Não consegui mandar o esboço no Telegram', { dominio, err });
  }
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

// Phase 5. `npm run esbocos -- --limit 5` builds drafts for analyzed prospects without one;
// `--dominio site.com.br` builds one for a specific company. Renders locally, publishes nothing.
async function main(): Promise<void> {
  const env = getEnv();
  requireEnv('ANTHROPIC_API_KEY');
  const whatsapp = requireEnv('SENDER_WHATSAPP_URL');
  if (await isPaused()) {
    log.warn('Sistema pausado (controle.pausado). Nenhum esboço foi gerado.');
    return;
  }

  const dominio = arg('dominio');
  const refazer = process.argv.includes('--refazer');
  const ids = dominio ? [await empresaIdByDomain(dominio)] : await draftCandidates(Number(arg('limit') ?? 5), refazer);
  log.info('Esboços para gerar', { quantidade: ids.length });

  const browser = await launchBrowser();
  const feitos: (Esboco & { slug: string })[] = [];
  try {
    for (const id of ids) {
      try {
        const input = await loadDraftInput(id);
        if (!input.referencias.length) log.warn('Nenhuma referência capturada; rode npm run referencias antes', { dominio: input.dominio });
        log.info('Gerando esboço', { dominio: input.dominio, referencias: input.referencias.map((r) => r.url) });
        const e = await createDraft(input, {
          browser, outDir: OUT_DIR, agencia: env.SENDER_BRAND, legal: { razao: env.SENDER_RAZAO_SOCIAL, cnpj: env.SENDER_CNPJ }, whatsapp, model: env.MODEL_DESIGN, minScore: env.JUDGE_MIN_SCORE,
        });
        const slug = await saveDraft(id, input.empresa, e);
        feitos.push({ ...e, slug });
        if (e.html) {
          abrir(e.dominio);
          await publicarEAvisar(e.dominio, e.nota, input.empresa);
        }
        log.info(e.aprovado ? 'Esboço aprovado' : 'Esboço abaixo da nota mínima', { dominio: e.dominio, nota: e.nota, tentativas: e.tentativas, custo_usd: Number(e.custo_usd.toFixed(3)) });
      } catch (err) {
        log.error('Falha ao gerar esboço', { empresa: id, err });
      }
    }
  } finally {
    await browser.close();
  }

  if (feitos.length) {
    await mkdir('out', { recursive: true });
    await writeFile('out/esbocos.md', report(feitos, env.JUDGE_MIN_SCORE));
    log.info('Relatório salvo em out/esbocos.md', { esbocos: feitos.length, custo_usd: Number(feitos.reduce((s, e) => s + e.custo_usd, 0).toFixed(3)) });
  }
}

function report(items: (Esboco & { slug: string })[], min: number): string {
  const lines = [
    '# Esboços gerados', '',
    `Gerado em ${new Date().toISOString()}. Nota mínima do juiz: ${min}. Abra o index.html de cada pasta no navegador.`, '',
    '| Site | Referências | Nota | Situação | Tentativas | Custo | Arquivo |',
    '| --- | --- | ---: | --- | ---: | ---: | --- |',
    ...items.map((e) => `| ${e.dominio} | ${e.referencias.map((u) => new URL(u).hostname.replace(/^www\./, '')).join(', ') || '-'} | ${e.nota} | ${e.aprovado ? 'aprovado' : 'abaixo da nota, avisar Moura'} | ${e.tentativas} | US$ ${e.custo_usd.toFixed(2)} | \`out/esbocos/${e.dominio}/index.html\` |`),
    '',
  ];
  for (const e of items) {
    lines.push(`## ${e.dominio} (nota ${e.nota})`, '');
    if (e.juizo) {
      lines.push(
        `- **Resumo do juiz:** ${e.juizo.resumo}`,
        `- **Notas:** nível das referências ${e.juizo.nivel_referencia}, originalidade ${e.juizo.originalidade}, marca ${e.juizo.fidelidade_marca}, celular ${e.juizo.legibilidade_celular}, conteúdo ${e.juizo.conteudo}`,
      );
      if (e.juizo.feedback.length) lines.push(`- **Pontos a melhorar:** ${e.juizo.feedback.join('; ')}`);
    }
    lines.push(`- **Comparativo medido:** ${e.ganhos.map((g) => `${g.item} (${g.atual} > ${g.proposta})`).join('; ') || 'nenhum'}`);
    if (e.recusas.length) lines.push(`- **Versões recusadas pelas regras:** ${e.recusas.map((r) => r.join(', ')).join(' | ')}`);
    lines.push(`- **Aprovação:** pendente. Depois de revisar no navegador: \`npm run esbocos:aprovar -- ${e.dominio}\``, `- **Endereço futuro:** /${e.slug}`, '');
  }
  return lines.join('\n');
}

main().catch((err: unknown) => {
  log.error('esbocos falhou', { err });
  process.exitCode = 1;
});
