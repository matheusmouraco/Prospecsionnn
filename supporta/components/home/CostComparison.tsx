import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { pricing, site99 } from "@/lib/plans";
import { formatBRL, formatBRLCents } from "@/lib/site";
import { botWhatsappUrl } from "@/lib/site";

// Exemplo de mercado para comparação. Valores de site tradicional variam.
const traditional = [
  { label: "Criação do site (entrada)", value: 5000 },
  { label: "Hospedagem (R$40/mês × 12)", value: 480 },
  { label: "Domínio .com.br (1 ano)", value: 40 },
  { label: "Ajustes avulsos (6 × R$150)", value: 900 },
];
const traditionalTotal = traditional.reduce((sum, i) => sum + i.value, 0);
const supportaTotal = pricing.site;
const supporta = [
  { label: `${site99.name}, pago uma vez`, value: pricing.site },
  { label: "Endereço .supporta.com.br no 1º ano", value: 0 },
  { label: "Hospedagem e SSL no 1º ano", value: 0 },
  { label: `Alterações nos primeiros ${pricing.diasAlteracaoGratis} dias`, value: 0 },
  { label: "GEO e dados estruturados", value: 0 },
];

export function CostComparison() {
  const pct = (supportaTotal / traditionalTotal) * 100;
  return (
    <Section labelledBy="conta-title">
      <SectionHeading
        id="conta-title"
        label="Faça a conta · 1º ano"
        title="Quanto custa um site no primeiro ano?"
        lead={`Num site tradicional, cerca de ${formatBRL(traditionalTotal)} no primeiro ano. Na Supporta, ${formatBRLCents(supportaTotal)} pagos uma vez, e a partir do 2º ano só ${formatBRLCents(pricing.endereco)} por ano.`}
        align="center"
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
          <p className="label-mono text-graphite">Supporta · 1º ano</p>
          <p className="mt-3 text-5xl font-semibold tracking-[-0.06em]">{formatBRLCents(supportaTotal)}</p>
          <div className="mt-6 h-4 w-full rounded-full bg-line" aria-hidden>
            <div className="neon-bar h-4 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-6 divide-y divide-line">
            {supporta.map((i) => (
              <li key={i.label} className="flex justify-between gap-4 py-3 text-[15px]">
                <span className="text-graphite">{i.label}</span>
                <span className="font-medium">{i.value ? formatBRLCents(i.value) : "Incluso"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-graphite">A partir do 2º ano: {formatBRLCents(pricing.endereco)} por ano de endereço e hospedagem.</p>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Button href={botWhatsappUrl()} size="lg" data-track="plan_click" data-track-plan={site99.id} data-track-origin="faca-a-conta">
          Criar meu site <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
        </Button>
      </div>
    </Section>
  );
}
