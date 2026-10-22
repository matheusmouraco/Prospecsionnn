import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireEnv } from '../config/env.js';

// All prospector tables and RPCs live in this Postgres schema (see supabase/migrations).
export const DB_SCHEMA = 'prospector';

export type Db = SupabaseClient<any, typeof DB_SCHEMA>;

let client: Db | undefined;

// Server-side client with the service role key. Never expose it to a browser.
export function getSupabase(): Db {
  client ??= createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: DB_SCHEMA },
  });
  return client;
}

export const TABLES = [
  'empresas',
  'prospects',
  'analises',
  'emails',
  'respostas',
  'esbocos',
  'bloqueados',
  'metricas_diarias',
  'controle',
] as const;

export type TableName = (typeof TABLES)[number];
