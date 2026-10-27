// Decide se a resposta de uma IA cita a empresa: pelo nome no texto ou pelo domínio nas fontes.

export const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9.]+/g, " ").replace(/\.(?=\s|$)/g, "").replace(/\s+/g, " ").trim();

const domainOf = (value: string) =>
  value.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");

export function findMention(answer: { text: string; sources: { url: string; title?: string }[] }, names: string[]) {
  const text = normalize(answer.text);
  const terms = names.map((n) => n.trim()).filter((n) => n.length >= 3);
  const domains = terms.filter((t) => /\.[a-z]{2,}/i.test(t)).map(domainOf);

  for (const term of terms) {
    const needle = normalize(domainOf(term).includes(".") ? domainOf(term) : term);
    if (!needle) continue;
    // Palavra inteira: "Sorriso Real" não conta em "Sorriso Realeza".
    const at = ` ${text} `.indexOf(` ${needle} `);
    if (at >= 0) {
      const start = Math.max(0, at - 120);
      return { cited: true, snippet: text.slice(start, at + needle.length + 120) };
    }
  }
  for (const s of answer.sources) {
    const hay = `${domainOf(s.url)} ${s.title?.toLowerCase() ?? ""}`;
    const hit = domains.find((d) => d && hay.includes(d));
    if (hit) return { cited: true, snippet: `fonte citada: ${s.title ?? s.url}` };
  }
  return { cited: false, snippet: null as string | null };
}
