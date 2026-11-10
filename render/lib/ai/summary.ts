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
  surfacesForRoom,
  type Option,
} from "../../config/options.ts";
import type { Choices } from "../wizard/types.ts";

const label = (list: Option[], id: string | null | undefined) => (id ? list.find((o) => o.id === id)?.label : undefined);
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const SHORT: Record<string, string> = { piso: "piso", paredes: "paredes", teto: "teto", marcenaria: "marcenaria", bancadas: "bancada", metais: "metais" };

/** One item of the summary screen; `step` is the wizard step that edits it. */
export type SummaryItem = { step: string; text: string };

export function summaryItems(c: Choices): SummaryItem[] {
  const out: SummaryItem[] = [];
  const room = label(ROOMS, c.room);
  const style = label(STYLES, c.style);
  if (room || style) out.push({ step: style ? "estilo" : "ambiente", text: [room ?? "Ambiente", style ? lower(style) : null].filter(Boolean).join(" ") });
  const goal = label(GOALS, c.goal);
  if (goal) out.push({ step: "objetivo", text: goal });

  for (const key of surfacesForRoom(c.room)) {
    const s = SURFACES.find((x) => x.key === key)!;
    const v = c.materials[key];
    if (v === "auto") continue;
    if (v === "manter") out.push({ step: "materiais", text: `${SHORT[key]} mantido${key === "paredes" || key === "metais" ? "s" : ""}` });
    else {
      const o = s.options.find((x) => x.id === v);
      if (o) out.push({ step: "materiais", text: `${SHORT[key]} ${lower(o.label)}` });
    }
  }

  if (c.palette.mode === "preset") {
    const p = label(PALETTES, c.palette.preset);
    if (p) out.push({ step: "paleta", text: `paleta ${lower(p)}` });
  } else if (c.palette.mode === "custom" && c.palette.colors.length) {
    out.push({ step: "paleta", text: `paleta com ${c.palette.colors.length} cor${c.palette.colors.length > 1 ? "es" : ""} escolhida${c.palette.colors.length > 1 ? "s" : ""}` });
  }

  const time = label(TIMES, c.lighting.time);
  if (time) out.push({ step: "luz", text: lower(time) });
  for (const id of c.lighting.artificial) {
    const a = label(ARTIFICIAL, id);
    if (a) out.push({ step: "luz", text: lower(a) });
  }
  const t = label(TEMPERATURES, c.lighting.temperature);
  if (t) out.push({ step: "luz", text: lower(t) });
  const sky = label(SKIES, c.lighting.sky);
  if (sky) out.push({ step: "luz", text: lower(sky) });

  const fm = label(FURNITURE_MODES, c.furniture.mode);
  if (fm) out.push({ step: "mobiliario", text: lower(fm) });
  for (const id of c.furniture.items) {
    const i = label(ITEMS, id);
    if (i) out.push({ step: "mobiliario", text: `com ${lower(i)}` });
  }
  if (!c.furniture.items.includes("pessoas")) out.push({ step: "mobiliario", text: "sem pessoas" });
  if (c.furniture.avoid.trim()) out.push({ step: "mobiliario", text: `sem: ${c.furniture.avoid.trim()}` });

  if (c.camera.angle !== "original") out.push({ step: "camera", text: `vista ${lower(label(ANGLES, c.camera.angle) ?? "")}` });
  else out.push({ step: "camera", text: "ângulo original" });
  if (c.camera.format !== "original") out.push({ step: "camera", text: `formato ${FORMATS.find((f) => f.id === c.camera.format)?.label}` });
  const lens = label(LENSES, c.camera.lens);
  if (lens) out.push({ step: "camera", text: lower(lens) });

  if (c.refine.notes.trim()) out.push({ step: "ajustes", text: `"${c.refine.notes.trim()}"` });
  return out;
}

/** "Cozinha japandi, piso porcelanato areia, marcenaria freijó, fim de tarde dourado, sem pessoas" */
export function summarySentence(c: Choices): string {
  const s = summaryItems(c)
    .filter((i) => i.step !== "objetivo")
    .map((i) => i.text)
    .join(", ");
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "Deixar a IA decidir tudo";
}
