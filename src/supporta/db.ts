import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireEnv } from '../config/env.js';

// Sites of the Supporta builder live in the "supporta" schema of the same Supabase project.
export type SupportaDb = SupabaseClient<any, 'supporta'>;

export interface SiteRow {
  id: string;
  token: string;
  slug: string;
  status: 'na_fila' | 'gerando' | 'previa' | 'erro' | 'pago' | 'publicando' | 'no_ar' | 'cancelado';
  plano: 'start' | 'pro' | 'premium';
  empresa: string;
  contato_nome: string;
  contato_email: string;
  contato_whatsapp: string;
  respostas: Respostas;
  dominio: string | null;
  custo_usd: number;
  tentativas: number;
}

export interface Respostas {
  empresa: string;
  ramo: string;
  ramoOutro: string;
  frase: string;
  estilos: string[];
  personalidade: string[];
  cores: { modo: 'paleta'; paleta: string } | { modo: 'propria'; primaria: string; secundaria: string } | { modo: 'ia' };
  servicos: string[];
  diferenciais: string;
  publico: string;
  objetivo: string;
  cidade: string;
  endereco: string;
  horario: string;
  whatsappSite: string;
  instagram: string;
  siteAtual: string;
  logo: string;
  fotos: string[];
}

let client: SupportaDb | undefined;

export function getSupportaDb(): SupportaDb {
  client ??= createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'supporta' },
  });
  return client;
}

// Takes the oldest site in `de` and locks it as `para` (claim_site skips rows another run holds).
export async function claimSite(de: SiteRow['status'], para: SiteRow['status'], db = getSupportaDb()): Promise<SiteRow | null> {
  const { data, error } = await db.rpc('claim_site', { p_de: de, p_para: para });
  if (error) throw new Error(`claim_site: ${error.message}`);
  return ((data as SiteRow[] | null) ?? [])[0] ?? null;
}

export async function updateSite(id: string, patch: Record<string, unknown>, db = getSupportaDb()): Promise<void> {
  const { error } = await db.from('sites').update({ ...patch, atualizado_em: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(`sites: ${error.message}`);
}

export async function savePage(siteId: string, caminho: string, titulo: string, html: string, db = getSupportaDb()): Promise<void> {
  const { error } = await db.from('site_paginas').upsert({ site_id: siteId, caminho, titulo, html, atualizado_em: new Date().toISOString() });
  if (error) throw new Error(`site_paginas: ${error.message}`);
}

export async function getPage(siteId: string, caminho: string, db = getSupportaDb()): Promise<string | null> {
  const { data, error } = await db.from('site_paginas').select('html').eq('site_id', siteId).eq('caminho', caminho).maybeSingle();
  if (error) throw new Error(`site_paginas: ${error.message}`);
  return (data as { html: string } | null)?.html ?? null;
}
