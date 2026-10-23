import { getSupabase, type Db } from '../db/client.js';
import type { ProspectRow } from '../db/queue.js';
import type { Classificacao } from './classify.js';

export async function replyKnown(snovId: string, db: Db = getSupabase()): Promise<boolean> {
  const { data, error } = await db.from('respostas').select('id').eq('snov_id', snovId).limit(1);
  if (error) throw new Error(`Falha ao consultar respostas: ${error.message}`);
  return (data ?? []).length > 0;
}

export async function prospectByEmail(email: string, db: Db = getSupabase()) {
  const { data, error } = await db
    .from('prospects').select('id, status, tentativas, empresa_id, email, primeiro_nome, empresas(nome, dominio)').eq('email', email).maybeSingle();
  if (error) throw new Error(`Falha ao buscar prospect ${email}: ${error.message}`);
  if (!data) return null;
  const emp = (Array.isArray(data.empresas) ? data.empresas[0] : data.empresas) as { nome: string | null; dominio: string | null } | null;
  return { ...(data as unknown as Pick<ProspectRow, 'id' | 'status' | 'tentativas' | 'empresa_id' | 'email' | 'primeiro_nome'>), empresa: emp?.nome ?? null, dominio: emp?.dominio ?? null };
}

export async function saveReply(
  r: { snov_id: string; prospect_id: string; texto: string; recebida_em: string | null; c: Classificacao; acoes: string[] },
  db: Db = getSupabase(),
): Promise<void> {
  const { error } = await db.from('respostas').insert({
    snov_id: r.snov_id,
    prospect_id: r.prospect_id,
    texto: r.texto,
    categoria: r.c.categoria,
    categoria_modelo: r.c.categoria_modelo,
    confianca: r.c.confianca,
    resumo: r.c.resumo,
    acao_tomada: r.acoes.join(' + '),
    ...(r.recebida_em && !Number.isNaN(Date.parse(r.recebida_em)) ? { recebida_em: new Date(r.recebida_em).toISOString() } : {}),
  });
  if (error) throw new Error(`Falha ao gravar resposta: ${error.message}`);
}

export async function block(email: string, dominio: string | null, motivo: string, db: Db = getSupabase()): Promise<void> {
  const { error } = await db.from('bloqueados').upsert({ email, dominio, motivo });
  if (error) throw new Error(`Falha ao bloquear ${email}: ${error.message}`);
}

export async function setRetomar(prospectId: string, quando: Date, db: Db = getSupabase()): Promise<void> {
  const { error } = await db.from('prospects').update({ retomar_em: quando.toISOString() }).eq('id', prospectId);
  if (error) throw new Error(`Falha ao agendar retomada: ${error.message}`);
}

// "Agora não" prospects whose 6 months passed go back to `novo` (fresh analysis, new email).
export async function reactivateDue(db: Db = getSupabase()): Promise<number> {
  const { data, error } = await db
    .from('prospects')
    .update({ status: 'novo', retomar_em: null, locked_at: null })
    .eq('status', 'respondeu_nao')
    .lte('retomar_em', new Date().toISOString())
    .select('id');
  if (error) throw new Error(`Falha ao reativar prospects: ${error.message}`);
  return (data ?? []).length;
}
