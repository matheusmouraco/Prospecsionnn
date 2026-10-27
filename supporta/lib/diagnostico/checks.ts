import { safeFetch } from "./safe-fetch";

export type Check = { id: string; label: string; ok: boolean; detail: string };

const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"];

/** Robôs de IA bloqueados pelo robots.txt (grupo específico ou "*" com Disallow: /). */
export function blockedBots(robots: string) {
  const groups: { agents: string[]; disallowAll: boolean }[] = [];
  let current: { agents: string[]; disallowAll: boolean } | null = null;
  let lastWasAgent = false;
  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (!key) continue;
    const k = key.toLowerCase();
    if (k === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], disallowAll: false };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (current && k === "disallow" && value === "/") current.disallowAll = true;
    }
  }
  const star = groups.find((g) => g.agents.includes("*"));
  return AI_BOTS.filter((bot) => {
    const own = groups.find((g) => g.agents.includes(bot.toLowerCase()));
    return own ? own.disallowAll : Boolean(star?.disallowAll);
  });
}

function attr(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

export async function runChecks(url: URL): Promise<{ checks: Check[]; finalUrl: string }> {
  const page = await safeFetch(url);
  const html = page.text;
  const origin = page.finalUrl.origin;

  const title = attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description =
    attr(html, /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    attr(html, /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const hasJsonLd = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);

  const [llms, robots] = await Promise.all([
    safeFetch(new URL("/llms.txt", origin), { maxBytes: 200_000, timeoutMs: 6000 }).catch(() => null),
    safeFetch(new URL("/robots.txt", origin), { maxBytes: 200_000, timeoutMs: 6000 }).catch(() => null),
  ]);
  const looksLikeText = (r: typeof llms) => Boolean(r && r.status === 200 && !/text\/html/i.test(r.contentType) && r.text.trim().length > 0 && !/<html/i.test(r.text));
  const hasLlms = looksLikeText(llms);
  const hasRobots = looksLikeText(robots);
  const blocked = hasRobots ? blockedBots(robots!.text) : [];

  const checks: Check[] = [
    {
      id: "https",
      label: "Cadeado de segurança (HTTPS)",
      ok: page.finalUrl.protocol === "https:",
      detail: page.finalUrl.protocol === "https:" ? "O site abre com HTTPS." : "O site abre sem HTTPS. Navegadores mostram \"não seguro\".",
    },
    {
      id: "title",
      label: "Título da página",
      ok: title.length >= 10 && title.length <= 70,
      detail: title ? `"${title.slice(0, 80)}" (${title.length} caracteres)` : "Sem título. O Google não sabe como chamar o seu site nos resultados.",
    },
    {
      id: "description",
      label: "Meta description",
      ok: description.length >= 50 && description.length <= 170,
      detail: description ? `${description.length} caracteres` : "Sem descrição. O Google inventa um resumo com pedaços aleatórios da página.",
    },
    {
      id: "jsonld",
      label: "Dados estruturados (JSON-LD)",
      ok: hasJsonLd,
      detail: hasJsonLd ? "Encontrados." : "Não encontrados. Google e IAs não confirmam nome, endereço e serviços com certeza.",
    },
    {
      id: "llms",
      label: "llms.txt",
      ok: hasLlms,
      detail: hasLlms ? "Encontrado." : "Não encontrado. As IAs não têm um resumo oficial da sua empresa.",
    },
    {
      id: "robots",
      label: "robots.txt liberado pras IAs",
      ok: hasRobots && blocked.length === 0,
      detail: !hasRobots ? "Não encontrado." : blocked.length ? `Bloqueia: ${blocked.join(", ")}.` : "Robôs das IAs liberados.",
    },
  ];

  return { checks, finalUrl: page.finalUrl.toString() };
}
