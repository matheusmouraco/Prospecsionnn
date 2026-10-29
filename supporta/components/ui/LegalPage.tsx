import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { SectionLabel } from "./SectionLabel";

export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <article className="pb-24 pt-8 md:pt-12">
      <div className="container-site">
        <Breadcrumbs items={[{ name: title, path }]} />
        <div className="mx-auto mt-6 max-w-3xl">
          <SectionLabel>Atualizado em {updated}</SectionLabel>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] tracking-[-0.055em]">{title}</h1>
          <p className="mt-6 rounded-2xl bg-pink-light px-5 py-4 text-[15px]">
            Minuta para revisão jurídica. Os trechos entre colchetes precisam ser preenchidos ou validados antes da publicação.
          </p>
          <div className="legal mt-10 space-y-4 text-[17px] leading-relaxed text-graphite [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:tracking-[-0.04em] [&_h2]:text-ink [&_li]:ml-6 [&_li]:list-disc [&_strong]:text-ink">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}
