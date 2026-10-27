import { NextResponse } from "next/server";
import { isCronAuthorized, runWithBudget } from "@/lib/cron";
import { notifyTeam } from "@/lib/email/send";
import { pendingVisitClients, runVisitsFor } from "@/lib/monitor/visits";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  if (!process.env.PLAUSIBLE_API_KEY) return NextResponse.json({ skipped: "PLAUSIBLE_API_KEY ausente" });
  const clients = (await pendingVisitClients()) ?? [];
  const result = await runWithBudget(clients, 240_000, (c) => runVisitsFor(c));
  if (result.failures.length) {
    await notifyTeam("Falha no relatório de visitas", result.failures.map((f) => `${f.item.nome}: ${f.error}`));
  }
  return NextResponse.json({ processed: result.processed, remaining: result.remaining, failures: result.failures.length });
}
