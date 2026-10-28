import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { glossary } from "@/lib/glossary";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Glossário de site, SEO, AEO e GEO | Supporta",
  description: "O que é SEO, AEO, GEO, llms.txt, dados estruturados, LCP, domínio e outros termos de site, explicados em linguagem simples.",
  path: "/glossario",
});

export default function GlossarioPage() {
  const letters = [...new Set(glossary.map((t) => t.term[0].toUpperCase()))];
  return (
    <>
      <PageHero
        crumbs={[{ name: "Glossário", path: "/glossario" }]}
        label="Glossário"
        title="Termos de site explicados em linguagem simples"
        lead="O que quer dizer cada sigla que aparece quando o assunto é site, Google e IA."
      >
        <nav aria-label="Letras" className="mt-8 flex flex-wrap gap-2">
          {letters.map((l) => <a key={l} href={`#letra-${l}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 font-medium hover:border-ink">{l}</a>)}
        </nav>
      </PageHero>
      <section aria-label="Termos" className="bg-white py-16 md:py-24">
        <div className="container-site max-w-4xl">
          <dl className="divide-y divide-line border-y border-line">
            {glossary.map((t, i) => (
              <div key={t.slug} id={t.slug} className="grid gap-2 py-7 md:grid-cols-[220px_1fr] md:gap-8">
                <dt className="text-2xl font-semibold tracking-[-0.04em]">
                  {i === 0 || glossary[i - 1].term[0].toUpperCase() !== t.term[0].toUpperCase() ? <span id={`letra-${t.term[0].toUpperCase()}`} /> : null}
                  {t.term}
                </dt>
                <dd className="text-lg leading-relaxed text-graphite">{t.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <FinalCta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Glossário Supporta",
          url: absoluteUrl("/glossario"),
          hasDefinedTerm: glossary.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.definition, url: absoluteUrl(`/glossario#${t.slug}`) })),
        }}
      />
    </>
  );
}
