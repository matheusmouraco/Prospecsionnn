// Measures how ready a site is for AI search (GEO: ChatGPT, Gemini, Perplexity, Google AI)
// and for AI agents that browse on the user's behalf. Only objective, fetchable facts.
import type { FetchLike } from '../snov/client.js';

// Crawler user agents of the main AI assistants and AI search products.
export const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot',
] as const;

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';

export interface ProntidaoIA {
  robots_txt: boolean;
  bots_bloqueados: string[];       // AI bots denied the whole site by robots.txt
  sitemap: boolean;
  llms_txt: boolean;
  texto_html_chars: number | null; // text a crawler that does not run JavaScript sees
  texto_renderizado_chars: number | null;
  dados_estruturados: string[];    // schema.org @types found (JSON-LD and microdata)
  tem_faq: boolean;
  controles_sem_nome: number | null; // links/buttons an agent cannot identify
}

interface Group {
  agents: string[];
  disallowAll: boolean;
}

// Minimal robots.txt reading: which groups disallow "/" entirely (an "Allow: /" in the group cancels it).
export function parseRobots(text: string): { groups: Group[]; sitemaps: string[] } {
  const groups: Group[] = [];
  const sitemaps: string[] = [];
  let current: Group | null = null;
  let lastWasAgent = false;
  let allowAll = false;
  const close = () => {
    if (current && allowAll) current.disallowAll = false;
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, '').trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1]!.toLowerCase();
    const value = m[2]!.trim();
    if (key === 'user-agent') {
      if (!current || !lastWasAgent) {
        close();
        current = { agents: [], disallowAll: false };
        allowAll = false;
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (key === 'sitemap' && value) sitemaps.push(value);
    if (!current) continue;
    if (key === 'disallow' && value === '/') current.disallowAll = true;
    if (key === 'allow' && value === '/') allowAll = true;
  }
  close();
  return { groups, sitemaps };
}

// A bot is blocked when its own group disallows "/", or when it has no group and "*" does.
export function blockedBots(robots: string, bots: readonly string[] = AI_BOTS): string[] {
  const { groups } = parseRobots(robots);
  const star = groups.find((g) => g.agents.includes('*'));
  return bots.filter((bot) => {
    const own = groups.find((g) => g.agents.includes(bot.toLowerCase()));
    return own ? own.disallowAll : !!star?.disallowAll;
  });
}

// Visible text length of raw HTML, as a crawler that does not execute JavaScript would read it.
export function htmlTextLength(html: string): number {
  return html
    .replace(/<(script|style|noscript|template|svg)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;
}

async function get(fetchImpl: FetchLike, url: string): Promise<{ ok: boolean; text: string; type: string }> {
  try {
    const res = await fetchImpl(url, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(20_000) });
    const text = res.ok ? await res.text() : '';
    return { ok: res.ok, text, type: res.headers.get('content-type') ?? '' };
  } catch {
    return { ok: false, text: '', type: '' };
  }
}

// Soft 404s (an HTML page served for any path) must not count as having the file.
const looksLikeHtml = (r: { text: string; type: string }) => /html/i.test(r.type) || /^\s*<(!doctype|html)/i.test(r.text);

export interface DomIA {
  dados_estruturados: string[];
  tem_faq: boolean;
  controles_sem_nome: number;
  texto_renderizado_chars: number;
}

export async function checkAiReadiness(pageUrl: string, dom: DomIA | null, fetchImpl: FetchLike = (u, i) => fetch(u, i)): Promise<ProntidaoIA> {
  const origin = new URL(pageUrl).origin;
  const [robots, llms, sitemap, page] = await Promise.all([
    get(fetchImpl, `${origin}/robots.txt`),
    get(fetchImpl, `${origin}/llms.txt`),
    get(fetchImpl, `${origin}/sitemap.xml`),
    get(fetchImpl, pageUrl),
  ]);
  const robotsOk = robots.ok && !looksLikeHtml(robots);
  const robotsText = robotsOk ? robots.text : '';
  const sitemapInRobots = robotsOk && parseRobots(robotsText).sitemaps.length > 0;

  return {
    robots_txt: robotsOk,
    bots_bloqueados: robotsOk ? blockedBots(robotsText) : [],
    sitemap: (sitemap.ok && /<(urlset|sitemapindex)/i.test(sitemap.text)) || sitemapInRobots,
    llms_txt: llms.ok && !looksLikeHtml(llms) && llms.text.trim().length > 0,
    texto_html_chars: page.ok ? htmlTextLength(page.text) : null,
    texto_renderizado_chars: dom?.texto_renderizado_chars ?? null,
    dados_estruturados: dom?.dados_estruturados ?? [],
    tem_faq: dom?.tem_faq ?? false,
    controles_sem_nome: dom?.controles_sem_nome ?? null,
  };
}
