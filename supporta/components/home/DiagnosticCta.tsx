import { ArrowRight } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Formulário simples (GET) que leva a URL para a ferramenta em /diagnostico. Funciona sem JavaScript. */
export function DiagnosticCta() {
  return (
    <Section tone="ink" labelledBy="diag-title" className="glow-field">
      <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionLabel tone="dark">Diagnóstico grátis</SectionLabel>
          <h2 id="diag-title" className="mt-4 text-[clamp(2rem,5.2vw,3.5rem)] tracking-[-0.05em]">
            Teste a nota do seu site
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-mist">
            Em menos de um minuto você vê a nota do Google para o seu site no celular e se ele está pronto pras IAs.
          </p>
        </div>
        <form action="/diagnostico" method="get" className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="diag-url" className="sr-only">Endereço do seu site</label>
          <input
            id="diag-url"
            name="url"
            type="text"
            inputMode="url"
            autoComplete="url"
            required
            placeholder="seusite.com.br"
            className="h-14 flex-1 rounded-full border border-line-dark bg-card-dark px-6 text-paper placeholder:text-mist focus:border-pink focus:shadow-[0_0_0_1px_rgb(255_61_113/0.7),0_0_24px_rgb(255_61_113/0.35)] focus:outline-none"
          />
          <button type="submit" className={buttonClass("neon", "lg", "h-14")}>
            Testar agora <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Section>
  );
}
