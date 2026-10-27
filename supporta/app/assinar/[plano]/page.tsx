import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getPlan, plans } from "@/lib/plans";
import { segments } from "@/lib/segments";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappUrl } from "@/lib/site";

type Props = { params: Promise<{ plano: string }> };

export function generateStaticParams() {
  return plans.map((p) => ({ plano: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plan = getPlan((await params).plano);
  if (!plan) return {};
  return pageMetadata({
    title: `Assinar o plano ${plan.name} por R$${plan.price}/mês | Supporta`,
    description: `Assine o plano ${plan.name} da Supporta por R$${plan.price}/mês no cartão, sem custo de criação. Em 3 etapas: dados, briefing e pagamento.`,
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
        <Breadcrumbs items={[{ name: "Planos", path: "/planos" }, { name: `Assinar ${plan.name}`, path: `/assinar/${plan.id}` }]} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <SectionLabel>Assinatura</SectionLabel>
            <h1 id="page-title" className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1] tracking-[-0.055em]">
              Assinar o plano {plan.name}
            </h1>
            <div className="mt-10">
              <CheckoutFlow plan={plan} segments={segments.map((s) => ({ slug: s.slug, tab: s.tab }))} />
            </div>
          </div>
          <aside aria-label="Resumo do plano" className="lg:sticky lg:top-24 lg:self-start">
            <div className={`rounded-[2rem] p-7 ${plan.highlight ? "on-pink bg-pink" : "border border-line bg-white"}`}>
              <p className="label-mono">Plano {plan.name}</p>
              <p className="mt-3 text-5xl font-semibold tracking-[-0.06em]">
                R${plan.price}
                <span className="text-lg font-normal">/mês</span>
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
                Site pronto em até {site.deliveryDays[plan.id]} dias úteis depois do briefing completo.
              </p>
            </div>
            <p className="mt-5 text-sm text-graphite">
              Dúvida antes de assinar?{" "}
              <a href={whatsappUrl(`Oi! Estou assinando o plano ${plan.name} e tenho uma dúvida.`)} target="_blank" rel="noopener" className="link text-ink" data-track="whatsapp_click" data-track-origin="checkout">
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
