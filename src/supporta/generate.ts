import { readFile } from 'node:fs/promises';
import type Anthropic from '@anthropic-ai/sdk';
import { getEnv } from '../config/env.js';
import { visualContext } from '../draft/generate.js';
import { extractHtml, injectJsonLd } from '../draft/rules.js';
import { generateText } from '../lib/claude.js';
import { logger } from '../lib/logger.js';
import { loadPrompt } from '../lib/prompts.js';
import { chooseReferences, loadFichas } from '../references/select.js';
import { buildSiteBrief, fonteNumeros, imagensPermitidas, ramoDe, whatsappLink } from './brief.js';
import type { SiteRow } from './db.js';
import { applySiteRules, injectCredito, validateSite } from './rules.js';

const log = logger.child({ etapa: 'supporta' });
const MAX_ATTEMPTS = 3;

export interface Gerado { html: string; custo: number; tentativas: number }

/** Public address of a published site (own domain wins once it is pointed). */
export const enderecoDe = (site: SiteRow) => (site.dominio ? `https://${site.dominio}` : `https://${site.slug}.supporta.com.br`);

const MEDIA: Record<string, Anthropic.Beta.BetaBase64ImageSource['media_type']> = { 'image/png': 'image/png', 'image/jpeg': 'image/jpeg', 'image/webp': 'image/webp', 'image/gif': 'image/gif' };

async function remoteImage(url: string): Promise<Anthropic.Beta.BetaImageBlockParam | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    const type = (res.headers.get('content-type') ?? '').split(';')[0]!.trim();
    if (!res.ok || !MEDIA[type]) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 4_500_000) return null;
    return { type: 'image', source: { type: 'base64', media_type: MEDIA[type]!, data: buf.toString('base64') } };
  } catch {
    return null;
  }
}

async function localImage(path: string): Promise<Anthropic.Beta.BetaImageBlockParam | null> {
  try {
    const buf = await readFile(path);
    if (buf.length > 4_500_000) return null;
    return { type: 'image', source: { type: 'base64', media_type: path.endsWith('.png') ? 'image/png' : 'image/jpeg', data: buf.toString('base64') } };
  } catch {
    return null;
  }
}

/** Quality references for the trade + the styles the owner picked in the game + the logo (brand colors). */
async function contexto(site: SiteRow) {
  const r = site.respostas;
  const refs = chooseReferences(ramoDe(r), await loadFichas());
  const out: Anthropic.Beta.BetaContentBlockParam[] = await visualContext(refs, null);
  const base = (getEnv().SUPPORTA_URL ?? 'https://supporta.com.br').replace(/\/$/, '');
  for (const slug of r.estilos) {
    const img = await remoteImage(`${base}/vitrine/${slug}.webp`);
    if (img) out.push({ type: 'text', text: `Estilo que o dono escolheu no jogo (${slug}):` }, img);
  }
  const logo = r.logo || r.siteAnalise?.logo || '';
  if (logo && !/\.svg(\?|$)/i.test(logo) && !logo.startsWith('data:')) {
    const img = await remoteImage(logo);
    if (img) out.push({ type: 'text', text: 'Logo do dono:' }, img);
  }
  const print = r.siteAnalise?.print ? await localImage(r.siteAnalise.print) : null;
  if (print) out.push({ type: 'text', text: 'Site atual do dono (topo da página). O novo site mantém a identidade dele, só que muito melhor:' }, print);
  return { refs, visual: out };
}

function finalizar(html: string, site: SiteRow): string {
  const r = site.respostas;
  return injectCredito(
    injectJsonLd(html, {
      nome: site.empresa,
      url: enderecoDe(site),
      nicho: ramoDe(r),
      telefone: (r.whatsappSite || site.contato_whatsapp) ? `+55${(r.whatsappSite || site.contato_whatsapp).replace(/\D/g, '')}` : null,
      endereco: r.endereco || r.cidade || null,
      descricao: r.frase || null,
      logo: r.logo || null,
    }),
  );
}

/** Home page (the preview): MODEL_DESIGN at high effort, retried only when the code rejects a hard rule. */
export async function generateHome(site: SiteRow): Promise<Gerado> {
  const env = getEnv();
  const r = site.respostas;
  const whatsapp = whatsappLink(r, site);
  const check = { whatsapp, imagens: imagensPermitidas(r, site.id), fonteNumeros: fonteNumeros(r, site) };
  const { refs, visual } = await contexto(site);
  const system = await loadPrompt('supporta-site-gerar');
  let feedback: string[] = [];
  let custo = 0;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const brief = await buildSiteBrief(site, refs, feedback);
    const gen = await generateText({
      model: env.MODEL_DESIGN,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      content: [...visual, { type: 'text', text: brief }],
      effort: 'high',
      maxTokens: 128000,
    });
    custo += gen.costUsd;
    const raw = extractHtml(gen.text);
    if (!raw) {
      feedback = ['responda apenas com o documento HTML completo, de <!doctype html> até </html>'];
      continue;
    }
    const html = applySiteRules(raw, whatsapp);
    const issues = validateSite(html, check);
    if (issues.length) {
      log.warn('Site recusado pelas regras', { slug: site.slug, tentativa: attempt, problemas: issues });
      feedback = issues;
      continue;
    }
    return { html: finalizar(html, site), custo, tentativas: attempt };
  }
  throw Object.assign(new Error(`a página inicial quebrou as regras ${MAX_ATTEMPTS} vezes: ${feedback.join('; ')}`), { custo });
}

export interface PaginaSpec { caminho: string; titulo: string; instrucao: string }

/** Inner page from the finished home (same head, header, footer and motion). MODEL_FAST is enough: it reuses the layout. */
export async function generatePage(site: SiteRow, home: string, spec: PaginaSpec, menu: string): Promise<Gerado> {
  const env = getEnv();
  const r = site.respostas;
  const whatsapp = whatsappLink(r, site);
  const check = { whatsapp, imagens: imagensPermitidas(r, site.id), fonteNumeros: fonteNumeros(r, site) };
  const dados = await buildSiteBrief(site, [], []);
  // The credit and structured data are added by code; strip them so the model does not copy them.
  const base = home.replace(/<p data-secao="credito-supporta"[\s\S]*?<\/p>\s*/i, '').replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/i, '');
  let feedback: string[] = [];
  let custo = 0;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const prompt = await loadPrompt('supporta-site-pagina', {
      pagina: `${spec.titulo} (${spec.caminho})`,
      menu,
      instrucao: spec.instrucao + (feedback.length ? `\n\nA versão anterior foi recusada. Corrija: ${feedback.join('; ')}` : ''),
      dados,
      home: base,
    });
    const gen = await generateText({
      model: env.MODEL_FAST,
      system: [{ type: 'text', text: 'Você cria páginas internas fiéis ao layout da página inicial. Responda só com HTML.' }],
      content: [{ type: 'text', text: prompt }],
      effort: 'medium',
      maxTokens: 64000,
    });
    custo += gen.costUsd;
    const raw = extractHtml(gen.text);
    if (!raw) {
      feedback = ['responda apenas com o documento HTML completo'];
      continue;
    }
    const html = applySiteRules(raw, whatsapp);
    const issues = validateSite(html, check);
    if (issues.length) {
      log.warn('Página recusada pelas regras', { slug: site.slug, pagina: spec.caminho, tentativa: attempt, problemas: issues });
      feedback = issues;
      continue;
    }
    return { html: finalizar(html, site), custo, tentativas: attempt };
  }
  throw Object.assign(new Error(`a página ${spec.caminho} quebrou as regras ${MAX_ATTEMPTS} vezes: ${feedback.join('; ')}`), { custo });
}

/** Changes the client asked for on WhatsApp after seeing the preview: edits the home, keeps the layout. */
export async function adjustHome(site: SiteRow, home: string, pedidos: string[]): Promise<Gerado> {
  const env = getEnv();
  const r = site.respostas;
  const whatsapp = whatsappLink(r, site);
  // New images can only come from the Supporta bucket (photos the client sent on WhatsApp), named in the requests.
  const novas = pedidos.flatMap((p) => p.match(/https:\/\/\S+\/storage\/v1\/object\/public\/supporta-sites\/[^\s)"']+/g) ?? []);
  const check = { whatsapp, imagens: [...imagensPermitidas(r, site.id), ...novas], fonteNumeros: `${fonteNumeros(r, site)} ${pedidos.join(' ')}` };
  const base = home
    .replace(/<p data-secao="credito-supporta"[\s\S]*?<\/p>\s*/i, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '')
    .split(whatsapp.replace(/&/g, '&amp;')).join('%%WHATSAPP%%')
    .split(whatsapp).join('%%WHATSAPP%%');
  const system = await loadPrompt('supporta-site-ajustar');
  const donos = [r.logo, ...r.fotos].filter(Boolean);
  let feedback: string[] = [];
  let custo = 0;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const gen = await generateText({
      model: env.MODEL_FAST,
      system: [{ type: 'text', text: system }],
      content: [{
        type: 'text',
        text: `Mudanças pedidas pelo cliente:\n${pedidos.map((p) => `- ${p}`).join('\n')}${feedback.length ? `\n\nA versão anterior foi recusada. Corrija: ${feedback.join('; ')}` : ''}\n\nImagens do dono:\n${donos.map((f) => `- ${f}`).join('\n') || '(nenhuma)'}\n\nPágina atual:\n\n${base}`,
      }],
      effort: 'medium',
      maxTokens: 64000,
    });
    custo += gen.costUsd;
    const raw = extractHtml(gen.text);
    if (!raw) {
      feedback = ['responda apenas com o documento HTML completo'];
      continue;
    }
    const html = applySiteRules(raw, whatsapp);
    const issues = validateSite(html, check);
    if (issues.length) {
      log.warn('Ajuste recusado pelas regras', { slug: site.slug, tentativa: attempt, problemas: issues });
      feedback = issues;
      continue;
    }
    return { html: finalizar(html, site), custo, tentativas: attempt };
  }
  throw Object.assign(new Error(`o ajuste quebrou as regras ${MAX_ATTEMPTS} vezes: ${feedback.join('; ')}`), { custo });
}
