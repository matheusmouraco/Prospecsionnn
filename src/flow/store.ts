import { getSupabase, type Db } from '../db/client.js';
import type { ProspectStatus } from '../domain/status.js';

export interface LeadEsboco {
  id: string;
  status: ProspectStatus;
  email: string;
  primeiro_nome: string | null;
  empresa: string | null;
  dominio: string;
  nicho: string | null;
  esboco: { aprovado: boolean; publicado: boolean; url: string | null } | null;
  resposta: string | null; // what the lead wrote
}

export async function loadLead(prospectId: string, db: Db = getSupabase()): Promise<LeadEsboco> {
  const { data, error } = await db.from('prospects')
    .select('id, status, email, primeiro_nome, empresa_id, empresas(nome, dominio, nicho)').eq('id', prospectId).single();
  if (error) throw new Error(`Lead ${prospectId} não encontrado: ${error.message}`);
  const emp = (Array.isArray(data.empresas) ? data.empresas[0] : data.empresas) as { nome: string | null; dominio: string; nicho: string | null } | null;
  if (!emp?.dominio) throw new Error(`Lead ${prospectId} sem empresa`);
  const { data: r } = await db.from('respostas').select('texto').eq('prospect_id', prospectId).order('recebida_em', { ascending: false }).limit(1).maybeSingle();
  const { data: e } = await db.from('esbocos').select('aprovado, publicado_em, url').eq('empresa_id', data.empresa_id as string).maybeSingle();
  return {
    id: data.id as string, status: data.status as ProspectStatus, email: data.email as string,
    primeiro_nome: (data.primeiro_nome as string | null) ?? null, empresa: emp.nome, dominio: emp.dominio, nicho: emp.nicho ?? null,
    resposta: (r?.texto as string | undefined) ?? null,
    esboco: e ? { aprovado: Boolean(e.aprovado), publicado: Boolean(e.publicado_em), url: (e.url as string | null) ?? null } : null,
  };
}

// Status change outside the claim/advance cycle (the lead waits for Moura in gerando_esboco).
export async function setStatus(prospectId: string, from: ProspectStatus, to: ProspectStatus, db: Db = getSupabase()): Promise<void> {
  const { error } = await db.from('prospects').update({ status: to, locked_at: null }).eq('id', prospectId).eq('status', from);
  if (error) throw new Error(`Falha ao mudar status de ${prospectId}: ${error.message}`);
}
