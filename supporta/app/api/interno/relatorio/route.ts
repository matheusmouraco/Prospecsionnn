import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { enviarRelatorio } from "@/lib/bot/relatorio";

export const runtime = "nodejs";

function autorizado(request: Request) {
  const secret = process.env.SUPPORTA_WORKER_SECRET ?? "";
  const given = (request.headers.get("authorization") ?? "").replace(/^Bearer /, "");
  return secret.length >= 24 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

/** Chamado pelo agendador do VPS às 19h: manda o resumo do dia no WhatsApp do Matheus e devolve o texto para o Telegram. */
export async function POST(request: Request) {
  if (!autorizado(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const texto = await enviarRelatorio();
  return NextResponse.json({ ok: true, texto });
}
