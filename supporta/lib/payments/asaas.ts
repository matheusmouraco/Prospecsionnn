import type { CheckoutInput, CheckoutResult, Invoice, PaymentEvent, PaymentProvider } from "./types";

// Asaas: cliente + cobrança avulsa do site (paga hoje, na página segura do Asaas) + assinatura anual da renovação,
// com o 1º vencimento daqui a 1 ano. Nenhum dado de cartão passa pelo nosso servidor.

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

    const payment = await asaas<{ invoiceUrl: string }>("/payments", {
      method: "POST",
      body: JSON.stringify({
        customer: customer.id,
        billingType: "UNDEFINED",
        value: input.hoje,
        dueDate: today(),
        description: `Supporta: site profissional${input.dominio ? " + 1º ano do domínio próprio" : ""}`,
        externalReference: input.reference,
        callback: { successUrl: input.successUrl, autoRedirect: true },
      }),
    });
    const nextYear = new Date(Date.now() + 365 * 864e5).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
    const subscription = await asaas<{ id: string }>("/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        customer: customer.id,
        billingType: "UNDEFINED",
        value: input.anual,
        nextDueDate: nextYear,
        cycle: "YEARLY",
        description: `Supporta: renovação anual do endereço${input.dominio ? " e do domínio próprio" : ""}`,
        externalReference: input.reference,
      }),
    });
    if (!payment.invoiceUrl) throw new Error("Asaas: cobrança criada sem fatura.");
    return { redirectUrl: payment.invoiceUrl, providerCustomerId: customer.id, providerSubscriptionId: subscription.id };
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

  async cancelSubscription(subscriptionId: string) {
    // O Asaas encerra na hora e apaga as cobranças pendentes; o site segue no ar até cancelar_em (cron diário).
    await asaas(`/subscriptions/${encodeURIComponent(subscriptionId)}`, { method: "DELETE" });
  },

  async chargeOnce({ customerId, value, description, reference }) {
    const due = new Date(Date.now() + 3 * 864e5).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
    // UNDEFINED: o cliente escolhe Pix, boleto ou cartão na fatura. externalReference próprio para não contar como renovação.
    const payment = await asaas<{ invoiceUrl: string | null; status: string }>("/payments", {
      method: "POST",
      body: JSON.stringify({ customer: customerId, billingType: "UNDEFINED", value, dueDate: due, description, externalReference: `avulso_${reference}` }),
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
