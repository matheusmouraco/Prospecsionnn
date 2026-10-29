import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { NeonArt, type ArtName } from "./NeonArt";
import { SectionLabel } from "./SectionLabel";

/** As três camadas da marca em vidro preto e neon, decorando o topo das páginas internas. */
function LayersArt() {
  return (
    <div aria-hidden className="pointer-events-none page-hero-art absolute top-1/2 hidden w-[26%] max-w-[340px] -translate-y-1/2 xl:block">
      <div className="space-y-3.5 [transform:perspective(1000px)_rotateY(-22deg)_rotateX(10deg)]">
        <div className="gloss-bar ml-[18%] h-14 rounded-full" />
        <div className="neon-bar neon-pulse ml-[6%] h-14 rounded-full" />
        <div className="gloss-bar h-14 rounded-full" />
      </div>
      <div className="neon-floor mx-auto mt-6 h-16 w-3/4" />
    </div>
  );
}

export function PageHero({
  crumbs,
  label,
  title,
  lead,
  art,
  children,
}: {
  crumbs: { name: string; path: string }[];
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Arte neon no lado direito; sem ela, entram as três camadas da marca. */
  art?: ArtName;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden border-b border-line bg-white pb-16 pt-14 md:pb-24 md:pt-20">
      <div aria-hidden className="grid-light pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-32 h-[560px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgb(255_61_113/0.18),transparent)]" />
      {art ? (
        <div aria-hidden className="page-hero-art pointer-events-none absolute top-1/2 hidden w-[34%] max-w-[440px] -translate-y-1/2 xl:block">
          <div className="neon-ring overflow-hidden rounded-[2rem]">
            <NeonArt name={art} sizes="440px" eager className="aspect-[4/3]" />
          </div>
        </div>
      ) : (
        <LayersArt />
      )}
      <div className={`container-site relative ${art ? "xl:pr-[min(480px,38%)]" : ""}`}>
        <Breadcrumbs items={crumbs} />
        <SectionLabel>{label}</SectionLabel>
        <h1 id="page-title" className="mt-4 max-w-3xl text-[clamp(2.5rem,7vw,5.25rem)] leading-[0.98] tracking-[-0.06em]">
          {title}
        </h1>
        {lead ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite md:text-xl">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}
