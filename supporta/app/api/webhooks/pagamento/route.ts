import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { handlePaymentEvent } from "@/lib/subscriptions";

export const runtime = "nodejs";

/** Recebe os eventos do provedor (aprovado, recusado, cancelado), atualiza o banco e avisa cliente e equipe. */
export async function POST(request: Request) {
  const provider = getPaymentProvider();
  if (!provider) return NextResponse.json({ error: "Provedor não configurado." }, { status: 503 });
  let event;
  try {
    event = await provider.parseWebhook(request);
  } catch (err) {
    console.warn("[webhook pagamento]", (err as Error).message);
    return NextResponse.json({ error: "Webhook inválido." }, { status: 401 });
  }
  await handlePaymentEvent(event);
  return NextResponse.json({ received: true });
}
