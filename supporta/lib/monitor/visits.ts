import { monthStart, tryDb } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { visitsEmail, type VisitsData } from "@/lib/email/templates";
import type { Cliente } from "@/lib/repo";

// Estatísticas pela Stats API v2 do Plausible (plausible.io ou instância própria em PLAUSIBLE_URL).

async function query(body: Record<string, unknown>) {
  const base = (process.env.PLAUSIBLE_URL || "https://plausible.io").replace(/\/$/, "");
  const res = await fetch(`${base}/api/v2/query`, {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.PLAUSIBLE_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Plausible ${res.status}: ${JSON.stringify(data).slice(0, 200)}`);
  return (data.results ?? []) as { metrics: number[]; dimensions: string[] }[];
}

const lastDay = (first: string) => {
  const d = new Date(`${first}T12:00:00Z`);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).toISOString().slice(0, 10);
};

export async function fetchVisits(siteId: string, mes: string): Promise<VisitsData> {
  const range = [mes, lastDay(mes)];
  const prev = monthStart(-1, new Date(`${mes}T12:00:00Z`));
  const [totals, previous, sources, pages] = await Promise.all([
    query({ site_id: siteId, metrics: ["visitors", "visits", "pageviews"], date_range: range }),
    query({ site_id: siteId, metrics: ["visitors"], date_range: [prev, lastDay(prev)] }),
    query({ site_id: siteId, metrics: ["visitors"], date_range: range, dimensions: ["visit:source"], order_by: [["visitors", "desc"]], pagination: { limit: 5 } }),
    query({ site_id: siteId, metrics: ["visitors"], date_range: range, dimensions: ["event:page"], order_by: [["visitors", "desc"]], pagination: { limit: 5 } }),
  ]);
  const [visitantes = 0, visitas = 0, paginas = 0] = totals[0]?.metrics ?? [];
  return {
    mes,
    visitantes,
    visitas,
    paginas,
    anterior: previous[0] ? { visitantes: previous[0].metrics[0] ?? 0 } : null,
    fontes: sources.map((r) => ({ nome: r.dimensions[0] === "Direct / None" ? "Acesso direto" : r.dimensions[0], visitantes: r.metrics[0] })),
    topPaginas: pages.map((r) => ({ pagina: r.dimensions[0], visitantes: r.metrics[0] })),
  };
}

/** Clientes Pro e Premium com Plausible configurado e sem relatório do mês anterior. */
export function pendingVisitClients(mes = monthStart(-1)) {
  return tryDb("pendingVisitClients", (sql) => sql<Cliente[]>`
    select c.* from clientes c
    where c.ativo and c.plano in ('pro', 'premium') and c.plausible_site_id is not null
      and not exists (select 1 from relatorios_visitas r where r.cliente_id = c.id and r.mes = ${mes}::date and r.enviado_em is not null)
    order by c.criado_em`);
}

export async function runVisitsFor(client: Cliente, mes = monthStart(-1)) {
  const data = await fetchVisits(client.plausible_site_id!, mes);
  const sent = await sendEmail({ to: client.email, ...visitsEmail(client.nome, data) });
  await tryDb("saveVisits", (sql) => sql`
    insert into relatorios_visitas (cliente_id, mes, dados, enviado_em)
    values (${client.id}, ${mes}, ${sql.json(data as never)}, ${sent ? new Date() : null})
    on conflict (cliente_id, mes) do update set dados = excluded.dados, enviado_em = coalesce(excluded.enviado_em, relatorios_visitas.enviado_em)`);
  return data;
}
