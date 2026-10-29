import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/home/FinalCta";
import { BrowserFrame } from "@/components/mockups/Frames";
import { SiteMock } from "@/components/mockups/SiteMock";
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
      <section aria-label="Galeria de modelos" className="pb-20 pt-12 md:pb-28 md:pt-16">
        <ul className="container-site grid gap-6 md:grid-cols-2">
          {segments.map((s) => (
            <li key={s.slug}>
              <Link href={`/modelos/${s.slug}`} className="group block rounded-[2rem] border border-line bg-white p-4 transition-colors hover:border-ink md:p-5">
                <BrowserFrame url={`${s.slug}.supporta.com.br`}>
                  <SiteMock mock={s.mock} variant="desktop" />
                </BrowserFrame>
                <div className="flex items-center justify-between gap-4 px-2 pb-2 pt-6">
                  <div>
                    <p className="label-mono text-graphite">{s.tab}</p>
                    <h2 className="mt-2 text-2xl tracking-[-0.04em]">{s.title}</h2>
                  </div>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-colors group-hover:bg-ink group-hover:text-paper">
                    <ArrowRight aria-hidden strokeWidth={1.75} className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Section id="vitrine" tone="white" labelledBy="vitrine-title">
        <SectionHeading
          id="vitrine-title"
          label="Vitrine"
          title="Veja os modelos funcionando"
          lead="Abra qualquer modelo e navegue como se fosse o seu site. A gente aplica a sua marca, os seus textos e as suas fotos no estilo que você escolher."
          align="center"
        />
        <div className="mt-12">
          <VitrineGallery />
        </div>
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
