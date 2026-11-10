import {
  ANGLES,
  ARTIFICIAL,
  EXTERIOR_ROOMS,
  FURNITURE_MODES,
  GOALS,
  INPUT_TYPES,
  ITEMS,
  LENSES,
  PALETTES,
  PROMPT_BLOCKS,
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

const find = (list: Option[], id: string | null | undefined) => (id ? list.find((o) => o.id === id) : undefined);

export type PromptContext = {
  hasMask: boolean;
  referenceCount: number;
};

function fidelityLine(f: number): string {
  if (f <= 20)
    return "FIDELITY: maximum. Stay extremely faithful to the base image. Change only what the choices below explicitly ask for; everything else keeps its current shape, position and color.";
  if (f <= 45)
    return "FIDELITY: high. Stay faithful to the base image; small styling decisions are allowed where the choices leave room.";
  if (f <= 70)
    return "FIDELITY: balanced. Respect the architecture strictly, and feel free to make tasteful decisions about decor, styling and accessories.";
  return "FIDELITY: creative. Architecture stays locked, but you have creative freedom with decor, styling, accessories and atmosphere to create a striking image.";
}

function autoMaterialLine(goal: string | null): string {
  if (goal === "realista") return "keep the current material and color shown in the base image, rendered photorealistically";
  if (goal === "redecorar") return "keep the current finish";
  return "choose a material that fits the style and palette";
}

/** Turns every wizard choice into the structured English prompt sent with the base image. */
export function buildPrompt(c: Choices, ctx: PromptContext): string {
  const lines: string[] = [PROMPT_BLOCKS.role, ""];

  const input = find(INPUT_TYPES, c.inputType);
  if (input) lines.push(`INPUT: ${input.prompt}`);

  const goal = find(GOALS, c.goal);
  if (goal) lines.push(`GOAL: ${goal.prompt}`);

  lines.push("", PROMPT_BLOCKS.geometry, fidelityLine(c.refine.fidelity), "");

  const room = find(ROOMS, c.room);
  if (room) lines.push(`SPACE: ${room.prompt}.`);

  const style = find(STYLES, c.style);
  lines.push(style ? `STYLE: ${style.prompt}.` : "STYLE: choose the style that best fits the space and its existing elements.");

  // Materials
  const keep = c.goal === "realista";
  const materialLines: string[] = [];
  for (const key of surfacesForRoom(c.room)) {
    const surface = SURFACES.find((s) => s.key === key)!;
    const value = c.materials[key];
    if (value === "manter") materialLines.push(`- ${surface.promptLabel}: keep exactly as it is in the base image.`);
    else if (value === "auto") materialLines.push(`- ${surface.promptLabel}: ${autoMaterialLine(c.goal)}.`);
    else {
      const opt = find(surface.options, value);
      if (opt) materialLines.push(`- ${surface.promptLabel}: ${opt.prompt}.`);
    }
  }
  if (materialLines.length) lines.push("MATERIALS (apply only to surfaces that exist in the image, never invent new architecture to show them):", ...materialLines);

  // Palette
  if (c.palette.mode === "preset") {
    const p = find(PALETTES, c.palette.preset);
    if (p) lines.push(`COLOR PALETTE: ${p.prompt} (${p.colors!.join(", ")}).`);
  } else if (c.palette.mode === "custom" && c.palette.colors.length) {
    lines.push(`COLOR PALETTE: build the color scheme around these exact colors: ${c.palette.colors.join(", ")}.`);
  } else if (!keep) {
    lines.push("COLOR PALETTE: harmonious palette coherent with the style.");
  }

  // Lighting
  const light: string[] = [];
  const time = find(TIMES, c.lighting.time);
  if (time) light.push(time.prompt);
  const art = c.lighting.artificial.map((id) => find(ARTIFICIAL, id)?.prompt).filter(Boolean);
  if (art.length) light.push(`artificial lighting turned on: ${art.join(", ")}`);
  const temp = find(TEMPERATURES, c.lighting.temperature);
  if (temp) light.push(temp.prompt);
  const sky = find(SKIES, c.lighting.sky);
  const exterior = (c.room && EXTERIOR_ROOMS.has(c.room)) || c.goal === "fachada";
  if (sky) light.push(exterior ? sky.prompt : `${sky.prompt} visible through the windows`);
  if (c.lighting.natural !== null) {
    const n = c.lighting.natural;
    light.push(n < 25 ? "very little natural light" : n < 60 ? "moderate natural light" : n < 85 ? "abundant natural light" : "flooded with natural light");
  }
  lines.push(light.length ? `LIGHTING: ${light.join("; ")}.` : "LIGHTING: natural, flattering light that suits the space, with soft realistic shadows.");

  // Furniture
  const fm = find(FURNITURE_MODES, c.furniture.mode);
  const furn: string[] = [];
  if (fm) furn.push(fm.prompt);
  else if (c.goal === "realista") furn.push(FURNITURE_MODES[0]!.prompt);
  const items = c.furniture.items.map((id) => find(ITEMS, id)?.prompt).filter(Boolean);
  if (items.length) furn.push(`Include: ${items.join(", ")}.`);
  if (!c.furniture.items.includes("pessoas")) furn.push("No people.");
  if (!c.furniture.items.includes("pets")) furn.push("No animals.");
  if (furn.length) lines.push(`FURNITURE AND DECOR: ${furn.join(" ")}`);

  // Camera
  const angle = find(ANGLES, c.camera.angle) ?? ANGLES[0]!;
  const lens = find(LENSES, c.camera.lens);
  lines.push(`CAMERA: ${angle.prompt}${lens ? ` Lens: ${lens.prompt}.` : ""}`);
  if (c.camera.format !== "original") {
    lines.push(`FRAMING: final aspect ratio ${c.camera.format}. Extend the scene naturally at the edges if needed, continuing the existing architecture without inventing new openings.`);
  }

  // Inputs other than the base image
  if (ctx.hasMask) {
    lines.push(
      "EDITABLE AREA: an image labeled MASK is provided. White areas may change according to these instructions; black areas must remain pixel-identical to the base image.",
    );
  }
  if (ctx.referenceCount > 0) {
    lines.push(
      `REFERENCES: ${ctx.referenceCount} image(s) labeled REFERENCE form a moodboard. Borrow their style, materials, colors and mood only. Never copy their layout, geometry or camera.`,
    );
  }

  const notes = c.refine.notes.trim();
  if (notes) lines.push(`CLIENT NOTES (written in Portuguese, follow them carefully as long as they do not break the geometry lock): "${notes}"`);

  lines.push("", PROMPT_BLOCKS.quality);
  const avoid = c.furniture.avoid.trim();
  lines.push(`AVOID: ${PROMPT_BLOCKS.negativeBase}${avoid ? `. Also absolutely do not show (client request, in Portuguese): "${avoid}"` : ""}.`);
  lines.push(PROMPT_BLOCKS.output);

  return lines.join("\n");
}

/** Text edit on an existing render ("troque o piso por madeira"). */
export function buildEditPrompt(instruction: string, ctx: { hasMask: boolean }): string {
  return [
    PROMPT_BLOCKS.role,
    "",
    "TASK: edit the provided render. Apply ONLY the change requested below and keep everything else identical: same camera, same geometry, same furniture, same materials, same colors, same lighting, same image size.",
    `REQUESTED CHANGE (written in Portuguese): "${instruction.trim()}"`,
    ctx.hasMask
      ? "EDITABLE AREA: an image labeled MASK is provided. Apply the change only inside the white area; black areas must remain pixel-identical."
      : "",
    PROMPT_BLOCKS.geometry,
    PROMPT_BLOCKS.quality,
    `AVOID: ${PROMPT_BLOCKS.negativeBase}.`,
    PROMPT_BLOCKS.output,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Variation of a chosen render: same brief, small differences. */
export function buildVariationPrompt(c: Choices, ctx: PromptContext): string {
  return (
    buildPrompt(c, { ...ctx, referenceCount: ctx.referenceCount }) +
    "\n\nVARIATION: the image labeled CHOSEN RENDER is the client's favorite result. Create an alternative take that stays very close to it (same materials, palette, lighting and mood), varying only decor details, styling and accessories."
  );
}

export function buildUpscalePrompt(): string {
  return [
    "Re-render this exact image at higher resolution with crisper, cleaner detail and refined textures.",
    "Do not change the composition, camera, objects, materials, colors or lighting in any way. Remove compression artifacts and noise.",
    PROMPT_BLOCKS.output,
  ].join("\n");
}
