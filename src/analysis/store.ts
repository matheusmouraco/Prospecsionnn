import { getSupabase, type Db } from '../db/client.js';
import type { Analise } from './analyze.js';

export interface EmpresaRow {
  id: string;
  dominio: string;
  nome: string | null;
}

export async function getEmpresa(id: string, db: Db = getSupabase()): Promise<EmpresaRow> {
  const { data, error } = await db.from('empresas').select('id, dominio, nome').eq('id', id).single();
  if (error) throw new Error(`Empresa ${id} não encontrada: ${error.message}`);
  return data as EmpresaRow;
}

// One analysis per company (rule 2): re-running replaces the previous one.
// Prints are local paths until Phase 7 moves them to private R2 storage.
export async function saveAnalise(empresaId: string, a: Analise, db: Db = getSupabase()): Promise<void> {
  const { error } = await db.from('analises').upsert(
    {
      empresa_id: empresaId,
      pagespeed_mobile: a.pagespeed_mobile,
      pagespeed_desktop: a.pagespeed_desktop,
      print_desktop_url: a.prints?.desktop_inteira ?? null,
      print_mobile_url: a.prints?.mobile_inteira ?? null,
      marca: a.marca ? { ...a.marca, acesso: a.acesso, resumo: a.resumo } : { acesso: a.acesso, resumo: a.resumo },
      problemas: a.problemas,
      nota_site: a.nota_site,
    },
    { onConflict: 'empresa_id' },
  );
  if (error) throw new Error(`Falha ao gravar análise de ${a.dominio}: ${error.message}`);

  if (a.nicho_detectado) {
    const { error: e2 } = await db.from('empresas').update({ nicho: a.nicho_detectado }).eq('id', empresaId);
    if (e2) throw new Error(`Falha ao gravar nicho de ${a.dominio}: ${e2.message}`);
  }
}
