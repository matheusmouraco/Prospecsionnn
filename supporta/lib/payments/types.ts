import type { Cycle, Plan } from "@/lib/plans";

export type Customer = {
  name: string;
  company: string;
  email: string;
  phone: string;
  cpfCnpj: string;
};

export type CheckoutInput = {
  plan: Plan;
  /** Mensal ou anual. */
  cycle: Cycle;
  /** Valor de cada cobrança no ciclo (mensalidade ou anuidade), em reais. */
  amount: number;
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
  /** Desconto de quem continua depois do prazo mínimo: passa a cobrar `value` nas próximas cobranças. */
  applyLoyaltyDiscount(input: { subscriptionId: string; value: number; plan: Plan; cycle: Cycle }): Promise<void>;
  /** Página do provedor onde o cliente troca o cartão sozinho, quando o provedor oferece. */
  manageUrl?(customerId: string, returnUrl: string): Promise<string | null>;
}
