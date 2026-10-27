import { notifyTeam, sendEmail } from "./email/send";
import { paymentRefusedEmail, welcomeEmail } from "./email/templates";
import { sendToWebhook } from "./leads";
import type { PaymentEvent } from "./payments";
import { getPlan } from "./plans";
import {
  deactivateClient,
  ensureClient,
  findSubscription,
  logPaymentEvent,
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
        `Plano ${plan?.name}, R$${plan?.price}/mês`,
        `Origem: ${JSON.stringify(assinatura.origem)}`,
      ]);
    }
  } else if (event.type === "payment_refused") {
    await setSubscriptionStatus(assinatura.id, "pagamento_recusado");
    await sendEmail({ to: assinatura.email, ...paymentRefusedEmail(assinatura.responsavel.split(" ")[0]) });
    await notifyTeam(`Cobrança recusada: ${assinatura.empresa}`, [`${assinatura.email} · ${assinatura.whatsapp}`]);
  } else if (event.type === "subscription_canceled") {
    await setSubscriptionStatus(assinatura.id, "cancelada");
    await deactivateClient(assinatura.id);
    await notifyTeam(`Assinatura cancelada: ${assinatura.empresa}`, [`${assinatura.email} · ${assinatura.whatsapp}`]);
  }
}
