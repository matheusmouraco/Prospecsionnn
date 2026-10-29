"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { vitrine, vitrineCategories, vitrineThumb, vitrineUrl } from "@/lib/vitrine";

/** Galeria dos modelos de demonstração, com filtro por categoria. Cada card abre a demo navegável numa nova aba. */
export function VitrineGallery() {
  const [cat, setCat] = useState<string>("Todos");
  const list = cat === "Todos" ? vitrine : vitrine.filter((v) => v.category === cat);
  const chip = (c: string) => (
    <button
      key={c}
      type="button"
      aria-pressed={cat === c}
      onClick={() => setCat(c)}
      className={`h-10 shrink-0 rounded-full px-4 text-[15px] font-medium transition-colors ${cat === c ? "bg-ink text-paper" : "border border-ink/15 bg-white text-ink hover:border-ink"}`}
    >
      {c}
    </button>
  );
  return (
    <div>
      <div role="group" aria-label="Filtrar modelos por categoria" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:justify-center md:px-0">
        {chip("Todos")}
        {vitrineCategories.map(chip)}
      </div>
      <p className="mt-4 text-center text-sm text-graphite" aria-live="polite">
        {list.length} modelo{list.length === 1 ? "" : "s"}
      </p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => (
          <li key={v.slug}>
            <a
              href={vitrineUrl(v.slug)}
              target="_blank"
              rel="noopener"
              data-track="demo_open"
              data-track-origin={v.slug}
              className="group block overflow-hidden rounded-[1.75rem] border border-line bg-white transition-[border-color,box-shadow] hover:border-pink hover:shadow-[0_0_0_1px_rgb(255_61_113/0.6),0_0_24px_rgb(255_61_113/0.25)]"
            >
              <div className="relative aspect-[880/605] overflow-hidden border-b border-line bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={vitrineThumb(v.slug)} alt={`Modelo de site para ${v.name.toLowerCase()}`} width={880} height={605} loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <div>
                  <p className="label-mono text-graphite">{v.category}</p>
                  <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.02em]">{v.name}</h3>
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-colors group-hover:border-pink group-hover:bg-pink">
                  <ArrowUpRight aria-hidden strokeWidth={1.75} className="h-5 w-5" />
                  <span className="sr-only">Abrir o modelo numa nova aba</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
