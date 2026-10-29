import { notifyTeam, sendEmail } from "./email/send";
import { noticeEmail } from "./email/templates";
import { sendToWebhook } from "./leads";
import { getPaymentProvider } from "./payments";
import { billing, earlyCancelFee, getPlan, loyaltyPriceFor, plans, priceFor, type Plan, type PlanId } from "./plans";
import {
  changeSubscriptionPlan,
  countApprovedPayments,
  createRequest,
  lastApprovedPaymentAt,
  scheduleCancellation,
  setStage,
  type Assinatura,
  type Cliente,
} from "./repo";
import { formatBRLCents } from "./site";

// Autoatendimento da área do cliente: aprovar a prévia, pedir revisão, trocar de plano e cancelar.
// Sem provedor de pagamento configurado, troca de plano e cancelamento viram pedido para a equipe.

const planOrder = (id: PlanId) => plans.findIndex((p) => p.id === id);
const isoDate = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
const brDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", { timeZone: "UTC" });

/** Situação do contrato: meses pagos, prazo mínimo, multa se cancelar hoje e até quando o período está pago. */
export async function contractState(assinatura: Assinatura, plan: Plan) {
  const paid = (await countApprovedPayments(assinatura.id)) ?? 0;
  const cycle = assinatura.ciclo ?? "mensal";
  const monthsCovered = cycle === "anual" ? paid * 12 : paid;
  const inMinimum = monthsCovered < billing.minMonths;
  const fee = cycle === "mensal" && inMinimum ? earlyCancelFee(plan, monthsCovered) : 0;
  const last = await lastApprovedPaymentAt(assinatura.id);
  const until = new Date(last ?? Date.now());
  until.setMonth(until.getMonth() + (cycle === "anual" ? 12 : 1));
  until.setDate(until.getDate() - 1);
  return { paid, cycle, monthsCovered, inMinimum, fee, paidUntil: isoDate(last ? until : new Date()) };
}

/** O que acontece se o cliente escolher outro plano: sobe na hora; descer só depois do prazo mínimo. */
export function planChangeRule(current: PlanId, target: PlanId, inMinimum: boolean) {
  if (current === target) return "igual" as const;
  if (planOrder(target) > planOrder(current)) return "subir" as const;
  return inMinimum ? ("descer_bloqueado" as const) : ("descer" as const);
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

export async function changePlan(client: Cliente, assinatura: Assinatura, targetId: PlanId) {
  const current = getPlan(assinatura.plano)!;
  const target = getPlan(targetId);
  if (!target) return { ok: false as const, message: "Plano inválido." };
  const state = await contractState(assinatura, current);
  const rule = planChangeRule(current.id, target.id, state.inMinimum);
  if (rule === "igual") return { ok: false as const, message: "Esse já é o seu plano." };
  if (rule === "descer_bloqueado") {
    return { ok: false as const, message: `Durante o prazo mínimo de ${billing.minMonths} meses dá para subir de plano. Para descer, fale com a gente no WhatsApp.` };
  }

  const loyalty = Boolean(assinatura.desconto_fidelidade_em);
  const value = loyalty ? loyaltyPriceFor(target, state.cycle) : priceFor(target, state.cycle);
  const detail = `${current.name} para ${target.name}, ${formatBRLCents(value)}/${state.cycle === "anual" ? "ano" : "mês"} a partir da próxima cobrança`;
  const provider = getPaymentProvider();
  const automatic = Boolean(provider && provider.name === assinatura.provedor && assinatura.provedor_assinatura_id);

  if (automatic) {
    try {
      await provider!.changePlan({ subscriptionId: assinatura.provedor_assinatura_id!, plan: target, cycle: state.cycle, value, loyalty });
    } catch (err) {
      console.error("[mudar-plano]", (err as Error).message);
      await createRequest(client.id, "mudar_plano", detail, { de: current.id, para: target.id, valor: value, erro: (err as Error).message });
      await notifyTeam(`Falha ao trocar plano: ${client.nome}`, [detail, (err as Error).message, "Trocar manualmente no provedor."]);
      return { ok: true as const, message: "Pedido registrado. A gente confirma a troca no seu e-mail em até 1 dia útil." };
    }
    await changeSubscriptionPlan(assinatura.id, target.id, value);
    await createRequest(client.id, "mudar_plano", detail, { de: current.id, para: target.id, valor: value }, "feito");
  } else {
    await createRequest(client.id, "mudar_plano", detail, { de: current.id, para: target.id, valor: value });
  }

  await notifyTeam(`Troca de plano${automatic ? "" : " pedida"}: ${client.nome}`, [detail, automatic ? "Já aplicada no provedor." : "Aplicar no provedor e no painel."]);
  await sendEmail({
    to: client.email,
    ...noticeEmail(automatic ? "Plano alterado" : "Pedido de troca de plano recebido", [
      automatic ? `Oi, ${client.nome}. Seu plano mudou: ${detail}.` : `Oi, ${client.nome}. Recebemos o pedido de troca: ${detail}. A gente confirma em até 1 dia útil.`,
      rule === "subir" ? "Os recursos do plano novo começam a valer já, e a gente te chama se precisar de alguma informação." : "",
    ].filter(Boolean)),
  });
  await sendToWebhook("plano_alterado", { cliente: client.nome, de: current.id, para: target.id, valor: value, automatico: automatic });
  return { ok: true as const, message: automatic ? `Pronto: ${detail}.` : "Pedido registrado. A gente confirma a troca no seu e-mail em até 1 dia útil." };
}

export async function cancel(client: Cliente, assinatura: Assinatura, motivo: string) {
  if (assinatura.cancelamento_pedido_em) return { ok: false as const, message: "O cancelamento já foi pedido." };
  const plan = getPlan(assinatura.plano)!;
  const state = await contractState(assinatura, plan);
  const provider = getPaymentProvider();
  const automatic = Boolean(provider && provider.name === assinatura.provedor && assinatura.provedor_assinatura_id && assinatura.provedor_cliente_id);
  // Anual no prazo mínimo tem devolução proporcional: a equipe calcula e responde.
  const manual = !automatic || (state.cycle === "anual" && state.inMinimum);
  const dados: Record<string, unknown> = { motivo, ciclo: state.cycle, mesesPagos: state.monthsCovered, multa: state.fee, noArAte: state.paidUntil };

  if (manual) {
    await createRequest(client.id, "cancelar", motivo, dados);
    await notifyTeam(`Cancelamento pedido: ${client.nome}`, [
      `Plano ${plan.name} ${state.cycle}, ${state.monthsCovered} meses pagos.`,
      state.cycle === "anual" && state.inMinimum ? `Anual no prazo mínimo: calcular a devolução proporcional menos ${billing.earlyCancelFeePct}%.` : "Cancelar no provedor.",
      state.fee ? `Multa: ${formatBRLCents(state.fee)}.` : "Sem multa.",
      motivo ? `Motivo: ${motivo}` : "",
    ].filter(Boolean));
    await sendEmail({ to: client.email, ...noticeEmail("Pedido de cancelamento recebido", [`Oi, ${client.nome}. Recebemos o seu pedido de cancelamento. A gente confirma por e-mail em até 1 dia útil, com os valores e até quando o site fica no ar.`]) });
    await sendToWebhook("cancelamento_pedido", { cliente: client.nome, email: client.email, ...dados });
    return { ok: true as const, message: "Pedido registrado. A gente confirma por e-mail em até 1 dia útil.", feeUrl: null };
  }

  let feeUrl: string | null = null;
  let feePaid = false;
  if (state.fee > 0) {
    try {
      const charge = await provider!.chargeOnce({
        customerId: assinatura.provedor_cliente_id!,
        value: state.fee,
        description: `Supporta: multa por cancelamento antes de ${billing.minMonths} meses (${billing.minMonths - state.monthsCovered} mensalidades restantes x ${billing.earlyCancelFeePct}%)`,
        reference: assinatura.referencia,
      });
      feeUrl = charge.url;
      feePaid = charge.paid;
    } catch (err) {
      console.error("[cancelar-multa]", (err as Error).message);
      await notifyTeam(`Falha ao cobrar a multa: ${client.nome}`, [formatBRLCents(state.fee), (err as Error).message, "Cobrar manualmente."]);
    }
  }
  try {
    await provider!.cancelSubscription(assinatura.provedor_assinatura_id!);
  } catch (err) {
    console.error("[cancelar]", (err as Error).message);
    await createRequest(client.id, "cancelar", motivo, { ...dados, erro: (err as Error).message });
    await notifyTeam(`Falha ao cancelar no provedor: ${client.nome}`, [(err as Error).message, "Cancelar manualmente."]);
    return { ok: true as const, message: "Pedido registrado. A gente confirma por e-mail em até 1 dia útil.", feeUrl };
  }
  await scheduleCancellation(assinatura.id, state.paidUntil);
  await createRequest(client.id, "cancelar", motivo, { ...dados, multaUrl: feeUrl, multaPaga: feePaid }, "feito");

  const lines = [
    `Oi, ${client.nome}. Sua assinatura foi cancelada e não haverá novas cobranças.`,
    `O site fica no ar até ${brDate(state.paidUntil)}, fim do período já pago.`,
    state.fee ? (feePaid ? `A multa de ${formatBRLCents(state.fee)} foi cobrada no cartão.` : `A multa de ${formatBRLCents(state.fee)} está no link abaixo.`) : "",
  ].filter(Boolean);
  await sendEmail({ to: client.email, ...noticeEmail("Assinatura cancelada", lines, undefined, feeUrl && !feePaid ? { label: "Pagar a multa", href: feeUrl } : undefined) });
  await notifyTeam(`Cancelamento: ${client.nome}`, [`No ar até ${brDate(state.paidUntil)}.`, state.fee ? `Multa ${formatBRLCents(state.fee)} ${feePaid ? "paga" : "em aberto"}.` : "Sem multa.", motivo ? `Motivo: ${motivo}` : ""].filter(Boolean));
  await sendToWebhook("cancelamento", { cliente: client.nome, email: client.email, ...dados, multaPaga: feePaid });
  return { ok: true as const, message: `Assinatura cancelada. O site fica no ar até ${brDate(state.paidUntil)}.`, feeUrl: feePaid ? null : feeUrl };
}
