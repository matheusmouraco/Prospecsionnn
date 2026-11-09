import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireEnv } from '../config/env.js';

// Sites of the Supporta builder live in the "supporta" schema of the same Supabase project.
export type SupportaDb = SupabaseClient<any, 'supporta'>;

export interface SiteRow {
  id: string;
  token: string;
  slug: string;
  status: 'na_fila' | 'gerando' | 'previa' | 'ajuste' | 'ajustando' | 'erro' | 'pago' | 'publicando' | 'no_ar' | 'ajuste_no_ar' | 'ajustando_no_ar' | 'cancelado';
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
  // Campos do jogo novo: pedidos antigos não têm.
  coresOrigem?: '' | 'logo' | 'cliente' | 'ia';
  direcao?: Record<string, string>;
  historia?: string;
  duvidas?: string;
  admira?: string;
  evitar?: string;
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
  // Pedidos que chegam pelo robô de WhatsApp (supporta/lib/bot).
  origem?: string;
  /** Tudo o que o dono contou e não cabe nos campos acima: preços, bio do Instagram, textos do site atual, correções. */
  extra?: string;
  ajustesPendentes?: string[];
  ajustesFeitos?: string[];
  /** Alterações pedidas com o site no ar (dentro dos 30 dias): aplicadas sozinhas pelo ciclo. */
  ajustesNoArPendentes?: string[];
  ajustesNoAr?: { texto: string; em: string }[];
  /** Site atual do dono lido pelo analisador do Prospector (Playwright). */
  siteAnalise?: { url: string; logo: string | null; cores: string[]; fontes: string[]; titulos: string[]; paragrafos: string[]; telefone: string | null; endereco: string | null; fotos: string[]; print: string | null } | null;
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

/** Custo de API por cliente e por dia (supporta.custos), lido pelo relatório diário. Nunca derruba o ciclo. */
export async function registrarCustoSite(siteId: string, operacao: string, usd: number, db = getSupportaDb()): Promise<void> {
  if (!(usd > 0)) return;
  const { error } = await db.from('custos').insert({ site_id: siteId, fornecedor: 'anthropic', operacao, usd: Number(usd.toFixed(5)) });
  if (error) console.warn(`[custos] ${error.message}`);
}

export async function listPages(siteId: string, db = getSupportaDb()): Promise<string[]> {
  const { data, error } = await db.from('site_paginas').select('caminho').eq('site_id', siteId);
  if (error) throw new Error(`site_paginas: ${error.message}`);
  return ((data as { caminho: string }[] | null) ?? []).map((p) => p.caminho);
}
