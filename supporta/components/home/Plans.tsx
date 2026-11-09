import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { customProject, priceRows, pricing, site99 } from "@/lib/plans";

const reais = (v: number) => `R$${v.toLocaleString("pt-BR")}`;

/** Preço único: o que está incluso à esquerda e "tudo o que você paga" num card escuro à direita. */
export function PlanCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div>
      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_1.15fr] lg:gap-5">
        <article className="flex flex-col rounded-[2rem] border border-line bg-white p-7 md:p-9">
          <H className="text-2xl tracking-[-0.04em]">{site99.name}</H>
          <p className="mt-2 text-[15px] text-graphite">{site99.pitch}</p>
          <p className="mt-7 flex items-baseline gap-2">
            <span className="text-[64px] font-semibold leading-none tracking-[-0.06em]">{reais(pricing.site)}</span>
            <span className="text-graphite">pago uma vez</span>
          </p>
          <div className="my-7 h-px bg-line" />
          <ul className="flex-1 space-y-3.5">
            {site99.features.map((f) => (
              <li key={f} className="flex gap-3 text-[15px] leading-snug">
                <span aria-hidden className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-light text-pink">
                  <Check strokeWidth={3} className="h-3 w-3" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/criar" className={buttonClass("neon", "lg", "mt-8 w-full")} data-track="plan_click" data-track-plan={site99.id}>
            Criar meu site <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-center text-[13px] text-graphite">Você vê a prévia antes de pagar.</p>
        </article>

        <article aria-labelledby="tudo-que-paga" className="glow-card neon-ring flex flex-col rounded-[2rem] p-7 text-paper md:p-9">
          <p className="label-mono text-pink">Resumindo</p>
          <H id="tudo-que-paga" className="mt-3 text-[clamp(2rem,4vw,2.75rem)] leading-[1] tracking-[-0.05em]">
            Tudo o que você <span className="neon-text">paga.</span>
          </H>
          <dl className="mt-8 flex-1 divide-y divide-line-dark border-y border-line-dark">
            {priceRows.map((r, i) => (
              <div key={r.item} className="flex items-center justify-between gap-4 py-5">
                <dt>
                  <span className="flex flex-wrap items-center gap-2 text-lg font-semibold tracking-[-0.02em]">
                    {r.item}
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] ${r.obrigatorio ? "bg-pink text-ink" : "border border-line-dark text-mist"}`}>{r.obrigatorio ? "Obrigatório" : "Opcional"}</span>
                  </span>
                  <span className="mt-1 block text-[15px] text-mist">{r.detail}</span>
                </dt>
                <dd className="shrink-0 text-right">
                  <span className={`text-3xl font-semibold tracking-[-0.04em] md:text-4xl ${i === 0 ? "neon-text" : ""}`}>{reais(r.value)}</span>
                  {r.per ? <span className="text-[15px] text-mist">{r.per}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm text-mist">Obrigatório é só o site e a renovação do endereço. Sem mensalidade e sem fidelidade: a renovação pode ser cancelada quando quiser.</p>
        </article>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-line bg-white p-6 text-center md:flex-row md:p-8 md:text-left">
        <div>
          <p className="text-xl font-semibold tracking-[-0.03em]">{customProject.label}</p>
          <p className="mt-1 text-[15px] text-graphite">Sistema, loja, integração ou um site fora desse formato: o Matheus monta um projeto só para você.</p>
        </div>
        <a
          href={`https://wa.me/${customProject.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(customProject.message)}`}
          target="_blank"
          rel="noopener"
          className={buttonClass("primary", "lg", "shrink-0")}
          data-track="whatsapp_click"
          data-track-origin="planos-personalizado"
        >
          {customProject.cta}
        </a>
      </div>
    </div>
  );
}
