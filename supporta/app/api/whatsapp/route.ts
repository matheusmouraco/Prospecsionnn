import { timingSafeEqual } from "node:crypto";
import { after, NextResponse } from "next/server";
import { lerWebhook } from "@/lib/bot/evolution";
import { comCliente } from "@/lib/bot/custos";
import { tratarMensagem } from "@/lib/bot/fluxo";

export const runtime = "nodejs";
// Espera a rajada de fotos (45s) e chama a IA depois de responder a Evolution.
export const maxDuration = 300;

function autorizado(request: Request) {
  const secret = process.env.EVOLUTION_WEBHOOK_TOKEN ?? "";
  const given = request.headers.get("x-supporta-token") ?? new URL(request.url).searchParams.get("token") ?? "";
  return secret.length >= 16 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

/** Webhook da Evolution (evento MESSAGES_UPSERT). Responde na hora e processa a mensagem em segundo plano. */
export async function POST(request: Request) {
  if (!autorizado(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const payload = await request.json().catch(() => null);
  const mensagem = lerWebhook(payload);
  if (!mensagem) return NextResponse.json({ ok: true, ignorado: true });
  const tarefas: Promise<unknown>[] = [];
  after(() => comCliente(mensagem.de, async () => {
    try {
      await tratarMensagem(mensagem, (p) => tarefas.push(p.catch((err) => console.error("[whatsapp] tarefa:", (err as Error).message))));
      // Tarefas podem criar outras (ex.: imagem que leva ao resumo): espera até não sobrar nenhuma.
      while (tarefas.length) await tarefas.shift();
    } catch (err) {
      console.error("[whatsapp]", (err as Error).message);
    }
  }));
  return NextResponse.json({ ok: true });
}
