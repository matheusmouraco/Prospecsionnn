import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { AiLogos } from "@/components/ui/AiLogos";
import { buttonClass } from "@/components/ui/Button";
import { plans } from "@/lib/plans";

const perDay = (price: number) => (price / 30).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Cards dos planos. O Pro é a camada do meio: preto brilhante com luz neon. */
export function PlanCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-3 lg:gap-5">
      {plans.map((plan) => {
        const hot = plan.highlight;
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
              <span className={`text-[60px] font-semibold leading-none tracking-[-0.06em] ${hot ? "neon-text" : ""}`}>R${plan.price}</span>
              <span className={hot ? "text-mist" : "text-graphite"}>/mês</span>
            </p>
            <p className={`mt-2 text-sm ${hot ? "text-mist" : "text-graphite"}`}>
              Cerca de {perDay(plan.price)} por dia · R$0 de criação
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
              href={`/assinar/${plan.id}`}
              className={buttonClass(hot ? "neon" : "outline", "lg", "mt-8 w-full")}
              data-track="plan_click"
              data-track-plan={plan.id}
              aria-label={`Assinar o plano ${plan.name} por R$${plan.price} por mês`}
            >
              Assinar o {plan.name}
            </Link>
            <p className={`mt-3 text-center text-[13px] ${hot ? "text-mist" : "text-graphite"}`}>Assinatura no cartão · mínimo de 12 meses</p>
          </article>
        );
      })}
    </div>
  );
}
