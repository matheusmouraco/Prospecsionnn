import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron";
import { notifyTeam } from "@/lib/email/send";
import { deactivateClient, dueCancellations, setSubscriptionStatus } from "@/lib/repo";

export const runtime = "nodejs";

/** Diário: assinaturas canceladas pela área do cliente cujo período pago acabou saem do ar. */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const due = (await dueCancellations()) ?? [];
  for (const a of due) {
    await setSubscriptionStatus(a.id, "cancelada");
    await deactivateClient(a.id);
  }
  if (due.length) {
    await notifyTeam(`Período pago encerrado: ${due.length} site(s) para tirar do ar`, due.map((a) => `${a.empresa} · ${a.email} · plano ${a.plano}`));
  }
  return NextResponse.json({ encerradas: due.length });
}
