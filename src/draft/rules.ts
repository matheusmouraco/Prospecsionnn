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

// Enforces what the code can enforce by itself (rule 5): exact banner text, noindex,
// WhatsApp link and no scripts (structured data is injected later by the code).
export function applyMandatory(html: string, o: { agencia: string; empresa: string; whatsapp: string }): string {
  let out = html.replace(/%%WHATSAPP%%/g, escapeHtml(o.whatsapp));
  out = out.replace(/<script\b[\s\S]*?<\/script>/gi, '');
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
  if (!html.includes(COMPARATIVO_MARKER)) issues.push(`mantenha o marcador ${COMPARATIVO_MARKER} antes da seção de contato`);
  if (!/<meta[^>]+name="viewport"/i.test(html)) issues.push('falta a meta tag viewport');

  const texto = visibleText(html);
  const sobras = texto.match(/\[[A-ZÀ-Úa-zà-ú][^\]]{2,80}\]/g);
  if (sobras) issues.push(`sobraram textos de exemplo do template: ${[...new Set(sobras)].slice(0, 5).join(', ')}`);
  if (/[—–]/.test(texto)) issues.push('o texto usa travessão; reescreva sem ele');

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

export function injectComparativo(html: string, linhas: LinhaComparativo[]): string {
  const rows = linhas
    .map((l) => `<tr><th scope="row">${escapeHtml(l.item)}</th><td>${escapeHtml(l.atual)}</td><td>${escapeHtml(l.proposta)}</td></tr>`)
    .join('');
  const section = `<section class="comparativo" data-secao="comparativo" style="padding:72px 0">
      <div class="container" style="max-width:900px">
        <h2>Site atual e proposta</h2>
        <p style="margin-bottom:28px;opacity:.8">Itens medidos no site atual e nesta proposta.</p>
        <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:16px">
          <thead><tr><th style="text-align:left;padding:12px 8px;border-bottom:2px solid currentColor"></th><th style="text-align:left;padding:12px 8px;border-bottom:2px solid currentColor">Site atual</th><th style="text-align:left;padding:12px 8px;border-bottom:2px solid currentColor">Proposta</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </div>
      <style>.comparativo td,.comparativo tbody th{padding:14px 8px;border-bottom:1px solid #0000001a;text-align:left;vertical-align:top}.comparativo tbody th{font-weight:600}</style>
    </section>`;
  return html.replace(COMPARATIVO_MARKER, section);
}
