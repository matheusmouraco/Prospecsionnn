import { numbersIn } from '../email/validate.js';

export const COMPARATIVO_MARKER = '<!-- COMPARATIVO -->';

export function faixaTexto(agencia: string, empresa: string): string {
  return `Proposta conceitual criada pela ${agencia} para ${empresa}. Este não é o site oficial.`;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Pulls the HTML document out of the model's answer (it may wrap it in a code fence).
export function extractHtml(text: string): string | null {
  const m = text.match(/<!doctype html[\s\S]*<\/html>/i);
  return m ? m[0] : null;
}

export function templateUsado(html: string): string | null {
  return html.match(/<!--\s*template:\s*([a-z-]+)/i)?.[1]?.toLowerCase() ?? null;
}

// Animation libraries the draft may load (pinned versions, public CDNs). Anything else is removed.
export const SCRIPTS_PERMITIDOS = /^https:\/\/(cdnjs\.cloudflare\.com\/ajax\/libs\/(gsap|lenis)\/|cdn\.jsdelivr\.net\/npm\/(gsap|lenis|@studio-freight\/lenis|splitting|swiper)@\d)/i;

// Inline scripts are for motion only: nothing that sends, stores or evaluates data.
const SCRIPT_PROIBIDO = /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|importScripts|eval|Function)\s*\(|new\s+(WebSocket|Function|Worker)|document\.cookie|localStorage|sessionStorage|indexedDB|window\.open|location\s*=|location\.(href|assign|replace)/;

// Enforces what the code can enforce by itself (rule 5): exact banner text, noindex,
// WhatsApp link, and only allowed external scripts (structured data is injected later by the code).
export function applyMandatory(html: string, o: { agencia: string; empresa: string; whatsapp: string }): string {
  let out = html.replace(/%%WHATSAPP%%/g, escapeHtml(o.whatsapp));
  out = out.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (tag, attrs: string) => {
    const src = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (src) return SCRIPTS_PERMITIDOS.test(src) ? tag : '';
    return /application\/ld\+json/i.test(attrs) ? '' : tag; // structured data comes from the code
  });
  out = out.replace(
    /(<[^>]+data-secao="faixa"[^>]*>)[\s\S]*?(<\/[a-z]+>)/i,
    `$1${escapeHtml(faixaTexto(o.agencia, o.empresa))}$2`,
  );
  if (!/<meta[^>]+name="robots"[^>]+noindex/i.test(out)) {
    out = out.replace(/<head([^>]*)>/i, '<head$1>\n  <meta name="robots" content="noindex, nofollow">');
  }
  return out;
}

// Text a visitor reads (no head, scripts, styles or tags).
export function visibleText(html: string): string {
  return html
    .replace(/<head[\s\S]*?<\/head>/i, ' ')
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Section ordinals used by the templates ("01", "02"...) are layout, not claims.
const ORDINAL = /^0\d$/;

export interface DraftCheck {
  agencia: string;
  empresa: string;
  whatsapp: string;
  fonteNumeros: string; // all real text from the original site; any number in the draft must come from it
}

// Hard rules. Returns issues in Portuguese, fed back to the model. Empty means valid.
export function validateDraft(html: string, c: DraftCheck): string[] {
  const issues: string[] = [];
  if (!html.includes(faixaTexto(c.agencia, c.empresa))) issues.push('falta a faixa fixa com data-secao="faixa" no topo da página');
  if (!/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) issues.push('falta <meta name="robots" content="noindex, nofollow">');
  if (/<form\b/i.test(html)) issues.push('a página não pode ter <form>');
  if (/<(input|textarea|select)\b/i.test(html)) issues.push('a página não pode ter campos de formulário (input, textarea, select)');
  if (!html.includes(`href="${escapeHtml(c.whatsapp)}"`)) issues.push('o botão principal precisa levar ao WhatsApp (%%WHATSAPP%%)');
  if (!/<meta[^>]+name="viewport"/i.test(html)) issues.push('falta a meta tag viewport');
  for (const [, body] of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
    const bad = body!.match(SCRIPT_PROIBIDO);
    if (bad) issues.push(`o JavaScript da página só pode animar; remova "${bad[0].trim()}"`);
  }

  const texto = visibleText(html);
  const sobras = texto.match(/\[[A-ZÀ-Úa-zà-ú][^\]]{2,80}\]/g);
  if (sobras) issues.push(`sobraram textos de exemplo do template: ${[...new Set(sobras)].slice(0, 5).join(', ')}`);
  if (/[—–]/.test(texto)) issues.push('o texto usa travessão; reescreva sem ele');
  if (/<(s|del|strike)\b|line-through/i.test(html)) issues.push('não use texto riscado (<s>, <del> ou line-through); escreva só a frase final');

  const permitidos = new Set(numbersIn(c.fonteNumeros));
  const inventados = [...new Set(numbersIn(texto).filter((n) => !ORDINAL.test(n) && !permitidos.has(n)))];
  if (inventados.length) {
    issues.push(`números que não existem no site original: ${inventados.slice(0, 8).join(', ')}. Não invente anos, quantidades, preços ou estatísticas`);
  }
  return issues;
}

export interface DadosEmpresa {
  nome: string;
  url: string;
  nicho: string | null;
  telefone: string | null;
  endereco: string | null;
  descricao: string | null;
  logo: string | null;
}

function schemaType(nicho: string | null): string {
  const n = (nicho ?? '').toLowerCase();
  if (/odonto|dent/.test(n)) return 'Dentist';
  if (/cl[ií]nica|m[eé]dic|sa[uú]de|est[eé]tica|fisio|psic/.test(n)) return 'MedicalBusiness';
  if (/advoca|jur[ií]dic/.test(n)) return 'LegalService';
  if (/arquitet|engenh|constru/.test(n)) return 'ProfessionalService';
  return 'LocalBusiness';
}

// schema.org data built from real facts only, so AI assistants and Google understand the business.
export function injectJsonLd(html: string, d: DadosEmpresa): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType(d.nicho),
    name: d.nome,
    url: d.url,
    ...(d.descricao ? { description: d.descricao } : {}),
    ...(d.telefone ? { telephone: d.telefone } : {}),
    ...(d.endereco ? { address: d.endereco } : {}),
    ...(d.logo ? { logo: d.logo, image: d.logo } : {}),
  };
  const tag = `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

export interface LinhaComparativo {
  item: string;
  atual: string;
  proposta: string;
}

// Measured gains as cards. Fewer than 2 gains reads as weak, so the section is left out.
export function injectComparativo(html: string, linhas: LinhaComparativo[]): string {
  if (linhas.length < 2) return html.replace(COMPARATIVO_MARKER, '');
  const cards = linhas
    .map(
      (l) => `<article class="cmp-card">
            <h3>${escapeHtml(l.item)}</h3>
            <p class="cmp-antes"><span>Hoje</span>${escapeHtml(l.atual)}</p>
            <p class="cmp-depois"><span>Na proposta</span>${escapeHtml(l.proposta)}</p>
          </article>`,
    )
    .join('');
  const section = `<section class="comparativo" data-secao="comparativo">
      <div class="cmp-wrap">
        <p class="cmp-rotulo">Medido no site atual</p>
        <h2>O que esta proposta resolve</h2>
        <div class="cmp-grid">${cards}</div>
      </div>
      <style>
        .comparativo{padding:88px 24px;background:#fff;color:#111}
        .cmp-wrap{max-width:1080px;margin:0 auto}
        .cmp-rotulo{font-size:13px;letter-spacing:.12em;text-transform:uppercase;opacity:.6;margin:0 0 12px}
        .comparativo h2{margin:0 0 40px}
        .cmp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
        .cmp-card{border:1px solid #0000001a;border-radius:16px;padding:28px;background:#fff}
        .cmp-card h3{margin:0 0 20px;font-size:20px}
        .cmp-card p{margin:0;font-size:15px;line-height:1.5}
        .cmp-card span{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;opacity:.55}
        .cmp-antes{padding-bottom:16px;margin-bottom:16px!important;border-bottom:1px dashed #0000001f;opacity:.7}
        .cmp-depois{font-weight:600}
      </style>
    </section>`;
  return html.replace(COMPARATIVO_MARKER, section);
}

export interface Legal {
  razao: string;
  cnpj: string;
}

// Agency footer at the very end of every draft, added by code so it is identical everywhere:
// small gray copyright + CNPJ on the left, quality seal on the right (stacked on phones).
export function injectSelo(html: string, src: string, agencia: string, legal?: Legal): string {
  const ano = new Date().getFullYear();
  const texto = legal
    ? `Copyright © ${ano} ${escapeHtml(legal.razao)}. Todos os direitos reservados. CNPJ nº ${escapeHtml(legal.cnpj)}`
    : `Proposta conceitual por ${escapeHtml(agencia)}`;
  const rodape = `<footer class="rodape-agencia" data-secao="selo">
    <div class="ra-wrap">
      <p class="ra-legal">${texto}</p>
      <img src="${src}" alt="Selo de qualidade ${escapeHtml(agencia)}" width="110">
    </div>
    <style>
      .rodape-agencia{background:#fff;border-top:1px solid #0000000f;padding:22px 24px}
      .ra-wrap{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px}
      .ra-legal{margin:0;font:400 12px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#8a8f98;letter-spacing:.01em}
      .rodape-agencia img{width:110px;height:auto;display:block;flex-shrink:0}
      @media (max-width:640px){.ra-wrap{flex-direction:column-reverse;text-align:center;gap:14px}}
    </style>
  </footer>`;
  return html.replace(/<\/body>/i, `${rodape}\n</body>`);
}
