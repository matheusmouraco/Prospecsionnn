import type { SupabaseClient } from '@supabase/supabase-js';
import { businessDay } from '../lib/dates.js';
import { getSupabase } from './client.js';

export type MetricField =
  | 'enviados'
  | 'bounces'
  | 'respostas'
  | 'positivas'
  | 'descadastros'
  | 'esbocos_gerados'
  | 'custo_api_usd';

export async function isPaused(db: SupabaseClient = getSupabase()): Promise<boolean> {
  const { data, error } = await db.from('controle').select('valor').eq('chave', 'pausado').maybeSingle();
  if (error) throw new Error(`Falha ao ler controle.pausado: ${error.message}`);
  // Unknown state counts as paused so nothing is sent by accident.
  return data?.valor !== 'false';
}

export async function setPaused(paused: boolean, motivo = '', db: SupabaseClient = getSupabase()): Promise<void> {
  const { error } = await db.from('controle').upsert([
    { chave: 'pausado', valor: String(paused) },
    { chave: 'motivo_pausa', valor: paused ? motivo : '' },
  ]);
  if (error) throw new Error(`Falha ao atualizar controle: ${error.message}`);
}

export async function incrementMetric(
  field: MetricField,
  value = 1,
  db: SupabaseClient = getSupabase(),
  day: string = businessDay(),
): Promise<void> {
  const { error } = await db.rpc('incrementar_metrica', { p_campo: field, p_valor: value, p_dia: day });
  if (error) throw new Error(`Falha ao incrementar métrica ${field}: ${error.message}`);
}
