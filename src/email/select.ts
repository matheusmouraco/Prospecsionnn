import type { Problema } from '../analysis/checks.js';

export interface ProblemaEscolhido extends Problema {
  id: string;
}

// Higher severity first; on ties a measured problem beats a visual one (stronger evidence).
function rank(a: Problema, b: Problema): number {
  return b.gravidade - a.gravidade || Number(b.origem === 'medido') - Number(a.origem === 'medido');
}

// The code, not the model, decides which problems the email cites (rule 1), up to three.
// problema_1: the most severe. problema_2: the most severe AI-search ('ia') problem when there is one
// (Moura's GEO angle), otherwise the most severe of a different type. problema_3: the most severe of a
// type not used yet, otherwise the next one.
export function chooseProblems(problemas: Problema[], max = 3): ProblemaEscolhido[] | null {
  const valid = problemas.filter((p) => p.evidencia?.trim() && p.descricao_curta?.trim());
  if (!valid.length) return null;
  const sorted = [...valid].sort(rank).map((p, i) => ({ ...p, id: `p${i + 1}` }));

  const first = sorted[0]!;
  const picked = [first];
  const rest = () => sorted.filter((p) => !picked.includes(p));
  const second =
    (first.tipo !== 'ia' ? rest().find((p) => p.tipo === 'ia') : undefined) ??
    rest().find((p) => p.tipo !== first.tipo) ??
    rest()[0];
  if (second && max > 1) picked.push(second);
  const third = rest().find((p) => !picked.some((q) => q.tipo === p.tipo)) ?? rest()[0];
  if (third && max > 2) picked.push(third);
  return picked;
}
