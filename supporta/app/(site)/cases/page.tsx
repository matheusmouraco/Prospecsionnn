import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/home/Cases";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHero } from "@/components/ui/PageHero";
import { cases } from "@/lib/cases";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cases de clientes Supporta: antes e depois",
  description: "Sites de clientes Supporta com as notas do PageSpeed do Google medidas antes e depois. Só números reais.",
  path: "/cases",
});

export default function CasesPage() {
  if (!cases.length) notFound();
  return (
    <>
      <PageHero crumbs={[{ name: "Cases", path: "/cases" }]} label="Clientes" title="Antes e depois, com números medidos" lead="Notas do PageSpeed do Google no celular, medidas antes e depois de cada site Supporta." />
      <section aria-label="Cases" className="pb-20">
        <ul className="container-site grid gap-4 md:grid-cols-3">
          {cases.map((c) => <li key={c.slug}><CaseCard c={c} /></li>)}
        </ul>
      </section>
      <FinalCta />
    </>
  );
}
