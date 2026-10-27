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

export type PaymentEventType = "payment_approved" | "payment_refused" | "subscription_canceled" | "ignored";

export type PaymentEvent = {
  type: PaymentEventType;
  provider: string;
  providerEvent: string;
  reference?: string;
  subscriptionId?: string;
  amount?: number;
};

/** Contrato que todo provedor implementa. Trocar de provedor = trocar PAYMENT_PROVIDER no .env. */
export interface PaymentProvider {
  name: string;
  createSubscriptionCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  /** Valida a autenticidade do webhook e traduz para um evento nosso. Lança erro se inválido. */
  parseWebhook(request: Request): Promise<PaymentEvent>;
}
