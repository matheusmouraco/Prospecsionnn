import { FriendlyError } from "@/lib/ai/providers/types";

const MAX_BYTES = 6 * 1024 * 1024;

export function parseDataUrl(url: string, what = "imagem"): { mime: string; data: string } {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(url);
  if (!m) throw new FriendlyError(`Formato de ${what} inválido. Use JPG, PNG ou WebP.`, 400);
  const data = m[2]!;
  if ((data.length * 3) / 4 > MAX_BYTES) throw new FriendlyError(`A ${what} ficou grande demais depois de comprimida.`, 413);
  return { mime: m[1]!, data };
}
