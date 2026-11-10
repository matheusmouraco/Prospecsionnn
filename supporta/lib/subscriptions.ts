import { notifyTeam, sendEmail } from "./email/send";
import { noticeEmail, paymentRefusedEmail, welcomeEmail } from "./email/templates";
import { sendToWebhook } from "./leads";
import type { PaymentEvent } from "./payments";
import { getPlan, pricing } from "./plans";
import {
  cancelSiteBySubscription,
  deactivateClient,
  ensureClient,
  findSubscription,
  logPaymentEvent,
  markSitePaid,
  markWelcomeSent,
  setProviderIds,
  setSubscriptionStatus,
} from "./repo";
import { absoluteUrl, botWhatsapp, botWhatsappUrl, site, suporteTexto } from "./site";
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
    // Site do criador: o gerador do VPS publica sozinho assim que o site fica "pago".
    if (assinatura.site_id) {
      await markSitePaid(assinatura.site_id, assinatura.id, assinatura.plano);
      // Site criado pelo WhatsApp: o robô confirma por lá.
      const { avisarConversa } = await import("./bot/fluxo");
      await avisarConversa("", "pago", assinatura.site_id).catch((err) => console.error("[pagamento] whatsapp:", (err as Error).message));
    }
    if (await markWelcomeSent(assinatura.id)) {
      const mail = assinatura.site_id
        ? noticeEmail("Pagamento confirmado. Seu site está indo ao ar", [
            `Oi, ${assinatura.responsavel.split(" ")[0]}. Pagamento confirmado: o seu site profissional Supporta está pago.`,
            `Agora entram as páginas Sobre, Serviços, Perguntas frequentes e Contato, e o site vai ao ar em até ${pricing.prazoHoras}h. Você recebe o link no WhatsApp e por e-mail.`,
            `Nos primeiros ${pricing.diasAlteracaoGratis} dias depois da entrega, as alterações são sem custo. É só pedir pelo WhatsApp ${botWhatsapp}.`,
            suporteTexto(),
          ], undefined, { label: "Falar no WhatsApp", href: botWhatsappUrl("Oi! Já paguei o meu site e queria falar sobre ele.") })
        : welcomeEmail({
            nome: assinatura.responsavel.split(" ")[0],
            plano: plan?.name ?? assinatura.plano,
            prazo: site.deliveryDays[assinatura.plano],
            briefingUrl: briefingUrl(assinatura.referencia),
          });
      await sendEmail({ to: assinatura.email, ...mail });
      await notifyTeam(`Novo site vendido: ${assinatura.empresa}`, [
        `${assinatura.responsavel} · ${assinatura.email} · ${assinatura.whatsapp}`,
        `Pago hoje R$${assinatura.valor}${assinatura.dominio_proprio ? " (com domínio próprio: registrar no registro.br e combinar no WhatsApp)" : ""}; renovação de R$${assinatura.valor_anual ?? "45"}/ano a partir do 2º ano`,
        `Origem: ${JSON.stringify(assinatura.origem)}`,
      ]);
    }
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
    await cancelSiteBySubscription(assinatura.id);
    await notifyTeam(`Assinatura cancelada: ${assinatura.empresa}`, [`${assinatura.email} · ${assinatura.whatsapp}`]);
  }
}
