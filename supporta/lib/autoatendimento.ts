import { notifyTeam, sendEmail } from "./email/send";
import { noticeEmail } from "./email/templates";
import { sendToWebhook } from "./leads";
import { getPaymentProvider } from "./payments";
import { alteracaoGratis, pricing } from "./plans";
import { createAdjustment, createRequest, lastApprovedPaymentAt, scheduleCancellation, setStage, type Assinatura, type Cliente } from "./repo";
import { formatBRLCents } from "./site";

// Autoatendimento da área do cliente: aprovar a prévia, pedir revisão, pedir alteração e cancelar a renovação.
// Sem provedor de pagamento configurado, cancelamento e alteração paga viram pedido para a equipe.

const isoDate = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
const brDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", { timeZone: "UTC" });

/** Renovação: o site e o 1º ano vêm do pagamento inicial; cada renovação paga cobre mais 1 ano. */
export async function contractState(assinatura: Assinatura) {
  const last = (await lastApprovedPaymentAt(assinatura.id)) ?? null;
  const until = new Date(last ?? assinatura.criado_em);
  until.setFullYear(until.getFullYear() + 1);
  until.setDate(until.getDate() - 1);
  return {
    paidUntil: isoDate(until),
    renovacao: Number(assinatura.valor_anual ?? pricing.endereco + (assinatura.dominio_proprio ? pricing.dominio : 0)),
    dominio: assinatura.dominio_proprio,
  };
}

export async function approvePreview(client: Cliente) {
  const updated = await setStage(client.id, "aprovado");
  await notifyTeam(`Prévia aprovada: ${client.nome}`, ["O cliente aprovou a prévia. Publicar o site e marcar como no ar no painel.", client.previa_url ?? ""]);
  await sendToWebhook("previa_aprovada", { cliente: client.nome, email: client.email, previa: client.previa_url });
  return updated;
}

export async function requestRevision(client: Cliente, descricao: string) {
  await createRequest(client.id, "revisao_previa", descricao, { previa: client.previa_url });
  const updated = await setStage(client.id, "revisao");
  await notifyTeam(`Revisão da prévia pedida: ${client.nome}`, [descricao, client.previa_url ?? ""]);
  await sendEmail({ to: client.email, ...noticeEmail("Pedido de revisão recebido", [`Oi, ${client.nome}. Recebemos o que você quer mudar na prévia. Assim que a nova versão estiver pronta, você recebe um aviso para ver de novo.`], descricao) });
  return updated;
}

/**
 * Pedido de alteração: sem custo nos primeiros dias depois da entrega; depois, cobra o valor da alteração
 * (no cartão salvo, quando o provedor permite, ou por link) e registra o pedido do mesmo jeito.
 */
export async function requestAdjustment(client: Cliente, assinatura: Assinatura | null, descricao: string) {
  if (alteracaoGratis(client.publicado_em)) {
    const ajuste = await createAdjustment(client.id, descricao);
    return { ajuste, valor: 0, cobrancaUrl: null as string | null, pago: true };
  }
  const provider = getPaymentProvider();
  let url: string | null = null;
  let pago = false;
  if (provider && assinatura?.provedor_cliente_id && provider.name === assinatura.provedor) {
    try {
      const r = await provider.chargeOnce({ customerId: assinatura.provedor_cliente_id, value: pricing.alteracao, description: `Supporta: alteração no site (${descricao.slice(0, 60)})`, reference: assinatura.referencia });
      url = r.url;
      pago = r.paid;
    } catch (err) {
      console.error("[alteracao]", (err as Error).message);
    }
  }
  const ajuste = await createAdjustment(client.id, descricao, { valor: pricing.alteracao, url, pago });
  if (!url && !pago) await notifyTeam(`Cobrar alteração de ${formatBRLCents(pricing.alteracao)}: ${client.nome}`, [descricao, "A cobrança automática não rodou; cobre pelo provedor."]);
  return { ajuste, valor: pricing.alteracao, cobrancaUrl: url, pago };
}

/** Cancela a renovação anual: sem multa, o site fica no ar até o fim do ano pago e depois sai. */
export async function cancel(client: Cliente, assinatura: Assinatura, motivo: string) {
  if (assinatura.cancelamento_pedido_em) return { ok: false as const, message: "O cancelamento já foi pedido." };
  const state = await contractState(assinatura);
  const provider = getPaymentProvider();
  const automatic = Boolean(provider && provider.name === assinatura.provedor && assinatura.provedor_assinatura_id);
  const dados: Record<string, unknown> = { motivo, noArAte: state.paidUntil, renovacao: state.renovacao };

  if (automatic) {
    try {
      await provider!.cancelSubscription(assinatura.provedor_assinatura_id!);
    } catch (err) {
      console.error("[cancelar]", (err as Error).message);
      await createRequest(client.id, "cancelar", motivo, { ...dados, erro: (err as Error).message });
      await notifyTeam(`Falha ao cancelar no provedor: ${client.nome}`, [(err as Error).message, "Cancelar a renovação manualmente."]);
      return { ok: true as const, message: "Pedido registrado. A gente confirma por e-mail em até 1 dia útil." };
    }
    await scheduleCancellation(assinatura.id, state.paidUntil);
    await createRequest(client.id, "cancelar", motivo, dados, "feito");
  } else {
    await createRequest(client.id, "cancelar", motivo, dados);
  }
  await sendEmail({
    to: client.email,
    ...noticeEmail(automatic ? "Renovação cancelada" : "Pedido de cancelamento recebido", [
      automatic ? `Oi, ${client.nome}. A renovação anual foi cancelada e não haverá novas cobranças.` : `Oi, ${client.nome}. Recebemos o pedido para cancelar a renovação. A gente confirma por e-mail em até 1 dia útil.`,
      `O site fica no ar até ${brDate(state.paidUntil)}, fim do período já pago.`,
    ]),
  });
  await notifyTeam(`Cancelamento: ${client.nome}`, [`No ar até ${brDate(state.paidUntil)}.`, automatic ? "Renovação já cancelada no provedor." : "Cancelar a renovação no provedor.", motivo ? `Motivo: ${motivo}` : ""].filter(Boolean));
  await sendToWebhook("cancelamento", { cliente: client.nome, email: client.email, ...dados, automatico: automatic });
  return { ok: true as const, message: automatic ? `Renovação cancelada. O site fica no ar até ${brDate(state.paidUntil)}.` : "Pedido registrado. A gente confirma por e-mail em até 1 dia útil." };
}

