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

export interface Andamento {
  status: Record<string, number>;
  agora: string[];           // domains being analyzed right now
  ultimos: { dominio: string; status: string; em: string }[];
  porHora: number;           // prospects that moved in the last hour
}

// Live view for /andamento: queue by status, what is running and the recent pace.
export async function andamento(db: Db = getSupabase()): Promise<Andamento> {
  const status: Record<string, number> = {};
  for (const s of ['novo', 'analisando', 'analisado', 'email_pronto', 'enviado_snov', 'descartado_site_bom', 'erro', 'gerando_esboco']) {
    status[s] = await contarStatus([s], db);
  }
  const umaHora = new Date(Date.now() - 3600_000).toISOString();
  const { data, error } = await db.from('prospects').select('status, updated_at, empresas(dominio)')
    .gte('updated_at', umaHora).order('updated_at', { ascending: false }).limit(500);
  if (error) throw new Error(`Falha ao ler andamento: ${error.message}`);
  const rows = (data ?? []) as unknown as { status: string; updated_at: string; empresas: { dominio: string } | null }[];
  return {
    status,
    agora: rows.filter((r) => r.status === 'analisando' || r.status === 'gerando_esboco').map((r) => r.empresas?.dominio ?? '?'),
    ultimos: rows.filter((r) => r.status !== 'analisando').slice(0, 5).map((r) => ({ dominio: r.empresas?.dominio ?? '?', status: r.status, em: r.updated_at })),
    porHora: rows.filter((r) => r.status !== 'analisando').length,
  };
}
