"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/mockups/Frames";
import { buttonClass } from "@/components/ui/Button";
import { categoryIntro, vitrine, vitrineCategories, vitrineMobileThumb, vitrineThumb, vitrineUrl } from "@/lib/vitrine";

/** Vitrine por segmento: abas por categoria, o modelo escolhido no computador e no celular, e os outros modelos da categoria. */
export function TemplatesTabs() {
  const [active, setActive] = useState(0);
  const [pick, setPick] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const category = vitrineCategories[active];
  const items = vitrine.filter((v) => v.category === category);
  const model = items[Math.min(pick, items.length - 1)];

  const select = (i: number) => {
    setActive(i);
    setPick(0);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (e.key in keys) {
      const next = (active + keys[e.key] + vitrineCategories.length) % vitrineCategories.length;
      select(next);
      tabs.current[next]?.focus();
      e.preventDefault();
    }
  };

  return (
    <div>
      <div role="tablist" aria-label="Segmentos" onKeyDown={onKey} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:justify-center md:px-0">
        {vitrineCategories.map((c, i) => (
          <button
            key={c}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`tab-${i}`}
            aria-selected={i === active}
            aria-controls="painel-vitrine"
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            className={`h-11 shrink-0 rounded-full px-5 text-[15px] font-medium transition-colors ${i === active ? "bg-ink text-paper" : "border border-ink/15 bg-white text-ink hover:border-ink"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="painel-vitrine" aria-labelledby={`tab-${active}`} className="mt-8 grid items-center gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div key={model.slug} className="fade-up relative pb-10 pr-[18%] md:pr-[16%]">
          <a href={vitrineUrl(model.slug)} target="_blank" rel="noopener" aria-label={`Abrir o modelo ${model.name} numa nova aba`} className="block">
            <BrowserFrame url={`${model.slug.replace(/-/g, "")}.com.br`} ratio="880 / 605" className="shadow-[0_30px_60px_-24px_rgb(11_11_15/0.35)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={vitrineThumb(model.slug)} alt={`Modelo ${model.name} no computador`} width={880} height={605} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
            </BrowserFrame>
          </a>
          <PhoneFrame className="absolute bottom-0 right-0 w-[30%] max-w-[210px] shadow-[0_30px_60px_-24px_rgb(11_11_15/0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={vitrineMobileThumb(model.slug)} alt={`Modelo ${model.name} no celular`} width={360} height={760} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
          </PhoneFrame>
        </div>
        <div>
          <p className="label-mono text-graphite">{category}</p>
          <h3 className="mt-3 text-3xl tracking-[-0.045em] md:text-4xl">{model.name}</h3>
          <p className="mt-4 leading-relaxed text-graphite">{categoryIntro[category]}</p>
          <p className="mt-6 text-sm font-medium">Outros modelos deste segmento</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {items.map((v, i) => (
              <li key={v.slug}>
                <button
                  type="button"
                  aria-pressed={v.slug === model.slug}
                  onClick={() => setPick(i)}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${v.slug === model.slug ? "bg-pink text-ink" : "border border-line bg-white hover:border-ink"}`}
                >
                  {v.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/planos?tema=${model.slug}`} className={buttonClass("primary", "lg")} data-track="plan_click" data-track-origin={`modelo:${model.slug}`}>
              Quero esse modelo <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
            </Link>
            <a href={vitrineUrl(model.slug)} target="_blank" rel="noopener" className={buttonClass("outline", "lg")} data-track="demo_open" data-track-origin={model.slug}>
              Abrir o modelo <ArrowUpRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
            </a>
          </div>
          <Link href="/modelos#vitrine" className="link mt-5 inline-block text-[15px]">
            Ver todos os {vitrine.length} modelos
          </Link>
        </div>
      </div>
    </div>
  );
}
