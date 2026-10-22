import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabase } from '../db/client.js';
import type { Candidate, ImportStore } from './importer.js';

const CHUNK = 200;

async function collect(
  db: SupabaseClient,
  table: string,
  column: string,
  values: string[],
): Promise<Set<string>> {
  const out = new Set<string>();
  const unique = [...new Set(values)];
  for (let i = 0; i < unique.length; i += CHUNK) {
    const slice = unique.slice(i, i + CHUNK);
    const { data, error } = await db.from(table).select(column).in(column, slice);
    if (error) throw new Error(`Falha ao consultar ${table}.${column}: ${error.message}`);
    for (const row of (data ?? []) as unknown as Record<string, string | null>[]) {
      const v = row[column];
      if (v) out.add(v);
    }
  }
  return out;
}

export class InsertSkipped extends Error {}

export function supabaseImportStore(db: SupabaseClient = getSupabase()): ImportStore {
  return {
    existingDomains: (d) => collect(db, 'empresas', 'dominio', d),
    existingEmails: (e) => collect(db, 'prospects', 'email', e),
    blockedEmails: (e) => collect(db, 'bloqueados', 'email', e),
    blockedDomains: (d) => collect(db, 'bloqueados', 'dominio', d),
    async insert(c: Candidate) {
      const { data, error } = await db.rpc('importar_prospect', {
        p_dominio: c.domain,
        p_nome_empresa: c.companyName,
        p_cidade: c.city,
        p_email: c.email,
        p_snov_prospect_id: c.snovId,
        p_primeiro_nome: c.firstName,
        p_cargo: c.position,
        p_lista_origem: c.listId,
      });
      if (error) throw new Error(`importar_prospect falhou: ${error.message}`);
      // Lost a race with another import or a block added meanwhile.
      if (data !== true) throw new InsertSkipped(`${c.domain} já existe ou está bloqueado`);
    },
  };
}
