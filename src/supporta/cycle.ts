import { getEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { ensureDomain } from '../publish/vercel.js';
import { notify } from '../telegram/notify.js';
import { claimSite, getPage, savePage, updateSite, type SiteRow } from './db.js';
import { enderecoDe, generateHome, generatePage } from './generate.js';
import { homeMultipagina, menuDe, paginasDoPlano } from './pages.js';

const log = logger.child({ etapa: 'supporta' });
const MAX_TENTATIVAS = 3;

/** Tells the Supporta site (which owns the client emails and the client area). Never breaks the cycle. */
async function avisarSite(site: SiteRow, evento: 'previa' | 'no_ar' | 'erro', detalhe?: string) {
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
  await updateSite(site.id, { status: final ? 'erro' : voltaPara, erro: msg, locked_at: null, custo_usd: Number(site.custo_usd) + custo });
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
    const home = await generateHome(site);
    await savePage(site.id, '/', site.empresa, home.html);
    await updateSite(site.id, { status: 'previa', previa_em: new Date().toISOString(), erro: null, locked_at: null, custo_usd: Number(site.custo_usd) + home.custo });
    await avisarSite(site, 'previa');
    log.info('Prévia pronta', { slug: site.slug, custo_usd: Number(home.custo.toFixed(3)), tentativas: home.tentativas });
  } catch (err) {
    await falhou(site, 'na_fila', err);
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
    await avisarSite(site, 'no_ar');
    await notify(`✅ Supporta: site de ${site.empresa} no ar (plano ${site.plano}).\n${enderecoDe(site)}${dominioOk ? '' : '\n⚠️ Subdomínio não entrou na Vercel: adicione à mão no projeto supportasite.'}`);
  } catch (err) {
    await falhou(site, 'pago', err);
  }
  return true;
}
