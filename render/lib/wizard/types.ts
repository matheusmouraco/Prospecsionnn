import type { QualityId, SurfaceKey } from "../../config/options.ts";

/** "auto" always means "deixar a IA decidir". */
export type Auto = "auto";

export type Choices = {
  inputType: string | null;
  goal: string | null;
  room: string | null;
  style: string | Auto;
  /** per surface: "auto" | "manter" | option id */
  materials: Record<SurfaceKey, string>;
  palette: { mode: Auto | "preset" | "custom"; preset: string | null; colors: string[] };
  lighting: {
    time: string | Auto;
    artificial: string[];
    temperature: string | Auto;
    sky: string | Auto;
    /** natural light intensity 0..100, null = auto */
    natural: number | null;
  };
  furniture: { mode: string | Auto; items: string[]; avoid: string };
  camera: { angle: string; format: string; lens: string | Auto };
  refine: { notes: string; fidelity: number };
  quality: QualityId;
  variations: number;
};

export const DEFAULT_CHOICES: Choices = {
  inputType: null,
  goal: null,
  room: null,
  style: "auto",
  materials: { piso: "auto", paredes: "auto", teto: "auto", marcenaria: "auto", bancadas: "auto", metais: "auto" },
  palette: { mode: "auto", preset: null, colors: [] },
  lighting: { time: "auto", artificial: [], temperature: "auto", sky: "auto", natural: null },
  furniture: { mode: "auto", items: [], avoid: "" },
  camera: { angle: "original", format: "original", lens: "auto" },
  refine: { notes: "", fidelity: 25 },
  quality: "1k",
  variations: 2,
};

export function cloneChoices(c: Choices): Choices {
  return JSON.parse(JSON.stringify(c)) as Choices;
}

/** Merge a partial (from a preset or the assistant) over the current choices. */
export function mergeChoices(base: Choices, patch: Partial<Choices>): Choices {
  const out = cloneChoices(base);
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === null) continue;
    const key = k as keyof Choices;
    const cur = out[key];
    if (cur && typeof cur === "object" && !Array.isArray(cur) && typeof v === "object" && !Array.isArray(v)) {
      (out as Record<string, unknown>)[key] = { ...cur, ...v };
    } else {
      (out as Record<string, unknown>)[key] = v;
    }
  }
  return out;
}

export function creditsFor(quality: QualityId, variations: number): number {
  return (quality === "2k" ? 3 : 1) * variations;
}
