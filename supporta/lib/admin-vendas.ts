import { tryDb } from "./db";

// Painel das vendas pelo WhatsApp (/admin): sites, pagamentos, clientes, conversas, custo de API e retorno do tráfego.

export type LinhaSite = {
  id: string;
  slug: string;
  empresa: string;
  status: string;
  contato_nome: string;
  contato_email: string;
  contato_whatsapp: string;
  dominio: string | null;
  criado_em: Date;
  previa_em: Date | null;
  publicado_em: Date | null;
  pago: boolean;
  pago_em: Date | null;
  recebido: number;
  custo: number;
  telefone: string | null;
  etapa: string | null;
  alteracoes: number;
};

export type Mes = { mes: string; leads: number; vendas: number; faturado: number; custo: number; trafego: number };

export type Investimento = { id: number; mes: Date; canal: string; valor: number; obs: string | null };

/** Custo de um site: o que o gerador gastou nele + o que a conversa do número dele gastou. */
const CUSTO_SITE = `coalesce((select sum(c.usd) from custos c where c.site_id = s.id or (c.site_id is null and c.telefone = cv.telefone)), 0)::float`;

export function painelVendas() {
  return tryDb("painelVendas", async (sql) => {
    const sites = await sql.unsafe<LinhaSite[]>(`
      select s.id, s.slug, s.empresa, s.status, s.contato_nome, s.contato_email, s.contato_whatsapp, s.dominio,
        s.criado_em, s.previa_em, s.publicado_em,
        exists (select 1 from assinaturas a where a.site_id = s.id and a.status = 'ativa') as pago,
        (select min(e.recebido_em) from eventos_pagamento e join assinaturas a on a.id = e.assinatura_id where a.site_id = s.id and e.tipo = 'payment_approved') as pago_em,
        coalesce((select sum(e.valor) from eventos_pagamento e join assinaturas a on a.id = e.assinatura_id where a.site_id = s.id and e.tipo = 'payment_approved'), 0)::float as recebido,
        ${CUSTO_SITE} as custo,
        cv.telefone, cv.etapa,
        (jsonb_array_length(coalesce(s.respostas->'ajustesFeitos', '[]')) + jsonb_array_length(coalesce(s.respostas->'ajustesNoAr', '[]')))::int as alteracoes
      from sites s left join conversas cv on cv.site_id = s.id
      where s.status <> 'cancelado'
      order by s.criado_em desc limit 300`);

    const conversas = await sql<{ telefone: string; nome: string | null; etapa: string; criado_em: Date; ultima: Date | null; negocio: string | null; custo: number }[]>`
      select cv.telefone, cv.nome, cv.etapa, cv.criado_em, cv.ultima_msg_cliente_em as ultima, cv.briefing->>'negocio' as negocio,
        coalesce((select sum(usd) from custos c where c.telefone = cv.telefone), 0)::float as custo
      from conversas cv where cv.site_id is null order by coalesce(cv.ultima_msg_cliente_em, cv.criado_em) desc limit 200`;

    const meses = await sql.unsafe<Mes[]>(`
      with m as (select generate_series(date_trunc('month', now() at time zone 'America/Sao_Paulo') - interval '5 months', date_trunc('month', now() at time zone 'America/Sao_Paulo'), interval '1 month')::date as mes)
      select to_char(m.mes, 'YYYY-MM') as mes,
        (select count(*) from conversas where date_trunc('month', criado_em at time zone 'America/Sao_Paulo')::date = m.mes)::int as leads,
        (select count(distinct a.id) from assinaturas a join eventos_pagamento e on e.assinatura_id = a.id
          where a.site_id is not null and e.tipo = 'payment_approved' and date_trunc('month', e.recebido_em at time zone 'America/Sao_Paulo')::date = m.mes
          and e.recebido_em = (select min(e2.recebido_em) from eventos_pagamento e2 where e2.assinatura_id = a.id and e2.tipo = 'payment_approved'))::int as vendas,
        coalesce((select sum(valor) from eventos_pagamento where tipo = 'payment_approved' and date_trunc('month', recebido_em at time zone 'America/Sao_Paulo')::date = m.mes), 0)::float as faturado,
        coalesce((select sum(usd) from custos where date_trunc('month', dia)::date = m.mes), 0)::float as custo,
        coalesce((select sum(valor) from investimentos where mes = m.mes), 0)::float as trafego
      from m order by m.mes desc`);

    const investimentos = await sql<Investimento[]>`select id, mes, canal, valor::float as valor, obs from investimentos order by mes desc, id desc limit 60`;
    return { sites, conversas, meses, investimentos };
  });
}

export function detalheSite(id: string) {
  return tryDb("detalheSite", async (sql) => {
    const [site] = await sql<(LinhaSite & { respostas: Record<string, unknown>; token: string })[]>`select s.*, s.respostas from sites s where s.id = ${id}`;
    if (!site) return null;
    const [conversa] = await sql<{ telefone: string; nome: string | null; etapa: string; briefing: Record<string, unknown>; midias: { url: string; tipo: string; alt: string }[] }[]>`
      select telefone, nome, etapa, briefing, midias from conversas where site_id = ${id} limit 1`;
    const assinaturas = await sql<{ id: string; referencia: string; status: string; valor: number; valor_anual: number | null; responsavel: string; documento: string; email: string; whatsapp: string; dominio_proprio: boolean; provedor: string; criado_em: Date }[]>`
      select id, referencia, status, valor::float as valor, valor_anual::float as valor_anual, responsavel, documento, email, whatsapp, dominio_proprio, provedor, criado_em
      from assinaturas where site_id = ${id} order by criado_em desc`;
    const pagamentos = await sql<{ evento: string; tipo: string; valor: number | null; recebido_em: Date }[]>`
      select e.evento, e.tipo, e.valor::float as valor, e.recebido_em from eventos_pagamento e join assinaturas a on a.id = e.assinatura_id
      where a.site_id = ${id} order by e.recebido_em desc limit 30`;
    const custos = await sql<{ dia: Date; fornecedor: string; operacao: string; usd: number }[]>`
      select dia, fornecedor, operacao, sum(usd)::float as usd from custos
      where site_id = ${id} or (site_id is null and telefone = ${conversa?.telefone ?? ""})
      group by dia, fornecedor, operacao order by dia desc, usd desc`;
    const paginas = await sql<{ caminho: string; atualizado_em: Date }[]>`select caminho, atualizado_em from site_paginas where site_id = ${id} order by caminho`;
    return { site, conversa: conversa ?? null, assinaturas, pagamentos, custos, paginas };
  });
}

export function mensagensDe(telefone: string, limite = 500) {
  return tryDb("mensagensDe", (sql) => sql<{ direcao: "in" | "out"; tipo: string | null; corpo: string; criado_em: Date }[]>`
    select direcao, tipo, corpo, criado_em from (
      select * from mensagens where telefone = ${telefone} order by criado_em desc limit ${limite}
    ) m order by criado_em`);
}

export function conversaPorTelefone(telefone: string) {
  return tryDb("conversaPorTelefone", async (sql) => {
    const [row] = await sql<{ telefone: string; nome: string | null; etapa: string; site_id: string | null; briefing: Record<string, unknown>; criado_em: Date }[]>`
      select telefone, nome, etapa, site_id, briefing, criado_em from conversas where telefone = ${telefone}`;
    return row ?? null;
  });
}

export function adicionarInvestimento(i: { mes: string; canal: string; valor: number; obs: string | null }) {
  return tryDb("adicionarInvestimento", (sql) => sql`
    insert into investimentos (mes, canal, valor, obs) values (${`${i.mes}-01`}::date, ${i.canal}, ${i.valor}, ${i.obs})`);
}

export function removerInvestimento(id: number) {
  return tryDb("removerInvestimento", (sql) => sql`delete from investimentos where id = ${id}`);
}

/** Devolve a conversa ao robô (sai da etapa "humano"). */
export function devolverAoRobo(telefone: string, etapa: string) {
  return tryDb("devolverAoRobo", (sql) => sql`
    update conversas set etapa = ${etapa}, briefing = briefing - 'etapaAntesHumano', retornos = 0, ultimo_retorno_em = null, atualizado_em = now()
    where telefone = ${telefone} and etapa = 'humano'`);
}
