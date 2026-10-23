import { getSupabase, type Db } from '../db/client.js';
import type { Candidate, ImportStore, SeenStore } from './importer.js';

// Small chunks keep the `in(...)` URL short; Snov ids are long hashes.
const CHUNK = 50;

// Network blips ("fetch failed") are retried a few times before giving up.
async function withRetry<T extends { error: { message: string } | null }>(run: () => PromiseLike<T>): Promise<T> {
  let last: T | undefined;
  for (let attempt = 1; attempt <= 4; attempt++) {
    last = await run();
    if (!last.error || !/fetch failed|network|timeout|ECONNRESET/i.test(last.error.message)) return last;
    await new Promise((r) => setTimeout(r, attempt * 2000));
  }
  return last!;
}

async function collect(
  db: Db,
  table: string,
  column: string,
  values: string[],
): Promise<Set<string>> {
  const out = new Set<string>();
  const unique = [...new Set(values)];
  for (let i = 0; i < unique.length; i += CHUNK) {
    const slice = unique.slice(i, i + CHUNK);
    const { data, error } = await withRetry(() => db.from(table).select(column).in(column, slice));
    if (error) throw new Error(`Falha ao consultar ${table}.${column}: ${error.message}`);
    for (const row of (data ?? []) as unknown as Record<string, string | null>[]) {
      const v = row[column];
      if (v) out.add(v);
    }
  }
  return out;
}

export class InsertSkipped extends Error {}

export function supabaseImportStore(db: Db = getSupabase()): ImportStore {
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

export function supabaseSeenStore(db: Db = getSupabase()): SeenStore {
  return {
    seen: (ids) => collect(db, 'snov_vistos', 'snov_id', ids),
    async markSeen(ids) {
      for (let i = 0; i < ids.length; i += 500) {
        const { error } = await db.from('snov_vistos').upsert(ids.slice(i, i + 500).map((snov_id) => ({ snov_id })), { ignoreDuplicates: true });
        if (error) throw new Error(`Falha ao registrar prospects lidos: ${error.message}`);
      }
    },
  };
}
