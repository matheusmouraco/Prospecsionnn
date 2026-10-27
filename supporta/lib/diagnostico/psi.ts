export type Scores = { performance: number; accessibility: number; bestPractices: number; seo: number };
export type PsiResult = { scores: Scores; lcpSeconds: number | null; cls: number | null };

/** PageSpeed Insights v5, estratégia mobile. A chave fica em PSI_API_KEY (sem chave a cota é muito baixa). */
export async function runPageSpeed(url: string): Promise<PsiResult> {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", "mobile");
  api.searchParams.set("locale", "pt_BR");
  for (const c of ["performance", "accessibility", "best-practices", "seo"]) api.searchParams.append("category", c);
  if (process.env.PSI_API_KEY) api.searchParams.set("key", process.env.PSI_API_KEY);

  const res = await fetch(api, { signal: AbortSignal.timeout(50_000) });
  if (!res.ok) throw new Error(`PageSpeed respondeu ${res.status}`);
  const data = await res.json();
  const cat = data?.lighthouseResult?.categories ?? {};
  const audits = data?.lighthouseResult?.audits ?? {};
  const pct = (v: unknown) => (typeof v === "number" ? Math.round(v * 100) : 0);
  const lcp = audits["largest-contentful-paint"]?.numericValue;
  const cls = audits["cumulative-layout-shift"]?.numericValue;
  return {
    scores: {
      performance: pct(cat.performance?.score),
      accessibility: pct(cat.accessibility?.score),
      bestPractices: pct(cat["best-practices"]?.score),
      seo: pct(cat.seo?.score),
    },
    lcpSeconds: typeof lcp === "number" ? Math.round(lcp / 100) / 10 : null,
    cls: typeof cls === "number" ? Math.round(cls * 1000) / 1000 : null,
  };
}
