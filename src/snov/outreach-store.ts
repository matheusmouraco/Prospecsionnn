import { getSupabase, type Db } from '../db/client.js';
import { businessDay } from '../lib/dates.js';

export interface EnvioPronto {
  prospect_id: string;
  email_id: string;
  email: string;
  primeiro_nome: string | null;
  empresa: string | null;
  dominio: string | null;
  campos: Record<string, string>; // Snov custom fields, without `fontes`
}

export async function enviadosHoje(db: Db = getSupabase()): Promise<number> {
  const { data, error } = await db.from('metricas_diarias').select('enviados').eq('dia', businessDay()).maybeSingle();
  if (error) throw new Error(`Falha ao ler métricas do dia: ${error.message}`);
  return Number(data?.enviados ?? 0);
}

export async function loadEnvio(prospectId: string, db: Db = getSupabase()): Promise<EnvioPronto> {
  const { data: p, error: e1 } = await db
    .from('prospects').select('id, email, primeiro_nome, empresas(nome, dominio)').eq('id', prospectId).single();
  if (e1) throw new Error(`Prospect ${prospectId} não encontrado: ${e1.message}`);
  const { data: em, error: e2 } = await db
    .from('emails').select('id, campos').eq('prospect_id', prospectId).order('id', { ascending: false }).limit(1).single();
  if (e2) throw new Error(`Email do prospect ${prospectId} não encontrado: ${e2.message}`);
  const { fontes: _fontes, ...campos } = (em.campos ?? {}) as Record<string, unknown>;
  const emp = (Array.isArray(p.empresas) ? p.empresas[0] : p.empresas) as { nome: string | null; dominio: string | null } | null;
  return {
    prospect_id: p.id as string,
    email_id: em.id as string,
    email: p.email as string,
    primeiro_nome: (p.primeiro_nome as string | null) ?? null,
    empresa: emp?.nome ?? null,
    dominio: emp?.dominio ?? null,
    campos: Object.fromEntries(Object.entries(campos).map(([k, v]) => [k, String(v ?? '')])),
  };
}

export async function isBlocked(email: string, dominio: string | null, db: Db = getSupabase()): Promise<boolean> {
  const filtro = dominio ? `email.eq.${email},dominio.eq.${dominio}` : `email.eq.${email}`;
  const { data, error } = await db.from('bloqueados').select('email').or(filtro).limit(1);
  if (error) throw new Error(`Falha ao consultar bloqueados: ${error.message}`);
  return (data ?? []).length > 0;
}

export async function markSent(emailId: string, db: Db = getSupabase()): Promise<void> {
  const { error } = await db.from('emails').update({ enviado_em: new Date().toISOString() }).eq('id', emailId);
  if (error) throw new Error(`Falha ao marcar email ${emailId} como enviado: ${error.message}`);
}

// The prospect of a domain that already has an email written (used by snov:teste to borrow real fields).
export async function prospectIdByDomain(dominio: string, db: Db = getSupabase()): Promise<string> {
  const { data, error } = await db.from('prospects').select('id, empresas!inner(dominio)').eq('empresas.dominio', dominio).limit(1);
  if (error) throw new Error(`Falha ao buscar ${dominio}: ${error.message}`);
  if (!data?.length) throw new Error(`${dominio} não está no banco`);
  return data[0]!.id as string;
}

export async function firstReadyDomain(db: Db = getSupabase()): Promise<string> {
  const { data, error } = await db.from('prospects').select('empresas(dominio)').eq('status', 'email_pronto').limit(1);
  if (error) throw new Error(`Falha ao buscar prospect pronto: ${error.message}`);
  const emp = data?.[0]?.empresas as { dominio?: string } | { dominio?: string }[] | undefined;
  const dominio = Array.isArray(emp) ? emp[0]?.dominio : emp?.dominio;
  if (!dominio) throw new Error('Nenhum prospect com email pronto; rode npm run emails primeiro');
  return dominio;
}

const GENERICOS = /^(gmail|hotmail|outlook|live|yahoo|icloud|uol|bol|terra|ig|globo|msn)\./i;
// The email is from a corporate domain that is not the analyzed site (Snov had another company's site):
// the email would talk about a site that is not theirs.
export function outraEmpresa(email: string, dominio: string | null): boolean {
  const d = email.split('@')[1]?.toLowerCase() ?? '';
  if (!dominio || !d || GENERICOS.test(d)) return false;
  const raiz = (x: string) => x.replace(/^www\./, '').split('.')[0]!;
  return d !== dominio && !d.endsWith(`.${dominio}`) && !dominio.endsWith(`.${d}`) && raiz(d) !== raiz(dominio);
}

