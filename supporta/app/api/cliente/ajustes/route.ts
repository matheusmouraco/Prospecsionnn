import { NextResponse } from "next/server";
import { notifyTeam, sendEmail } from "@/lib/email/send";
import { adjustmentEmail } from "@/lib/email/templates";
import { sendToWebhook } from "@/lib/leads";
import { adjustmentsPerMonth } from "@/lib/plans";
import { countAdjustmentsThisMonth, createAdjustment } from "@/lib/repo";
import { currentClient } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const client = await currentClient();
  if (!client) return NextResponse.json({ error: "Sua sessão expirou. Entre de novo." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const descricao = String(body?.descricao ?? "").trim().slice(0, 2000);
  if (descricao.length < 5) return NextResponse.json({ error: "Descreva o ajuste que você quer." }, { status: 400 });

  const limit = adjustmentsPerMonth[client.plano];
  const used = (await countAdjustmentsThisMonth(client.id)) ?? 0;
  if (limit !== null && used >= limit) {
    return NextResponse.json(
      { error: `Os ${limit === 1 ? "1 ajuste" : `${limit} ajustes`} do mês já foram usados. Fale com a gente no WhatsApp para ver o melhor caminho ou subir de plano.` },
      { status: 409 },
    );
  }
  const ajuste = await createAdjustment(client.id, descricao);
  if (!ajuste) return NextResponse.json({ error: "Não foi possível registrar agora. Tente de novo." }, { status: 500 });
  await Promise.all([
    sendEmail({ to: client.email, ...adjustmentEmail(client.nome, descricao, "recebido") }),
    notifyTeam(`Ajuste pedido: ${client.nome} (${client.plano})`, [descricao, `Usados no mês: ${used + 1}${limit ? ` de ${limit}` : ""}`]),
    sendToWebhook("ajuste_pedido", { cliente: client.nome, email: client.email, plano: client.plano, descricao }),
  ]);
  return NextResponse.json({ ok: true, ajuste: { id: ajuste.id, descricao: ajuste.descricao, status: ajuste.status, pedido_em: ajuste.pedido_em } });
}
