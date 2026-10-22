import type { Problema } from '../analysis/checks.js';
import type { Marca } from '../analysis/facts.js';
import { getSupabase, type Db } from '../db/client.js';
import type { EmailGerado } from './generate.js';

export interface DadosParaEmail {
  empresa_id: string;
  dominio: string;
  empresa: string | null;
  nicho: string | null;
  titulos: string[];
  paragrafos: string[];
  problemas: Problema[];
}

export async function loadEmailInput(empresaId: string, db: Db = getSupabase()): Promise<DadosParaEmail> {
  const [{ data: emp, error: e1 }, { data: an, error: e2 }] = await Promise.all([
    db.from('empresas').select('id, dominio, nome, nicho').eq('id', empresaId).single(),
    db.from('analises').select('problemas, marca').eq('empresa_id', empresaId).single(),
  ]);
  if (e1) throw new Error(`Empresa ${empresaId} não encontrada: ${e1.message}`);
  if (e2) throw new Error(`Análise da empresa ${empresaId} não encontrada: ${e2.message}`);
  const marca = (an.marca ?? {}) as Partial<Marca>;
  return {
    empresa_id: emp.id as string,
    dominio: emp.dominio as string,
    empresa: (emp.nome as string | null) ?? null,
    nicho: (emp.nicho as string | null) ?? null,
    titulos: marca.titulos ?? [],
    paragrafos: marca.paragrafos ?? [],
    problemas: (an.problemas ?? []) as Problema[],
  };
}

// Drops the emails not sent yet, so a rewrite replaces them (`--refazer`).
export async function deleteUnsent(prospectId: string, db: Db = getSupabase()): Promise<void> {
  const { error } = await db.from('emails').delete().eq('prospect_id', prospectId).is('enviado_em', null);
  if (error) throw new Error(`Falha ao apagar email antigo do prospect ${prospectId}: ${error.message}`);
}

// `campos` keeps the Snov fields plus `fontes`: the problems (with evidence) each sentence came from.
export async function saveEmail(prospectId: string, email: EmailGerado, db: Db = getSupabase()): Promise<void> {
  const { error } = await db.from('emails').insert({
    prospect_id: prospectId,
    campos: {
      ...email.campos,
      fontes: email.problemas_usados.map(({ id, tipo, descricao_curta, evidencia, origem }) => ({ id, tipo, descricao_curta, evidencia, origem })),
    },
  });
  if (error) throw new Error(`Falha ao gravar email do prospect ${prospectId}: ${error.message}`);
}
