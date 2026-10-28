import { ArrowRight } from "lucide-react";
import { TemplateMarquee } from "@/components/home/TemplateMarquee";
import { AiLogos } from "@/components/ui/AiLogos";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-white pb-16 pt-10 md:pb-24 md:pt-14">
      {/* Halo neon bem suave atrás da vitrine. */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[620px] w-[720px] rounded-full bg-[radial-gradient(closest-side,rgb(255_61_113/0.16),transparent)]" />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div className="min-w-0">
          <SectionLabel>Sites por assinatura</SectionLabel>
          <h1 id="hero-title" className="mt-5 text-[clamp(2.75rem,8.5vw,4.75rem)] leading-[0.95] tracking-[-0.06em]">
            <span className="block">Seu site no ar.</span> <span className="neon-text block">Todo mês.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite md:text-xl">
            Site profissional, hospedagem, manutenção e GEO numa assinatura só. A partir de R$89/mês, sem custo de criação.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/#planos" size="lg" variant="neon" data-track="plan_click" data-track-origin="hero">
              Ver planos <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
            </Button>
            <Button href="/modelos" size="lg" variant="outline">
              Ver modelos
            </Button>
          </div>
          <div className="mt-10 border-t border-line pt-6">
            <p className="label-mono text-graphite">Feito para aparecer no Google e nas IAs</p>
            <AiLogos className="mt-4 gap-x-5" size={20} />
          </div>
        </div>
        <TemplateMarquee />
      </div>
    </section>
  );
}
