import { Check } from "lucide-react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { plans } from "@/lib/plans";

/** Cards dos planos. O Pro é "a camada do meio": fundo rosa. */
export function PlanCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-3">
      {plans.map((plan) => {
        const pink = plan.highlight;
        return (
          <article
            key={plan.id}
            className={`flex flex-col rounded-[2rem] p-7 md:p-8 ${pink ? "on-pink bg-pink text-ink lg:-my-4 lg:py-12" : "border border-line bg-white text-ink"}`}
          >
            <div className="flex items-center justify-between">
              <H className="text-2xl tracking-[-0.04em]">{plan.name}</H>
              {pink ? <span className="label-mono rounded-full bg-ink px-3 py-1.5 text-paper">Recomendado</span> : null}
            </div>
            <p className={`mt-2 text-[15px] ${pink ? "text-ink" : "text-graphite"}`}>{plan.pitch}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-[56px] font-semibold leading-none tracking-[-0.06em]">R${plan.price}</span>
              <span className={pink ? "text-ink" : "text-graphite"}>/mês</span>
            </p>
            <ul className="mt-7 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] leading-snug">
                  <Check aria-hidden strokeWidth={1.75} className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${pink ? "text-ink" : "text-pink"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/assinar/${plan.id}`}
              className={buttonClass(pink ? "primary" : "outline", "lg", "mt-8 w-full")}
              data-track="plan_click"
              data-track-plan={plan.id}
              aria-label={`Assinar o plano ${plan.name} por R$${plan.price} por mês`}
            >
              Assinar o {plan.name}
            </Link>
            <p className={`mt-3 text-center text-[13px] ${pink ? "text-ink" : "text-graphite"}`}>Cartão de crédito · fidelidade de 12 meses</p>
          </article>
        );
      })}
    </div>
  );
}
