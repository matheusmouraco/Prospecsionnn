import { ArrowRight } from "lucide-react";
import { Symbol } from "@/components/brand/Symbol";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

/** Fechamento de página: fundo escuro com a última frase acesa em neon. */
export function FinalCta({ title = "A IA sempre se apoia em alguma fonte. Faça ser a sua.", href = "/#planos", cta = "Escolher meu plano" }: { title?: string; href?: string; cta?: string }) {
  // Acende a última frase do título ("Faça ser a sua.").
  const cut = title.slice(0, -1).lastIndexOf(". ");
  const [lead, lit] = cut > 0 ? [title.slice(0, cut + 1), title.slice(cut + 2)] : ["", title];
  return (
    <Section tone="ink" labelledBy="cta-final" className="glow-field">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-4xl">
          <Symbol tone="dark" className="h-14 w-14 drop-shadow-[0_0_14px_rgb(255_61_113/0.6)]" />
          <h2 id="cta-final" className="mt-6 text-[clamp(2.25rem,6vw,4.5rem)] leading-[1] tracking-[-0.055em]">
            {lead ? <>{lead} </> : null}
            <span className="neon-text">{lit}</span>
          </h2>
        </div>
        <Button href={href} variant="neon" size="lg" className="shrink-0" data-track="plan_click" data-track-origin="cta-final">
          {cta} <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
        </Button>
      </div>
    </Section>
  );
}
