// Supabase Storage (bucket privado supporta-briefings) via REST. Upload e download só por URL assinada.

const BUCKET = "supporta-briefings";

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

export const storageEnabled = () => Boolean(config());

export const allowedUploads: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** URL para o navegador enviar o arquivo direto ao Storage (PUT), sem passar pela função da Vercel. */
export async function signedUploadUrl(path: string) {
  const c = config();
  if (!c) throw new Error("Storage não configurado.");
  const res = await fetch(`${c.url}/storage/v1/object/upload/sign/${BUCKET}/${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${c.key}`, apikey: c.key },
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(`Storage: ${data.message ?? res.status}`);
  return `${c.url}/storage/v1${data.url}`;
}

/** Link temporário para baixar um arquivo (painel interno). */
export async function signedDownloadUrl(path: string, expiresIn = 3600) {
  const c = config();
  if (!c) return null;
  const res = await fetch(`${c.url}/storage/v1/object/sign/${BUCKET}/${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${c.key}`, apikey: c.key, "content-type": "application/json" },
    body: JSON.stringify({ expiresIn }),
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok && data.signedURL ? `${c.url}/storage/v1${data.signedURL}` : null;
}
