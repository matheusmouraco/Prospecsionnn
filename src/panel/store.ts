import { getSupabase, type Db } from '../db/client.js';
import { isPaused } from '../db/control.js';
import { motivoPausa } from '../monitor/store.js';

export interface DiaMetricas { dia: string; enviados: number; respostas: number; positivas: number; esbocos_gerados: number; custo_api_usd: number }
export interface RespostaPainel { recebida_em: string | null; categoria: string | null; resumo: string | null; texto: string | null; email: string | null; empresa: string | null; dominio: string | null }
export interface EsbocoPainel { empresa: string | null; dominio: string | null; url: string | null; publicado_em: string | null; nota: number | null }

export interface DadosPainel {
  geradoEm: string;
  pausado: boolean;
  motivo: string;
  status: Record<string, number>;
  dias: DiaMetricas[];
  respostas: RespostaPainel[];
  esbocos: EsbocoPainel[];
}

const one = <T>(v: T | T[] | null | undefined): T | null => (Array.isArray(v) ? v[0] ?? null : v ?? null);

export async function loadPainel(db: Db = getSupabase()): Promise<DadosPainel> {
  const [st, met, resp, esb, pausado, motivo] = await Promise.all([
    db.from('prospects').select('status'),
    db.from('metricas_diarias').select('dia, enviados, respostas, positivas, esbocos_gerados, custo_api_usd').order('dia', { ascending: false }).limit(14),
    db.from('respostas').select('recebida_em, categoria, resumo, texto, prospects(email, empresas(nome, dominio))').order('recebida_em', { ascending: false }).limit(30),
    db.from('esbocos').select('url, publicado_em, nota_juiz, empresas(nome, dominio)').not('publicado_em', 'is', null).order('publicado_em', { ascending: false }),
    isPaused(db),
    motivoPausa(db),
  ]);
  for (const r of [st, met, resp, esb]) if (r.error) throw new Error(`Falha ao montar o painel: ${r.error.message}`);
  const status: Record<string, number> = {};
  for (const p of st.data ?? []) status[p.status as string] = (status[p.status as string] ?? 0) + 1;
  return {
    geradoEm: new Date().toISOString(),
    pausado,
    motivo,
    status,
    dias: (met.data ?? []).map((d) => ({
      dia: d.dia as string, enviados: Number(d.enviados ?? 0), respostas: Number(d.respostas ?? 0), positivas: Number(d.positivas ?? 0),
      esbocos_gerados: Number(d.esbocos_gerados ?? 0), custo_api_usd: Number(d.custo_api_usd ?? 0),
    })),
    respostas: (resp.data ?? []).map((r) => {
      const p = one(r.prospects as unknown as { email: string; empresas: unknown } | null);
      const e = one(p?.empresas as unknown as { nome: string | null; dominio: string | null } | null);
      return { recebida_em: r.recebida_em as string | null, categoria: r.categoria as string | null, resumo: r.resumo as string | null, texto: r.texto as string | null, email: p?.email ?? null, empresa: e?.nome ?? null, dominio: e?.dominio ?? null };
    }),
    esbocos: (esb.data ?? []).map((x) => {
      const e = one(x.empresas as unknown as { nome: string | null; dominio: string | null } | null);
      return { empresa: e?.nome ?? null, dominio: e?.dominio ?? null, url: x.url as string | null, publicado_em: x.publicado_em as string | null, nota: x.nota_juiz as number | null };
    }),
  };
}
