import type { Plan } from "@/lib/plans";

export type Customer = {
  name: string;
  company: string;
  email: string;
  phone: string;
  cpfCnpj: string;
};

export type CheckoutInput = {
  plan: Plan;
  /** Cliente quer domínio próprio .com.br (cobrado já no 1º ano e renovado todo ano). */
  dominio: boolean;
  /** Cobrado hoje: o site (pago uma vez) e, se pedido, o 1º ano do domínio. Em reais. */
  hoje: number;
  /** Renovação anual a partir do 2º ano: endereço e, se pedido, domínio. Em reais. */
  anual: number;
  customer: Customer;
  /** Identificador nosso da assinatura, enviado ao provedor e devolvido nos webhooks. */
  reference: string;
  successUrl: string;
  cancelUrl: string;
  remoteIp: string;
  metadata: Record<string, string>;
};

export type CheckoutResult = {
  redirectUrl: string;
  providerCustomerId?: string;
  providerSubscriptionId?: string;
};

export type PaymentEventType = "payment_approved" | "payment_refused" | "subscription_canceled" | "subscription_linked" | "ignored";

export type PaymentEvent = {
  type: PaymentEventType;
  provider: string;
  providerEvent: string;
  reference?: string;
  subscriptionId?: string;
  customerId?: string;
  amount?: number;
  raw?: unknown;
};

export type Invoice = { id: string; dueDate: string; value: number; status: string; url: string | null };

/** Contrato que todo provedor implementa. Trocar de provedor = trocar PAYMENT_PROVIDER no .env. */
export interface PaymentProvider {
  name: string;
  createSubscriptionCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  /** Valida a autenticidade do webhook e traduz para um evento nosso. Lança erro se inválido. */
  parseWebhook(request: Request): Promise<PaymentEvent>;
  /** Últimas faturas do cliente, para a área do cliente. */
  listInvoices(customerId: string): Promise<Invoice[]>;
  /** Página do provedor onde o cliente troca o cartão sozinho, quando o provedor oferece. */
  manageUrl?(customerId: string, returnUrl: string): Promise<string | null>;
  /** Para as renovações anuais. O site fica no ar até o fim do ano já pago (controlado por nós). */
  cancelSubscription(subscriptionId: string): Promise<void>;
  /** Cobrança avulsa (alteração depois de 30 dias). Devolve o link da fatura e se já foi paga. */
  chargeOnce(input: { customerId: string; value: number; description: string; reference: string }): Promise<{ url: string | null; paid: boolean }>;
}
