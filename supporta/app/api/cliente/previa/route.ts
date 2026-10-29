import { NextResponse } from "next/server";
import { approvePreview, requestRevision } from "@/lib/autoatendimento";
import { currentClient } from "@/lib/session";

export const runtime = "nodejs";

/** Prévia do site: o cliente aprova (libera a publicação) ou pede revisão. */
export async function POST(request: Request) {
  const client = await currentClient();
  if (!client) return NextResponse.json({ error: "Sua sessão expirou. Entre de novo." }, { status: 401 });
  if (client.etapa !== "previa") return NextResponse.json({ error: "Não há prévia esperando aprovação agora." }, { status: 409 });
  const body = await request.json().catch(() => null);
  if (body?.acao === "aprovar") {
    await approvePreview(client);
    return NextResponse.json({ ok: true, message: "Prévia aprovada. A gente publica e avisa quando estiver no ar." });
  }
  if (body?.acao === "revisao") {
    const descricao = String(body?.descricao ?? "").trim().slice(0, 3000);
    if (descricao.length < 5) return NextResponse.json({ error: "Conte o que você quer mudar na prévia." }, { status: 400 });
    await requestRevision(client, descricao);
    return NextResponse.json({ ok: true, message: "Pedido de revisão recebido. Você recebe um aviso quando a nova versão estiver pronta." });
  }
  return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
}
