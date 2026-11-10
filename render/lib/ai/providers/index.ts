import "server-only";
import sharp from "sharp";
import { serverEnv } from "@/lib/server/env";
import { callGemini, NO_QUOTA_MESSAGE } from "./gemini-client";
import { FriendlyError, type ImageProvider, type ImageRequest, type ImageResult } from "./types";

class GeminiImageProvider implements ImageProvider {
  constructor(
    readonly id: string,
    private readonly costUsd: number,
    private readonly fallback?: { id: string; costUsd: number },
  ) {}

  async generate(req: ImageRequest): Promise<ImageResult> {
    try {
      return await this.call(this.id, this.costUsd, req);
    } catch (err) {
      // No quota for the main model (e.g. free tier): try the fallback model once.
      if (err instanceof FriendlyError && err.message === NO_QUOTA_MESSAGE && this.fallback && this.fallback.id !== this.id) {
        console.warn(`[render] sem cota em ${this.id}, tentando ${this.fallback.id}`);
        return this.call(this.fallback.id, this.fallback.costUsd, req);
      }
      throw err;
    }
  }

  private async call(model: string, costUsd: number, req: ImageRequest): Promise<ImageResult> {
    const out = await callGemini({ model, parts: req.parts, image: { aspectRatio: req.aspectRatio, size: req.size } });
    const img = out.images[out.images.length - 1]!;
    return { mime: img.mime, data: img.data, model, costUsd };
  }
}

/**
 * Demo mode (no GEMINI_API_KEY): returns the base image color-graded so the
 * whole flow can be tested and shown without spending anything.
 */
class DemoProvider implements ImageProvider {
  readonly id = "demo";
  async generate(req: ImageRequest): Promise<ImageResult> {
    const base = req.parts.find((p) => p.type === "image");
    if (!base || base.type !== "image") throw new Error("demo: no image");
    await new Promise((r) => setTimeout(r, 1800 + Math.random() * 1500));
    const hue = Math.round(Math.random() * 30 - 15);
    const buf = await sharp(Buffer.from(base.data, "base64"))
      .modulate({ brightness: 1.06, saturation: 1.25, hue })
      .linear(1.08, -6)
      .sharpen()
      .jpeg({ quality: 90 })
      .toBuffer();
    return { mime: "image/jpeg", data: buf.toString("base64"), model: "demo", costUsd: 0 };
  }
}

export function isDemo(): boolean {
  return !serverEnv().geminiKey;
}

export function providerFor(quality: "1k" | "2k"): ImageProvider {
  const env = serverEnv();
  if (!env.geminiKey) return new DemoProvider();
  const fallback = { id: env.modelFallback, costUsd: env.costStandard };
  return quality === "2k"
    ? new GeminiImageProvider(env.modelHd, env.costHd, fallback)
    : new GeminiImageProvider(env.modelStandard, env.costStandard, fallback);
}

/**
 * Converts the model output to a compact JPEG (keeps the response under the
 * 4.5 MB Vercel limit) and reports the final size.
 */
export async function toJpeg(result: ImageResult): Promise<{ data: string; width: number; height: number }> {
  const img = sharp(Buffer.from(result.data, "base64")).rotate();
  const buf = await img.jpeg({ quality: 90, mozjpeg: true }).toBuffer({ resolveWithObject: true });
  return { data: buf.data.toString("base64"), width: buf.info.width, height: buf.info.height };
}
