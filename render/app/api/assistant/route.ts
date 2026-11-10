import {
  ANGLES,
  ARTIFICIAL,
  FORMATS,
  FURNITURE_MODES,
  GOALS,
  ITEMS,
  LENSES,
  PALETTES,
  ROOMS,
  SKIES,
  STYLES,
  SURFACES,
  TEMPERATURES,
  TIMES,
  type Option,
} from "@/config/options";
import { isDemo } from "@/lib/ai/providers";
import { callGemini } from "@/lib/ai/providers/gemini-client";
import { serverEnv } from "@/lib/server/env";
import { hasAccess } from "@/lib/server/guard";
import type { Choices } from "@/lib/wizard/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const ids = (l: Option[]) => l.map((o) => o.id);
const pick = (l: Option[], v: unknown) => (typeof v === "string" && l.some((o) => o.id === v) ? v : undefined);
const pickMany = (l: Option[], v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && l.some((o) => o.id === x)) : undefined);

function catalog(): string {
  const mats = Object.fromEntries(SURFACES.map((s) => [s.key, ["auto", "manter", ...ids(s.options)]]));
  return JSON.stringify({
    goal: ids(GOALS),
    room: ids(ROOMS),
    style: ["auto", ...ids(STYLES)],
    materials: mats,
    palette: ids(PALETTES),
    time: ["auto", ...ids(TIMES)],
    artificial: ids(ARTIFICIAL),
    temperature: ["auto", ...ids(TEMPERATURES)],
    sky: ["auto", ...ids(SKIES)],
    furnitureMode: ["auto", ...ids(FURNITURE_MODES)],
    items: ids(ITEMS),
    angle: ids(ANGLES),
    format: FORMATS.map((f) => f.id),
    lens: ["auto", ...ids(LENSES)],
  });
}

/** Keeps only valid ids, so the model can never put garbage in the wizard. */
function sanitize(raw: Record<string, unknown>): Partial<Choices> {
  const out: Partial<Choices> = {};
  const g = pick(GOALS, raw.goal);
  if (g) out.goal = g;
  const r = pick(ROOMS, raw.room);
  if (r) out.room = r;
  const s = pick(STYLES, raw.style);
  if (s) out.style = s;
  if (raw.materials && typeof raw.materials === "object") {
    const m: Record<string, string> = {};
    for (const surf of SURFACES) {
      const v = (raw.materials as Record<string, unknown>)[surf.key];
      if (v === "manter" || pick(surf.options, v)) m[surf.key] = v as string;
    }
    if (Object.keys(m).length) out.materials = m as Choices["materials"];
  }
  const p = pick(PALETTES, raw.palette);
  if (p) out.palette = { mode: "preset", preset: p, colors: [] };
  const lighting: Partial<Choices["lighting"]> = {};
  const t = pick(TIMES, raw.time);
  if (t) lighting.time = t;
  const a = pickMany(ARTIFICIAL, raw.artificial);
  if (a?.length) lighting.artificial = a;
  const te = pick(TEMPERATURES, raw.temperature);
  if (te) lighting.temperature = te;
  const sk = pick(SKIES, raw.sky);
  if (sk) lighting.sky = sk;
  if (Object.keys(lighting).length) out.lighting = lighting as Choices["lighting"];
  const furniture: Partial<Choices["furniture"]> = {};
  const fm = pick(FURNITURE_MODES, raw.furnitureMode);
  if (fm) furniture.mode = fm;
  const it = pickMany(ITEMS, raw.items);
  if (it?.length) furniture.items = it;
  if (typeof raw.avoid === "string" && raw.avoid.trim()) furniture.avoid = raw.avoid.trim().slice(0, 200);
  if (Object.keys(furniture).length) out.furniture = furniture as Choices["furniture"];
  const camera: Partial<Choices["camera"]> = {};
  const an = pick(ANGLES, raw.angle);
  if (an) camera.angle = an;
  if (typeof raw.format === "string" && FORMATS.some((f) => f.id === raw.format)) camera.format = raw.format;
  const le = pick(LENSES, raw.lens);
  if (le) camera.lens = le;
  if (Object.keys(camera).length) out.camera = camera as Choices["camera"];
  if (typeof raw.notes === "string" && raw.notes.trim()) out.refine = { notes: raw.notes.trim().slice(0, 400), fidelity: 25 };
  return out;
}

/** "Assistente": turns a free description into wizard choices. */
export async function POST(req: Request) {
  if (!(await hasAccess())) return Response.json({ error: "Digite a senha de acesso.", code: "acesso" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { text?: string } | null;
  const text = body?.text?.trim().slice(0, 1500);
  if (!text) return Response.json({ error: "Descreva o que você quer." }, { status: 400 });
  if (isDemo()) return Response.json({ error: "O assistente precisa da chave da IA (modo demonstração)." }, { status: 503 });

  try {
    const out = await callGemini({
      model: serverEnv().modelText,
      timeoutMs: 25_000,
      parts: [
        {
          type: "text",
          text: `You fill a render wizard for an architecture app from a Brazilian client's description (in Portuguese).
Allowed values (use ONLY these ids; omit any field the client did not mention or imply):
${catalog()}
Return ONLY a JSON object with any of these keys: goal, room, style, materials (object surface->id), palette, time, artificial (array), temperature, sky, furnitureMode, items (array), avoid (Portuguese text of things that must NOT appear), angle, format, lens, notes (Portuguese, only specific details that do not fit any field, e.g. "ilha central com cooktop").

Client description: """${text}"""`,
        },
      ],
    });
    const json = JSON.parse(out.text.match(/\{[\s\S]*\}/)?.[0] ?? "{}") as Record<string, unknown>;
    return Response.json({ patch: sanitize(json) });
  } catch (err) {
    console.error("[assistant]", err);
    return Response.json({ error: "O assistente não conseguiu entender agora. Tente descrever de outro jeito." }, { status: 502 });
  }
}
