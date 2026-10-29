import { NextResponse } from "next/server";
import { cancel } from "@/lib/autoatendimento";
import { rateLimit } from "@/lib/rate-limit";
import { getSubscriptionById } from "@/lib/repo";
import { currentClient } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const client = await currentClient();
  if (!client) return NextResponse.json({ error: "Sua sessão expirou. Entre de novo." }, { status: 401 });
  if (!rateLimit(`cancelar:${client.id}`, 3, 60 * 60 * 1000).ok) return NextResponse.json({ error: "Muitas tentativas. Tente mais tarde." }, { status: 429 });
  const body = await request.json().catch(() => null);
  if (body?.confirmar !== true) return NextResponse.json({ error: "Confirme que quer cancelar." }, { status: 400 });
  const assinatura = await getSubscriptionById(client.assinatura_id);
  if (!assinatura || assinatura.status === "cancelada") return NextResponse.json({ error: "A assinatura já está cancelada." }, { status: 409 });
  const result = await cancel(client, assinatura, String(body?.motivo ?? "").trim().slice(0, 600));
  return NextResponse.json(result.ok ? { ok: true, message: result.message, feeUrl: result.feeUrl } : { error: result.message }, { status: result.ok ? 200 : 409 });
}
