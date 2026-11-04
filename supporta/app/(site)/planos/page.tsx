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
    "Planos Landing page (R$49,90), Site (R$99,90) e Site com blog (R$149,90) por mês. Site criado pela IA, hospedagem, manutenção e GEO inclusos, sem custo de criação.",
  path: "/planos",
});

export default function PlanosPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Planos", path: "/planos" }]}
        label="Planos"
        art="camadas"
        title="Quanto custa ter um site profissional?"
        lead="De R$49,90 a R$149,90 por mês, ou no anual com 2 meses grátis, com site, hospedagem, manutenção e GEO inclusos. É uma assinatura: o site fica no ar enquanto ela estiver ativa. Mínimo de 12 meses, que é o que permite não cobrar a criação, e 10% de desconto a partir do 13º mês."
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
      <FinalCta title="Responda algumas escolhas. Veja o seu site pronto em minutos." href="/criar" cta="Criar meu site" />
      <JsonLd data={[serviceSchema(), faqSchema(billingFaq)]} />
    </>
  );
}
