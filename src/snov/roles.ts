// Lower number = better contact. Order matters: "diretor comercial" is a decision maker.
const ROLE_TIERS: RegExp[] = [
  /\b(socio|socia|fundador|fundadora|co-?fundador|founder|co-?founder|ceo|owner|proprietari[oa]|dono|dona|diretor|diretora|director|presidente|president|partner|gerente geral|general manager)\b/,
  /\b(marketing|mkt|cmo|growth|comunicacao|branding)\b/,
  /\b(comercial|vendas|sales|cco|negocios|business development|bdr|sdr)\b/,
];

const UNKNOWN_TIER = ROLE_TIERS.length;

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function roleTier(cargo: string | null | undefined): number {
  if (!cargo) return UNKNOWN_TIER;
  const text = normalize(cargo);
  const tier = ROLE_TIERS.findIndex((re) => re.test(text));
  return tier === -1 ? UNKNOWN_TIER : tier;
}
