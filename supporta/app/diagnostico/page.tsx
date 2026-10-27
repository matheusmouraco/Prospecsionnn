import type { Metadata } from "next";
import { DiagnosticTool } from "@/components/diagnostico/DiagnosticTool";
import { FinalCta } from "@/components/home/FinalCta";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import type { Faq as FaqItem } from "@/lib/faqs";
import { faqSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Diagnóstico grátis do seu site: nota e IAs | Supporta",
  description:
    "Teste grátis a nota do seu site no celular pelo PageSpeed do Google e veja se ele está pronto pras IAs: llms.txt, robots.txt e dados estruturados.",
  path: "/diagnostico",
});

const faq: FaqItem[] = [
  {
    q: "De onde vem a nota?",
    a: "Do PageSpeed Insights, a ferramenta oficial do Google, na versão para celular. É a mesma nota que você veria no site do Google.",
  },
  {
    q: "Por que a nota muda a cada teste?",
    a: "Porque o teste depende da rede e do servidor naquele momento. Variações de alguns pontos são normais. Diferenças grandes indicam instabilidade na hospedagem.",
  },
  {
    q: "Qual é uma boa nota?",
    a: "De 90 a 100 é bom (verde), de 50 a 89 precisa melhorar (laranja) e abaixo de 50 é ruim (vermelho). Os sites da Supporta são feitos para ficar com 90 ou mais no celular.",
  },
  {
    q: "O que vocês fazem com o meu e-mail?",
    a: "Enviamos o relatório e podemos entrar em contato para falar do resultado. Você pode pedir para sair a qualquer momento.",
  },
];

export default function DiagnosticoPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Diagnóstico", path: "/diagnostico" }]}
        label="Ferramenta grátis"
        title="Qual a nota do seu site no Google?"
        lead="Digite o endereço e o seu e-mail. Em menos de um minuto você vê as 4 notas do PageSpeed no celular, se o site está pronto pras IAs e 3 recomendações práticas."
      />
      <section aria-label="Ferramenta de diagnóstico" className="pb-20 md:pb-28">
        <div className="container-site max-w-5xl">
          <DiagnosticTool />
        </div>
      </section>
      <Section tone="white" labelledBy="diag-faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="diag-faq" label="Dúvidas" title="Perguntas sobre o diagnóstico" />
          <Faq items={faq} />
        </div>
      </Section>
      <FinalCta />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Diagnóstico grátis de site Supporta",
            url: absoluteUrl("/diagnostico"),
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
          },
          faqSchema(faq),
        ]}
      />
    </>
  );
}
