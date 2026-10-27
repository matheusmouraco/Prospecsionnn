import { NextResponse } from "next/server";
import { sendToWebhook } from "@/lib/leads";
import { getPaymentProvider } from "@/lib/payments";

export const runtime = "nodejs";

/** Recebe os eventos do provedor (aprovado, recusado, cancelado) e repassa ao CRM. */
export async function POST(request: Request) {
  const provider = getPaymentProvider();
  if (!provider) return NextResponse.json({ error: "Provedor não configurado." }, { status: 503 });
  try {
    const event = await provider.parseWebhook(request);
    if (event.type !== "ignored") await sendToWebhook(`pagamento_${event.type}`, event);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.warn("[webhook pagamento]", (err as Error).message);
    return NextResponse.json({ error: "Webhook inválido." }, { status: 401 });
  }
}
