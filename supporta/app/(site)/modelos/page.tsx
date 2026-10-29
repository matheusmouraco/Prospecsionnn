import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/home/FinalCta";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { VitrineGallery } from "@/components/modelos/VitrineGallery";
import { Section, SectionHeading } from "@/components/ui/Section";
import type { Faq as FaqItem } from "@/lib/faqs";
import { faqSchema } from "@/lib/schema";
import { segments } from "@/lib/segments";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Modelos de site por segmento | Supporta",
  description:
    "Modelos de site para arquitetos, restaurantes, dentistas, advogados, clínicas e prestadores de serviço. Com a sua marca, a partir de R$89/mês.",
  path: "/modelos",
});

const faq: FaqItem[] = [
  {
    q: "O site vai ficar igual ao de outras empresas?",
    a: "Não. O modelo é o ponto de partida. A gente aplica o seu logo, as suas cores, os seus textos e as suas fotos. No Pro o design é personalizado a partir do modelo e no Premium o site é sob medida.",
  },
  {
    q: "Meu segmento não está na lista. E agora?",
    a: "O modelo de Serviços se adapta a quase todo negócio local. Se precisar de algo diferente, chame no WhatsApp que a gente indica o melhor caminho.",
  },
  {
    q: "Posso trocar de modelo depois?",
    a: "Pode. Troca de modelo conta como ajuste maior e é combinada com você pelo WhatsApp, sem custo extra dentro da assinatura.",
  },
];

export default function ModelosPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Modelos", path: "/modelos" }]}
        label="Modelos"
        art="reguas"
        title="Qual modelo de site combina com o seu negócio?"
        lead="Cada modelo foi desenhado para o que o cliente daquele segmento procura primeiro. Escolha o seu e a gente aplica a sua marca."
      />
      <section id="vitrine" aria-label="Galeria de modelos" className="pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container-site">
          <VitrineGallery />
        </div>
      </section>
      <Section tone="white" labelledBy="segmentos-title">
        <SectionHeading
          id="segmentos-title"
          label="Por segmento"
          title="O que o site do seu segmento precisa ter"
          lead="Para cada área, explicamos o que o cliente procura primeiro e como o modelo responde a isso."
          align="center"
        />
        <ul className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
          {segments.map((s) => (
            <li key={s.slug}>
              <Link href={`/modelos/${s.slug}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4 transition-colors hover:border-pink">
                <span>
                  <span className="label-mono block text-graphite">{s.tab}</span>
                  <span className="mt-1 block text-lg font-semibold tracking-[-0.02em]">{s.title}</span>
                </span>
                <ArrowRight aria-hidden strokeWidth={1.75} className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section labelledBy="modelos-faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="modelos-faq" label="Dúvidas" title="Perguntas sobre os modelos" />
          <Faq items={faq} />
        </div>
      </Section>
      <FinalCta />
      <JsonLd data={faqSchema(faq)} />
    </>
  );
}
