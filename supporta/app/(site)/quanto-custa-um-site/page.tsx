import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { CostCalculator } from "@/components/tools/CostCalculator";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import type { Faq as FaqItem } from "@/lib/faqs";
import { articleSchema, faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Quanto custa um site para empresa? Calculadora",
  description: "Quanto custa um site profissional: criação, hospedagem, domínio e manutenção. Use a calculadora e compare com o site por assinatura.",
  path: "/quanto-custa-um-site",
});

const factors = [
  { title: "Criação", text: "É o valor para desenhar e montar o site. Varia com o número de páginas, se o design é de modelo ou sob medida e quem escreve os textos." },
  { title: "Hospedagem", text: "O servidor onde o site fica no ar. Planos baratos costumam deixar o site lento, o que pesa no Google." },
  { title: "Domínio", text: "O endereço .com.br, renovado todo ano no Registro.br." },
  { title: "Manutenção e ajustes", text: "Atualizar textos, fotos, preços e horários, além de segurança e atualizações técnicas. É o custo que mais gente esquece." },
  { title: "Conteúdo para o Google e as IAs", text: "Artigos, perguntas frequentes e dados estruturados. Sem isso, o site existe, mas pouca gente encontra." },
];

const faq: FaqItem[] = [
  { q: "Quanto custa um site simples para empresa?", a: "No modelo tradicional, um site de uma página costuma custar alguns milhares de reais de criação, mais hospedagem e domínio. Na Supporta, o plano Start custa R$89 por mês, sem custo de criação." },
  { q: "Por que alguns orçamentos são tão diferentes?", a: "Porque incluem coisas diferentes: alguns entregam só o design, outros incluem textos, SEO, hospedagem e ajustes. Compare sempre o que está incluso, não só o valor." },
  { q: "O que é mais barato a longo prazo?", a: "Depende de quanto o site muda. Se ele quase nunca precisa de ajuste, o modelo tradicional pode sair mais barato depois de alguns anos. Se você atualiza com frequência e quer aparecer no Google e nas IAs, a assinatura costuma compensar." },
];

export default function QuantoCustaPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Quanto custa um site", path: "/quanto-custa-um-site" }]}
        label="Calculadora"
        title="Quanto custa um site para a minha empresa?"
        lead="O custo real de um site soma criação, hospedagem, domínio e manutenção. Coloque os valores que você recebeu e veja o total em 1, 2 ou 3 anos."
      />
      <section aria-label="Calculadora de custo" className="pb-20 md:pb-28">
        <div className="container-site">
          <CostCalculator />
        </div>
      </section>
      <Section tone="white" labelledBy="custo-fatores">
        <SectionHeading id="custo-fatores" label="O que entra na conta" title="Do que depende o preço de um site?" lead="De cinco itens. O orçamento barato quase sempre deixa um deles de fora." />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {factors.map((f, i) => (
            <li key={f.title} className="rounded-3xl border border-line bg-paper p-7">
              <span className="font-mono text-sm text-graphite">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-2xl tracking-[-0.04em]">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-graphite">{f.text}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section labelledBy="custo-faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="custo-faq" label="Dúvidas" title="Perguntas sobre preço de site" />
          <Faq items={faq} />
        </div>
      </Section>
      <FinalCta />
      <JsonLd data={[articleSchema({ title: "Quanto custa um site para empresa", description: "Custos de criação, hospedagem, domínio e manutenção, com calculadora.", path: "/quanto-custa-um-site", date: "2026-10-27" }), faqSchema(faq)]} />
    </>
  );
}
