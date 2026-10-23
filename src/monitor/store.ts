import { getSupabase, type Db } from '../db/client.js';
import { businessDay } from '../lib/dates.js';
import { METRICAS_ZERO, type Metricas } from './locks.js';

export async function metricasDoDia(dia = businessDay(), db: Db = getSupabase()): Promise<Metricas> {
  const { data, error } = await db.from('metricas_diarias').select('*').eq('dia', dia).maybeSingle();
  if (error) throw new Error(`Falha ao ler métricas: ${error.message}`);
  const out = { ...METRICAS_ZERO };
  for (const k of Object.keys(out) as (keyof Metricas)[]) out[k] = Number(data?.[k] ?? 0);
  return out;
}

export async function contarStatus(status: string[], db: Db = getSupabase()): Promise<number> {
  const { count, error } = await db.from('prospects').select('id', { count: 'exact', head: true }).in('status', status);
  if (error) throw new Error(`Falha ao contar prospects: ${error.message}`);
  return count ?? 0;
}

export async function motivoPausa(db: Db = getSupabase()): Promise<string> {
  const { data } = await db.from('controle').select('valor').eq('chave', 'motivo_pausa').maybeSingle();
  return (data?.valor as string | undefined) ?? '';
}
