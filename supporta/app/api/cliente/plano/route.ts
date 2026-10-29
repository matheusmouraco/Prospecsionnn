import { NextResponse } from "next/server";
import { changePlan } from "@/lib/autoatendimento";
import { getPlan } from "@/lib/plans";
import { rateLimit } from "@/lib/rate-limit";
import { getSubscriptionById } from "@/lib/repo";
import { currentClient } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const client = await currentClient();
  if (!client) return NextResponse.json({ error: "Sua sessão expirou. Entre de novo." }, { status: 401 });
  if (!rateLimit(`plano:${client.id}`, 5, 60 * 60 * 1000).ok) return NextResponse.json({ error: "Muitas tentativas. Tente mais tarde." }, { status: 429 });
  const body = await request.json().catch(() => null);
  const plan = getPlan(String(body?.plano ?? ""));
  const assinatura = await getSubscriptionById(client.assinatura_id);
  if (!plan || !assinatura) return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  if (assinatura.status !== "ativa" || assinatura.cancelamento_pedido_em) return NextResponse.json({ error: "A assinatura não está ativa para trocar de plano." }, { status: 409 });
  const result = await changePlan(client, assinatura, plan.id);
  return NextResponse.json(result.ok ? { ok: true, message: result.message } : { error: result.message }, { status: result.ok ? 200 : 409 });
}
