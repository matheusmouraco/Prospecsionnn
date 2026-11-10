"use client";

export type Img = { url: string; width: number; height: number };

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não consegui abrir esta imagem."));
    img.src = src;
  });
}

async function decode(file: Blob): Promise<{ source: CanvasImageSource; width: number; height: number; close?: () => void }> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      return { source: img, width: img.naturalWidth, height: img.naturalHeight };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

/**
 * Client-side compression: longest side capped, JPEG, and quality lowered
 * until the file fits `maxBytes` (keeps uploads fast on 4G at the job site).
 */
export async function compressImage(file: Blob, maxSide = 2048, maxBytes = 2_400_000): Promise<Img> {
  if (file.size > 25 * 1024 * 1024) throw new Error("Arquivo muito grande. Envie uma imagem de até 25 MB.");
  let decoded;
  try {
    decoded = await decode(file);
  } catch {
    throw new Error("Não consegui ler esta imagem. Se for HEIC do iPhone, exporte como JPG e envie de novo.");
  }
  const scale = Math.min(1, maxSide / Math.max(decoded.width, decoded.height));
  const width = Math.round(decoded.width * scale);
  const height = Math.round(decoded.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; // transparent PNGs become white, not black
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(decoded.source, 0, 0, width, height);
  decoded.close?.();

  let q = 0.88;
  let url = canvas.toDataURL("image/jpeg", q);
  while (url.length * 0.75 > maxBytes && q > 0.5) {
    q -= 0.08;
    url = canvas.toDataURL("image/jpeg", q);
  }
  return { url, width, height };
}

export async function compressDataUrl(url: string, maxSide: number, maxBytes?: number): Promise<Img> {
  const blob = await (await fetch(url)).blob();
  return compressImage(blob, maxSide, maxBytes);
}

/**
 * Keeps the original pixels outside the painted mask and the generated pixels
 * inside it, with a feathered edge. Guarantees locked areas stay identical even
 * when the model drifts.
 */
export async function compositeWithMask(originalUrl: string, generatedUrl: string, maskAlphaUrl: string, feather = 10): Promise<string> {
  const [orig, gen, mask] = await Promise.all([loadImage(originalUrl), loadImage(generatedUrl), loadImage(maskAlphaUrl)]);
  const w = gen.naturalWidth;
  const h = gen.naturalHeight;

  // Locked layer = original minus (blurred) mask.
  const locked = document.createElement("canvas");
  locked.width = w;
  locked.height = h;
  const lc = locked.getContext("2d")!;
  lc.drawImage(orig, 0, 0, w, h);
  lc.globalCompositeOperation = "destination-out";
  lc.filter = `blur(${Math.round((feather * w) / 1024)}px)`;
  lc.drawImage(mask, 0, 0, w, h);

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const oc = out.getContext("2d")!;
  oc.drawImage(gen, 0, 0, w, h);
  oc.drawImage(locked, 0, 0);
  return out.toDataURL("image/jpeg", 0.92);
}

export function downloadDataUrl(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
