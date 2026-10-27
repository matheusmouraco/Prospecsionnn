import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { cases, type Case } from "@/lib/cases";

function Score({ label, before, after }: { label: string; before: number; after: number }) {
  return (
    <div>
      <p className="label-mono text-graphite">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
        <span className="text-bad">{before}</span> <ArrowRight aria-label="para" strokeWidth={1.75} className="inline h-5 w-5" /> <span className="text-ok">{after}</span>
      </p>
    </div>
  );
}

export function CaseCard({ c }: { c: Case }) {
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-line bg-white p-7">
      <p className="label-mono text-graphite">{c.cidade} · plano {c.plano}</p>
      <h3 className="mt-3 text-2xl tracking-[-0.04em]">{c.empresa}</h3>
      <p className="mt-2 flex-1 leading-relaxed text-graphite">{c.resumo}</p>
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
        <Score label="Desempenho" before={c.antes.performance} after={c.depois.performance} />
        <Score label="SEO" before={c.antes.seo} after={c.depois.seo} />
      </div>
      {c.depoimento ? (
        <blockquote className="mt-6 border-l-4 border-pink pl-4">
          <p>“{c.depoimento.texto}”</p>
          <footer className="mt-2 text-sm text-graphite">{c.depoimento.autor}, {c.depoimento.cargo}</footer>
        </blockquote>
      ) : null}
      <p className="mt-4 text-xs text-graphite">Notas do PageSpeed no celular, medidas em {c.antes.medidoEm} e {c.depois.medidoEm}.</p>
    </article>
  );
}

/** Some quando ainda não há cases reais. */
export function Cases() {
  if (!cases.length) return null;
  return (
    <Section tone="white" labelledBy="cases-title">
      <SectionHeading id="cases-title" label="Clientes" title="O que mudou para quem assinou?" lead="Notas medidas no PageSpeed do Google, antes e depois do site Supporta." />
      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {cases.slice(0, 3).map((c) => <li key={c.slug}><CaseCard c={c} /></li>)}
      </ul>
      {cases.length > 3 ? <Link href="/cases" className="link mt-8 inline-block">Ver todos os cases</Link> : null}
    </Section>
  );
}
