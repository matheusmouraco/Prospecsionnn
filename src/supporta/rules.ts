import { numbersIn } from '../email/validate.js';
import { SCRIPTS_PERMITIDOS, visibleText } from '../draft/rules.js';

// Hard rules for Supporta client sites (real sites, not drafts): no banner and no noindex,
// contact always through the owner's WhatsApp, only the owner's images, nothing invented.

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const SCRIPT_PROIBIDO = /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|importScripts|eval|Function)\s*\(|new\s+(WebSocket|Function|Worker)|document\.cookie|localStorage|sessionStorage|indexedDB|window\.open|location\s*=|location\.(href|assign|replace)/;
const ORDINAL = /^0\d$/;

export interface SiteCheck {
  whatsapp: string;
  imagens: string[]; // the owner's logo and photos: the only images allowed
  fonteNumeros: string;
}

/** WhatsApp link, allowed scripts only, no model-made structured data, no meta robots (it is a real site). */
export function applySiteRules(html: string, whatsapp: string): string {
  let out = html.replace(/%%WHATSAPP%%/g, escapeAttr(whatsapp));
  out = out.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (tag, attrs: string) => {
    const src = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (src) return SCRIPTS_PERMITIDOS.test(src) ? tag : '';
    return /application\/ld\+json/i.test(attrs) ? '' : tag;
  });
  return out.replace(/<meta[^>]+name=["']robots["'][^>]*>\s*/gi, '');
}

export function validateSite(html: string, c: SiteCheck): string[] {
  const issues: string[] = [];
  if (/<form\b/i.test(html)) issues.push('a página não pode ter <form>');
  if (/<(input|textarea|select)\b/i.test(html)) issues.push('a página não pode ter campos de formulário (input, textarea, select)');
  if (!html.includes(`href="${escapeAttr(c.whatsapp)}"`)) issues.push('os botões de contato precisam levar ao WhatsApp (href="%%WHATSAPP%%")');
  if (!/<meta[^>]+name="viewport"/i.test(html)) issues.push('falta a meta tag viewport');
  if (!/<title>[^<]{5,}<\/title>/i.test(html)) issues.push('falta um <title> com o nome da empresa');
  if (!/<meta[^>]+name="description"/i.test(html)) issues.push('falta a meta description');
  if ((html.match(/<h1\b/gi) ?? []).length !== 1) issues.push('a página precisa de exatamente um <h1>');
  for (const [, body] of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
    const bad = body!.match(SCRIPT_PROIBIDO);
    if (bad) issues.push(`o JavaScript da página só pode animar; remova "${bad[0].trim()}"`);
  }
  const permitidas = new Set(c.imagens);
  const imagens = [...html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi), ...html.matchAll(/url\(\s*["']?(https?:\/\/[^"')]+)/gi)].map((m) => m[1]!);
  const estranhas = [...new Set(imagens.filter((u) => /^https?:/i.test(u) && !permitidas.has(u) && !/fonts\.(googleapis|gstatic)\.com/i.test(u)))];
  if (estranhas.length) issues.push(`use só as imagens do dono (logo e fotos da lista); remova: ${estranhas.slice(0, 4).join(', ')}`);

  const texto = visibleText(html);
  const sobras = texto.match(/\[[A-ZÀ-Úa-zà-ú][^\]]{2,80}\]|lorem ipsum/gi);
  if (sobras) issues.push(`sobraram textos de exemplo: ${[...new Set(sobras)].slice(0, 5).join(', ')}`);
  if (/[—–]/.test(texto)) issues.push('o texto usa travessão; reescreva sem ele');
  if (/<(s|del|strike)\b|line-through/i.test(html)) issues.push('não use texto riscado');
  const permitidos = new Set(numbersIn(c.fonteNumeros));
  const inventados = [...new Set(numbersIn(texto).filter((n) => !ORDINAL.test(n) && !permitidos.has(n)))];
  if (inventados.length) issues.push(`números que o dono não informou: ${inventados.slice(0, 8).join(', ')}. Não invente anos, quantidades, preços ou estatísticas`);
  return issues;
}

/** Discreet credit at the very end, the same on every Supporta site. */
export function injectCredito(html: string): string {
  const credito = `<p data-secao="credito-supporta" style="margin:0;padding:14px 20px;text-align:center;background:#fff;border-top:1px solid #0000000d;font:400 12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#8a8f98">Site feito com <a href="https://supporta.com.br/?ref=site" style="color:inherit">Supporta</a></p>`;
  return html.replace(/<\/body>/i, `${credito}\n</body>`);
}
