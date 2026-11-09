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
import { priceLabel, pricing } from "@/lib/plans";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Preço do site: R$${pricing.site}, pago uma vez | Supporta`,
  description:
    `Site profissional com até 5 páginas por ${priceLabel(pricing.site)}, pago uma vez e pronto em até ${pricing.prazoHoras}h. Endereço e hospedagem inclusos no 1º ano; depois, ${priceLabel(pricing.endereco)} por ano. Domínio próprio opcional.`,
  path: "/planos",
});

export default function PlanosPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Preço", path: "/planos" }]}
        label="Preço"
        art="camadas"
        title="Quanto custa ter um site profissional?"
        lead={`${priceLabel(pricing.site)}, pago uma vez, e o site fica pronto em até ${pricing.prazoHoras}h. O endereço nome.supporta.com.br, com hospedagem e SSL, vem incluso no 1º ano; a partir do 2º, renova por ${priceLabel(pricing.endereco)} por ano. Domínio próprio é opcional, por ${priceLabel(pricing.dominio)} por ano. Sem mensalidade, sem prazo mínimo e sem multa.`}
      />
      <section aria-label="Preço" className="pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container-site">
          <PlanCards headingLevel="h2" />
          <CompareTable open />
        </div>
      </section>
      <CostComparison />
      <Section tone="white" labelledBy="cobranca-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="cobranca-title" label="Pagamento" title="Dúvidas sobre pagamento" lead="Pagamento no cartão de crédito, com nota fiscal a cada cobrança e 7 dias para se arrepender." />
          <Faq items={billingFaq} />
        </div>
      </Section>
      <FinalCta title="Chame no WhatsApp. Veja o seu site pronto em minutos." cta="Criar meu site" />
      <JsonLd data={[serviceSchema(), faqSchema(billingFaq)]} />
    </>
  );
}
