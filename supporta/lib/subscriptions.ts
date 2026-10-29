import { notifyTeam, sendEmail } from "./email/send";
import { paymentRefusedEmail, welcomeEmail } from "./email/templates";
import { sendToWebhook } from "./leads";
import { getPaymentProvider, type PaymentEvent } from "./payments";
import { billing, getPlan, loyaltyPriceFor, type Plan } from "./plans";
import type { Assinatura } from "./repo";
import {
  countApprovedPayments,
  deactivateClient,
  ensureClient,
  findSubscription,
  logPaymentEvent,
  markLoyaltyDiscount,
  markWelcomeSent,
  setProviderIds,
  setSubscriptionStatus,
} from "./repo";
import { absoluteUrl, site } from "./site";
import { briefingSignature } from "./tokens";

export function briefingUrl(referencia: string) {
  return absoluteUrl(`/briefing?ref=${referencia}&t=${briefingSignature(referencia)}`);
}

/** Aplica um evento do provedor: atualiza a assinatura, cria o cliente e manda os e-mails certos. */
export async function handlePaymentEvent(event: PaymentEvent) {
  const assinatura = await findSubscription({ referencia: event.reference, subscriptionId: event.subscriptionId });
  await logPaymentEvent({ assinaturaId: assinatura?.id ?? null, provedor: event.provider, evento: event.providerEvent, tipo: event.type, valor: event.amount, bruto: event.raw });

  if (assinatura && (event.customerId || event.subscriptionId)) {
    await setProviderIds(assinatura.referencia, { customerId: event.customerId, subscriptionId: event.subscriptionId });
  }
  if (event.type !== "ignored" && event.type !== "subscription_linked") {
    await sendToWebhook(`pagamento_${event.type}`, { ...event, raw: undefined, empresa: assinatura?.empresa, email: assinatura?.email, plano: assinatura?.plano });
  }
  if (!assinatura) return;
  const plan = getPlan(assinatura.plano);

  if (event.type === "payment_approved") {
    await setSubscriptionStatus(assinatura.id, "ativa");
    await ensureClient({ ...assinatura, status: "ativa" });
    if (await markWelcomeSent(assinatura.id)) {
      const mail = welcomeEmail({
        nome: assinatura.responsavel.split(" ")[0],
        plano: plan?.name ?? assinatura.plano,
        prazo: site.deliveryDays[assinatura.plano],
        briefingUrl: briefingUrl(assinatura.referencia),
      });
      await sendEmail({ to: assinatura.email, ...mail });
      await notifyTeam(`Nova assinatura: ${assinatura.empresa} (${plan?.name})`, [
        `${assinatura.responsavel} · ${assinatura.email} · ${assinatura.whatsapp}`,
        `Plano ${plan?.name} ${assinatura.ciclo}, R$${assinatura.valor} por cobrança`,
        `Origem: ${JSON.stringify(assinatura.origem)}`,
      ]);
    }
    if (plan) await maybeApplyLoyaltyDiscount(assinatura, plan);
  } else if (event.type === "payment_refused") {
    await setSubscriptionStatus(assinatura.id, "pagamento_recusado");
    await sendEmail({ to: assinatura.email, ...paymentRefusedEmail(assinatura.responsavel.split(" ")[0]) });
    await notifyTeam(`Cobrança recusada: ${assinatura.empresa}`, [`${assinatura.email} · ${assinatura.whatsapp}`]);
  } else if (event.type === "subscription_canceled") {
    // Cancelado pela área do cliente: o site segue no ar até o fim do período pago (o cron diário desliga).
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
    if (assinatura.cancelar_em && new Date(assinatura.cancelar_em).toISOString().slice(0, 10) >= today) return;
    await setSubscriptionStatus(assinatura.id, "cancelada");
    await deactivateClient(assinatura.id);
    await notifyTeam(`Assinatura cancelada: ${assinatura.empresa}`, [`${assinatura.email} · ${assinatura.whatsapp}`]);
  }
}

/**
 * Desconto de quem continua: a partir do 13º mês a cobrança cai billing.loyaltyDiscountPct.
 * No mensal, aplica depois da 12ª mensalidade paga; no anual, depois da 1ª anuidade (a próxima já é a do 13º mês).
 */
async function maybeApplyLoyaltyDiscount(assinatura: Assinatura, plan: Plan) {
  if (assinatura.desconto_fidelidade_em || !assinatura.provedor_assinatura_id) return;
  const paid = await countApprovedPayments(assinatura.id);
  const threshold = assinatura.ciclo === "anual" ? 1 : billing.minMonths;
  if (paid === null || paid < threshold) return;
  const provider = getPaymentProvider();
  if (!provider || provider.name !== assinatura.provedor) return;
  const value = loyaltyPriceFor(plan, assinatura.ciclo);
  try {
    await provider.applyLoyaltyDiscount({ subscriptionId: assinatura.provedor_assinatura_id, value, plan, cycle: assinatura.ciclo });
    if (await markLoyaltyDiscount(assinatura.id, value)) {
      await notifyTeam(`Desconto de fidelidade aplicado: ${assinatura.empresa}`, [`Plano ${plan.name} ${assinatura.ciclo}, próximas cobranças de R$${value}`]);
    }
  } catch (err) {
    console.error("[fidelidade]", (err as Error).message);
    await notifyTeam(`Falha ao aplicar desconto de fidelidade: ${assinatura.empresa}`, [(err as Error).message, "Aplicar manualmente no painel do provedor."]);
  }
}
