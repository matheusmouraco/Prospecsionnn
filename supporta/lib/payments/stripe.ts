import { createHmac, timingSafeEqual } from "node:crypto";
import type { PlanId } from "@/lib/plans";
import type { CheckoutInput, CheckoutResult, PaymentEvent, PaymentProvider } from "./types";

// Stripe Billing via Checkout Session (modo subscription). Sem SDK para manter o bundle leve:
// chamadas REST com form-encoding e verificação manual da assinatura do webhook.

const priceIds: Record<PlanId, string | undefined> = {
  start: process.env.STRIPE_PRICE_START,
  pro: process.env.STRIPE_PRICE_PRO,
  premium: process.env.STRIPE_PRICE_PREMIUM,
};

function form(data: Record<string, string>) {
  return new URLSearchParams(data).toString();
}

function verifySignature(payload: string, header: string, secret: string) {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const signatures = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  return signatures.some((sig) => sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
}

export const stripeProvider: PaymentProvider = {
  name: "stripe",

  async createSubscriptionCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const price = priceIds[input.plan.id];
    if (!price) throw new Error(`Stripe: STRIPE_PRICE_${input.plan.id.toUpperCase()} não configurado.`);
    const metadata: Record<string, string> = {};
    for (const [k, v] of Object.entries({ reference: input.reference, plan: input.plan.id, ...input.metadata })) {
      metadata[`metadata[${k}]`] = v;
      metadata[`subscription_data[metadata][${k}]`] = v;
    }
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: form({
        mode: "subscription",
        "line_items[0][price]": price,
        "line_items[0][quantity]": "1",
        "payment_method_types[0]": "card",
        customer_email: input.customer.email,
        client_reference_id: input.reference,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        locale: "pt-BR",
        ...metadata,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Stripe: ${data?.error?.message ?? res.status}`);
    return { redirectUrl: data.url, providerSubscriptionId: data.subscription ?? undefined };
  },

  async parseWebhook(request: Request): Promise<PaymentEvent> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const payload = await request.text();
    const header = request.headers.get("stripe-signature") ?? "";
    if (!secret || !verifySignature(payload, header, secret)) throw new Error("Assinatura do webhook inválida.");
    const event = JSON.parse(payload);
    const obj = event?.data?.object ?? {};
    const map: Record<string, PaymentEvent["type"]> = {
      "invoice.paid": "payment_approved",
      "invoice.payment_failed": "payment_refused",
      "customer.subscription.deleted": "subscription_canceled",
    };
    return {
      type: map[event.type] ?? "ignored",
      provider: "stripe",
      providerEvent: event.type,
      reference: obj?.metadata?.reference ?? obj?.subscription_details?.metadata?.reference ?? obj?.parent?.subscription_details?.metadata?.reference,
      subscriptionId: typeof obj.subscription === "string" ? obj.subscription : obj.id,
      amount: typeof obj.amount_paid === "number" ? obj.amount_paid / 100 : undefined,
    };
  },
};
