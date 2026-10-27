// Link to the Supporta subscription checkout for a lead whose draft was approved (custom field `link_supporta`).
// The checkout opens with the template of the lead's niche and the company name/site already filled in.

const SNOV_MAX = 255;

// Supporta template slugs (supporta/lib/segments.ts) and the words in empresas.nicho that point to each one.
const SEGMENTOS: [slug: string, termos: RegExp][] = [
  ['odontologia', /odont|dent|ortodon|implant/i],
  ['advocacia', /advoca|advogad|jur[ií]d|direito/i],
  ['arquitetura', /arquitet|interiores|paisag/i],
  ['restaurante', /restaur|pizz|hamburg|gastron|bistr|cantina|lanchon|padar|caf[eé]|bar\b|culin/i],
  ['saude', /sa[uú]de|cl[ií]nica|m[eé]dic|fisio|psic|nutri|est[eé]tic|fono|derma|pilates|veterin/i],
];

export function segmentoSupporta(nicho: string | null | undefined): string {
  if (!nicho) return 'servicos';
  return SEGMENTOS.find(([, re]) => re.test(nicho))?.[0] ?? 'servicos';
}

export function linkSupporta(baseUrl: string, lead: { nicho: string | null; dominio: string; empresa: string | null }): string {
  const build = (empresa: string) => {
    const url = new URL('/assinar/start', baseUrl);
    url.searchParams.set('modelo', segmentoSupporta(lead.nicho));
    url.searchParams.set('site', lead.dominio);
    if (empresa) url.searchParams.set('empresa', empresa);
    url.searchParams.set('origem', 'matilab-esboco');
    return url.toString();
  };
  let empresa = (lead.empresa ?? '').trim();
  let link = build(empresa);
  // Snov custom fields hold at most 255 characters: shorten the company name, then drop it.
  while (link.length > SNOV_MAX && empresa.length > 0) {
    empresa = empresa.slice(0, Math.max(0, empresa.length - 10)).trim();
    link = build(empresa);
  }
  return link;
}
