import { headers } from "next/headers";
import { tryDb } from "./db";
import { isAdminAuthorization } from "./admin-auth";
import type { Ajuste, Assinatura, Cliente, Solicitacao } from "./repo";

/** Segunda checagem dentro das server actions (o proxy já barra quem não tem senha). */
export async function assertAdmin() {
  if (!isAdminAuthorization((await headers()).get("authorization"))) throw new Error("Não autorizado.");
}

export function adminOverview() {
  return tryDb("adminOverview", async (sql) => {
    const [assinaturas, ajustes, clientes, leads, pedidos] = await Promise.all([
      sql<(Assinatura & { tem_briefing: boolean; briefing_id: string | null })[]>`
        select a.*, (b.id is not null) as tem_briefing, b.id as briefing_id
        from assinaturas a left join lateral (select id from briefings where assinatura_id = a.id order by enviado_em desc limit 1) b on true
        order by a.criado_em desc limit 60`,
      sql<(Ajuste & { cliente_nome: string; plano: string })[]>`
        select j.*, c.nome as cliente_nome, c.plano from ajustes j join clientes c on c.id = j.cliente_id
        where j.status <> 'feito' order by j.pedido_em`,
      sql<Cliente[]>`select * from clientes order by criado_em desc limit 100`,
      sql<{ dia: Date; n: number }[]>`
        select date_trunc('day', criado_em) as dia, count(*)::int as n from leads
        where criado_em > now() - interval '14 days' group by 1 order by 1 desc`,
      sql<(Solicitacao & { cliente_nome: string; plano: string; whatsapp: string | null })[]>`
        select s.*, c.nome as cliente_nome, c.plano, c.whatsapp from solicitacoes s join clientes c on c.id = s.cliente_id
        where s.status = 'aberto' order by s.criado_em`,
    ]);
    return { assinaturas, ajustes, clientes, leads, pedidos };
  });
}

export function adminBriefing(id: string) {
  return tryDb("adminBriefing", async (sql) => {
    const [row] = await sql<{ id: string; respostas: Record<string, unknown>; arquivos: { path: string; nome: string; kind: string }[]; enviado_em: Date; empresa: string; plano: string; email: string; whatsapp: string }[]>`
      select b.*, a.empresa, a.plano, a.email, a.whatsapp from briefings b join assinaturas a on a.id = b.assinatura_id where b.id = ${id}`;
    return row ?? null;
  });
}

export function updateClientConfig(id: string, data: { nomes: string[]; perguntas: string[]; plausible: string | null; site: string | null; ativo: boolean }) {
  return tryDb("updateClientConfig", (sql) => sql`
    update clientes set nomes_busca = ${data.nomes}, perguntas_ia = ${data.perguntas}, plausible_site_id = ${data.plausible},
      site_url = ${data.site}, ativo = ${data.ativo} where id = ${id}`);
}
