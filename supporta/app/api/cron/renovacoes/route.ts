import { NextResponse } from "next/server";
import { avisarRenovacoes } from "@/lib/bot/renovacao";
import { isCronAuthorized } from "@/lib/cron";

export const runtime = "nodejs";

/** Diário (10h17 em São Paulo): avisa no WhatsApp e por e-mail 15 e 3 dias antes da renovação anual. */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const enviados = await avisarRenovacoes();
  return NextResponse.json({ avisados: enviados.length });
}
