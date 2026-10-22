// Google PageSpeed Insights API v5 (runPagespeed). Lighthouse category scores come as 0-1
// and audits carry numericValue in ms (CLS is unitless).
import type { FetchLike } from '../snov/client.js';

const ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const CATEGORIES = ['performance', 'seo', 'accessibility', 'best-practices'] as const;

export type Strategy = 'mobile' | 'desktop';

export interface PageSpeedResult {
  strategy: Strategy;
  performance: number | null;     // 0-100
  seo: number | null;
  acessibilidade: number | null;
  boas_praticas: number | null;
  lcp_ms: number | null;          // largest contentful paint
  fcp_ms: number | null;          // first contentful paint
  cls: number | null;             // cumulative layout shift
  tbt_ms: number | null;          // total blocking time
  speed_index_ms: number | null;
  erro: string | null;            // Lighthouse could not measure the page
}

type Json = Record<string, unknown>;

function obj(v: unknown): Json | undefined {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Json) : undefined;
}

function score(categories: Json | undefined, key: string): number | null {
  const s = obj(categories?.[key])?.score;
  return typeof s === 'number' ? Math.round(s * 100) : null;
}

function audit(audits: Json | undefined, key: string): number | null {
  const v = obj(audits?.[key])?.numericValue;
  return typeof v === 'number' ? v : null;
}

export function parsePageSpeed(strategy: Strategy, body: unknown): PageSpeedResult {
  const lh = obj(obj(body)?.lighthouseResult);
  const categories = obj(lh?.categories);
  const audits = obj(lh?.audits);
  const runtimeError = obj(lh?.runtimeError);
  const apiError = obj(obj(body)?.error);
  return {
    strategy,
    performance: score(categories, 'performance'),
    seo: score(categories, 'seo'),
    acessibilidade: score(categories, 'accessibility'),
    boas_praticas: score(categories, 'best-practices'),
    lcp_ms: audit(audits, 'largest-contentful-paint'),
    fcp_ms: audit(audits, 'first-contentful-paint'),
    cls: audit(audits, 'cumulative-layout-shift'),
    tbt_ms: audit(audits, 'total-blocking-time'),
    speed_index_ms: audit(audits, 'speed-index'),
    erro: (runtimeError?.message as string | undefined) ?? (apiError?.message as string | undefined) ?? null,
  };
}

export async function runPageSpeed(
  url: string,
  strategy: Strategy,
  apiKey: string,
  fetchImpl: FetchLike = (u, i) => fetch(u, i),
): Promise<PageSpeedResult> {
  const qs = new URLSearchParams({ url, strategy, key: apiKey, locale: 'pt_BR' });
  for (const c of CATEGORIES) qs.append('category', c);

  // Lighthouse runs can take a minute; one retry for transient 5xx.
  for (let attempt = 1; ; attempt++) {
    const res = await fetchImpl(`${ENDPOINT}?${qs.toString()}`, { signal: AbortSignal.timeout(120_000) });
    const body = await res.json().catch(() => null);
    if (res.ok || attempt >= 2 || res.status < 500) return parsePageSpeed(strategy, body);
  }
}
