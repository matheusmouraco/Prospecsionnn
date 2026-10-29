import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/home/FinalCta";
import { PlanCards } from "@/components/home/Plans";
import { BrowserFrame, PhoneFrame } from "@/components/mockups/Frames";
import { segmentModel, vitrineMobileThumb, vitrineThumb, vitrineUrl } from "@/lib/vitrine";
import { Button } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { getSegment, segments } from "@/lib/segments";
import { posts } from "@/lib/blog";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ segmento: string }> };

export function generateStaticParams() {
  return segments.map((s) => ({ segmento: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seg = getSegment((await params).segmento);
  if (!seg) return {};
  return pageMetadata({ title: `${seg.metaTitle} | Supporta`, description: seg.metaDescription, path: `/modelos/${seg.slug}` });
}

export default async function SegmentPage({ params }: Props) {
  const seg = getSegment((await params).segmento);
  if (!seg) notFound();

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Modelos", path: "/modelos" },
          { name: seg.tab, path: `/modelos/${seg.slug}` },
        ]}
        label={`Modelo ${seg.tab}`}
        title={seg.title}
        lead={seg.intro}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={`/assinar/start?modelo=${seg.slug}&tema=${segmentModel[seg.slug] ?? ""}`} size="lg" variant="neon" data-track="plan_click" data-track-plan="start" data-track-origin={`segmento:${seg.slug}`}>
            Quero esse modelo <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
          </Button>
          <Button href={vitrineUrl(segmentModel[seg.slug])} size="lg" variant="outline" target="_blank" data-track="demo_open" data-track-origin={segmentModel[seg.slug]}>
            Abrir o modelo
          </Button>
        </div>
      </PageHero>

      <section aria-label="Prévia do modelo" className="pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container-site">
          <div className="relative pb-12 pr-[16%]">
            <BrowserFrame url={`${seg.slug}.com.br`} ratio="880 / 605" className="shadow-[0_30px_60px_-24px_rgb(11_11_15/0.35)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={vitrineThumb(segmentModel[seg.slug])} alt={`Modelo de site para ${seg.tab.toLowerCase()} no computador`} width={880} height={605} decoding="async" className="h-full w-full object-cover object-top" />
            </BrowserFrame>
            <PhoneFrame className="absolute bottom-0 right-0 w-[28%] max-w-[260px] shadow-[0_30px_60px_-24px_rgb(11_11_15/0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={vitrineMobileThumb(segmentModel[seg.slug])} alt={`Modelo de site para ${seg.tab.toLowerCase()} no celular`} width={360} height={760} decoding="async" className="h-full w-full object-cover object-top" />
            </PhoneFrame>
          </div>
        </div>
      </section>

      <Section tone="white" labelledBy="seg-detalhes">
        <h2 id="seg-detalhes" className="sr-only">Detalhes do {seg.title.toLowerCase()}</h2>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {seg.sections.map((s) => (
            <div key={s.heading}>
              <h3 className="text-3xl tracking-[-0.045em]">{s.heading}</h3>
              <p className="mt-4 text-lg leading-relaxed text-graphite">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 rounded-[2rem] bg-paper p-7 md:p-10">
          <p className="label-mono text-graphite">O que vem no modelo</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {seg.includes.map((i) => (
              <li key={i} className="flex gap-3">
                <Check aria-hidden strokeWidth={1.75} className="mt-1 h-[18px] w-[18px] shrink-0 text-pink" />
                {i}
              </li>
            ))}
            <li className="flex gap-3">
              <Check aria-hidden strokeWidth={1.75} className="mt-1 h-[18px] w-[18px] shrink-0 text-pink" />
              Dados estruturados de negócio local, llms.txt e robôs das IAs liberados
            </li>
            <li className="flex gap-3">
              <Check aria-hidden strokeWidth={1.75} className="mt-1 h-[18px] w-[18px] shrink-0 text-pink" />
              Hospedagem, SSL, domínio no 1º ano e manutenção
            </li>
          </ul>
        </div>
      </Section>

      <Section tone="ink" labelledBy="seg-ia">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading id="seg-ia" tone="dark" label="Busca com IA" title={`Seu cliente já pergunta isso para a IA`} />
          <div className="rounded-3xl border border-line-dark bg-card-dark p-6">
            <p className="ml-auto max-w-[90%] rounded-3xl rounded-br-lg bg-paper px-5 py-3 text-ink">{seg.aiQuestion}</p>
            <p className="mt-5 leading-relaxed text-mist">
              A IA responde com quem ela consegue entender e confirmar: nome, serviço, região e reputação. O modelo de {seg.tab.toLowerCase()} já sai organizado para isso.
            </p>
            <p className="dashed-pill mt-5 inline-block px-4 py-2 text-pink">sua empresa?</p>
          </div>
        </div>
      </Section>

      <Section labelledBy="seg-planos">
        <SectionHeading id="seg-planos" label="Planos" title={`Quanto custa um ${seg.title.toLowerCase()}?`} lead="A partir de R$89 por mês, sem custo de criação. Escolha o plano:" />
        <div className="mt-12">
          <PlanCards />
        </div>
      </Section>

      {posts.filter((p) => p.segment === seg.slug).map((post) => (
        <section key={post.slug} aria-label="Artigo relacionado" className="pb-20 md:pb-28">
          <div className="container-site">
            <Link href={`/blog/${post.slug}`} className="group flex flex-col justify-between gap-4 rounded-[2rem] border border-line bg-white p-7 transition-colors hover:border-ink md:flex-row md:items-center md:p-9">
              <span>
                <span className="label-mono text-graphite">Leia no blog</span>
                <span className="mt-2 block text-2xl font-semibold tracking-[-0.04em]">{post.title}</span>
                <span className="mt-2 block text-graphite">{post.description}</span>
              </span>
              <ArrowRight aria-hidden strokeWidth={1.75} className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      ))}

      <Section tone="white" labelledBy="seg-faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="seg-faq" label="Dúvidas" title={`Perguntas sobre ${seg.title.toLowerCase()}`} />
          <Faq items={seg.faq} />
        </div>
      </Section>

      <FinalCta />
      <JsonLd data={[serviceSchema(), faqSchema(seg.faq)]} />
    </>
  );
}
