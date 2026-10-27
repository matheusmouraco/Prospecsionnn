import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { allowedUploads, MAX_UPLOAD_BYTES, signedUploadUrl, storageEnabled } from "@/lib/storage";
import { isBriefingSignature } from "@/lib/tokens";

export const runtime = "nodejs";

/** Devolve uma URL assinada para o navegador enviar o arquivo direto ao Storage privado. */
export async function POST(request: Request) {
  if (!rateLimit(`upload:${clientIp(request.headers)}`, 60, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Muitos envios. Tente mais tarde." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const ref = String(body?.ref ?? "");
  if (!/^sup_[0-9a-f-]{36}$/.test(ref) || !isBriefingSignature(ref, String(body?.t ?? ""))) {
    return NextResponse.json({ error: "Link do briefing inválido." }, { status: 403 });
  }
  const ext = allowedUploads[String(body?.type ?? "")];
  if (!ext) return NextResponse.json({ error: "Envie PNG, JPG, WebP, SVG ou PDF." }, { status: 400 });
  if (typeof body?.size !== "number" || body.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "Cada arquivo pode ter até 10 MB." }, { status: 400 });
  if (!storageEnabled()) return NextResponse.json({ error: "Envio de arquivos indisponível agora. Mande pelo WhatsApp." }, { status: 503 });

  const kind = body?.kind === "logo" ? "logo" : "foto";
  const path = `${ref}/${kind}-${randomUUID().slice(0, 8)}.${ext}`;
  try {
    return NextResponse.json({ path, uploadUrl: await signedUploadUrl(path) });
  } catch (err) {
    console.error("[briefing upload]", (err as Error).message);
    return NextResponse.json({ error: "Não foi possível preparar o envio. Tente de novo." }, { status: 502 });
  }
}
