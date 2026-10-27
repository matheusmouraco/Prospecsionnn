import postgres from "postgres";

// Conexão Postgres direta com o Supabase (use a URL do pooler, porta 6543, em produção na Vercel).
// Sem SUPABASE_DB_URL, db() devolve null e o site segue funcionando só com o webhook.

let client: postgres.Sql | null | undefined;

export function db(): postgres.Sql | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_DB_URL;
  client = url
    ? postgres(url, { max: 3, prepare: false, idle_timeout: 20, connect_timeout: 10, connection: { search_path: "supporta" }, onnotice: () => {} })
    : null;
  if (!client) console.warn("[db] SUPABASE_DB_URL não configurada; dados não são gravados no banco.");
  return client;
}

/** Roda a operação no banco sem derrubar o fluxo do usuário. Devolve null se não houver banco ou se falhar. */
export async function tryDb<T>(label: string, fn: (sql: postgres.Sql) => Promise<T>): Promise<T | null> {
  const sql = db();
  if (!sql) return null;
  try {
    return await fn(sql);
  } catch (err) {
    console.error(`[db] ${label}:`, (err as Error).message);
    return null;
  }
}

/** Primeiro dia do mês (YYYY-MM-01) no fuso de São Paulo, deslocado em meses. */
export function monthStart(offset = 0, from = new Date()) {
  const [y, m] = from.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" }).split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + offset, 1));
  return d.toISOString().slice(0, 10);
}
