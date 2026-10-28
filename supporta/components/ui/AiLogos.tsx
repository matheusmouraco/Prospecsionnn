/** Logos oficiais das IAs e do Google (arquivos em public/logos/ia, pacote LobeHub, MIT). Indicam onde o site aparece, sem sugerir parceria. */

export const aiPlatforms = [
  { id: "google", name: "Google", file: "google.svg" },
  { id: "chatgpt", name: "ChatGPT", file: "chatgpt.svg", dark: "chatgpt-claro.svg" },
  { id: "gemini", name: "Gemini", file: "gemini.svg" },
  { id: "perplexity", name: "Perplexity", file: "perplexity.svg" },
  { id: "claude", name: "Claude", file: "claude.svg" },
  { id: "copilot", name: "Copilot", file: "copilot.svg" },
] as const;

type Id = (typeof aiPlatforms)[number]["id"];

export function AiLogos({
  only,
  tone = "light",
  size = 22,
  names = true,
  className = "",
}: {
  only?: Id[];
  tone?: "light" | "dark";
  size?: number;
  names?: boolean;
  className?: string;
}) {
  const list = only ? aiPlatforms.filter((p) => only.includes(p.id)) : aiPlatforms;
  const text = tone === "dark" ? "text-paper/90" : "text-ink";
  return (
    <ul className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}>
      {list.map((p) => (
        <li key={p.id} className={`flex items-center gap-2 text-[15px] font-medium tracking-[-0.01em] ${text}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/ia/${tone === "dark" && "dark" in p ? p.dark : p.file}`}
            alt={names ? "" : p.name}
            width={size}
            height={size}
            loading="lazy"
            decoding="async"
            className="shrink-0"
          />
          {names ? p.name : null}
        </li>
      ))}
    </ul>
  );
}

export const aiDisclaimer = "Marcas dos seus respectivos donos. A Supporta não tem vínculo com essas empresas.";
