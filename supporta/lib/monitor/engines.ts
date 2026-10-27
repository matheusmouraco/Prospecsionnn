// Pergunta às IAs com busca na web ligada e devolve o texto da resposta e as fontes citadas.
// Modelos sempre pelo .env: as versões mudam rápido.

export type EngineAnswer = { text: string; sources: { url: string; title?: string }[] };
export type Engine = { id: string; label: string; enabled: () => boolean; ask: (question: string) => Promise<EngineAnswer> };

const PROMPT_SUFFIX = "\n\nResponda em português do Brasil, indicando empresas ou profissionais específicos quando fizer sentido.";

async function post(url: string, headers: Record<string, string>, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(90_000) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data?.error ?? data).slice(0, 200)}`);
  return data;
}

const openai: Engine = {
  id: "chatgpt",
  label: "ChatGPT",
  enabled: () => Boolean(process.env.OPENAI_API_KEY),
  async ask(question) {
    const data = await post("https://api.openai.com/v1/responses", { authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, {
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      tools: [{ type: "web_search" }],
      input: question + PROMPT_SUFFIX,
    });
    const parts: string[] = [];
    const sources: EngineAnswer["sources"] = [];
    for (const item of data.output ?? []) {
      for (const c of item.content ?? []) {
        if (typeof c.text === "string") parts.push(c.text);
        for (const a of c.annotations ?? []) if (a.url) sources.push({ url: a.url, title: a.title });
      }
    }
    return { text: parts.join("\n") || String(data.output_text ?? ""), sources };
  },
};

const gemini: Engine = {
  id: "gemini",
  label: "Gemini",
  enabled: () => Boolean(process.env.GEMINI_API_KEY),
  async ask(question) {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const data = await post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { "x-goog-api-key": process.env.GEMINI_API_KEY ?? "" }, {
      contents: [{ role: "user", parts: [{ text: question + PROMPT_SUFFIX }] }],
      tools: [{ google_search: {} }],
    });
    const cand = data.candidates?.[0] ?? {};
    const text = (cand.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("\n");
    // O Gemini devolve links de redirecionamento; o título costuma trazer o domínio real da fonte.
    const sources = (cand.groundingMetadata?.groundingChunks ?? []).map((g: { web?: { uri: string; title?: string } }) => ({ url: g.web?.uri ?? "", title: g.web?.title })).filter((s: { url: string }) => s.url);
    return { text, sources };
  },
};

const perplexity: Engine = {
  id: "perplexity",
  label: "Perplexity",
  enabled: () => Boolean(process.env.PERPLEXITY_API_KEY),
  async ask(question) {
    const data = await post("https://api.perplexity.ai/chat/completions", { authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}` }, {
      model: process.env.PERPLEXITY_MODEL || "sonar",
      messages: [{ role: "user", content: question + PROMPT_SUFFIX }],
    });
    const text = String(data.choices?.[0]?.message?.content ?? "");
    const urls: { url: string; title?: string }[] = [
      ...(data.search_results ?? []).map((r: { url: string; title?: string }) => ({ url: r.url, title: r.title })),
      ...(data.citations ?? []).map((u: string) => ({ url: u })),
    ];
    return { text, sources: urls.filter((s, i, all) => s.url && all.findIndex((x) => x.url === s.url) === i) };
  },
};

export const engines: Engine[] = [openai, gemini, perplexity];
