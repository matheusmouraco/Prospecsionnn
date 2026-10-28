import { ArrowRight } from "lucide-react";
import { BrowserFrame } from "@/components/mockups/Frames";
import { SiteMock } from "@/components/mockups/SiteMock";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getSegment } from "@/lib/segments";

// As 3 barras do símbolo: as de fora em acrílico preto, a do meio acesa em neon.
const bars = [
  { label: "Site", className: "ml-[20%] w-[80%] gloss-bar text-paper", delay: "120ms" },
  { label: "Hospedagem e manutenção", className: "ml-[8%] w-[92%] neon-bar neon-pulse text-ink", delay: "320ms" },
  { label: "GEO", className: "w-[80%] gloss-bar text-paper", delay: "520ms" },
];

export function Hero() {
  const mock = getSegment("odontologia")!.mock;
  return (
    <section aria-labelledby="hero-title" className="glow-field overflow-hidden pb-20 pt-12 text-paper md:pb-28 md:pt-20">
      <div className="container-site">
        <div className="max-w-4xl">
          <SectionLabel tone="dark">Sites por assinatura</SectionLabel>
          <h1 id="hero-title" className="mt-5 text-[clamp(2.75rem,10vw,6.5rem)] leading-[0.95] tracking-[-0.06em]">
            <span className="block">Seu site no ar.</span> <span className="neon-text block">Todo mês.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist md:text-xl">
            Site profissional, hospedagem, manutenção e GEO numa assinatura só. A partir de R$89/mês, sem custo de criação.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/#planos" size="lg" variant="neon" data-track="plan_click" data-track-origin="hero">
              Ver planos <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
            </Button>
            <Button href="/modelos" size="lg" variant="outline-dark">
              Ver modelos
            </Button>
          </div>
        </div>

        <div className="mt-14 grid items-center gap-12 md:mt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="relative">
            <p className="label-mono text-mist">Tudo numa assinatura</p>
            <ul className="relative z-10 mt-5 space-y-3 md:space-y-4">
              {bars.map((bar) => (
                <li
                  key={bar.label}
                  className={`bar-in flex h-16 items-center rounded-full px-6 md:h-20 md:px-8 ${bar.className}`}
                  style={{ animationDelay: bar.delay }}
                >
                  <span className="label-mono text-[12px] md:text-sm">{bar.label}</span>
                </li>
              ))}
            </ul>
            <div aria-hidden className="neon-floor absolute -bottom-10 left-[10%] h-16 w-[80%]" />
          </div>
          <div className="relative">
            <div aria-hidden className="neon-floor absolute -bottom-8 left-[5%] h-20 w-[90%]" />
            <BrowserFrame url="clinicasorrirbem.com.br" scroll distance="58%" className="neon-ring fade-up relative [animation-delay:400ms]">
              <SiteMock mock={mock} variant="desktop" />
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
