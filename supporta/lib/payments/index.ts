import { asaasProvider } from "./asaas";
import { stripeProvider } from "./stripe";
import type { PaymentProvider } from "./types";

export type { Invoice, PaymentEvent, PaymentProvider } from "./types";

/** Provedor ativo pelo .env (PAYMENT_PROVIDER=asaas|stripe). Sem chave configurada, retorna null (modo teste). */
export function getPaymentProvider(): PaymentProvider | null {
  const name = (process.env.PAYMENT_PROVIDER || "asaas").trim().toLowerCase();
  if (name === "stripe") return process.env.STRIPE_SECRET_KEY ? stripeProvider : null;
  if (name === "asaas") return process.env.ASAAS_API_KEY ? asaasProvider : null;
  // Valor inválido (ex.: o nome da variável colado como valor): usa o provedor que tiver chave, em vez de travar a venda.
  console.warn(`[pagamento] PAYMENT_PROVIDER inválido ("${name}"); escolhendo pelo provedor que tem chave.`);
  if (process.env.ASAAS_API_KEY) return asaasProvider;
  if (process.env.STRIPE_SECRET_KEY) return stripeProvider;
  return null;
}
