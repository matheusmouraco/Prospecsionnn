import { db, monthStart, tryDb } from "./db";
import type { PlanId } from "./plans";

/** Assinaturas antigas tinham ciclo mensal; no preço único a renovação é sempre anual. */
export type Cycle = "mensal" | "anual";

// Acesso ao schema supporta. Cada função devolve null quando não há banco configurado.

export type Assinatura = {
  id: string;
  referencia: string;
  plano: PlanId;
  ciclo: Cycle;
  valor: string;
  desconto_fidelidade_em: Date | null;
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
  modelo: string | null;
  site_id: string | null;
  dominio_proprio: boolean;
  valor_anual: string | null;
  cancelamento_pedido_em: Date | null;
  cancelar_em: Date | null;
  criado_em: Date;
};

/** Andamento do site: briefing, produção, prévia para aprovar, revisão pedida, aprovado e no ar. */
export type Etapa = "briefing" | "producao" | "previa" | "revisao" | "aprovado" | "publicado";

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
  etapa: Etapa;
  previa_url: string | null;
  previa_em: Date | null;
  aprovado_em: Date | null;
  publicado_em: Date | null;
  criado_em: Date;
};

export type Solicitacao = {
  id: string;
  cliente_id: string;
  tipo: "revisao_previa" | "mudar_plano" | "cancelar";
  descricao: string;
  dados: Record<string, unknown>;
  status: "aberto" | "feito";
  criado_em: Date;
  concluido_em: Date | null;
};

export type Ajuste = {
  id: string;
  cliente_id: string;
  descricao: string;
  status: "aberto" | "em_andamento" | "feito";
  pedido_em: Date;
  concluido_em: Date | null;
  /** Alteração cobrada (depois de 30 dias da entrega): valor, link da fatura e se já foi paga. */
  valor: string;
  cobranca_url: string | null;
  pago: boolean;
};

export function saveLead(lead: { email: string | null; site: string; ip: string; relatorio: unknown; enviado: boolean; origem?: string }) {
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
  ciclo: Cycle;
  valor: number;
  status: Assinatura["status"];
  provedor: string;
  customer: { company: string; name: string; cpfCnpj: string; email: string; phone: string };
  briefing: Record<string, string>;
  origem: Record<string, string>;
  modelo: string | null;
  siteId?: string | null;
  dominioProprio?: boolean;
  valorAnual?: number;
  aceite: { text: string; termsVersion: string; termsUrl: string; acceptedAt: string; ip: string; userAgent: string };
}) {
  return tryDb("createSubscription", (sql) =>
    sql.begin(async (tx) => {
      const [row] = await tx`
        insert into assinaturas (referencia, plano, ciclo, valor, status, provedor, empresa, responsavel, documento, email, whatsapp, briefing_inicial, origem, modelo, site_id, briefing_enviado_em, dominio_proprio, valor_anual)
        values (${input.referencia}, ${input.plano}, ${input.ciclo}, ${input.valor}, ${input.status}, ${input.provedor}, ${input.customer.company}, ${input.customer.name},
                ${input.customer.cpfCnpj}, ${input.customer.email}, ${input.customer.phone}, ${tx.json(input.briefing)}, ${tx.json(input.origem)}, ${input.modelo},
                ${input.siteId ?? null}, ${input.siteId ? new Date() : null}, ${input.dominioProprio ?? false}, ${input.valorAnual ?? null})
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

/** Cobranças aprovadas e distintas (o Asaas manda CONFIRMED e RECEIVED para a mesma cobrança). */
export function countApprovedPayments(assinaturaId: string) {
  return tryDb("countApprovedPayments", async (sql) => {
    const [row] = await sql`
      select count(distinct coalesce(bruto->>'id', id::text))::int as n
      from eventos_pagamento where assinatura_id = ${assinaturaId} and tipo = 'payment_approved'`;
    return row.n as number;
  });
}

/** Cria o cliente na primeira cobrança aprovada. Os nomes de busca começam com o nome da empresa e o domínio. */
export function ensureClient(a: Assinatura) {
  return tryDb("ensureClient", async (sql) => {
    const site = a.briefing_inicial.siteAtual ? a.briefing_inicial.siteAtual.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : null;
    const nomes = [a.empresa, site].filter(Boolean) as string[];
    const [row] = await sql<Cliente[]>`
      insert into clientes (assinatura_id, nome, email, whatsapp, plano, segmento, cidade, site_url, nomes_busca, etapa)
      values (${a.id}, ${a.empresa}, ${a.email}, ${a.whatsapp}, ${a.plano}, ${a.briefing_inicial.segmento ?? null}, ${a.briefing_inicial.cidade ?? null},
              ${site ? `https://${site}` : null}, ${nomes}, ${a.briefing_enviado_em ? "producao" : "briefing"})
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
      await tx`update clientes set etapa = 'producao' where assinatura_id = ${assinaturaId} and etapa = 'briefing'`;
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

export function createAdjustment(clienteId: string, descricao: string, cobranca: { valor: number; url: string | null; pago: boolean } = { valor: 0, url: null, pago: true }) {
  return tryDb("createAdjustment", async (sql) => {
    const [row] = await sql<Ajuste[]>`
      insert into ajustes (cliente_id, descricao, valor, cobranca_url, pago)
      values (${clienteId}, ${descricao}, ${cobranca.valor}, ${cobranca.url}, ${cobranca.pago}) returning *`;
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

/** Data da última cobrança aprovada (base para saber até quando o período já está pago). */
export function lastApprovedPaymentAt(assinaturaId: string) {
  return tryDb("lastApprovedPaymentAt", async (sql) => {
    const [row] = await sql`select max(recebido_em) as em from eventos_pagamento where assinatura_id = ${assinaturaId} and tipo = 'payment_approved'`;
    return (row?.em as Date | null) ?? null;
  });
}

export function setStage(clienteId: string, etapa: Etapa, extra: { previaUrl?: string | null; siteUrl?: string | null } = {}) {
  return tryDb("setStage", async (sql) => {
    const [row] = await sql<Cliente[]>`
      update clientes set
        etapa = ${etapa},
        previa_url = coalesce(${extra.previaUrl ?? null}, previa_url),
        previa_em = case when ${etapa} = 'previa' then now() else previa_em end,
        aprovado_em = case when ${etapa} = 'aprovado' then now() else aprovado_em end,
        publicado_em = case when ${etapa} = 'publicado' then coalesce(publicado_em, now()) else publicado_em end,
        site_url = coalesce(${extra.siteUrl ?? null}, site_url)
      where id = ${clienteId} returning *`;
    return row ?? null;
  });
}

export function createRequest(clienteId: string, tipo: Solicitacao["tipo"], descricao: string, dados: Record<string, unknown> = {}, status: Solicitacao["status"] = "aberto") {
  return tryDb("createRequest", async (sql) => {
    const [row] = await sql<Solicitacao[]>`
      insert into solicitacoes (cliente_id, tipo, descricao, dados, status, concluido_em)
      values (${clienteId}, ${tipo}, ${descricao}, ${sql.json(dados as never)}, ${status}, ${status === "feito" ? new Date() : null}) returning *`;
    return row;
  });
}

export function listRequests(clienteId: string, limit = 20) {
  return tryDb("listRequests", (sql) => sql<Solicitacao[]>`select * from solicitacoes where cliente_id = ${clienteId} order by criado_em desc limit ${limit}`);
}

export function finishRequest(id: string) {
  return tryDb("finishRequest", (sql) => sql`update solicitacoes set status = 'feito', concluido_em = now() where id = ${id}`);
}

/** Troca de plano: assinatura e cliente passam a valer o plano novo. */
export function changeSubscriptionPlan(assinaturaId: string, plano: PlanId, valor: number) {
  return tryDb("changeSubscriptionPlan", (sql) =>
    sql.begin(async (tx) => {
      await tx`update assinaturas set plano = ${plano}, valor = ${valor}, atualizado_em = now() where id = ${assinaturaId}`;
      await tx`update clientes set plano = ${plano} where assinatura_id = ${assinaturaId}`;
    }),
  );
}

export function scheduleCancellation(assinaturaId: string, cancelarEm: string) {
  return tryDb("scheduleCancellation", (sql) => sql`
    update assinaturas set cancelamento_pedido_em = now(), cancelar_em = ${cancelarEm}, atualizado_em = now() where id = ${assinaturaId}`);
}

/** Cancelamentos cujo período pago já acabou: desliga o cliente e fecha a assinatura. */
export function dueCancellations() {
  return tryDb("dueCancellations", (sql) => sql<Assinatura[]>`
    select * from assinaturas where cancelar_em is not null and cancelar_em < (now() at time zone 'America/Sao_Paulo')::date and status <> 'cancelada'`);
}

/** Site montado pela IA no criador (/criar). */
export type Site = {
  id: string;
  token: string;
  slug: string;
  status: "na_fila" | "gerando" | "previa" | "ajuste" | "ajustando" | "erro" | "pago" | "publicando" | "no_ar" | "cancelado";
  plano: PlanId;
  empresa: string;
  contato_nome: string;
  contato_email: string;
  contato_whatsapp: string;
  respostas: Record<string, unknown>;
  assinatura_id: string | null;
  dominio: string | null;
  erro: string | null;
  criado_em: Date;
  previa_em: Date | null;
  publicado_em: Date | null;
};

/** Um site ativo por e-mail ou WhatsApp: quem volta ao criador continua de onde parou. */
/** E-mail na forma usada para comparar: sem "+apelido" e, no Gmail, sem pontos. */
export function emailCanonico(email: string) {
  const [local = "", dominio = ""] = email.trim().toLowerCase().split("@");
  const base = local.split("+")[0];
  return `${dominio === "gmail.com" || dominio === "googlemail.com" ? base.replace(/\./g, "") : base}@${dominio === "googlemail.com" ? "gmail.com" : dominio}`;
}

/** Uma prévia por pessoa: o mesmo e-mail (com variações) ou o mesmo WhatsApp. */
export function findSiteByContact(email: string, whatsapp: string) {
  return tryDb("findSiteByContact", async (sql) => {
    const [row] = await sql<Site[]>`
      select * from sites
      where status <> 'cancelado' and (
        contato_whatsapp = ${whatsapp}
        or (case when lower(split_part(contato_email, '@', 2)) in ('gmail.com', 'googlemail.com')
              then replace(split_part(lower(split_part(contato_email, '@', 1)), '+', 1), '.', '') || '@gmail.com'
              else split_part(lower(split_part(contato_email, '@', 1)), '+', 1) || '@' || lower(split_part(contato_email, '@', 2)) end) = ${emailCanonico(email)}
      )
      order by criado_em desc limit 1`;
    return row ?? null;
  });
}

/** Já saiu uma prévia deste IP nos últimos 30 dias? Fica no banco porque o limite em memória zera a cada instância. */
export function siteRecenteDoIp(ip: string) {
  return tryDb("siteRecenteDoIp", async (sql) => {
    const [row] = await sql`select 1 from sites where ip = ${ip} and status <> 'cancelado' and criado_em > now() - interval '30 days' limit 1`;
    return Boolean(row);
  });
}

export function slugTaken(slug: string) {
  return tryDb("slugTaken", async (sql) => {
    const [row] = await sql`select 1 from sites where slug = ${slug}`;
    return Boolean(row);
  });
}

export function createSite(input: { token: string; slug: string; plano: PlanId; empresa: string; contato: { nome: string; email: string; whatsapp: string }; respostas: unknown; ip: string }) {
  return tryDb("createSite", async (sql) => {
    const [row] = await sql<Site[]>`
      insert into sites (token, slug, plano, empresa, contato_nome, contato_email, contato_whatsapp, respostas, ip)
      values (${input.token}, ${input.slug}, ${input.plano}, ${input.empresa}, ${input.contato.nome}, ${input.contato.email}, ${input.contato.whatsapp},
              ${sql.json(input.respostas as never)}, ${input.ip})
      returning *`;
    return row;
  });
}

export function getSiteByToken(token: string) {
  return tryDb("getSiteByToken", async (sql) => {
    const [row] = await sql<Site[]>`select * from sites where token = ${token}`;
    return row ?? null;
  });
}

/** Site publicado pelo endereço: subdomínio de supporta.com.br ou domínio próprio. */
export function getLiveSiteByHost(host: { slug?: string; dominio?: string }) {
  return tryDb("getLiveSiteByHost", async (sql) => {
    const [row] = await sql<Site[]>`
      select * from sites where status = 'no_ar'
        and ((${host.slug ?? null}::text is not null and slug = ${host.slug ?? null}) or (${host.dominio ?? null}::text is not null and dominio = ${host.dominio ?? null}))
      limit 1`;
    return row ?? null;
  });
}

export function getSitePage(siteId: string, caminho: string) {
  return tryDb("getSitePage", async (sql) => {
    const [row] = await sql<{ html: string; titulo: string }[]>`select html, titulo from site_paginas where site_id = ${siteId} and caminho = ${caminho}`;
    return row ?? null;
  });
}

export function listSitePages(siteId: string) {
  return tryDb("listSitePages", (sql) => sql<{ caminho: string; titulo: string; atualizado_em: Date }[]>`
    select caminho, titulo, atualizado_em from site_paginas where site_id = ${siteId} order by caminho`);
}

export function setSitePlan(siteId: string, plano: PlanId) {
  return tryDb("setSitePlan", (sql) => sql`update sites set plano = ${plano}, atualizado_em = now() where id = ${siteId}`);
}

/** Pagamento confirmado: o gerador do VPS pega o site e publica conforme o plano. */
export function markSitePaid(siteId: string, assinaturaId: string, plano: PlanId) {
  return tryDb("markSitePaid", async (sql) => {
    const rows = await sql`
      update sites set status = 'pago', pago_em = now(), assinatura_id = ${assinaturaId}, plano = ${plano}, locked_at = null, atualizado_em = now()
      where id = ${siteId} and status in ('previa', 'ajuste', 'ajustando', 'erro') returning id`;
    return rows.length > 0;
  });
}

export function cancelSiteBySubscription(assinaturaId: string) {
  return tryDb("cancelSiteBySubscription", (sql) => sql`update sites set status = 'cancelado', atualizado_em = now() where assinatura_id = ${assinaturaId}`);
}

export { db };
