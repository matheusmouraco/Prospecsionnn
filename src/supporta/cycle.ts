import { getEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { ensureDomain } from '../publish/vercel.js';
import { notify } from '../telegram/notify.js';
import { claimSite, getPage, getSupportaDb, listPages, registrarCustoSite, savePage, updateSite, type SiteRow } from './db.js';
import { adjustHome, enderecoDe, generateHome, generatePage } from './generate.js';
import { analisarSiteAtual } from './site-atual.js';
import { homeMultipagina, menuDe, paginasDoPlano } from './pages.js';

const log = logger.child({ etapa: 'supporta' });
const MAX_TENTATIVAS = 3;

/** Tells the Supporta site (which owns the client emails and the client area). Never breaks the cycle. */
async function avisarSite(site: SiteRow, evento: 'previa' | 'no_ar' | 'erro' | 'ajustado', detalhe?: string) {
  const env = getEnv();
  if (!env.SUPPORTA_URL || !env.SUPPORTA_WORKER_SECRET) return log.warn('SUPPORTA_URL ou SUPPORTA_WORKER_SECRET ausente; cliente não recebe e-mail', { slug: site.slug, evento });
  try {
    const res = await fetch(`${env.SUPPORTA_URL.replace(/\/$/, '')}/api/interno/site`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${env.SUPPORTA_WORKER_SECRET}` },
      body: JSON.stringify({ token: site.token, evento, detalhe }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) log.warn('Site da Supporta recusou o aviso', { slug: site.slug, evento, status: res.status });
  } catch (err) {
    log.warn('Falha ao avisar o site da Supporta', { slug: site.slug, evento, erro: (err as Error).message });
  }
}

/** A failure goes back to the queue; on the third one the site is marked as error and Moura is told. */
async function falhou(site: SiteRow, voltaPara: SiteRow['status'], err: unknown) {
  const msg = (err as Error).message.slice(0, 500);
  const custo = Number((err as { custo?: number }).custo ?? 0);
  const final = site.tentativas >= MAX_TENTATIVAS;
  await registrarCustoSite(site.id, `falha:${voltaPara}`, custo);
  await updateSite(site.id, { status: final ? (voltaPara === 'ajuste_no_ar' ? 'no_ar' : 'erro') : voltaPara, erro: msg, locked_at: null, custo_usd: Number(site.custo_usd) + custo });
  log.error('Site da Supporta falhou', { slug: site.slug, tentativa: site.tentativas, final, erro: msg });
  if (final) {
    await notify(`⚠️ Supporta: o site de ${site.empresa} falhou ${MAX_TENTATIVAS} vezes.\n${msg}\nContato: ${site.contato_nome}, ${site.contato_whatsapp}`);
    await avisarSite(site, 'erro', msg);
  }
}

/** na_fila > gerando > previa: builds the home page the client sees before paying. */
export async function gerarPrevia(): Promise<boolean> {
  const site = await claimSite('na_fila', 'gerando');
  if (!site) return false;
  log.info('Gerando prévia', { slug: site.slug, empresa: site.empresa });
  try {
    const comSite = await analisarSiteAtual(site);
    const home = await generateHome(comSite);
    await savePage(site.id, '/', site.empresa, home.html);
    await updateSite(site.id, { status: 'previa', previa_em: new Date().toISOString(), erro: null, locked_at: null, tentativas: 0, custo_usd: Number(site.custo_usd) + home.custo });
    await registrarCustoSite(site.id, 'previa', home.custo);
    await avisarSite(site, 'previa');
    log.info('Prévia pronta', { slug: site.slug, custo_usd: Number(home.custo.toFixed(3)), tentativas: home.tentativas });
  } catch (err) {
    await falhou(site, 'na_fila', err);
  }
  return true;
}

/** ajuste > ajustando > previa: applies what the client asked on WhatsApp and sends the new preview. */
export async function aplicarAjustes(): Promise<boolean> {
  const site = await claimSite('ajuste', 'ajustando');
  if (!site) return false;
  const pedidos = site.respostas.ajustesPendentes ?? [];
  log.info('Ajustando prévia', { slug: site.slug, pedidos: pedidos.length });
  try {
    const home = await getPage(site.id, '/');
    const gerado = home && pedidos.length ? await adjustHome(site, home, pedidos) : null;
    if (gerado) await savePage(site.id, '/', site.empresa, gerado.html);
    // Requests that arrived while this one ran stay pending and go in the next round.
    const db = getSupportaDb();
    const { data } = await db.from('sites').select('respostas, status').eq('id', site.id).single();
    const atual = (data as { respostas: SiteRow['respostas']; status: SiteRow['status'] } | null) ?? { respostas: site.respostas, status: site.status };
    const restantes = (atual.respostas.ajustesPendentes ?? []).slice(pedidos.length);
    const respostas = { ...atual.respostas, ajustesPendentes: restantes, ajustesFeitos: [...(atual.respostas.ajustesFeitos ?? []), ...pedidos] };
    const custo = Number(site.custo_usd) + (gerado?.custo ?? 0);
    if (atual.status === 'ajustando') {
      await updateSite(site.id, { respostas, status: restantes.length ? 'ajuste' : 'previa', erro: null, locked_at: null, custo_usd: custo, tentativas: 0 });
    } else {
      // Paid meanwhile: keep the new status, only record the adjustment.
      await updateSite(site.id, { respostas, custo_usd: custo });
    }
    await registrarCustoSite(site.id, 'ajuste', gerado?.custo ?? 0);
    await avisarSite(site, 'previa');
    log.info('Ajuste pronto', { slug: site.slug, custo_usd: Number((gerado?.custo ?? 0).toFixed(3)) });
  } catch (err) {
    await falhou(site, 'ajuste', err);
  }
  return true;
}

// Which pages a request touches: named pages, or every page for site-wide things (colors, logo, contact data...).
const PAGINAS_POR_PALAVRA: [RegExp, string][] = [
  [/\bsobre\b|quem somos|hist[oó]ria/i, '/sobre'],
  [/servi[cç]o|produto|material|cat[aá]logo/i, '/servicos'],
  [/pergunta|faq|d[uú]vida/i, '/perguntas'],
  [/contato|fale conosco/i, '/contato'],
  [/in[ií]cio|home|p[aá]gina inicial|topo|capa|hero|banner|primeira (tela|p[aá]gina)/i, '/'],
];
const TODAS = /\bcor(es)?\b|logo|fonte|letra|whats|telefone|n[uú]mero|endere[cç]o|hor[aá]rio|menu|rodap[eé]|todas as p[aá]ginas|site (todo|inteiro)|em tudo|nome da empresa|instagram/i;

export function paginasAfetadas(pedidos: string[], existentes: string[]): string[] {
  const alvo = new Set<string>();
  for (const p of pedidos) {
    if (TODAS.test(p)) existentes.forEach((c) => alvo.add(c));
    let achou = false;
    for (const [re, caminho] of PAGINAS_POR_PALAVRA) if (re.test(p) && existentes.includes(caminho)) { alvo.add(caminho); achou = true; }
    if (!achou && !TODAS.test(p)) alvo.add('/');
  }
  return existentes.filter((c) => alvo.has(c));
}

/** ajuste_no_ar > ajustando_no_ar > no_ar: changes asked on WhatsApp in the first 30 days, applied to the live site. */
export async function aplicarAjustesNoAr(): Promise<boolean> {
  const site = await claimSite('ajuste_no_ar', 'ajustando_no_ar');
  if (!site) return false;
  const pedidos = site.respostas.ajustesNoArPendentes ?? [];
  log.info('Ajustando site no ar', { slug: site.slug, pedidos: pedidos.length });
  try {
    let custo = 0;
    const caminhos = paginasAfetadas(pedidos, await listPages(site.id));
    for (const caminho of caminhos) {
      const html = await getPage(site.id, caminho);
      if (!html) continue;
      const gerado = await adjustHome(site, html, pedidos);
      custo += gerado.custo;
      await savePage(site.id, caminho, caminho === '/' ? site.empresa : (caminho.slice(1, 2).toUpperCase() + caminho.slice(2)), gerado.html);
    }
    const db = getSupportaDb();
    const { data } = await db.from('sites').select('respostas, status').eq('id', site.id).single();
    const atual = (data as { respostas: SiteRow['respostas']; status: SiteRow['status'] } | null) ?? { respostas: site.respostas, status: site.status };
    const restantes = (atual.respostas.ajustesNoArPendentes ?? []).slice(pedidos.length);
    const respostas = { ...atual.respostas, ajustesNoArPendentes: restantes };
    await updateSite(site.id, {
      respostas,
      ...(atual.status === 'ajustando_no_ar' ? { status: restantes.length ? 'ajuste_no_ar' : 'no_ar', locked_at: null, tentativas: 0 } : {}),
      erro: null,
      custo_usd: Number(site.custo_usd) + custo,
    });
    await registrarCustoSite(site.id, 'ajuste_no_ar', custo);
    await avisarSite(site, 'ajustado', caminhos.join(', '));
    log.info('Site no ar ajustado', { slug: site.slug, paginas: caminhos, custo_usd: Number(custo.toFixed(3)) });
  } catch (err) {
    await falhou(site, 'ajuste_no_ar', err);
  }
  return true;
}

/** pago > publicando > no_ar: the inner pages of the plan, the menu, the subdomain on Vercel and the emails. */
export async function publicarPago(): Promise<boolean> {
  const site = await claimSite('pago', 'publicando');
  if (!site) return false;
  const env = getEnv();
  log.info('Publicando site pago', { slug: site.slug, plano: site.plano });
  try {
    let home = await getPage(site.id, '/');
    if (!home) {
      const gerado = await generateHome(site);
      home = gerado.html;
      await savePage(site.id, '/', site.empresa, home);
    }
    let custo = 0;
    const paginas = paginasDoPlano(site);
    for (const spec of paginas) {
      if (await getPage(site.id, spec.caminho)) continue; // resumes after a failure without paying twice
      const p = await generatePage(site, home, spec, menuDe(site));
      custo += p.custo;
      await savePage(site.id, spec.caminho, spec.titulo, p.html);
    }
    if (paginas.length) await savePage(site.id, '/', site.empresa, homeMultipagina(home, site));

    const dominio = `${site.slug}.supporta.com.br`;
    let dominioOk = true;
    if (env.VERCEL_TOKEN) {
      const r = await ensureDomain({ token: env.VERCEL_TOKEN, teamId: env.VERCEL_TEAM_ID, project: env.SUPPORTA_VERCEL_PROJECT }, dominio);
      dominioOk = r.ok;
      if (!r.ok) log.warn('Subdomínio não entrou na Vercel', { dominio, detalhe: r.detalhe });
    } else {
      dominioOk = false;
      log.warn('VERCEL_TOKEN ausente; subdomínio não foi adicionado', { dominio });
    }
    await updateSite(site.id, { status: 'no_ar', publicado_em: new Date().toISOString(), erro: null, locked_at: null, custo_usd: Number(site.custo_usd) + custo });
    await registrarCustoSite(site.id, 'publicacao', custo);
    await avisarSite(site, 'no_ar');
    await notify(`✅ Supporta: site de ${site.empresa} no ar (plano ${site.plano}).\n${enderecoDe(site)}${dominioOk ? '' : '\n⚠️ Subdomínio não entrou na Vercel: adicione à mão no projeto supportasite.'}`);
  } catch (err) {
    await falhou(site, 'pago', err);
  }
  return true;
}
