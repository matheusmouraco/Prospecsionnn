import { join } from 'node:path';
import { captureSite, launchBrowser } from '../analysis/browser.js';
import { logger } from '../lib/logger.js';
import { updateSite, type Respostas, type SiteRow } from './db.js';

const log = logger.child({ etapa: 'supporta' });

/**
 * Site atual do dono (link mandado no WhatsApp): o mesmo analisador do Prospector abre no Chromium, tira o print
 * e extrai logo, cores, fontes, textos e fotos. Fica em respostas.siteAnalise para o gerador partir da identidade real.
 * Falhar aqui nunca impede a prévia.
 */
export async function analisarSiteAtual(site: SiteRow): Promise<SiteRow> {
  const r = site.respostas;
  const dominio = r.siteAtual?.replace(/^https?:\/\//, '').split('/')[0]?.toLowerCase();
  if (!dominio || r.siteAnalise !== undefined) return site;
  let siteAnalise: Respostas['siteAnalise'] = null;
  const browser = await launchBrowser();
  try {
    const cap = await captureSite(browser, dominio, join('out', 'supporta', site.slug));
    const m = cap.desktop?.marca;
    if (m) {
      siteAnalise = {
        url: cap.desktop!.url_final,
        logo: m.logo_url && /^https?:\/\//.test(m.logo_url) ? m.logo_url : null,
        cores: m.cores.slice(0, 6),
        fontes: [m.fonte_titulo, m.fonte_corpo].filter((x): x is string => Boolean(x)),
        titulos: m.titulos.slice(0, 15),
        paragrafos: m.paragrafos.slice(0, 20),
        telefone: m.telefone,
        endereco: m.endereco,
        fotos: m.fotos.filter((f) => /^https?:\/\//.test(f) && !/\.svg(\?|$)/i.test(f)).slice(0, 10),
        print: cap.prints?.desktop_dobra ?? null,
      };
    }
    log.info('Site atual analisado', { slug: site.slug, dominio, ok: Boolean(siteAnalise) });
  } catch (err) {
    log.warn('Não deu para analisar o site atual', { slug: site.slug, dominio, erro: (err as Error).message });
  } finally {
    await browser.close().catch(() => {});
  }
  const respostas = { ...r, siteAnalise };
  await updateSite(site.id, { respostas });
  return { ...site, respostas };
}
