import { numbersIn } from '../email/validate.js';
import { SCRIPTS_PERMITIDOS, visibleText } from '../draft/rules.js';

// Hard rules for Supporta client sites (real sites, not drafts): no banner and no noindex,
// contact always through the owner's WhatsApp, only the owner's images and the checked stock photos, nothing invented.

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const SCRIPT_PROIBIDO = /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|importScripts|eval|Function)\s*\(|new\s+(WebSocket|Function|Worker)|document\.cookie|localStorage|sessionStorage|indexedDB|window\.open|location\s*=|location\.(href|assign|replace)/;
const ORDINAL = /^0\d$/;

export interface SiteCheck {
  whatsapp: string;
  imagens: string[]; // the owner's logo and photos, plus the stock list: the only images allowed
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
  const imagens = [...html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi), ...html.matchAll(/url\(\s*["']?(https?:\/\/[^"')]+)/gi)].map((m) => m[1]!.replace(/&amp;/g, '&'));
  const estranhas = [...new Set(imagens.filter((u) => /^https?:/i.test(u) && !permitidas.has(u) && !/fonts\.(googleapis|gstatic)\.com/i.test(u)))];
  if (estranhas.length) issues.push(`use só as imagens do dono e do banco de imagens, com a URL exata; remova: ${estranhas.slice(0, 4).join(', ')}`);

  const texto = visibleText(html);
  const sobras = texto.match(/\[[A-ZÀ-Úa-zà-ú][^\]]{2,80}\]|lorem ipsum/gi);
  if (sobras) issues.push(`sobraram textos de exemplo: ${[...new Set(sobras)].slice(0, 5).join(', ')}`);
  if (/[—–]/.test(texto)) issues.push('o texto usa travessão; reescreva sem ele');
  if (/<(s|del|strike)\b|line-through/i.test(html)) issues.push('não use texto riscado');
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '';
  const palavrasH1 = visibleText(h1).split(/\s+/).filter(Boolean).length;
  const quebrasH1 = (h1.match(/<br\b/gi) ?? []).length + (h1.match(/display\s*:\s*block/gi) ?? []).length;
  if (palavrasH1 > 10) issues.push(`o título do hero tem ${palavrasH1} palavras; deixe com até 8`);
  if (quebrasH1 > 1) issues.push('o título do hero está quebrado em várias linhas forçadas; tire os <br> e os spans em bloco e deixe em no máximo 3 linhas');
  const permitidos = new Set(numbersIn(c.fonteNumeros));
  const inventados = [...new Set(numbersIn(texto).filter((n) => !ORDINAL.test(n) && !permitidos.has(n)))];
  if (inventados.length) issues.push(`números que o dono não informou: ${inventados.slice(0, 8).join(', ')}. Não invente anos, quantidades, preços ou estatísticas`);
  return issues;
}

/** Discreet credit at the very end, the same on every Supporta site. */
export function injectCredito(html: string): string {
  // Pedido do Moura (nov/2026): sem o texto "Site feito com Supporta"; o rodapé com o selo é inserido pelo site da Supporta ao servir.
  return html.replace(/<p data-secao="credito-supporta"[\s\S]*?<\/p>\s*/gi, '');
}
