import { NextResponse } from "next/server";
import { isCronAuthorized, runWithBudget } from "@/lib/cron";
import { notifyTeam } from "@/lib/email/send";
import { pendingCitationClients, runCitationsFor } from "@/lib/monitor/citations";

export const runtime = "nodejs";
export const maxDuration = 300;

// Roda diariamente nos primeiros dias do mês: cada execução atende os clientes que cabem no tempo.
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const clients = (await pendingCitationClients()) ?? [];
  const result = await runWithBudget(clients, 200_000, (c) => runCitationsFor(c));
  if (result.failures.length) {
    await notifyTeam("Falha no monitoramento de citações", result.failures.map((f) => `${f.item.nome}: ${f.error}`));
  }
  return NextResponse.json({ processed: result.processed, remaining: result.remaining, failures: result.failures.length });
}
