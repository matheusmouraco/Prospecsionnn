/** Aspect ratios accepted by every Gemini image model we use. */
export const SUPPORTED_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"] as const;

export function ratioValue(r: string): number {
  const [w, h] = r.split(":").map(Number);
  return w! / h!;
}

/** Closest supported ratio to an image size (compared in log space so 2:1 and 1:2 are symmetric). */
export function closestRatio(width: number, height: number): string {
  const target = Math.log(width / height);
  let best: string = SUPPORTED_RATIOS[0];
  let diff = Infinity;
  for (const r of SUPPORTED_RATIOS) {
    const d = Math.abs(Math.log(ratioValue(r)) - target);
    if (d < diff) {
      diff = d;
      best = r;
    }
  }
  return best;
}
