import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { devices } from 'playwright';
import { launchBrowser } from '../analysis/browser.js';
import { getEnv, requireEnv } from '../config/env.js';
import { claimProspects, markInProgress } from '../db/queue.js';
import { markPublished, setApproval } from '../draft/store.js';
import { logger } from '../lib/logger.js';
import { revealPage } from '../lib/page.js';
import { runNpm } from '../lib/run.js';
import { publicarTodos } from '../publish/publicar.js';
import { SnovClient } from '../snov/client.js';
import { loadEnvio } from '../snov/outreach-store.js';
import { sendMessageWithButtons, sendPhoto } from '../telegram/client.js';
import { notify } from '../telegram/notify.js';
import { loadLead, setStatus, type LeadEsboco } from './store.js';

const log = logger.child({ etapa: 'esboco-lead' });
const DIR = 'out/esbocos';
const htmlPath = (dominio: string) => join(DIR, dominio, 'index.html');

async function prints(dominio: string): Promise<{ desktop: Buffer; mobile: Buffer }> {
  const html = await readFile(htmlPath(dominio), 'utf8');
  const browser = await launchBrowser();
  try {
    const shot = async (opts: Parameters<typeof browser.newContext>[0]) => {
      const ctx = await browser.newContext(opts);
      const page = await ctx.newPage();
      await page.setContent(html, { waitUntil: 'load', timeout: 45_000 }).catch(() => undefined);
      await revealPage(page);
      const png = await page.screenshot();
      await ctx.close();
      return png;
    };
    return { desktop: await shot({ viewport: { width: 1440, height: 900 } }), mobile: await shot({ ...devices['iPhone 13'] }) };
  } finally {
    await browser.close();
  }
}

// Sends Moura the draft for review, with the approve / adjust / skip buttons.
export async function pedirAprovacao(lead: LeadEsboco): Promise<void> {
  const dono = requireEnv('TELEGRAM_CHAT_ID');
  const p = await prints(lead.dominio);
  await sendPhoto(dono, p.desktop, `${lead.empresa ?? lead.dominio} (computador)`);
  await sendPhoto(dono, p.mobile, 'Celular');
  await sendMessageWithButtons(dono,
    `🎨 ${lead.empresa ?? lead.dominio} pediu o esboço (${lead.email}).\nConfere acima. Aprovando, eu publico e mando o link para o lead.`,
    [[{ texto: '✅ Aprovar e enviar', dados: `/esb_ok ${lead.id}` }, { texto: '✏️ Ajustar', dados: `/esb_aj ${lead.id}` }], [{ texto: '🚫 Não enviar', dados: `/esb_no ${lead.id}` }]]);
}

// Cycle: leads who asked for the draft (or asked about price) get one generated, then wait for Moura.
export async function cicloEsbocos(limit = 3): Promise<number> {
  const leads = [...await claimProspects('respondeu_quer_ver', limit), ...await claimProspects('respondeu_interesse', limit)];
  for (const p of leads) {
    try {
      await markInProgress(p, 'gerando_esboco');
      const lead = await loadLead(p.id);
      if (!lead.esboco || !existsSync(htmlPath(lead.dominio))) {
        log.info('Gerando esboço para lead', { dominio: lead.dominio });
        const r = await runNpm('esbocos', ['--dominio', lead.dominio, '--sem-abrir']);
        if (r.code !== 0 || !existsSync(htmlPath(lead.dominio))) throw new Error(`esbocos falhou: ${r.saida.slice(-500)}`);
      }
      await pedirAprovacao(await loadLead(p.id));
    } catch (err) {
      log.error('Falha no esboço do lead', { prospect: p.id, err });
      await notify(`⚠️ Não consegui preparar o esboço do lead ${p.id}: ${err instanceof Error ? err.message.slice(0, 300) : String(err)}`);
    }
  }
  return leads.length;
}

// Approve button: publish (production unless DRY_RUN) and hand the link to the Snov "esboço pronto" list.
export async function aprovarEEnviar(prospectId: string): Promise<string> {
  const env = getEnv();
  const lead = await loadLead(prospectId);
  if (lead.status !== 'gerando_esboco') return `Esse lead já foi tratado (situação: ${lead.status}).`;
  await setApproval(lead.dominio, true);
  const base = env.DRAFT_BASE_URL.replace(/\/$/, '');
  const slug = await markPublished(lead.dominio, await readFile(htmlPath(lead.dominio), 'utf8'), base);
  const pub = await publicarTodos();
  const link = pub.producao ? `${base}/${slug}` : `${pub.deploy}/${slug}`;
  if (env.DRY_RUN) return `🔎 [DRY_RUN] Esboço aprovado e publicado em prévia: ${link}\nNada foi enviado ao lead.`;

  const listId = requireEnv('SNOV_DRAFT_LIST_ID');
  const e = await loadEnvio(prospectId).catch(() => null);
  const snov = new SnovClient({ clientId: requireEnv('SNOV_CLIENT_ID'), clientSecret: requireEnv('SNOV_CLIENT_SECRET') });
  const r = await snov.addProspectToList(listId, {
    email: lead.email, firstName: lead.primeiro_nome, fullName: lead.primeiro_nome ?? lead.empresa ?? lead.email.split('@')[0],
    companyName: lead.empresa, companySite: `https://${lead.dominio}`, customFields: { ...(e?.campos ?? {}), link_esboco: link },
  });
  if (!r.ok) throw new Error(`Snov não incluiu o lead na lista do esboço: ${JSON.stringify(r.raw).slice(0, 200)}`);
  await setStatus(prospectId, 'gerando_esboco', 'esboco_publicado');
  await setStatus(prospectId, 'esboco_publicado', 'link_enviado');
  return `✅ Publicado e enviado para ${lead.email}:\n${link}`;
}

export async function ajustar(prospectId: string, pedido: string): Promise<string> {
  const lead = await loadLead(prospectId);
  const file = join(tmpdir(), `ajuste-${prospectId}.txt`);
  await writeFile(file, pedido.split(/\n|;/).map((l) => l.trim()).filter(Boolean).join('\n'));
  const r = await runNpm('esbocos:ajustar', [lead.dominio, '--pedidos', file]);
  if (r.code !== 0) return `Não consegui ajustar: ${r.saida.slice(-400)}`;
  await pedirAprovacao(lead);
  return 'Ajustado. Confere a nova versão acima.';
}

export async function naoEnviar(prospectId: string): Promise<string> {
  const lead = await loadLead(prospectId);
  if (lead.status !== 'gerando_esboco') return `Esse lead já foi tratado (situação: ${lead.status}).`;
  await setStatus(prospectId, 'gerando_esboco', 'notificado_moura');
  return `Ok, não envio. ${lead.email} fica com você.`;
}
