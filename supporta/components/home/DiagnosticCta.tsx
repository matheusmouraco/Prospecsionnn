import { ArrowRight, Gauge, Globe, SearchCheck, Sparkles } from "lucide-react";
import { AiLogos } from "@/components/ui/AiLogos";
import { buttonClass } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

const checks = [
  { icon: Gauge, title: "Nota no celular", text: "PageSpeed oficial do Google" },
  { icon: SearchCheck, title: "Básico do Google", text: "HTTPS, título e descrição" },
  { icon: Sparkles, title: "Pronto pras IAs", text: "llms.txt, robots e dados estruturados" },
];

/** Formulário simples (GET) que leva a URL para a ferramenta em /diagnostico. Funciona sem JavaScript. */
export function DiagnosticCta() {
  return (
    <Section tone="ink" labelledBy="diag-title" className="glow-field">
      <div className="mx-auto max-w-4xl text-center">
        <SectionLabel tone="dark">Diagnóstico grátis</SectionLabel>
        <h2 id="diag-title" className="mt-4 text-[clamp(2.25rem,6vw,4rem)] tracking-[-0.055em]">
          Teste a nota do <span className="neon-text">seu site</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mist">
          Em menos de um minuto você vê a nota do Google para o seu site no celular e se ele está pronto pras IAs.
        </p>

        <form action="/diagnostico" method="get" className="neon-ring mx-auto mt-10 flex max-w-2xl flex-col gap-2 rounded-[1.75rem] bg-card-dark p-2 sm:flex-row sm:rounded-full">
          <label htmlFor="diag-url" className="sr-only">Endereço do seu site</label>
          <div className="flex flex-1 items-center gap-3 px-4">
            <Globe aria-hidden strokeWidth={1.75} className="h-5 w-5 shrink-0 text-mist" />
            <input
              id="diag-url"
              name="url"
              type="text"
              inputMode="url"
              autoComplete="url"
              required
              placeholder="seusite.com.br"
              className="h-14 w-full bg-transparent text-lg text-paper placeholder:text-mist focus:outline-none"
            />
          </div>
          <button type="submit" className={buttonClass("neon", "lg", "h-14")}>
            Testar agora <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
          </button>
        </form>

        <ul className="mt-10 grid gap-3 text-left sm:grid-cols-3">
          {checks.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3 rounded-2xl border border-line-dark bg-ink/60 p-4">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink/15 text-pink">
                <Icon aria-hidden strokeWidth={1.75} className="h-[18px] w-[18px]" />
              </span>
              <span>
                <span className="block font-medium text-paper">{title}</span>
                <span className="block text-sm text-mist">{text}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="label-mono text-mist">Para aparecer no Google e nas IAs</p>
          <AiLogos only={["google", "chatgpt", "gemini", "perplexity", "claude"]} tone="dark" size={18} small className="justify-center gap-x-5" />
        </div>
      </div>
    </Section>
  );
}
