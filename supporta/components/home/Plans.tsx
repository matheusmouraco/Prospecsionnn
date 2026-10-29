"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AiLogos } from "@/components/ui/AiLogos";
import { buttonClass } from "@/components/ui/Button";
import { annualFreeMonths, billing, plans, priceFor, type Cycle } from "@/lib/plans";
import { formatBRL, formatBRLCents } from "@/lib/site";

/** Chave Mensal / Anual. Fica acima dos cards e muda preços e links de assinatura. */
function CycleSwitch({ cycle, onChange }: { cycle: Cycle; onChange: (c: Cycle) => void }) {
  const opt = (c: Cycle, label: string, extra?: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={cycle === c}
      onClick={() => onChange(c)}
      className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-colors ${cycle === c ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"}`}
    >
      {label}
      {extra ? <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cycle === c ? "bg-pink text-ink" : "bg-pink-light text-ink"}`}>{extra}</span> : null}
    </button>
  );
  return (
    <div className="flex justify-center">
      <div role="radiogroup" aria-label="Forma de pagamento" className="inline-flex rounded-full border border-line bg-white p-1">
        {opt("mensal", "Mensal")}
        {opt("anual", "Anual", `${annualFreeMonths} meses grátis`)}
      </div>
    </div>
  );
}

/** Cards dos planos. O Pro é a camada do meio: preto brilhante com luz neon. */
export function PlanCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const [cycle, setCycle] = useState<Cycle>("mensal");
  const annual = cycle === "anual";
  return (
    <div>
      <CycleSwitch cycle={cycle} onChange={setCycle} />
      <p className="mt-3 text-center text-sm text-graphite">
        {annual
          ? `Uma cobrança por ano: você paga ${billing.annualMonthsCharged} mensalidades e leva 12.`
          : `Uma cobrança por mês. A partir do 13º mês, ${billing.loyaltyDiscountPct}% de desconto.`}
      </p>
      <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3 lg:gap-5">
        {plans.map((plan) => {
          const hot = plan.highlight;
          const charge = priceFor(plan, cycle);
          const href = `/assinar/${plan.id}${annual ? "?ciclo=anual" : ""}`;
          return (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-[2rem] p-7 md:p-8 ${hot ? "glow-card neon-ring text-paper lg:-my-5 lg:py-12" : "border border-line bg-white text-ink"}`}
            >
              {hot ? (
                <span className="neon-glow absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-pink px-4 py-1.5 text-sm font-semibold text-ink">
                  <Sparkles aria-hidden strokeWidth={2} className="h-3.5 w-3.5" />
                  Recomendado
                </span>
              ) : null}
              <H className="text-2xl tracking-[-0.04em]">{plan.name}</H>
              <p className={`mt-2 text-[15px] ${hot ? "text-mist" : "text-graphite"}`}>{plan.pitch}</p>
              <p className="mt-7 flex items-baseline gap-1">
                <span className={`font-semibold leading-none tracking-[-0.06em] ${annual ? "text-[48px]" : "text-[60px]"} ${hot ? "neon-text" : ""}`}>
                  {annual ? formatBRL(charge) : `R$${charge}`}
                </span>
                <span className={hot ? "text-mist" : "text-graphite"}>{annual ? "/ano" : "/mês"}</span>
              </p>
              <p className={`mt-2 text-sm ${hot ? "text-mist" : "text-graphite"}`}>
                {annual ? (
                  <>
                    Equivale a {formatBRLCents(charge / 12)}/mês ·{" "}
                    <span className={hot ? "text-pink" : "font-medium text-ink"}>economia de {formatBRL(plan.price * annualFreeMonths)}</span>
                  </>
                ) : (
                  <>Cerca de {formatBRLCents(plan.price / 30)} por dia · R$0 de criação</>
                )}
              </p>
              <div className={`my-7 h-px ${hot ? "bg-line-dark" : "bg-line"}`} />
              {plan.includes ? <p className={`mb-4 text-sm font-semibold ${hot ? "text-paper" : "text-ink"}`}>{plan.includes}</p> : null}
              <ul className="flex-1 space-y-3.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[15px] leading-snug">
                    <span aria-hidden className={`mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${hot ? "bg-pink text-ink shadow-[0_0_12px_rgb(255_61_113/0.7)]" : "bg-pink-light text-pink"}`}>
                      <Check strokeWidth={3} className="h-3 w-3" />
                    </span>
                    <span className={hot ? "text-paper/90" : ""}>{f}</span>
                  </li>
                ))}
              </ul>
              {hot ? (
                <div className="mt-7 rounded-2xl border border-line-dark bg-card-dark/80 p-4">
                  <p className="label-mono text-pink">Ideal para</p>
                  <p className="mt-2 text-[15px] leading-snug text-paper/90">Quem depende de clientes da região: clínicas, escritórios, restaurantes e prestadores de serviço.</p>
                </div>
              ) : null}
              {plan.id === "premium" ? (
                <div className="mt-6 rounded-2xl bg-paper p-4">
                  <p className="label-mono text-graphite">Monitoramento mensal em</p>
                  <AiLogos only={["chatgpt", "gemini", "perplexity"]} size={16} small className="mt-3 flex-nowrap gap-x-3" />
                </div>
              ) : null}
              <Link
                href={href}
                className={buttonClass(hot ? "neon" : "outline", "lg", "mt-8 w-full")}
                data-track="plan_click"
                data-track-plan={plan.id}
                data-track-cycle={cycle}
                aria-label={`Assinar o plano ${plan.name} ${annual ? `anual por ${formatBRL(charge)} por ano` : `por R$${charge} por mês`}`}
              >
                Assinar o {plan.name}
              </Link>
              <p className={`mt-3 text-center text-[13px] ${hot ? "text-mist" : "text-graphite"}`}>
                {annual ? "Cartão, 1 vez por ano · mínimo de 12 meses" : "Cartão, todo mês · mínimo de 12 meses"}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
