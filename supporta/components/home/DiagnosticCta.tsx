import { Gauge, SearchCheck, Sparkles } from "lucide-react";
import { QuickDiagnostic } from "@/components/diagnostico/QuickDiagnostic";
import { AiLogos } from "@/components/ui/AiLogos";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

const checks = [
  { icon: Gauge, title: "Nota no celular", text: "PageSpeed oficial do Google" },
  { icon: SearchCheck, title: "Básico do Google", text: "HTTPS, título e descrição" },
  { icon: Sparkles, title: "Pronto pras IAs", text: "llms.txt, robots e dados estruturados" },
];

/** Diagnóstico grátis na home: o relatório abre num popup, sem e-mail e sem trocar de página. */
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

        <QuickDiagnostic />

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
