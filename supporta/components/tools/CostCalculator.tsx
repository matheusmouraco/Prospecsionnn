"use client";

import { useId, useState } from "react";
import { plans } from "@/lib/plans";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const kinds = [
  { id: "start", label: "Uma página", creation: 3000 },
  { id: "pro", label: "Até 5 páginas", creation: 6000 },
  { id: "premium", label: "Sob medida", creation: 12000 },
] as const;

function NumberField({ label, value, onChange, step = 10, suffix }: { label: string; value: number; onChange: (n: number) => void; step?: number; suffix?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-medium">{label}</label>
      <div className="mt-2 flex items-center gap-2">
        <input id={id} type="number" min={0} step={step} inputMode="numeric" value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} className="h-12 w-full rounded-2xl border border-line bg-white px-4 focus:border-ink focus:outline-none" />
        {suffix ? <span className="shrink-0 text-sm text-graphite">{suffix}</span> : null}
      </div>
    </div>
  );
}

/** Calculadora do custo total de um site em 1 a 3 anos. Os valores tradicionais são editáveis (variam muito). */
export function CostCalculator() {
  const [kind, setKind] = useState<(typeof kinds)[number]["id"]>("start");
  const [creation, setCreation] = useState(3000);
  const [hosting, setHosting] = useState(40);
  const [domain, setDomain] = useState(40);
  const [adjustments, setAdjustments] = useState(6);
  const [adjustmentPrice, setAdjustmentPrice] = useState(150);
  const [years, setYears] = useState(1);

  const plan = plans.find((p) => p.id === kind)!;
  const months = years * 12;
  const traditional = creation + hosting * months + domain * years + adjustments * adjustmentPrice * years;
  // Domínio do 1º ano incluso na Supporta; a partir do 2º ano, a renovação depende dos Termos.
  const supporta = plan.price * months;
  const diff = traditional - supporta;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
        <fieldset>
          <legend className="text-[15px] font-medium">Tipo de site</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {kinds.map((k) => (
              <label key={k.id} className={`inline-flex h-11 cursor-pointer items-center rounded-full border px-5 text-[15px] has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink ${kind === k.id ? "border-ink bg-ink text-paper" : "border-line"}`}>
                <input type="radio" name="tipo" className="sr-only" checked={kind === k.id} onChange={() => { setKind(k.id); setCreation(k.creation); }} />
                {k.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <NumberField label="Criação no modelo tradicional" value={creation} onChange={setCreation} step={500} suffix="R$" />
          <NumberField label="Hospedagem por mês" value={hosting} onChange={setHosting} suffix="R$" />
          <NumberField label="Domínio por ano" value={domain} onChange={setDomain} suffix="R$" />
          <NumberField label="Ajustes por ano" value={adjustments} onChange={setAdjustments} step={1} />
          <NumberField label="Preço de cada ajuste" value={adjustmentPrice} onChange={setAdjustmentPrice} suffix="R$" />
          <div>
            <label htmlFor="anos" className="text-[15px] font-medium">Período</label>
            <select id="anos" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-line bg-white px-4">
              <option value={1}>1 ano</option>
              <option value={2}>2 anos</option>
              <option value={3}>3 anos</option>
            </select>
          </div>
        </div>
        <p className="mt-5 text-sm text-graphite">Valores de exemplo. Troque pelos orçamentos que você recebeu.</p>
      </div>
      <div aria-live="polite" className="flex flex-col gap-4">
        <div className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
          <p className="label-mono text-graphite">Modelo tradicional · {years} {years === 1 ? "ano" : "anos"}</p>
          <p className="mt-2 text-5xl font-semibold tracking-[-0.06em]">{brl(traditional)}</p>
        </div>
        <div className="on-pink rounded-[2rem] bg-pink p-6 md:p-8">
          <p className="label-mono">Supporta {plan.name} · {years} {years === 1 ? "ano" : "anos"}</p>
          <p className="mt-2 text-5xl font-semibold tracking-[-0.06em]">{brl(supporta)}</p>
          <p className="mt-2 text-[15px]">R${plan.price}/mês, com criação, hospedagem, ajustes e GEO inclusos.</p>
        </div>
        <p className="px-2 text-[15px] text-graphite">
          {diff > 0 ? `Diferença de ${brl(diff)} no período, a favor da assinatura.` : `Neste cenário o modelo tradicional sai ${brl(-diff)} mais barato no período. Ele compensa quando o site quase nunca muda.`}
        </p>
      </div>
    </div>
  );
}
