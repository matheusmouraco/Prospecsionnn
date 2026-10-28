import { ArrowRight } from "lucide-react";
import { AiLogos } from "@/components/ui/AiLogos";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";

const cited = [
  { name: "Clínica Odonto Prime", source: "odontoprime.com.br" },
  { name: "Sorriso Center", source: "sorrisocenter.com.br" },
  { name: "OdontoVida Integrada", source: "google.com/maps" },
];

export function AiProblem() {
  return (
    <Section tone="ink" labelledBy="ia-title" className="glow-field">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading id="ia-title" tone="dark" label="O novo boca a boca" title="Sua empresa aparece no ChatGPT?" />
          <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-mist">
            <p>
              Cada vez mais clientes perguntam para a IA antes de escolher um dentista, um advogado ou um restaurante. E a IA responde citando empresas.
            </p>
            <p>
              Ela cita quem virou fonte: sites claros, rápidos e organizados que explicam bem o que a empresa faz e onde atende. Se o seu site não é assim, a indicação vai para o concorrente.
            </p>
          </div>
          <Button href="/diagnostico" variant="neon" size="lg" className="mt-8">
            Testar meu site grátis <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
          </Button>
        </div>

        <figure aria-label="Exemplo de conversa com uma IA" className="neon-ring rounded-3xl border border-line-dark bg-card-dark/90 p-5 md:p-7">
          <div className="flex justify-end">
            <p className="max-w-[85%] rounded-3xl rounded-br-lg bg-paper px-5 py-3 text-[15px] text-ink">
              Qual dentista você indica para implante aqui no bairro?
            </p>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="label-mono text-mist">Resposta da IA</p>
              <AiLogos only={["chatgpt", "gemini", "perplexity", "claude"]} tone="dark" names={false} size={18} className="gap-x-3" />
            </div>
            <p className="text-[15px] leading-relaxed text-paper/90">Com base em avaliações e nos sites das clínicas, estas são boas opções:</p>
            <ol className="space-y-2.5">
              {cited.map((c, i) => (
                <li key={c.name} className="fade-up flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line-dark px-4 py-3" style={{ animationDelay: `${200 + i * 180}ms` }}>
                  <span className="text-[15px] font-medium text-paper">
                    {i + 1}. {c.name}
                  </span>
                  <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] text-mist">fonte: {c.source}</span>
                </li>
              ))}
              <li className="fade-up neon-pulse flex items-center justify-between gap-2 rounded-2xl px-4 py-3 dashed-pill shadow-[0_0_18px_rgb(255_61_113/0.35)]" style={{ animationDelay: "800ms" }}>
                <span className="neon-text text-[15px] font-medium">4. sua empresa?</span>
                <span className="font-mono text-[11px] text-pink">fonte: ?</span>
              </li>
            </ol>
          </div>
          <figcaption className="sr-only">Na resposta, a IA cita três concorrentes e a sua empresa não aparece.</figcaption>
        </figure>
      </div>
    </Section>
  );
}
