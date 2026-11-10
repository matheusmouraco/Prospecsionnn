import sharp from "sharp";
import { z } from "zod";
import { buildEditPrompt, buildPrompt, buildUpscalePrompt, buildVariationPrompt } from "@/lib/ai/prompt-builder";
import { isDemo, providerFor, toJpeg } from "@/lib/ai/providers";
import { FriendlyError, type Part } from "@/lib/ai/providers/types";
import { closestRatio } from "@/lib/image/aspect";
import { parseDataUrl } from "@/lib/server/data-url";
import { hasAccess, rateLimit } from "@/lib/server/guard";
import type { Choices } from "@/lib/wizard/types";
import { DEFAULT_CHOICES, mergeChoices } from "@/lib/wizard/types";
import { FORMATS } from "@/config/options";

export const runtime = "nodejs";
export const maxDuration = 180;

const Body = z.object({
  mode: z.enum(["render", "variation", "edit", "upscale"]),
  choices: z.record(z.string(), z.unknown()).optional(),
  quality: z.enum(["1k", "2k"]).default("1k"),
  image: z.string(),
  mask: z.string().optional(),
  refs: z.array(z.string()).max(3).optional(),
  chosen: z.string().optional(),
  instruction: z.string().max(600).optional(),
});

export async function POST(req: Request) {
  const started = Date.now();
  try {
    if (!(await hasAccess())) return Response.json({ error: "Digite a senha de acesso.", code: "acesso" }, { status: 401 });

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) throw new FriendlyError("Pedido inválido.", 400, parsed.error.message);
    const b = parsed.data;
    const quality = b.mode === "upscale" ? "2k" : b.quality;
    if (!(await rateLimit(quality === "2k" ? 3 : 1))) {
      throw new FriendlyError("Você atingiu o limite de renders desta hora. Tente de novo mais tarde.", 429);
    }

    const choices: Choices = mergeChoices(DEFAULT_CHOICES, (b.choices ?? {}) as Partial<Choices>);
    const base = parseDataUrl(b.image, "imagem");
    const mask = b.mask ? parseDataUrl(b.mask, "máscara") : null;
    const refs = (b.refs ?? []).map((r) => parseDataUrl(r, "referência"));
    const chosen = b.chosen ? parseDataUrl(b.chosen, "imagem escolhida") : null;

    if (b.mode === "edit" && !b.instruction?.trim()) throw new FriendlyError("Escreva o que você quer mudar.", 400);

    // Aspect ratio: chosen format, or the closest supported ratio to the base image.
    const meta = await sharp(Buffer.from(base.data, "base64")).metadata();
    const format = FORMATS.find((f) => f.id === choices.camera.format);
    const keepsFrame = b.mode === "edit" || b.mode === "upscale";
    const aspectRatio = !keepsFrame && format?.ratio ? format.ratio : closestRatio(meta.width ?? 1, meta.height ?? 1);

    const ctx = { hasMask: Boolean(mask), referenceCount: refs.length };
    const prompt =
      b.mode === "render"
        ? buildPrompt(choices, ctx)
        : b.mode === "variation"
          ? buildVariationPrompt(choices, ctx)
          : b.mode === "edit"
            ? buildEditPrompt(b.instruction!, { hasMask: Boolean(mask) })
            : buildUpscalePrompt();

    const parts: Part[] = [{ type: "text", text: b.mode === "edit" || b.mode === "upscale" ? "BASE IMAGE (the render to work on):" : "BASE IMAGE (the scene to render, geometry is locked):" }, { type: "image", ...base }];
    if (mask) parts.push({ type: "text", text: "MASK (white = editable, black = locked):" }, { type: "image", ...mask });
    if (chosen) parts.push({ type: "text", text: "CHOSEN RENDER:" }, { type: "image", ...chosen });
    refs.forEach((r, i) => parts.push({ type: "text", text: `REFERENCE ${i + 1}:` }, { type: "image", ...r }));
    parts.push({ type: "text", text: prompt });

    const provider = providerFor(quality);
    const result = await provider.generate({ parts, aspectRatio, size: quality === "2k" ? "2K" : "1K" });
    const jpeg = await toJpeg(result);

    return Response.json({
      image: `data:image/jpeg;base64,${jpeg.data}`,
      width: jpeg.width,
      height: jpeg.height,
      model: result.model,
      costUsd: result.costUsd,
      aspectRatio,
      prompt,
      ms: Date.now() - started,
      demo: isDemo(),
    });
  } catch (err) {
    if (err instanceof FriendlyError) {
      if (err.detail) console.error("[render]", err.message, err.detail);
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error("[render] unexpected", err);
    return Response.json({ error: "Algo deu errado ao gerar. Tente de novo." }, { status: 500 });
  }
}
