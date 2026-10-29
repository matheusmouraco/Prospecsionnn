import type { CheckoutInput, CheckoutResult, Invoice, PaymentEvent, PaymentProvider } from "./types";

// Asaas: cliente + assinatura (mensal ou anual) no cartão. O cliente paga a 1ª fatura na página segura do Asaas
// (invoiceUrl) e o cartão fica salvo para as próximas cobranças. Nenhum dado de cartão passa pelo nosso servidor.

const baseUrl = () => (process.env.ASAAS_API_URL || "https://api.asaas.com/v3").replace(/\/$/, "");

async function asaas<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      "user-agent": "supporta-site",
      access_token: process.env.ASAAS_API_KEY ?? "",
      ...init.headers,
    },
    signal: AbortSignal.timeout(15_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.errors?.map((e: { description: string }) => e.description).join("; ") || `HTTP ${res.status}`;
    throw new Error(`Asaas: ${message}`);
  }
  return data as T;
}

function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

const approved = new Set(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]);
const refused = new Set(["PAYMENT_CREDIT_CARD_CAPTURE_REFUSED", "PAYMENT_REPROVED_BY_RISK_ANALYSIS", "PAYMENT_OVERDUE"]);
const canceled = new Set(["SUBSCRIPTION_DELETED", "SUBSCRIPTION_INACTIVATED"]);

export const asaasProvider: PaymentProvider = {
  name: "asaas",

  async createSubscriptionCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const customer = await asaas<{ id: string }>("/customers", {
      method: "POST",
      body: JSON.stringify({
        name: input.customer.company || input.customer.name,
        cpfCnpj: input.customer.cpfCnpj,
        email: input.customer.email,
        mobilePhone: input.customer.phone,
        externalReference: input.reference,
        notificationDisabled: false,
      }),
    });

    const subscription = await asaas<{ id: string }>("/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        customer: customer.id,
        billingType: "CREDIT_CARD",
        value: input.amount,
        nextDueDate: today(),
        cycle: input.cycle === "anual" ? "YEARLY" : "MONTHLY",
        description: `Supporta, plano ${input.plan.name} ${input.cycle} (prazo mínimo de 12 meses)`,
        externalReference: input.reference,
        callback: { successUrl: input.successUrl, autoRedirect: true },
      }),
    });

    const payments = await asaas<{ data: { invoiceUrl: string }[] }>(`/subscriptions/${subscription.id}/payments`);
    const invoiceUrl = payments.data?.[0]?.invoiceUrl;
    if (!invoiceUrl) throw new Error("Asaas: assinatura criada sem fatura inicial.");
    return { redirectUrl: invoiceUrl, providerCustomerId: customer.id, providerSubscriptionId: subscription.id };
  },

  async parseWebhook(request: Request): Promise<PaymentEvent> {
    const expected = process.env.ASAAS_WEBHOOK_TOKEN;
    if (!expected || request.headers.get("asaas-access-token") !== expected) throw new Error("Token do webhook inválido.");
    const body = await request.json();
    const event: string = body?.event ?? "";
    const payment = body?.payment ?? {};
    const type = approved.has(event) ? "payment_approved" : refused.has(event) ? "payment_refused" : canceled.has(event) ? "subscription_canceled" : "ignored";
    return {
      type,
      provider: "asaas",
      providerEvent: event,
      reference: payment.externalReference ?? body?.subscription?.externalReference,
      subscriptionId: payment.subscription ?? body?.subscription?.id,
      customerId: payment.customer ?? body?.subscription?.customer,
      amount: payment.value,
      raw: { event, id: payment.id ?? body?.subscription?.id, status: payment.status, billingType: payment.billingType },
    };
  },

  async applyLoyaltyDiscount({ subscriptionId, value }) {
    // updatePendingPayments: a próxima fatura, se já gerada, também sai com o valor novo.
    await asaas(`/subscriptions/${encodeURIComponent(subscriptionId)}`, { method: "POST", body: JSON.stringify({ value, updatePendingPayments: true }) });
  },

  async changePlan({ subscriptionId, plan, cycle, value }) {
    await asaas(`/subscriptions/${encodeURIComponent(subscriptionId)}`, {
      method: "POST",
      body: JSON.stringify({ value, description: `Supporta, plano ${plan.name} ${cycle} (prazo mínimo de 12 meses)`, updatePendingPayments: true }),
    });
  },

  async cancelSubscription(subscriptionId: string) {
    // O Asaas encerra na hora e apaga as cobranças pendentes; o site segue no ar até cancelar_em (cron diário).
    await asaas(`/subscriptions/${encodeURIComponent(subscriptionId)}`, { method: "DELETE" });
  },

  async chargeOnce({ customerId, value, description, reference }) {
    const due = new Date(Date.now() + 3 * 864e5).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
    // UNDEFINED: o cliente escolhe Pix, boleto ou cartão na fatura. externalReference próprio para não contar como mensalidade.
    const payment = await asaas<{ invoiceUrl: string | null; status: string }>("/payments", {
      method: "POST",
      body: JSON.stringify({ customer: customerId, billingType: "UNDEFINED", value, dueDate: due, description, externalReference: `multa_${reference}` }),
    });
    return { url: payment.invoiceUrl, paid: payment.status === "RECEIVED" || payment.status === "CONFIRMED" };
  },

  async listInvoices(customerId: string): Promise<Invoice[]> {
    const data = await asaas<{ data: { id: string; dueDate: string; value: number; status: string; invoiceUrl: string | null }[] }>(
      `/payments?customer=${encodeURIComponent(customerId)}&limit=12`,
    );
    return (data.data ?? []).map((p) => ({ id: p.id, dueDate: p.dueDate, value: p.value, status: p.status, url: p.invoiceUrl }));
  },
};
