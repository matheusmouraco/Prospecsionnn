import "server-only";

/** Single place that reads process.env on the server. */
export function serverEnv() {
  const e = process.env;
  return {
    geminiKey: e.GEMINI_API_KEY?.trim() || null,
    modelStandard: e.GEMINI_MODEL_STANDARD?.trim() || "gemini-3.1-flash-image",
    modelHd: e.GEMINI_MODEL_HD?.trim() || "gemini-3-pro-image",
    modelText: e.GEMINI_MODEL_TEXT?.trim() || "gemini-2.5-flash",
    apiStyle: (e.GEMINI_API_STYLE?.trim() === "generateContent" ? "generateContent" : "interactions") as
      | "interactions"
      | "generateContent",
    apiRevision: e.GEMINI_API_REVISION?.trim() || "2026-05-20",
    costStandard: Number(e.COST_USD_STANDARD ?? 0.039),
    costHd: Number(e.COST_USD_HD ?? 0.134),
    accessPassword: e.ACCESS_PASSWORD?.trim() || null,
    maxRendersPerHour: Number(e.MAX_RENDERS_PER_HOUR ?? 60),
  };
}
