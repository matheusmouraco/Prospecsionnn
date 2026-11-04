import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NeonArt, type ArtName } from "@/components/ui/NeonArt";
import { Section, SectionHeading } from "@/components/ui/Section";

const steps: { n: string; title: string; text: string; art: ArtName }[] = [
  { n: "01", title: "Responde as escolhas", text: "Um jogo rápido de escolhas sobre a sua empresa, o estilo e as cores. Sem formulário longo e sem reunião.", art: "passo-2-briefing" },
  { n: "02", title: "Vê a prévia", text: "Em poucos minutos a IA monta o seu site, com os textos e a sua marca. Você vê tudo antes de pagar.", art: "passo-3-navegador" },
  { n: "03", title: "Assina e está no ar", text: "Escolhe o plano, paga no cartão e o site entra no ar sozinho em nome.supporta.com.br. O domínio próprio a gente combina pelo WhatsApp.", art: "passo-1-cartao" },
];

export function HowItWorks() {
  return (
    <Section id="como-funciona" tone="white" labelledBy="como-title">
      <SectionHeading id="como-title" label="Como funciona" title="Como ter o site no ar?" lead="Em três passos, 100% automático, sem reunião e sem você precisar entender de tecnologia." align="center" />
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
        <Button href="/criar" size="lg" data-track="plan_click" data-track-origin="como-funciona">
          Criar meu site <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
        </Button>
      </div>
    </Section>
  );
}
