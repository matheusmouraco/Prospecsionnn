import "server-only";
import { serverEnv } from "@/lib/server/env";
import { FriendlyError, type Part } from "./types";

const BASE = "https://generativelanguage.googleapis.com/v1beta";

type Style = "interactions" | "generateContent";

export type GeminiCall = {
  model: string;
  parts: Part[];
  /** image output settings; omit for text output */
  image?: { aspectRatio?: string; size?: "1K" | "2K" };
  timeoutMs?: number;
};

export type GeminiOutput = { text: string; images: { mime: string; data: string }[] };

function interactionsBody(c: GeminiCall) {
  const body: Record<string, unknown> = {
    model: c.model,
    input: c.parts.map((p) => (p.type === "text" ? { type: "text", text: p.text } : { type: "image", mime_type: p.mime, data: p.data })),
  };
  if (c.image) {
    const rf: Record<string, unknown> = { type: "image" };
    if (c.image.aspectRatio) rf.aspect_ratio = c.image.aspectRatio;
    // Legacy 2.5 Flash Image has a fixed size and rejects image_size.
    if (c.image.size && !c.model.startsWith("gemini-2.5")) rf.image_size = c.image.size;
    body.response_format = rf;
  }
  return body;
}

function generateContentBody(c: GeminiCall) {
  const body: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts: c.parts.map((p) => (p.type === "text" ? { text: p.text } : { inline_data: { mime_type: p.mime, data: p.data } })),
      },
    ],
  };
  if (c.image) {
    const imageConfig: Record<string, unknown> = {};
    if (c.image.aspectRatio) imageConfig.aspectRatio = c.image.aspectRatio;
    if (c.image.size && !c.model.startsWith("gemini-2.5")) imageConfig.imageSize = c.image.size;
    body.generationConfig = { responseModalities: ["IMAGE"], imageConfig };
  }
  return body;
}

/**
 * Walks any response shape (Interactions `steps[].content[]`, `output_image`,
 * generateContent `candidates[].content.parts[]` with inlineData/inline_data)
 * and collects text and images. Keeps us working across API revisions.
 */
export function collectOutput(json: unknown): GeminiOutput {
  const out: GeminiOutput = { text: "", images: [] };
  const seen = new Set<string>();
  const visit = (node: unknown, depth: number) => {
    if (!node || typeof node !== "object" || depth > 12) return;
    if (Array.isArray(node)) return node.forEach((n) => visit(n, depth + 1));
    const o = node as Record<string, unknown>;
    // skip echoed input
    if ("input" in o && Array.isArray(o.input) && depth === 0) {
      for (const [k, v] of Object.entries(o)) if (k !== "input") visit(v, depth + 1);
      return;
    }
    const inline = (o.inlineData ?? o.inline_data) as Record<string, unknown> | undefined;
    if (inline && typeof inline.data === "string") {
      const mime = String(inline.mimeType ?? inline.mime_type ?? "image/png");
      if (!seen.has(inline.data.slice(0, 64))) {
        seen.add(inline.data.slice(0, 64));
        out.images.push({ mime, data: inline.data });
      }
      return;
    }
    if (o.type === "image" && typeof o.data === "string" && o.data.length > 100) {
      if (!seen.has(o.data.slice(0, 64))) {
        seen.add(o.data.slice(0, 64));
        out.images.push({ mime: String(o.mime_type ?? o.mimeType ?? "image/png"), data: o.data });
      }
      return;
    }
    if (typeof o.text === "string" && (o.type === "text" || !("type" in o))) out.text += o.text;
    for (const [k, v] of Object.entries(o)) {
      if (k === "thought" || k === "thoughts" || k === "thought_signature" || k === "thoughtSignature") continue;
      visit(v, depth + 1);
    }
  };
  visit(json, 0);
  return out;
}

function blockReason(json: unknown): string | null {
  const s = JSON.stringify(json ?? {});
  const m = s.match(/"(finishReason|blockReason|finish_reason|block_reason)"\s*:\s*"([A-Z_]+)"/);
  if (m && !["STOP", "FINISH_REASON_UNSPECIFIED"].includes(m[2]!)) return m[2]!;
  return null;
}

async function post(style: Style, c: GeminiCall): Promise<Response> {
  const env = serverEnv();
  const url = style === "interactions" ? `${BASE}/interactions` : `${BASE}/models/${encodeURIComponent(c.model)}:generateContent`;
  const headers: Record<string, string> = { "content-type": "application/json", "x-goog-api-key": env.geminiKey! };
  if (style === "interactions") headers["Api-Revision"] = env.apiRevision;
  const body = style === "interactions" ? interactionsBody(c) : generateContentBody(c);
  return fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(c.timeoutMs ?? 110_000) });
}

export const NO_QUOTA_MESSAGE =
  "A chave do Gemini está no plano gratuito, que não libera geração de imagem. Ative o faturamento no Google AI Studio (ai.dev) e tente de novo.";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function callGemini(c: GeminiCall): Promise<GeminiOutput> {
  const env = serverEnv();
  if (!env.geminiKey) throw new FriendlyError("A chave da IA não está configurada.", 500);
  const styles: Style[] = env.apiStyle === "interactions" ? ["interactions", "generateContent"] : ["generateContent", "interactions"];

  let lastDetail = "";
  for (const style of styles) {
    for (let attempt = 0; attempt < 3; attempt++) {
      let res: Response;
      try {
        res = await post(style, c);
      } catch (err) {
        const timeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
        if (timeout) throw new FriendlyError("A IA demorou demais para responder. Tente de novo em instantes.", 504);
        lastDetail = String(err);
        await sleep(1000 * (attempt + 1));
        continue;
      }
      const text = await res.text();
      let json: unknown = null;
      try {
        json = JSON.parse(text);
      } catch {
        /* non-JSON error page */
      }
      if (res.ok) {
        const out = collectOutput(json);
        if (c.image && out.images.length === 0) {
          const reason = blockReason(json);
          if (reason && /SAFETY|PROHIBITED|BLOCK|RECITATION|IMAGE_OTHER/.test(reason)) {
            throw new FriendlyError("A IA recusou esta imagem pelo filtro de segurança. Tente outra foto ou mude o texto livre.", 422, reason);
          }
          lastDetail = `no image in response (${reason ?? "sem motivo"}): ${out.text.slice(0, 300)}`;
          if (attempt < 1) continue;
          throw new FriendlyError("A IA não devolveu imagem desta vez. Tente gerar de novo.", 502, lastDetail);
        }
        return out;
      }
      lastDetail = `${style} HTTP ${res.status}: ${text.slice(0, 400)}`;
      // Free tier with zero quota for this model: retrying never helps.
      if (res.status === 429 && /limit:\s*0\b/.test(text)) {
        throw new FriendlyError(NO_QUOTA_MESSAGE, 402, lastDetail);
      }
      if (res.status === 429 || res.status >= 500) {
        if (attempt < 2) {
          await sleep(1500 * 2 ** attempt);
          continue;
        }
        if (res.status === 429) throw new FriendlyError("Muita gente gerando agora. Espere alguns segundos e tente de novo.", 429, lastDetail);
        break;
      }
      if (res.status === 401 || res.status === 403) throw new FriendlyError("A chave da IA foi recusada. Confira a GEMINI_API_KEY.", 500, lastDetail);
      // 400/404: likely this API style or model name is not accepted; try the other style.
      break;
    }
  }
  console.error("[gemini]", lastDetail);
  throw new FriendlyError("Não consegui falar com a IA agora. Tente de novo em instantes.", 502, lastDetail);
}
