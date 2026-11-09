import { tryDb } from "@/lib/db";
import { mensagemAvulsa } from "./fluxo";

// Informe diário do Matheus (19h, chamado pelo agendador do VPS): contatos, funil, vendas, alterações e custo de API por cliente.

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const usd = (v: number) => `US$ ${v > 0 && v < 0.01 ? v.toFixed(3) : v.toFixed(2)}`;
const hojeSQL = `(now() at time zone 'America/Sao_Paulo')::date`;
const dataBR = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10).split("-").reverse().join("/");

export async function montarRelatorio(): Promise<string> {
  const r = await tryDb("relatorio", async (sql) => {
    const [n] = await sql.unsafe(`
      select
        (select count(*) from conversas where (criado_em at time zone 'America/Sao_Paulo')::date = ${hojeSQL})::int as novos,
        (select count(distinct telefone) from mensagens where direcao = 'in' and (criado_em at time zone 'America/Sao_Paulo')::date = ${hojeSQL})::int as conversaram,
        (select count(*) from mensagens where direcao = 'in' and (criado_em at time zone 'America/Sao_Paulo')::date = ${hojeSQL})::int as recebidas,
        (select count(*) from sites where (previa_em at time zone 'America/Sao_Paulo')::date = ${hojeSQL})::int as previas,
        (select count(*) from sites where (publicado_em at time zone 'America/Sao_Paulo')::date = ${hojeSQL})::int as no_ar,
        (select count(*) from eventos_pagamento where tipo = 'payment_approved' and (recebido_em at time zone 'America/Sao_Paulo')::date = ${hojeSQL})::int as pagamentos,
        (select coalesce(sum(valor), 0) from eventos_pagamento where tipo = 'payment_approved' and (recebido_em at time zone 'America/Sao_Paulo')::date = ${hojeSQL})::float as faturado,
        (select count(*) from conversas where etapa in ('inicio', 'negocio', 'servicos', 'fotos', 'confirmacao'))::int as conversando,
        (select count(*) from conversas where etapa = 'gerando')::int as gerando,
        (select count(*) from conversas where etapa = 'previa')::int as em_previa,
        (select count(*) from conversas where etapa in ('dados', 'pagamento'))::int as pagando,
        (select count(*) from conversas where etapa = 'humano')::int as humano`);
    const humanos = await sql<{ nome: string | null; telefone: string }[]>`select nome, telefone from conversas where etapa = 'humano' order by atualizado_em desc limit 5`;
    const alteracoes = await sql.unsafe(`
      select s.empresa,
        (select count(*) from jsonb_array_elements(coalesce(s.respostas->'ajustesNoAr', '[]')) a where ((a->>'em')::timestamptz at time zone 'America/Sao_Paulo')::date = ${hojeSQL})::int as hoje,
        jsonb_array_length(coalesce(s.respostas->'ajustesNoAr', '[]'))::int as no_ar,
        jsonb_array_length(coalesce(s.respostas->'ajustesFeitos', '[]'))::int as previa
      from sites s
      where jsonb_array_length(coalesce(s.respostas->'ajustesNoAr', '[]')) > 0 or jsonb_array_length(coalesce(s.respostas->'ajustesFeitos', '[]')) > 0
      order by 2 desc, 3 desc limit 10`);
    const fornecedores = await sql.unsafe(`select fornecedor, sum(usd)::float as usd from custos where dia = ${hojeSQL} group by 1 order by 2 desc`);
    const clientes = await sql.unsafe(`
      select coalesce(s.empresa, c.telefone, 'sem cliente') as cliente, sum(c.usd)::float as usd,
        (select sum(usd) from custos t where t.site_id = c.site_id)::float as total
      from custos c left join sites s on s.id = c.site_id
      where c.dia = ${hojeSQL} group by c.site_id, s.empresa, c.telefone order by 2 desc limit 10`);
    const [mes] = await sql.unsafe(`select coalesce(sum(usd), 0)::float as usd from custos where dia >= date_trunc('month', ${hojeSQL})`);
    return { n, humanos, alteracoes, fornecedores, clientes, mes };
  });
  if (!r) return "Relatório da Supporta: banco indisponível agora.";
  const { n, humanos, alteracoes, fornecedores, clientes, mes } = r as any;
  const custoHoje = (fornecedores as { usd: number }[]).reduce((t, f) => t + f.usd, 0);
  const linhas = [
    `*Supporta, resumo de ${dataBR()}*`,
    "",
    "*Hoje*",
    `• Novos contatos: ${n.novos} (${n.conversaram} ${n.conversaram === 1 ? "pessoa conversou" : "pessoas conversaram"}, ${n.recebidas} mensagens)`,
    `• Prévias entregues: ${n.previas}`,
    `• Pagamentos: ${n.pagamentos} (${brl(n.faturado)})`,
    `• Sites que foram ao ar: ${n.no_ar}`,
    "",
    "*Funil agora*",
    `• Respondendo as perguntas: ${n.conversando}`,
    `• Prévia sendo feita: ${n.gerando}`,
    `• Com a prévia, sem decidir: ${n.em_previa}`,
    `• Passando dados ou com link de pagamento: ${n.pagando}`,
    `• Esperando você: ${n.humano}${(humanos as { nome: string | null; telefone: string }[]).length ? ` (${humanos.map((h: { nome: string | null; telefone: string }) => h.nome || h.telefone).join(", ")})` : ""}`,
    "",
    "*Alterações por cliente* (hoje / total no ar / na prévia)",
    ...((alteracoes as { empresa: string; hoje: number; no_ar: number; previa: number }[]).length
      ? alteracoes.map((a: { empresa: string; hoje: number; no_ar: number; previa: number }) => `• ${a.empresa}: ${a.hoje} / ${a.no_ar} / ${a.previa}`)
      : ["• Nenhuma"]),
    "",
    `*Custo de API hoje: ${usd(custoHoje)}* (mês: ${usd(mes.usd)})`,
    ...(fornecedores as { fornecedor: string; usd: number }[]).map((f) => `• ${f.fornecedor}: ${usd(f.usd)}`),
    ...((clientes as unknown[]).length ? ["", "*Custo por cliente hoje* (total desde o início)"] : []),
    ...(clientes as { cliente: string; usd: number; total: number | null }[]).map((c) => `• ${c.cliente}: ${usd(c.usd)}${c.total ? ` (${usd(c.total)})` : ""}`),
  ];
  return linhas.join("\n");
}

/** Monta e manda no WhatsApp do dono. Devolve o texto para o VPS mandar também no Telegram. */
export async function enviarRelatorio() {
  const texto = await montarRelatorio();
  const dono = (process.env.BOT_DONO_WHATSAPP || "5511992644010").replace(/\D/g, "");
  await mensagemAvulsa(dono, texto).catch((err) => console.error("[relatorio] whatsapp:", (err as Error).message));
  return texto;
}
