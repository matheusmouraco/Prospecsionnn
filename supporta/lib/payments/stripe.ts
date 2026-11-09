import { createHmac, timingSafeEqual } from "node:crypto";
import { pricing } from "@/lib/plans";
import type { CheckoutInput, CheckoutResult, Invoice, PaymentEvent, PaymentProvider } from "./types";

// Stripe via Checkout Session. Sem SDK para manter o bundle leve: chamadas REST com form-encoding
// e verificação manual da assinatura do webhook.
// Uma sessão só cobra o site (avulso, hoje) e cria a renovação anual com 365 dias de carência:
// o endereço (e o domínio, se pedido) só começa a ser cobrado no 2º ano. Preços criados na hora
// (price_data), então não há preço para cadastrar no painel da Stripe.

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

/** Chamada REST à Stripe: sem corpo vira GET, com corpo vira POST form-encoded. */
async function stripe<T = unknown>(path: string, body?: Record<string, string>): Promise<T> {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: body ? "POST" : "GET",
    headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, ...(body ? { "content-type": "application/x-www-form-urlencoded" } : {}) },
    body: body ? form(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Stripe: ${data?.error?.message ?? res.status}`);
  return data as T;
}

export const stripeProvider: PaymentProvider = {
  name: "stripe",

  async createSubscriptionCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const items: { nome: string; valor: number; anual: boolean }[] = [
      { nome: "Site profissional Supporta (pago uma vez)", valor: pricing.site, anual: false },
      ...(input.dominio ? [{ nome: "Domínio próprio .com.br, 1º ano", valor: pricing.dominio, anual: false }] : []),
      { nome: "Renovação anual do endereço e hospedagem (a partir do 2º ano)", valor: pricing.endereco, anual: true },
      ...(input.dominio ? [{ nome: "Renovação anual do domínio próprio (a partir do 2º ano)", valor: pricing.dominio, anual: true }] : []),
    ];
    const body: Record<string, string> = {
      mode: "subscription",
      "payment_method_types[0]": "card",
      customer_email: input.customer.email,
      client_reference_id: input.reference,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      locale: "pt-BR",
      "subscription_data[trial_period_days]": "365",
    };
    items.forEach((it, i) => {
      body[`line_items[${i}][quantity]`] = "1";
      body[`line_items[${i}][price_data][currency]`] = "brl";
      body[`line_items[${i}][price_data][unit_amount]`] = String(Math.round(it.valor * 100));
      body[`line_items[${i}][price_data][product_data][name]`] = it.nome;
      if (it.anual) body[`line_items[${i}][price_data][recurring][interval]`] = "year";
    });
    for (const [k, v] of Object.entries({ reference: input.reference, plan: input.plan.id, dominio: input.dominio ? "sim" : "nao", ...input.metadata })) {
      body[`metadata[${k}]`] = v;
      body[`subscription_data[metadata][${k}]`] = v;
    }
    const data = await stripe<{ url: string; subscription?: string }>("/checkout/sessions", body);
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
      "checkout.session.completed": "subscription_linked",
      "invoice.paid": "payment_approved",
      "invoice.payment_failed": "payment_refused",
      "customer.subscription.deleted": "subscription_canceled",
    };
    return {
      type: map[event.type] ?? "ignored",
      provider: "stripe",
      providerEvent: event.type,
      reference: obj?.client_reference_id ?? obj?.metadata?.reference ?? obj?.subscription_details?.metadata?.reference ?? obj?.parent?.subscription_details?.metadata?.reference,
      subscriptionId: typeof obj.subscription === "string" ? obj.subscription : obj.object === "subscription" ? obj.id : undefined,
      customerId: typeof obj.customer === "string" ? obj.customer : undefined,
      amount: typeof obj.amount_paid === "number" ? obj.amount_paid / 100 : undefined,
      raw: { type: event.type, id: obj.id, status: obj.status },
    };
  },

  async listInvoices(customerId: string): Promise<Invoice[]> {
    const res = await fetch(`https://api.stripe.com/v1/invoices?customer=${encodeURIComponent(customerId)}&limit=12`, {
      headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Stripe: ${data?.error?.message ?? res.status}`);
    return (data.data ?? []).map((i: { id: string; created: number; amount_due: number; status: string; hosted_invoice_url: string | null }) => ({
      id: i.id,
      dueDate: new Date(i.created * 1000).toISOString().slice(0, 10),
      value: i.amount_due / 100,
      status: i.status,
      url: i.hosted_invoice_url,
    }));
  },

  async cancelSubscription(subscriptionId: string) {
    await stripe(`/subscriptions/${encodeURIComponent(subscriptionId)}`, { cancel_at_period_end: "true" });
  },

  async chargeOnce({ customerId, value, description, reference }) {
    await stripe("/invoiceitems", { customer: customerId, amount: String(Math.round(value * 100)), currency: "brl", description });
    const invoice = await stripe<{ id: string }>("/invoices", {
      customer: customerId,
      collection_method: "charge_automatically",
      pending_invoice_items_behavior: "include",
      auto_advance: "true",
      description,
      "metadata[tipo]": "multa",
      "metadata[assinatura]": reference,
    });
    const finalized = await stripe<{ id: string; hosted_invoice_url: string | null }>(`/invoices/${invoice.id}/finalize`, {});
    try {
      const paid = await stripe<{ status: string; hosted_invoice_url: string | null }>(`/invoices/${invoice.id}/pay`, {});
      return { url: paid.hosted_invoice_url ?? finalized.hosted_invoice_url, paid: paid.status === "paid" };
    } catch {
      // Cartão recusado: a fatura fica aberta e o cliente paga pelo link.
      return { url: finalized.hosted_invoice_url, paid: false };
    }
  },

  async manageUrl(customerId: string, returnUrl: string) {
    const res = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "content-type": "application/x-www-form-urlencoded" },
      body: form({ customer: customerId, return_url: returnUrl, locale: "pt-BR" }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json();
    return res.ok ? (data.url as string) : null;
  },
};
