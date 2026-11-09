import { NextResponse } from "next/server";
import { requestAdjustment } from "@/lib/autoatendimento";
import { notifyTeam, sendEmail } from "@/lib/email/send";
import { adjustmentEmail } from "@/lib/email/templates";
import { sendToWebhook } from "@/lib/leads";
import { getSubscriptionById } from "@/lib/repo";
import { currentClient } from "@/lib/session";
import { formatBRLCents } from "@/lib/site";

export const runtime = "nodejs";

/** Pedido de alteração: sem custo nos primeiros 30 dias depois da entrega, cobrado depois disso. */
export async function POST(request: Request) {
  const client = await currentClient();
  if (!client) return NextResponse.json({ error: "Sua sessão expirou. Entre de novo." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const descricao = String(body?.descricao ?? "").trim().slice(0, 2000);
  if (descricao.length < 5) return NextResponse.json({ error: "Descreva a alteração que você quer." }, { status: 400 });

  const assinatura = await getSubscriptionById(client.assinatura_id);
  const r = await requestAdjustment(client, assinatura, descricao);
  if (!r.ajuste) return NextResponse.json({ error: "Não foi possível registrar agora. Tente de novo." }, { status: 500 });
  await Promise.all([
    sendEmail({ to: client.email, ...adjustmentEmail(client.nome, descricao, "recebido") }),
    notifyTeam(`Alteração pedida: ${client.nome}`, [descricao, r.valor ? `Cobrada: ${formatBRLCents(r.valor)} (${r.pago ? "paga" : "aguardando pagamento"})` : "Sem custo (até 30 dias da entrega)"]),
    sendToWebhook("ajuste_pedido", { cliente: client.nome, email: client.email, descricao, valor: r.valor, pago: r.pago }),
  ]);
  return NextResponse.json({ ok: true, valor: r.valor, pago: r.pago, cobrancaUrl: r.cobrancaUrl, ajuste: { id: r.ajuste.id, descricao: r.ajuste.descricao, status: r.ajuste.status, pedido_em: r.ajuste.pedido_em } });
}
