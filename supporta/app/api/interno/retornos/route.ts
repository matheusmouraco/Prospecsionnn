import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { avisarUltimoDia, cobrarParados, cobrarRetornos } from "@/lib/bot/fluxo";

export const runtime = "nodejs";

function autorizado(request: Request) {
  const secret = process.env.SUPPORTA_WORKER_SECRET ?? "";
  const given = (request.headers.get("authorization") ?? "").replace(/^Bearer /, "");
  return secret.length >= 24 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

/** Chamado pelo agendador do VPS a cada poucos minutos: manda o "o que achou?" para quem sumiu depois da prévia, o lembrete curto para quem parou antes dela e o aviso do último dia da prévia no ar. */
export async function POST(request: Request) {
  if (!autorizado(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const enviados = await cobrarRetornos();
  const ultimoDia = await avisarUltimoDia();
  const parados = await cobrarParados();
  return NextResponse.json({ ok: true, enviados: enviados.length, ultimoDia: ultimoDia.length, parados: parados.length });
}
