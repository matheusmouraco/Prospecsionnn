import { getSupabase, type Db } from '../db/client.js';
import type { EmailGerado } from '../email/generate.js';

// Read-only queries behind /leads, the morning email review and the weekly summary.

export const STATUS_LEAD = ['respondeu_quer_ver', 'respondeu_interesse', 'gerando_esboco', 'esboco_publicado', 'link_enviado', 'notificado_moura', 'respondeu_ausente'];

export const NOME_STATUS: Record<string, string> = {
  respondeu_quer_ver: 'pediu o esboço',
  respondeu_interesse: 'quer conversar ou saber preço',
  gerando_esboco: 'esboço esperando sua aprovação',
  esboco_publicado: 'esboço publicado',
  link_enviado: 'link do esboço enviado',
  notificado_moura: 'com você',
  respondeu_ausente: 'resposta automática (ausente)',
};

export interface LeadQuente {
  prospect_id: string;
  email: string;
  nome: string | null;
  empresa: string | null;
  dominio: string | null;
  status: string;
  resumo: string | null;
  quando: string;
  esboco: string | null;
}

export async function leadsQuentes(limit = 15, db: Db = getSupabase()): Promise<LeadQuente[]> {
  const { data, error } = await db.from('prospects')
    .select('id, email, primeiro_nome, status, updated_at, empresa_id, empresas(nome, dominio)')
    .in('status', STATUS_LEAD).order('updated_at', { ascending: false }).limit(limit);
  if (error) throw new Error(`Falha ao listar leads: ${error.message}`);
  const rows = (data ?? []) as unknown as { id: string; email: string; primeiro_nome: string | null; status: string; updated_at: string; empresa_id: string | null; empresas: { nome: string | null; dominio: string } | null }[];
  if (!rows.length) return [];
  const [{ data: resp }, { data: esb }] = await Promise.all([
    db.from('respostas').select('prospect_id, resumo, recebida_em').in('prospect_id', rows.map((r) => r.id)).order('recebida_em', { ascending: false }),
    db.from('esbocos').select('empresa_id, url, publicado_em').in('empresa_id', rows.map((r) => r.empresa_id).filter(Boolean) as string[]),
  ]);
  const resumo = new Map<string, string>();
  for (const r of (resp ?? []) as { prospect_id: string; resumo: string | null }[]) if (!resumo.has(r.prospect_id) && r.resumo) resumo.set(r.prospect_id, r.resumo);
  const link = new Map(((esb ?? []) as { empresa_id: string; url: string | null; publicado_em: string | null }[]).filter((e) => e.publicado_em && e.url).map((e) => [e.empresa_id, e.url!]));
  return rows.map((r) => ({
    prospect_id: r.id, email: r.email, nome: r.primeiro_nome, empresa: r.empresas?.nome ?? null, dominio: r.empresas?.dominio ?? null,
    status: r.status, resumo: resumo.get(r.id) ?? null, quando: r.updated_at, esboco: r.empresa_id ? link.get(r.empresa_id) ?? null : null,
  }));
}

export interface ProximoEmail { prospect_id: string; email: string; dominio: string; empresa: string | null; campos: EmailGerado['campos'] }

// The next emails the sending cycle will pick (claim_prospects takes the oldest updated_at first).
export async function proximosEmails(n = 3, db: Db = getSupabase()): Promise<ProximoEmail[]> {
  const { data, error } = await db.from('prospects').select('id, email, empresas(nome, dominio)')
    .eq('status', 'email_pronto').order('updated_at', { ascending: true }).limit(n);
  if (error) throw new Error(`Falha ao listar emails prontos: ${error.message}`);
  const rows = (data ?? []) as unknown as { id: string; email: string; empresas: { nome: string | null; dominio: string } | null }[];
  const out: ProximoEmail[] = [];
  for (const r of rows) {
    const { data: e } = await db.from('emails').select('campos').eq('prospect_id', r.id).is('enviado_em', null).limit(1).maybeSingle();
    if (e?.campos) out.push({ prospect_id: r.id, email: r.email, dominio: r.empresas?.dominio ?? '?', empresa: r.empresas?.nome ?? null, campos: e.campos as EmailGerado['campos'] });
  }
  return out;
}

export interface Semana {
  de: string; ate: string;
  enviados: number; respostas: number; positivas: number; descadastros: number; bounces: number; esbocos: number; custo: number;
  nichos: { nicho: string; enviados: number; positivas: number }[];
}

const POSITIVAS = ['quer_ver', 'interesse'];
const ENVIADOS = ['enviado_snov', 'respondeu_quer_ver', 'respondeu_interesse', 'respondeu_nao', 'respondeu_descadastro', 'respondeu_ausente', 'gerando_esboco', 'esboco_publicado', 'link_enviado', 'notificado_moura', 'sem_resposta'];

export async function resumoSemana(hoje = new Date(), db: Db = getSupabase()): Promise<Semana> {
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const inicio = new Date(hoje.getTime() - 6 * 86400_000);
  const { data: m, error } = await db.from('metricas_diarias').select('*').gte('dia', iso(inicio)).lte('dia', iso(hoje));
  if (error) throw new Error(`Falha ao ler métricas da semana: ${error.message}`);
  const soma = (k: string) => ((m ?? []) as Record<string, unknown>[]).reduce((s, r) => s + Number(r[k] ?? 0), 0);

  // Niches: who was sent (any status from enviado_snov on) and who answered positively.
  const { data: ps } = await db.from('prospects').select('id, status, empresas(nicho)').in('status', ENVIADOS).limit(5000);
  const prospects = (ps ?? []) as unknown as { id: string; status: string; empresas: { nicho: string | null } | null }[];
  const { data: rs } = await db.from('respostas').select('prospect_id, categoria').in('categoria', POSITIVAS).limit(5000);
  const positivos = new Set(((rs ?? []) as { prospect_id: string }[]).map((r) => r.prospect_id));
  const porNicho = new Map<string, { enviados: number; positivas: number }>();
  for (const p of prospects) {
    const n = (p.empresas?.nicho ?? 'não detectado').toLowerCase();
    const v = porNicho.get(n) ?? { enviados: 0, positivas: 0 };
    v.enviados++;
    if (positivos.has(p.id)) v.positivas++;
    porNicho.set(n, v);
  }
  return {
    de: iso(inicio), ate: iso(hoje),
    enviados: soma('enviados'), respostas: soma('respostas'), positivas: soma('positivas'), descadastros: soma('descadastros'),
    bounces: soma('bounces'), esbocos: soma('esbocos_gerados'), custo: soma('custo_api_usd'),
    nichos: [...porNicho.entries()].map(([nicho, v]) => ({ nicho, ...v }))
      .sort((a, b) => b.positivas / Math.max(b.enviados, 1) - a.positivas / Math.max(a.enviados, 1) || b.enviados - a.enviados).slice(0, 6),
  };
}

const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1).replace('.', ',')}%` : '0%');

export function renderSemana(s: Semana): string {
  const br = (d: string) => d.split('-').reverse().slice(0, 2).join('/');
  return [
    `📅 Semana de ${br(s.de)} a ${br(s.ate)}`,
    '',
    `Enviados: ${s.enviados}`,
    `Respostas: ${s.respostas} (${pct(s.respostas, s.enviados)} dos enviados)`,
    `Positivas: ${s.positivas} (${pct(s.positivas, s.enviados)})`,
    `Esboços gerados: ${s.esbocos}`,
    `Descadastros: ${s.descadastros} · Bounces: ${s.bounces}`,
    `Gasto de API: US$${s.custo.toFixed(2)}`,
    '',
    s.nichos.length ? 'Nichos (taxa de resposta positiva, desde o início):' : 'Ainda sem envios para comparar nichos.',
    ...s.nichos.map((n) => `• ${n.nicho}: ${n.positivas} de ${n.enviados} (${pct(n.positivas, n.enviados)})`),
  ].join('\n');
}

export interface StatusCompleto {
  status: Record<string, number>;
  empresas: number;
  lidosSnov: number;
  emailsEscritos: number;
  emailsEnviados: number;
  esbocos: { total: number; publicados: number; aprovados: number };
  respostas: Record<string, number>;
  bloqueados: number;
  custo: { hoje: number; semana: number; total: number };
  enviadosTotal: number;
}

async function contar(db: Db, tabela: string, filtro?: (q: any) => any): Promise<number> { // eslint-disable-line @typescript-eslint/no-explicit-any
  let q = db.from(tabela).select('*', { count: 'exact', head: true });
  if (filtro) q = filtro(q);
  const { count, error } = await q;
  if (error) throw new Error(`Falha ao contar ${tabela}: ${error.message}`);
  return count ?? 0;
}

// Everything at once for /status: queue by stage, what was produced (emails, drafts), replies, blocks and cost.
export async function statusCompleto(hoje: string, db: Db = getSupabase()): Promise<StatusCompleto> {
  const { data: ps, error } = await db.from('prospects').select('status').limit(20000);
  if (error) throw new Error(`Falha ao ler a fila: ${error.message}`);
  const status: Record<string, number> = {};
  for (const p of (ps ?? []) as { status: string }[]) status[p.status] = (status[p.status] ?? 0) + 1;

  const { data: rs } = await db.from('respostas').select('categoria').limit(20000);
  const respostas: Record<string, number> = {};
  for (const r of (rs ?? []) as { categoria: string | null }[]) respostas[r.categoria ?? 'outro'] = (respostas[r.categoria ?? 'outro'] ?? 0) + 1;

  const { data: ms } = await db.from('metricas_diarias').select('dia, custo_api_usd, enviados').limit(5000);
  const semanaAtras = new Date(Date.parse(hoje) - 6 * 86400_000).toISOString().slice(0, 10);
  const metricas = (ms ?? []) as { dia: string; custo_api_usd: number | string | null; enviados: number | null }[];
  const soma = (f: (m: (typeof metricas)[number]) => boolean) => metricas.filter(f).reduce((s, m) => s + Number(m.custo_api_usd ?? 0), 0);

  const [empresas, lidosSnov, emailsEscritos, emailsEnviados, esbTotal, esbPub, esbApr, bloqueados] = await Promise.all([
    contar(db, 'empresas'),
    contar(db, 'snov_vistos'),
    contar(db, 'emails'),
    contar(db, 'emails', (q) => q.not('enviado_em', 'is', null)),
    contar(db, 'esbocos'),
    contar(db, 'esbocos', (q) => q.not('publicado_em', 'is', null)),
    contar(db, 'esbocos', (q) => q.eq('aprovado', true)),
    contar(db, 'bloqueados'),
  ]);
  return {
    status, empresas, lidosSnov, emailsEscritos, emailsEnviados, bloqueados, respostas,
    esbocos: { total: esbTotal, publicados: esbPub, aprovados: esbApr },
    custo: { hoje: soma((m) => m.dia === hoje), semana: soma((m) => m.dia >= semanaAtras), total: soma(() => true) },
    enviadosTotal: metricas.reduce((s, m) => s + Number(m.enviados ?? 0), 0),
  };
}

export interface ContextoStatus { modoReal: boolean; pausado: boolean; motivo: string; limite: number; estoque: number; teto: number; desligados: string[] }

export function renderStatusCompleto(s: StatusCompleto, c: ContextoStatus, agora = new Date()): string {
  const n = (k: string) => s.status[k] ?? 0;
  const soma = (ks: string[]) => ks.reduce((t, k) => t + n(k), 0);
  const usd = (v: number) => `US$${v.toFixed(2)}`;
  const respondeu = soma(['respondeu_quer_ver', 'respondeu_interesse', 'respondeu_nao', 'respondeu_descadastro', 'respondeu_ausente', 'gerando_esboco', 'esboco_publicado', 'link_enviado', 'notificado_moura']);
  const enviadas = n('enviado_snov') + n('sem_resposta') + respondeu;
  const pct = (a: number, b: number) => (b ? ` (${((a / b) * 100).toFixed(1).replace('.', ',')}%)` : '');
  const dias = Math.floor(n('email_pronto') / Math.max(c.limite, 1));
  const hora = agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const r = s.respostas;
  return [
    `📊 Status completo · ${hora}`,
    c.pausado ? `⏸️ PAUSADO${c.motivo ? `: ${c.motivo}` : ''}` : '▶️ Rodando',
    `Modo: ${c.modoReal ? '🟢 REAL (envia para leads)' : '🧪 teste (nada vai para leads)'}`,
    '',
    '📥 Base',
    `• Lidos das listas do Snov: ${s.lidosSnov}`,
    `• Empresas no banco: ${s.empresas}`,
    `• Bloqueados (nunca contatar): ${s.bloqueados}`,
    '',
    '⚙️ Fila',
    `• Esperando análise: ${n('novo')}${n('analisando') ? ` (analisando agora: ${n('analisando')})` : ''}`,
    `• Analisadas, esperando email: ${n('analisado')}`,
    `• Descartadas (site já é bom): ${n('descartado_site_bom')}`,
    `• Com erro: ${n('erro') + n('erro_final')}${n('erro_final') ? ` (${n('erro_final')} sem solução)` : ''}`,
    '',
    '✉️ Emails',
    `• Escritos no total: ${s.emailsEscritos}`,
    `• Prontos para enviar: ${n('email_pronto')} (dá para ${dias} dia${dias === 1 ? '' : 's'} com ${c.limite} por dia)`,
    `• Empresas já na campanha: ${enviadas}${s.enviadosTotal !== enviadas ? ` (envios registrados: ${s.enviadosTotal})` : ''}`,
    `• Sequência terminada sem resposta: ${n('sem_resposta')}`,
    '',
    '💬 Respostas',
    `• Responderam: ${respondeu}${pct(respondeu, enviadas)}`,
    `• Pediram esboço: ${r.quer_ver ?? 0} · Interesse/preço: ${r.interesse ?? 0}`,
    `• Não agora: ${r.nao ?? 0} · Saíram: ${r.descadastro ?? 0} · Ausentes: ${r.ausente ?? 0} · Outras: ${r.outro ?? 0}`,
    `• Esperando sua aprovação de esboço: ${n('gerando_esboco')}`,
    `• Com você (conversa): ${n('notificado_moura')}`,
    '',
    '🎨 Esboços',
    `• Gerados: ${s.esbocos.total} · No ar: ${s.esbocos.publicados} · Aprovados: ${s.esbocos.aprovados}`,
    `• Links enviados a leads: ${n('link_enviado')}`,
    '',
    '💰 Gasto de API',
    `• Hoje: ${usd(s.custo.hoje)} de ${usd(c.teto)} · 7 dias: ${usd(s.custo.semana)} · Total: ${usd(s.custo.total)}`,
    '',
    '🔧 Ajustes',
    `• ${c.limite} empresas novas por dia · estoque ${c.estoque} · teto ${usd(c.teto)}/dia`,
    c.desligados.length ? `• Ciclos desligados: ${c.desligados.join(', ')}` : '• Todos os ciclos automáticos ligados',
  ].join('\n');
}
