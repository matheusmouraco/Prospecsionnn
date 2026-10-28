import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { billingFaq, geoFaq, homeFaq } from "@/lib/faqs";
import { faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Perguntas frequentes sobre a Supporta",
  description: "Todas as dúvidas sobre a Supporta: fidelidade, cancelamento, domínio, prazos, pagamento, ajustes, GEO e como funciona o site por assinatura.",
  path: "/perguntas-frequentes",
});

const groups = [
  { id: "assinatura", title: "Assinatura e site", items: homeFaq },
  { id: "pagamento", title: "Pagamento", items: billingFaq.filter((b) => !homeFaq.some((h) => h.q === b.q)) },
  { id: "geo", title: "Google e IAs", items: geoFaq.filter((g) => !homeFaq.some((h) => h.q === g.q)) },
];

export default function PerguntasPage() {
  const all = groups.flatMap((g) => g.items);
  return (
    <>
      <PageHero
        crumbs={[{ name: "Perguntas frequentes", path: "/perguntas-frequentes" }]}
        label="Central de dúvidas"
        title="Perguntas frequentes"
        lead={`${all.length} respostas diretas sobre a assinatura, o pagamento e como aparecer no Google e nas IAs.`}
      >
        <nav aria-label="Temas" className="mt-8 flex flex-wrap gap-2">
          {groups.map((g) => <a key={g.id} href={`#${g.id}`} className="rounded-full border border-ink/15 px-4 py-2 text-[15px] hover:border-ink">{g.title}</a>)}
        </nav>
      </PageHero>
      {groups.map((g, i) => (
        <section key={g.id} id={g.id} aria-labelledby={`${g.id}-t`} className={`py-16 md:py-20 ${i % 2 === 0 ? "bg-white" : ""}`}>
          <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <h2 id={`${g.id}-t`} className="text-[clamp(1.9rem,4.5vw,3rem)] tracking-[-0.05em]">{g.title}</h2>
            <Faq items={g.items} />
          </div>
        </section>
      ))}
      <FinalCta />
      <JsonLd data={faqSchema(all)} />
    </>
  );
}
