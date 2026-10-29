import { ArrowRight, Check } from "lucide-react";
import { TemplateMarquee } from "@/components/home/TemplateMarquee";
import { AiLogos } from "@/components/ui/AiLogos";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-white pb-12 pt-8 md:pb-16 lg:pt-6">
      <div aria-hidden className="grid-light pointer-events-none absolute inset-0" />
      {/* Halo neon suave atrás da parede de modelos. */}
      <div aria-hidden className="pointer-events-none absolute -right-48 top-0 h-[760px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgb(255_61_113/0.2),transparent)]" />
      <div className="container-site relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
        <div className="min-w-0 lg:py-16">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/80 py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink shadow-[0_1px_0_rgb(11_11_15/0.04)] backdrop-blur">
            <span aria-hidden className="neon-pulse ml-2 h-2 w-2 rounded-full bg-pink shadow-[0_0_10px_rgb(255_61_113/0.9)]" />
            Sites por assinatura, a partir de R$89/mês
          </p>
          <h1 id="hero-title" className="mt-6 text-[clamp(3rem,8.5vw,5.75rem)] leading-[0.92] tracking-[-0.065em]">
            <span className="block">Seu site no ar.</span> <span className="neon-text block">Todo mês.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-graphite md:text-xl">
            Site profissional, hospedagem, manutenção e GEO numa assinatura só. Sem custo de criação e pronto para aparecer no Google e nas IAs.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/#planos" size="lg" variant="neon" data-track="plan_click" data-track-origin="hero">
              Ver planos <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
            </Button>
            <Button href="/modelos" size="lg" variant="outline" className="bg-white">
              Ver modelos
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-graphite">
            {["Sem custo de criação", "Hospedagem e SSL inclusos", "Domínio grátis no 1º ano"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check aria-hidden strokeWidth={2} className="h-4 w-4 text-pink" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 border-t border-line pt-6">
            <p className="label-mono text-graphite">Feito para aparecer no</p>
            <AiLogos only={["google", "chatgpt", "gemini", "perplexity", "claude"]} size={18} small className="mt-3.5 gap-x-5" />
          </div>
        </div>

        <div className="relative min-w-0">
          <TemplateMarquee />
          {/* Selos flutuando sobre a parede (só no desktop, onde há espaço). */}
          <div aria-hidden className="pointer-events-none absolute left-2 top-16 hidden items-center gap-3 rounded-2xl border border-line bg-white/95 p-3 pr-5 shadow-[0_20px_50px_-20px_rgb(11_11_15/0.35)] backdrop-blur lg:flex">
            <svg viewBox="0 0 64 64" className="h-11 w-11">
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--line)" strokeWidth="7" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--pink)" strokeWidth="7" strokeLinecap="round" strokeDasharray="150 164" transform="rotate(-90 32 32)" />
            </svg>
            <div>
              <p className="text-xl font-semibold leading-none tracking-[-0.04em]">90+</p>
              <p className="mt-1 text-xs text-graphite">Nota no celular</p>
            </div>
          </div>
          <div aria-hidden className="pointer-events-none absolute bottom-16 right-0 hidden items-center gap-3 rounded-2xl bg-ink p-3 pr-5 text-paper neon-ring lg:flex">
            <AiLogos only={["chatgpt", "gemini", "perplexity"]} tone="dark" names={false} size={18} className="gap-x-2 rounded-xl bg-card-dark px-2.5 py-2" />
            <div>
              <p className="text-sm font-semibold leading-tight">Pronto pras IAs</p>
              <p className="text-xs text-mist">llms.txt e dados estruturados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
