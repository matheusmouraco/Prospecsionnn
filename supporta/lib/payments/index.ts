import { asaasProvider } from "./asaas";
import { stripeProvider } from "./stripe";
import type { PaymentProvider } from "./types";

export type { Invoice, PaymentEvent, PaymentProvider } from "./types";

/** Provedor ativo pelo .env (PAYMENT_PROVIDER=asaas|stripe). Sem chave configurada, retorna null (modo teste). */
export function getPaymentProvider(): PaymentProvider | null {
  const name = (process.env.PAYMENT_PROVIDER || "asaas").toLowerCase();
  if (name === "stripe") return process.env.STRIPE_SECRET_KEY ? stripeProvider : null;
  if (name === "asaas") return process.env.ASAAS_API_KEY ? asaasProvider : null;
  throw new Error(`PAYMENT_PROVIDER desconhecido: ${name}`);
}
