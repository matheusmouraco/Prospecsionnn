import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireEnv } from '../config/env.js';

let client: SupabaseClient | undefined;

// Server-side client with the service role key. Never expose it to a browser.
export function getSupabase(): SupabaseClient {
  client ??= createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
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
