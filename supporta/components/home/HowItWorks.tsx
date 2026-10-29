import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NeonArt, type ArtName } from "@/components/ui/NeonArt";
import { Section, SectionHeading } from "@/components/ui/Section";

const steps: { n: string; title: string; text: string; art: ArtName }[] = [
  { n: "01", title: "Assina", text: "Escolhe o plano e assina no cartão em poucos minutos, mensal ou anual. Sem custo de criação.", art: "passo-1-cartao" },
  { n: "02", title: "Preenche o briefing", text: "Responde um briefing de 10 minutos com informações da empresa, logo e fotos. A gente escreve os textos.", art: "passo-2-briefing" },
  { n: "03", title: "Aprova e publica", text: "Você revisa, pede o que quiser mudar e aprova. A gente publica e cuida de tudo todo mês.", art: "passo-3-navegador" },
];

export function HowItWorks() {
  return (
    <Section id="como-funciona" tone="white" labelledBy="como-title">
      <SectionHeading id="como-title" label="Como funciona" title="Como ter o site no ar?" lead="Em três passos, sem reunião longa e sem você precisar entender de tecnologia." align="center" />
      <ol className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="overflow-hidden rounded-3xl border border-line bg-paper">
            <NeonArt name={s.art} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3]" />
            <div className="p-7">
            <span className="font-mono text-sm text-graphite">{s.n}</span>
            <h3 className="mt-4 text-2xl tracking-[-0.04em]">{s.title}</h3>
            <p className="mt-3 leading-relaxed text-graphite">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex justify-center">
        <Button href="/#planos" size="lg" data-track="plan_click" data-track-origin="como-funciona">
          Escolher meu plano <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
        </Button>
      </div>
    </Section>
  );
}
