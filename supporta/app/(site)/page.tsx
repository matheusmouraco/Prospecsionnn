import type { Metadata } from "next";
import { AiProblem } from "@/components/home/AiProblem";
import { Cases } from "@/components/home/Cases";
import { CompareTable } from "@/components/home/CompareTable";
import { CostComparison } from "@/components/home/CostComparison";
import { DiagnosticCta } from "@/components/home/DiagnosticCta";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Layers } from "@/components/home/Layers";
import { PlanCards } from "@/components/home/Plans";
import { ProofStrip } from "@/components/home/ProofStrip";
import { TemplatesTabs } from "@/components/home/TemplatesTabs";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section, SectionHeading } from "@/components/ui/Section";
import { homeFaq } from "@/lib/faqs";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { segments } from "@/lib/segments";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Supporta | Site profissional por assinatura mensal",
  description:
    "Site profissional, hospedagem, manutenção e GEO numa assinatura só. A partir de R$89/mês, sem custo de criação. Pronto pro Google e pras IAs.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <AiProblem />
      <Layers />

      <Section id="modelos" tone="white" labelledBy="modelos-title">
        <SectionHeading
          id="modelos-title"
          label="Modelos por segmento"
          title="Como fica o site da minha empresa?"
          lead="Escolha o segmento e veja o modelo no computador e no celular. A gente aplica a sua marca, os seus textos e as suas fotos."
        />
        <div className="mt-12">
          <TemplatesTabs segments={segments} />
        </div>
      </Section>

      <HowItWorks />

      <Section id="planos" labelledBy="planos-title">
        <SectionHeading
          id="planos-title"
          label="Planos"
          title="Quanto custa o site por assinatura?"
          lead="De R$89 a R$389 por mês, sem custo de criação. Pagamento recorrente no cartão e fidelidade de 12 meses, que é o que permite não cobrar a criação do site."
        />
        <div className="mt-12 md:mt-16">
          <PlanCards />
        </div>
        <CompareTable />
      </Section>

      <Cases />
      <CostComparison />
      <DiagnosticCta />

      <Section id="duvidas" tone="white" labelledBy="duvidas-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="duvidas-title" label="Dúvidas" title="Perguntas frequentes" lead="Não achou o que procurava? Chame no WhatsApp, a resposta vem de gente." />
          <Faq items={homeFaq} />
        </div>
      </Section>

      <FinalCta />
      <JsonLd data={[serviceSchema(), faqSchema(homeFaq)]} />
    </>
  );
}
