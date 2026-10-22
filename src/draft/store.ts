import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import type { Problema } from '../analysis/checks.js';
import type { Marca } from '../analysis/facts.js';
import { getSupabase, type Db } from '../db/client.js';
import { chooseReferences, loadFichas } from '../references/select.js';
import type { Esboco, EsbocoInput } from './pipeline.js';

// Company name normalized + 4 random characters (spec), e.g. "clinica-sorriso-k3f9".
export function makeSlug(nome: string, rand: () => string = () => randomBytes(3).toString('hex').slice(0, 4)): string {
  const base = nome
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 40).replace(/-+$/, '');
  return `${base || 'empresa'}-${rand()}`;
}

// Companies analyzed as prospects (site not good) that still have no draft
// (`refazer`: also those with a draft not yet approved).
export async function draftCandidates(limit: number, refazer = false, db: Db = getSupabase()): Promise<string[]> {
  const { data: ps, error } = await db.from('prospects').select('empresa_id').in('status', ['analisado', 'email_pronto']);
  if (error) throw new Error(`Falha ao listar prospects: ${error.message}`);
  const { data: es, error: e2 } = await db.from('esbocos').select('empresa_id, aprovado');
  if (e2) throw new Error(`Falha ao listar esboços: ${e2.message}`);
  const done = new Set((es ?? []).filter((e) => !refazer || e.aprovado).map((e) => e.empresa_id as string));
  return [...new Set((ps ?? []).map((p) => p.empresa_id as string).filter((id) => id && !done.has(id)))].slice(0, limit);
}

export async function empresaIdByDomain(dominio: string, db: Db = getSupabase()): Promise<string> {
  const { data, error } = await db.from('empresas').select('id').eq('dominio', dominio).single();
  if (error) throw new Error(`Empresa ${dominio} não encontrada: ${error.message}`);
  return data.id as string;
}

export async function loadDraftInput(empresaId: string, db: Db = getSupabase()): Promise<EsbocoInput> {
  const [{ data: emp, error: e1 }, { data: an, error: e2 }] = await Promise.all([
    db.from('empresas').select('dominio, nome, nicho').eq('id', empresaId).single(),
    db.from('analises').select('marca, problemas, print_desktop_url').eq('empresa_id', empresaId).single(),
  ]);
  if (e1) throw new Error(`Empresa ${empresaId} não encontrada: ${e1.message}`);
  if (e2) throw new Error(`Análise da empresa ${empresaId} não encontrada: ${e2.message}`);
  const marca = an.marca as Marca;
  if (!marca?.titulos) throw new Error(`Análise de ${emp.dominio} sem dados de marca (site fora do ar?)`);
  // The judge compares with the original first screen, when the local print still exists.
  const dobra = (an.print_desktop_url as string | null)?.replace('desktop-inteira.png', 'desktop-dobra.png') ?? null;
  const nicho = (emp.nicho as string | null) ?? null;
  return {
    dominio: emp.dominio as string,
    empresa: (emp.nome as string | null) ?? (emp.dominio as string),
    nicho,
    referencias: chooseReferences(nicho, await loadFichas()),
    marca,
    problemas: (an.problemas ?? []) as Problema[],
    printOriginal: dobra && existsSync(dobra) ? dobra : null,
  };
}

// Records the draft (not yet published: url and expira_em stay empty until Phase 7).
export async function saveDraft(empresaId: string, nome: string, e: Esboco, db: Db = getSupabase()): Promise<string> {
  const { data: existing } = await db.from('esbocos').select('slug').eq('empresa_id', empresaId).maybeSingle();
  const slug = (existing?.slug as string | undefined) ?? makeSlug(nome);
  const { error } = await db.from('esbocos').upsert(
    // A new version always needs a new approval.
    { empresa_id: empresaId, slug, nota_juiz: e.nota, tentativas: e.tentativas, referencias: e.referencias, aprovado: false, aprovado_em: null },
    { onConflict: 'empresa_id' },
  );
  if (error) throw new Error(`Falha ao gravar esboço de ${e.dominio}: ${error.message}`);
  return slug;
}

export async function setApproval(dominio: string, aprovado: boolean, db: Db = getSupabase()): Promise<void> {
  const empresaId = await empresaIdByDomain(dominio, db);
  const { data, error } = await db
    .from('esbocos')
    .update({ aprovado, aprovado_em: aprovado ? new Date().toISOString() : null })
    .eq('empresa_id', empresaId)
    .select('slug');
  if (error) throw new Error(`Falha ao atualizar aprovação de ${dominio}: ${error.message}`);
  if (!data?.length) throw new Error(`${dominio} ainda não tem esboço`);
}
