import type { SupabaseClient } from '@supabase/supabase-js';
import { assertTransition, retryTarget, type ProspectStatus } from '../domain/status.js';
import { getSupabase } from './client.js';

export interface ProspectRow {
  id: string;
  empresa_id: string | null;
  snov_prospect_id: string | null;
  email: string;
  primeiro_nome: string | null;
  cargo: string | null;
  lista_origem: string | null;
  status: ProspectStatus;
  status_anterior: ProspectStatus | null;
  tentativas: number;
  locked_at: string | null;
  erro: string | null;
  created_at: string;
  updated_at: string;
}

// Locks up to `limit` prospects in `status` for this cycle (15 min lock, see claim_prospects).
export async function claimProspects(
  status: ProspectStatus,
  limit: number,
  db: SupabaseClient = getSupabase(),
): Promise<ProspectRow[]> {
  const { data, error } = await db.rpc('claim_prospects', { p_status: status, p_limit: limit });
  if (error) throw new Error(`claim_prospects falhou: ${error.message}`);
  return (data ?? []) as ProspectRow[];
}

// Moves a claimed prospect one step forward and releases its lock.
export async function advance(
  prospect: Pick<ProspectRow, 'id' | 'status'>,
  to: ProspectStatus,
  db: SupabaseClient = getSupabase(),
): Promise<void> {
  assertTransition(prospect.status, to);
  const { error } = await db
    .from('prospects')
    .update({ status: to, locked_at: null, erro: null, tentativas: 0, status_anterior: null })
    .eq('id', prospect.id)
    .eq('status', prospect.status);
  if (error) throw new Error(`Falha ao avançar prospect ${prospect.id}: ${error.message}`);
}

// Records a failure. The record goes to `erro` and is retried from the same step later.
export async function fail(
  prospect: Pick<ProspectRow, 'id' | 'status' | 'tentativas'>,
  err: unknown,
  db: SupabaseClient = getSupabase(),
): Promise<void> {
  const message = (err instanceof Error ? err.message : String(err)).slice(0, 1000);
  const { error } = await db
    .from('prospects')
    .update({
      status: 'erro',
      status_anterior: prospect.status,
      tentativas: (prospect.tentativas ?? 0) + 1,
      erro: message,
      locked_at: null,
    })
    .eq('id', prospect.id)
    .eq('status', prospect.status);
  if (error) throw new Error(`Falha ao registrar erro do prospect ${prospect.id}: ${error.message}`);
}

// Sends a failed prospect back to the step it failed in, or to erro_final after MAX_ATTEMPTS.
export async function retry(
  prospect: Pick<ProspectRow, 'id' | 'status_anterior' | 'tentativas'>,
  db: SupabaseClient = getSupabase(),
): Promise<ProspectStatus> {
  const to = retryTarget(prospect.status_anterior, prospect.tentativas);
  const { error } = await db
    .from('prospects')
    .update({ status: to, locked_at: null })
    .eq('id', prospect.id)
    .eq('status', 'erro');
  if (error) throw new Error(`Falha ao reprocessar prospect ${prospect.id}: ${error.message}`);
  return to;
}
