import { db, monthStart, tryDb } from "./db";
import type { PlanId } from "./plans";

// Acesso ao schema supporta. Cada função devolve null quando não há banco configurado.

export type Assinatura = {
  id: string;
  referencia: string;
  plano: PlanId;
  valor: string;
  status: "aguardando_pagamento" | "ativa" | "pagamento_recusado" | "cancelada" | "teste";
  provedor: string;
  provedor_cliente_id: string | null;
  provedor_assinatura_id: string | null;
  empresa: string;
  responsavel: string;
  documento: string;
  email: string;
  whatsapp: string;
  briefing_inicial: Record<string, string>;
  origem: Record<string, string>;
  boas_vindas_em: Date | null;
  briefing_enviado_em: Date | null;
  criado_em: Date;
};

export type Cliente = {
  id: string;
  assinatura_id: string;
  nome: string;
  email: string;
  whatsapp: string | null;
  plano: PlanId;
  segmento: string | null;
  cidade: string | null;
  site_url: string | null;
  nomes_busca: string[];
  perguntas_ia: string[];
  plausible_site_id: string | null;
  ativo: boolean;
  criado_em: Date;
};

export type Ajuste = { id: string; cliente_id: string; descricao: string; status: "aberto" | "em_andamento" | "feito"; pedido_em: Date; concluido_em: Date | null };

export function saveLead(lead: { email: string; site: string; ip: string; relatorio: unknown; enviado: boolean; origem?: string }) {
  return tryDb("saveLead", async (sql) => {
    const [row] = await sql`
      insert into leads (email, site, ip, relatorio, relatorio_enviado_em, origem)
      values (${lead.email}, ${lead.site}, ${lead.ip}, ${sql.json(lead.relatorio as never)}, ${lead.enviado ? new Date() : null}, ${lead.origem ?? null})
      returning id`;
    return row.id as string;
  });
}

export function createSubscription(input: {
  referencia: string;
  plano: PlanId;
  valor: number;
  status: Assinatura["status"];
  provedor: string;
  customer: { company: string; name: string; cpfCnpj: string; email: string; phone: string };
  briefing: Record<string, string>;
  origem: Record<string, string>;
  aceite: { text: string; termsVersion: string; termsUrl: string; acceptedAt: string; ip: string; userAgent: string };
}) {
  return tryDb("createSubscription", (sql) =>
    sql.begin(async (tx) => {
      const [row] = await tx`
        insert into assinaturas (referencia, plano, valor, status, provedor, empresa, responsavel, documento, email, whatsapp, briefing_inicial, origem)
        values (${input.referencia}, ${input.plano}, ${input.valor}, ${input.status}, ${input.provedor}, ${input.customer.company}, ${input.customer.name},
                ${input.customer.cpfCnpj}, ${input.customer.email}, ${input.customer.phone}, ${tx.json(input.briefing)}, ${tx.json(input.origem)})
        returning id`;
      await tx`
        insert into aceites (assinatura_id, texto, versao_termos, url_termos, aceito_em, ip, user_agent)
        values (${row.id}, ${input.aceite.text}, ${input.aceite.termsVersion}, ${input.aceite.termsUrl}, ${input.aceite.acceptedAt}, ${input.aceite.ip}, ${input.aceite.userAgent})`;
      return row.id as string;
    }),
  );
}

export function setProviderIds(referencia: string, ids: { customerId?: string; subscriptionId?: string }) {
  return tryDb("setProviderIds", (sql) => sql`
    update assinaturas set
      provedor_cliente_id = coalesce(${ids.customerId ?? null}, provedor_cliente_id),
      provedor_assinatura_id = coalesce(${ids.subscriptionId ?? null}, provedor_assinatura_id),
      atualizado_em = now()
    where referencia = ${referencia}`);
}

export function findSubscription(by: { referencia?: string; subscriptionId?: string }) {
  return tryDb("findSubscription", async (sql) => {
    if (!by.referencia && !by.subscriptionId) return null;
    const [row] = await sql<Assinatura[]>`
      select * from assinaturas
      where (${by.referencia ?? null}::text is not null and referencia = ${by.referencia ?? null})
         or (${by.subscriptionId ?? null}::text is not null and provedor_assinatura_id = ${by.subscriptionId ?? null})
      limit 1`;
    return row ?? null;
  });
}

export function setSubscriptionStatus(id: string, status: Assinatura["status"]) {
  return tryDb("setSubscriptionStatus", (sql) => sql`update assinaturas set status = ${status}, atualizado_em = now() where id = ${id}`);
}

export function markWelcomeSent(id: string) {
  return tryDb("markWelcomeSent", async (sql) => {
    const rows = await sql`update assinaturas set boas_vindas_em = now() where id = ${id} and boas_vindas_em is null returning id`;
    return rows.length > 0; // true só na primeira vez (evita boas-vindas repetidas a cada cobrança)
  });
}

export function logPaymentEvent(e: { assinaturaId: string | null; provedor: string; evento: string; tipo: string; valor?: number; bruto: unknown }) {
  return tryDb("logPaymentEvent", (sql) => sql`
    insert into eventos_pagamento (assinatura_id, provedor, evento, tipo, valor, bruto)
    values (${e.assinaturaId}, ${e.provedor}, ${e.evento}, ${e.tipo}, ${e.valor ?? null}, ${sql.json((e.bruto ?? null) as never)})`);
}

/** Cria o cliente na primeira cobrança aprovada. Os nomes de busca começam com o nome da empresa e o domínio. */
export function ensureClient(a: Assinatura) {
  return tryDb("ensureClient", async (sql) => {
    const site = a.briefing_inicial.siteAtual ? a.briefing_inicial.siteAtual.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : null;
    const nomes = [a.empresa, site].filter(Boolean) as string[];
    const [row] = await sql<Cliente[]>`
      insert into clientes (assinatura_id, nome, email, whatsapp, plano, segmento, cidade, site_url, nomes_busca)
      values (${a.id}, ${a.empresa}, ${a.email}, ${a.whatsapp}, ${a.plano}, ${a.briefing_inicial.segmento ?? null}, ${a.briefing_inicial.cidade ?? null},
              ${site ? `https://${site}` : null}, ${nomes})
      on conflict (assinatura_id) do update set ativo = true, plano = excluded.plano
      returning *`;
    return row;
  });
}

export function deactivateClient(assinaturaId: string) {
  return tryDb("deactivateClient", (sql) => sql`update clientes set ativo = false where assinatura_id = ${assinaturaId}`);
}

export function saveBriefing(assinaturaId: string, respostas: unknown, arquivos: unknown) {
  return tryDb("saveBriefing", (sql) =>
    sql.begin(async (tx) => {
      await tx`insert into briefings (assinatura_id, respostas, arquivos) values (${assinaturaId}, ${tx.json(respostas as never)}, ${tx.json(arquivos as never)})`;
      await tx`update assinaturas set briefing_enviado_em = now(), atualizado_em = now() where id = ${assinaturaId}`;
    }),
  );
}

export function updateClientFromBriefing(assinaturaId: string, data: { siteUrl?: string; cidade?: string; nomes: string[]; perguntas: string[] }) {
  return tryDb("updateClientFromBriefing", (sql) => sql`
    update clientes set
      site_url = coalesce(${data.siteUrl ?? null}, site_url),
      cidade = coalesce(${data.cidade ?? null}, cidade),
      nomes_busca = (select array(select distinct unnest(nomes_busca || ${data.nomes}::text[]))),
      perguntas_ia = case when cardinality(perguntas_ia) = 0 then ${data.perguntas}::text[] else perguntas_ia end
    where assinatura_id = ${assinaturaId}`);
}

export function getClientByEmail(email: string) {
  return tryDb("getClientByEmail", async (sql) => {
    const [row] = await sql<Cliente[]>`select * from clientes where lower(email) = lower(${email}) and ativo order by criado_em desc limit 1`;
    return row ?? null;
  });
}

export function getClient(id: string) {
  return tryDb("getClient", async (sql) => {
    const [row] = await sql<Cliente[]>`select * from clientes where id = ${id}`;
    return row ?? null;
  });
}

export function getSubscriptionById(id: string) {
  return tryDb("getSubscriptionById", async (sql) => {
    const [row] = await sql<Assinatura[]>`select * from assinaturas where id = ${id}`;
    return row ?? null;
  });
}

export function listAdjustments(clienteId: string, limit = 30) {
  return tryDb("listAdjustments", (sql) => sql<Ajuste[]>`select * from ajustes where cliente_id = ${clienteId} order by pedido_em desc limit ${limit}`);
}

export function countAdjustmentsThisMonth(clienteId: string) {
  return tryDb("countAdjustmentsThisMonth", async (sql) => {
    const [row] = await sql`select count(*)::int as n from ajustes where cliente_id = ${clienteId} and pedido_em >= ${monthStart(0)}::date`;
    return row.n as number;
  });
}

export function createAdjustment(clienteId: string, descricao: string) {
  return tryDb("createAdjustment", async (sql) => {
    const [row] = await sql<Ajuste[]>`insert into ajustes (cliente_id, descricao) values (${clienteId}, ${descricao}) returning *`;
    return row;
  });
}

export function setAdjustmentStatus(id: string, status: Ajuste["status"]) {
  return tryDb("setAdjustmentStatus", async (sql) => {
    const [row] = await sql<Ajuste[]>`
      update ajustes set status = ${status}, concluido_em = ${status === "feito" ? new Date() : null} where id = ${id} returning *`;
    return row ?? null;
  });
}

export function latestVisitReports(clienteId: string, limit = 6) {
  return tryDb("latestVisitReports", (sql) => sql<{ mes: Date; dados: Record<string, unknown> }[]>`
    select mes, dados from relatorios_visitas where cliente_id = ${clienteId} order by mes desc limit ${limit}`);
}

export function latestCitations(clienteId: string) {
  return tryDb("latestCitations", (sql) => sql<{ mes: Date; motor: string; pergunta: string; citado: boolean; trecho: string | null; erro: string | null }[]>`
    select mes, motor, pergunta, citado, trecho, erro from citacoes
    where cliente_id = ${clienteId} and mes = (select max(mes) from citacoes where cliente_id = ${clienteId})
    order by pergunta, motor`);
}

export { db };
