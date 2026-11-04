import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { allowedUploads, MAX_UPLOAD_BYTES, publicSiteFileUrl, signedUploadUrl, SITES_BUCKET, storageEnabled } from "@/lib/storage";

export const runtime = "nodejs";

/** Logo e fotos do criador: URL assinada para o navegador enviar direto ao bucket público dos sites. */
export async function POST(request: Request) {
  if (!rateLimit(`criar-upload:${clientIp(request.headers)}`, 40, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Muitos envios. Tente mais tarde." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const ext = allowedUploads[String(body?.type ?? "")];
  if (!ext || ext === "pdf") return NextResponse.json({ error: "Envie PNG, JPG, WebP ou SVG." }, { status: 400 });
  if (typeof body?.size !== "number" || body.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "Cada arquivo pode ter até 10 MB." }, { status: 400 });
  if (!storageEnabled()) return NextResponse.json({ error: "Envio de arquivos indisponível agora. Pode pular: a IA monta sem." }, { status: 503 });
  const lote = /^[a-f0-9-]{36}$/.test(String(body?.lote ?? "")) ? String(body.lote) : randomUUID();
  const kind = body?.kind === "logo" ? "logo" : "foto";
  const path = `criar/${lote}/${kind}-${randomUUID().slice(0, 8)}.${ext}`;
  try {
    return NextResponse.json({ uploadUrl: await signedUploadUrl(path, SITES_BUCKET), url: publicSiteFileUrl(path), lote });
  } catch (err) {
    console.error("[criar upload]", (err as Error).message);
    return NextResponse.json({ error: "Não foi possível preparar o envio. Tente de novo." }, { status: 502 });
  }
}
