import { tryDb } from "@/lib/db";
import type { Site } from "@/lib/repo";
import { quebrado } from "./retornos";

// Prévia no ar por 5 dias: até o fim do 5º dia depois de enviada (horário de São Paulo).
// Depois disso o link mostra "saiu do ar"; nada é apagado, e o cliente que volta ganha mais 2 dias.

export const DIAS_PREVIA = 5;
export const DIAS_REATIVADA = 2;
const STATUS_PREVIA = ["previa", "ajuste", "ajustando", "erro"];

type ComExpiracao = Site & { previa_expira_em: Date | null; aviso_expiracao_em: Date | null };

const fimDoDia = (dias: number) =>
  `((date_trunc('day', now() at time zone 'America/Sao_Paulo') + interval '${dias + 1} days' - interval '1 second') at time zone 'America/Sao_Paulo')`;

/** Primeira prévia pronta: começa a contar os 5 dias (só da primeira vez). */
export function marcarExpiracao(siteId: string) {
  return tryDb("marcarExpiracao", (sql) => sql.unsafe(
    `update sites set previa_expira_em = coalesce(previa_expira_em, ${fimDoDia(DIAS_PREVIA)}) where id = $1`, [siteId]));
}

export function previaExpirou(site: Pick<ComExpiracao, "status" | "previa_expira_em">, agora = new Date()) {
  return STATUS_PREVIA.includes(site.status) && Boolean(site.previa_expira_em) && new Date(site.previa_expira_em!) < agora;
}

/** Cliente voltou depois do prazo: a prévia volta ao ar por mais 2 dias (e pode receber o aviso de último dia de novo). */
export async function reativarPrevia(siteId: string) {
  return tryDb("reativarPrevia", (sql) => sql.unsafe(
    `update sites set previa_expira_em = ${fimDoDia(DIAS_REATIVADA)}, aviso_expiracao_em = null where id = $1`, [siteId]));
}

export async function lerExpiracao(siteId: string) {
  return tryDb("lerExpiracao", async (sql) => {
    const [row] = await sql<Pick<ComExpiracao, "status" | "previa_expira_em">[]>`select status, previa_expira_em from sites where id = ${siteId}`;
    return row ?? null;
  });
}

/** Quem está no último dia da prévia, sem pagar, e ainda não recebeu o aviso. Manda a partir das 10h (minutos quebrados) até as 21h. */
export async function previasNoUltimoDia(agora = new Date()) {
  const local = new Date(agora.getTime() - 3 * 3600_000);
  const hora = local.getUTCHours() + local.getUTCMinutes() / 60;
  if (hora < 10 || hora >= 21) return [];
  const rows = await tryDb("previasNoUltimoDia", (sql) => sql<{ id: string; slug: string; empresa: string; telefone: string }[]>`
    select s.id, s.slug, s.empresa, c.telefone from sites s join conversas c on c.site_id = s.id
    where s.status in ('previa', 'ajuste', 'ajustando', 'erro') and s.aviso_expiracao_em is null
      and s.previa_expira_em > ${agora}
      and (s.previa_expira_em at time zone 'America/Sao_Paulo')::date = (${agora}::timestamptz at time zone 'America/Sao_Paulo')::date
      and c.etapa in ('previa', 'dados', 'pagamento')`);
  return (rows ?? []).filter((r) => hora >= 10 + quebrado(r.telefone, 99) / 3600_000);
}

export function marcarAvisoExpiracao(siteId: string) {
  return tryDb("marcarAvisoExpiracao", (sql) => sql`update sites set aviso_expiracao_em = now() where id = ${siteId}`);
}
