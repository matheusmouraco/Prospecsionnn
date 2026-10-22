// Snov custom field limit.
export const MAX_FIELD_CHARS = 255;

export interface CamposEmail {
  saudacao: string;        // "Oi Bruna" or "Olá"; set by the code, not the model
  nome_empresa: string;
  site_da_empresa: string; // "site da Dentelli" / "site do Grupo Rios": article chosen by the model
  observacao: string;      // one neutral sentence about something specific on the site (proves a person looked)
  problema_1: string;
  problema_2: string;
  problema_3: string;      // may be empty when the site has only two measured problems
  gancho: string;
  sugestao: string;        // what Matilab would do, without numbers or promises
  nicho: string;
}

export const CAMPOS: (keyof CamposEmail)[] = [
  'saudacao', 'nome_empresa', 'site_da_empresa', 'observacao', 'problema_1', 'problema_2', 'problema_3', 'gancho', 'sugestao', 'nicho',
];
export const PROBLEMAS = ['problema_1', 'problema_2', 'problema_3'] as const;
type CampoProblema = (typeof PROBLEMAS)[number];

// Technical jargon the owner should never read (rule: business language).
const JARGAO = /\b(LCP|CLS|TBT|FCP|PageSpeed|Lighthouse|schema|JSON|robots\.txt|llms\.txt|sitemap|HTML|meta ?tags?|meta description|Open Graph|H1|viewport|alt text|SEO|GEO|HTTPS|SSL|favicon|JavaScript|DOM|crawlers?|renderiza\w*|pixels?|px)\b|\bog:/i;
// Phrases that read as AI-written.
const FRASES_IA = /(espero que (esteja|você esteja) bem|no cenário atual|no mundo de hoje|nos dias de hoje|em um mundo cada vez mais|vale ressaltar|é importante destacar|não é apenas|mergulhar|alavancar|potencializar)/i;
// Consequences belong in the hook; a problem sentence states only the measured fact (rule 1).
const CONSEQUENCIA = /(desist\w*|vai embora|vão embora|perde\w*|perder|acaba(m)? sem|deixa(m)? de (ver|achar|encontrar|ligar))/i;
// Moura: no flattery in a cold email ("gostei" reads weak and fake).
const BAJULACAO = /(?<!\p{L})(gostei|gostamos|adorei|amei|parab[eé]ns|incr[ií]vel|excelente|[oó]tim[oa]|lind[oa]|maravilh\p{L}*|muito bo[ma]|muito bonit[oa]|sensacional|impec[aá]vel|top)(?!\p{L})/iu;
// The suggestion says what we would do, never what will happen.
const PROMESSA = /\b(garant\w*|certeza|vai (aumentar|dobrar|triplicar|multiplicar)|mais (clientes|vendas|pacientes) garantid\w*|resultado garantido)\b/i;
const TRAVESSAO = /[—–]/;
const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|com\.br|net|org|br)\b)/i;

// Numbers in a text, normalized so "7,2" and "7.2" compare equal.
export function numbersIn(text: string): string[] {
  return (text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => n.replace(',', '.'));
}

export interface Fonte {
  campo: CampoProblema;
  texto: string; // descricao_curta + evidencia of the chosen problem
}

// Returns human-readable issues (in Portuguese, fed back to the model). Empty means valid.
// `textoSite` is the real text of the site: any number in observacao must come from it.
export function validateCampos(c: CamposEmail, fontes: Fonte[], textoSite = ''): string[] {
  const issues: string[] = [];
  for (const campo of CAMPOS) {
    const v = c[campo] ?? '';
    if (!v.trim()) {
      const opcional = (PROBLEMAS as readonly string[]).includes(campo) && !fontes.some((f) => f.campo === campo);
      if (!opcional) issues.push(`${campo} está vazio`);
      continue;
    }
    if (v.length > MAX_FIELD_CHARS) issues.push(`${campo} tem ${v.length} caracteres; o máximo é ${MAX_FIELD_CHARS}`);
    if (TRAVESSAO.test(v)) issues.push(`${campo} usa travessão; reescreva sem ele`);
    if (JARGAO.test(v)) issues.push(`${campo} usa termo técnico (${v.match(JARGAO)![0]}); use linguagem de dono de negócio`);
    if (FRASES_IA.test(v)) issues.push(`${campo} usa frase de efeito artificial (${v.match(FRASES_IA)![0]})`);
    if ((campo === 'observacao' || campo === 'sugestao') && BAJULACAO.test(v)) {
      issues.push(`${campo} soa como elogio (${v.match(BAJULACAO)![0]}); descreva o fato sem bajular`);
    }
    if (campo === 'sugestao' && PROMESSA.test(v)) issues.push(`sugestao promete resultado (${v.match(PROMESSA)![0]}); diga só o que seria feito`);
    if ((PROBLEMAS as readonly string[]).includes(campo) && CONSEQUENCIA.test(v)) {
      issues.push(`${campo} supõe uma consequência (${v.match(CONSEQUENCIA)![0]}); deixe só o fato medido e leve a consequência para o gancho`);
    }
    if (campo !== 'nome_empresa' && campo !== 'site_da_empresa' && LINK.test(v)) issues.push(`${campo} contém link ou endereço de site; o primeiro email não pode ter link`);
  }
  const site = c.site_da_empresa ?? '';
  if (site && !/^site d(a|o|as|os|e) /.test(site)) issues.push('site_da_empresa precisa começar com "site da", "site do", "site das", "site dos" ou "site de"');
  if (site && c.nome_empresa && !site.includes(c.nome_empresa)) issues.push('site_da_empresa precisa conter o nome_empresa exatamente como escrito');
  // Every number in a problem sentence must come from that problem's evidence (rule 1).
  for (const campo of PROBLEMAS) {
    if (c[campo]?.trim() && !fontes.some((f) => f.campo === campo)) issues.push(`${campo} precisa ficar vazio: não há um terceiro problema medido`);
  }
  for (const f of fontes) {
    const allowed = new Set(numbersIn(f.texto));
    const extra = numbersIn(c[f.campo] ?? '').filter((n) => !allowed.has(n));
    if (extra.length) issues.push(`${f.campo} cita números que não estão na evidência medida: ${extra.join(', ')}`);
  }
  // The hook may not introduce numbers at all (no invented market statistics).
  for (const campo of ['gancho', 'sugestao'] as const) {
    const n = numbersIn(c[campo] ?? '');
    if (n.length) issues.push(`${campo} não pode ter números (${n.join(', ')}); nada de estatística sem fonte`);
  }
  const permitidos = new Set(numbersIn(textoSite));
  const obs = numbersIn(c.observacao ?? '').filter((n) => !permitidos.has(n));
  if (obs.length) issues.push(`observacao cita números que não estão no texto do site: ${obs.join(', ')}`);
  return issues;
}
