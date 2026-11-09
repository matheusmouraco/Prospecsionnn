import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getPlan, plans, priceLabel, pricing } from "@/lib/plans";
import { segments } from "@/lib/segments";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site";

type Props = { params: Promise<{ plano: string }> };

export function generateStaticParams() {
  return plans.map((p) => ({ plano: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plan = getPlan((await params).plano);
  if (!plan) return {};
  return pageMetadata({
    title: `Contratar o ${plan.name} por ${priceLabel(plan.price)} | Supporta`,
    description: `Contrate o ${plan.name} da Supporta por ${priceLabel(plan.price)}, pago uma vez no cartão. O site fica pronto em até ${pricing.prazoHoras}h depois do pagamento.`,
    path: `/assinar/${plan.id}`,
    noindex: true,
  });
}

export default async function AssinarPage({ params }: Props) {
  const plan = getPlan((await params).plano);
  if (!plan) notFound();

  return (
    <section aria-labelledby="page-title" className="pb-24 pt-8 md:pt-12">
      <div className="container-site">
        <Breadcrumbs items={[{ name: "Preço", path: "/planos" }, { name: `Contratar ${plan.name}`, path: `/assinar/${plan.id}` }]} />
        <div className="mt-4 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <SectionLabel>Contratação</SectionLabel>
            <h1 id="page-title" className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1] tracking-[-0.055em]">
              Contratar o {plan.name}
            </h1>
            <div className="mt-10">
              <CheckoutFlow plan={plan} segments={segments.map((s) => ({ slug: s.slug, tab: s.tab }))} />
            </div>
          </div>
          <aside aria-label="Resumo do pedido" className="lg:sticky lg:top-24 lg:self-start">
            <div className={`rounded-[2rem] p-7 ${plan.highlight ? "glow-card neon-ring text-paper" : "border border-line bg-white"}`}>
              <p className="label-mono">{plan.name}</p>
              <p className="mt-3 text-5xl font-semibold tracking-[-0.06em]">
                {priceLabel(plan.price)}
                <span className="ml-2 text-lg font-normal tracking-normal">uma vez</span>
              </p>
              <p className="mt-2 text-sm">
                Endereço e hospedagem inclusos no 1º ano. A partir do 2º ano, {priceLabel(pricing.endereco)} por ano. Domínio próprio opcional por{" "}
                {priceLabel(pricing.dominio)} por ano. Sem mensalidade e sem multa.
              </p>
              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[15px] leading-snug">
                    <Check aria-hidden strokeWidth={1.75} className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-current/15 pt-5 text-sm">
                O site entra no ar em até {pricing.prazoHoras}h após a confirmação do pagamento. Você tem 7 dias para se arrepender, com reembolso integral.
              </p>
            </div>
            <p className="mt-5 text-sm text-graphite">
              Dúvida antes de contratar?{" "}
              <a href={whatsappUrl(`Oi! Estou contratando o ${plan.name} e tenho uma dúvida.`)} target="_blank" rel="noopener" className="link text-ink" data-track="whatsapp_click" data-track-origin="checkout">
                Fale com a gente no WhatsApp
              </a>
              .
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
