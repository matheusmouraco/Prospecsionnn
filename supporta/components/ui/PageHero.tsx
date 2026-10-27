import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { SectionLabel } from "./SectionLabel";

export function PageHero({
  crumbs,
  label,
  title,
  lead,
  children,
}: {
  crumbs: { name: string; path: string }[];
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="pb-14 pt-8 md:pb-20 md:pt-12">
      <div className="container-site">
        <Breadcrumbs items={crumbs} />
        <SectionLabel className="mt-10">{label}</SectionLabel>
        <h1 id="page-title" className="mt-4 max-w-4xl text-[clamp(2.5rem,7vw,5rem)] leading-[1] tracking-[-0.055em]">
          {title}
        </h1>
        {lead ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite md:text-xl">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}
