import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { formatBRL } from "@/lib/site";

// Exemplo de mercado para comparação. Valores de site tradicional variam.
const traditional = [
  { label: "Criação do site (entrada)", value: 5000 },
  { label: "Hospedagem (R$40/mês × 12)", value: 480 },
  { label: "Domínio .com.br (1 ano)", value: 40 },
  { label: "Ajustes avulsos (6 × R$150)", value: 900 },
];
const traditionalTotal = traditional.reduce((sum, i) => sum + i.value, 0);
const supporta = [
  { label: "Plano Start (R$89/mês × 12)", value: 1068 },
  { label: "Criação do site", value: 0 },
  { label: "Hospedagem, SSL e manutenção", value: 0 },
  { label: "Domínio .com.br no 1º ano", value: 0 },
  { label: "1 ajuste por mês", value: 0 },
];
const supportaTotal = 1068;

export function CostComparison() {
  const pct = (supportaTotal / traditionalTotal) * 100;
  return (
    <Section labelledBy="conta-title">
      <SectionHeading
        id="conta-title"
        label="Faça a conta · 12 meses"
        title="Quanto custa um site em 12 meses?"
        lead={`Num site tradicional, cerca de ${formatBRL(traditionalTotal)} no primeiro ano. No Supporta Start, ${formatBRL(supportaTotal)}, com tudo incluso.`}
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-line bg-white p-7 md:p-8">
          <p className="label-mono text-graphite">Site tradicional</p>
          <p className="mt-3 text-5xl font-semibold tracking-[-0.06em]">{formatBRL(traditionalTotal)}</p>
          <div className="mt-6 h-4 w-full rounded-full bg-ink" aria-hidden />
          <ul className="mt-6 divide-y divide-line">
            {traditional.map((i) => (
              <li key={i.label} className="flex justify-between gap-4 py-3 text-[15px]">
                <span className="text-graphite">{i.label}</span>
                <span className="font-medium">{formatBRL(i.value)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[2rem] border border-line bg-white p-7 md:p-8">
          <p className="label-mono text-graphite">Supporta Start</p>
          <p className="mt-3 text-5xl font-semibold tracking-[-0.06em]">{formatBRL(supportaTotal)}</p>
          <div className="mt-6 h-4 w-full rounded-full bg-line" aria-hidden>
            <div className="neon-bar h-4 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-6 divide-y divide-line">
            {supporta.map((i) => (
              <li key={i.label} className="flex justify-between gap-4 py-3 text-[15px]">
                <span className="text-graphite">{i.label}</span>
                <span className="font-medium">{i.value ? formatBRL(i.value) : "Incluso"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-graphite">Valores de site tradicional variam. Exemplo com valores comuns de mercado.</p>
        <Button href="/assinar/start" size="lg" data-track="plan_click" data-track-plan="start" data-track-origin="faca-a-conta">
          Assinar o Start <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
        </Button>
      </div>
    </Section>
  );
}
