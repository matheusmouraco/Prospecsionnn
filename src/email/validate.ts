// Snov custom field limit.
export const MAX_FIELD_CHARS = 255;

export interface CamposEmail {
  saudacao: string;        // "Oi Bruna" or "Olá"; set by the code, not the model
  nome_empresa: string;
  site_da_empresa: string; // "site da Dentelli" / "site do Grupo Rios": article chosen by the model
  problema_1: string;
  problema_2: string;
  gancho: string;
  nicho: string;
}

export const CAMPOS: (keyof CamposEmail)[] = ['saudacao', 'nome_empresa', 'site_da_empresa', 'problema_1', 'problema_2', 'gancho', 'nicho'];

// Technical jargon the owner should never read (rule: business language).
const JARGAO = /\b(LCP|CLS|TBT|FCP|PageSpeed|Lighthouse|schema|JSON|robots\.txt|llms\.txt|sitemap|HTML|meta ?tags?|meta description|Open Graph|H1|viewport|alt text|SEO|GEO|HTTPS|SSL|favicon|JavaScript|DOM|crawlers?|renderiza\w*|pixels?|px)\b|\bog:/i;
// Phrases that read as AI-written.
const FRASES_IA = /(espero que (esteja|você esteja) bem|no cenário atual|no mundo de hoje|nos dias de hoje|em um mundo cada vez mais|vale ressaltar|é importante destacar|não é apenas|mergulhar|alavancar|potencializar)/i;
const TRAVESSAO = /[—–]/;
const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|com\.br|net|org|br)\b)/i;

// Numbers in a text, normalized so "7,2" and "7.2" compare equal.
export function numbersIn(text: string): string[] {
  return (text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => n.replace(',', '.'));
}

export interface Fonte {
  campo: 'problema_1' | 'problema_2';
  texto: string; // descricao_curta + evidencia of the chosen problem
}

// Returns human-readable issues (in Portuguese, fed back to the model). Empty means valid.
export function validateCampos(c: CamposEmail, fontes: Fonte[]): string[] {
  const issues: string[] = [];
  for (const campo of CAMPOS) {
    const v = c[campo] ?? '';
    if (!v.trim()) {
      if (campo !== 'problema_2' || fontes.some((f) => f.campo === 'problema_2')) issues.push(`${campo} está vazio`);
      continue;
    }
    if (v.length > MAX_FIELD_CHARS) issues.push(`${campo} tem ${v.length} caracteres; o máximo é ${MAX_FIELD_CHARS}`);
    if (TRAVESSAO.test(v)) issues.push(`${campo} usa travessão; reescreva sem ele`);
    if (JARGAO.test(v)) issues.push(`${campo} usa termo técnico (${v.match(JARGAO)![0]}); use linguagem de dono de negócio`);
    if (FRASES_IA.test(v)) issues.push(`${campo} usa frase de efeito artificial (${v.match(FRASES_IA)![0]})`);
    if (campo !== 'nome_empresa' && campo !== 'site_da_empresa' && LINK.test(v)) issues.push(`${campo} contém link ou endereço de site; o primeiro email não pode ter link`);
  }
  const site = c.site_da_empresa ?? '';
  if (site && !/^site d(a|o|as|os|e) /.test(site)) issues.push('site_da_empresa precisa começar com "site da", "site do", "site das", "site dos" ou "site de"');
  if (site && c.nome_empresa && !site.includes(c.nome_empresa)) issues.push('site_da_empresa precisa conter o nome_empresa exatamente como escrito');
  // Every number in a problem sentence must come from that problem's evidence (rule 1).
  for (const f of fontes) {
    const allowed = new Set(numbersIn(f.texto));
    const extra = numbersIn(c[f.campo] ?? '').filter((n) => !allowed.has(n));
    if (extra.length) issues.push(`${f.campo} cita números que não estão na evidência medida: ${extra.join(', ')}`);
  }
  // The hook may not introduce numbers at all (no invented market statistics).
  const gancho = numbersIn(c.gancho ?? '');
  if (gancho.length) issues.push(`gancho não pode ter números (${gancho.join(', ')}); nada de estatística sem fonte`);
  return issues;
}
