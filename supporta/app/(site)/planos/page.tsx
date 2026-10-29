import type { Metadata } from "next";
import { CompareTable } from "@/components/home/CompareTable";
import { CostComparison } from "@/components/home/CostComparison";
import { FinalCta } from "@/components/home/FinalCta";
import { PlanCards } from "@/components/home/Plans";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { billingFaq } from "@/lib/faqs";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Planos e preços do site por assinatura | Supporta",
  description:
    "Planos Start (R$89), Pro (R$189) e Premium (R$389) por mês. Site, hospedagem, manutenção e GEO inclusos, sem custo de criação.",
  path: "/planos",
});

export default function PlanosPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Planos", path: "/planos" }]}
        label="Planos"
        title="Quanto custa ter um site profissional?"
        lead="De R$89 a R$389 por mês, ou no anual com 2 meses grátis, com site, hospedagem, manutenção e GEO inclusos. É uma assinatura: o site fica no ar enquanto ela estiver ativa. Mínimo de 12 meses, que é o que permite não cobrar a criação, e 10% de desconto a partir do 13º mês."
      />
      <section aria-label="Planos" className="pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container-site">
          <PlanCards headingLevel="h2" />
          <CompareTable open />
        </div>
      </section>
      <CostComparison />
      <Section tone="white" labelledBy="cobranca-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="cobranca-title" label="Cobrança" title="Dúvidas sobre pagamento" lead="Assinatura no cartão de crédito, mensal ou anual, com nota fiscal." />
          <Faq items={billingFaq} />
        </div>
      </Section>
      <FinalCta title="Escolha o plano e tenha o site no ar ainda este mês." href="/assinar/pro" cta="Assinar o Pro" />
      <JsonLd data={[serviceSchema(), faqSchema(billingFaq)]} />
    </>
  );
}
