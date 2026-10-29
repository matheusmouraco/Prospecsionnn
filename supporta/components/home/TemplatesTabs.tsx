"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/mockups/Frames";
import { SiteMock } from "@/components/mockups/SiteMock";
import { buttonClass } from "@/components/ui/Button";
import type { Segment } from "@/lib/segments";

function domainFor(name: string) {
  return `${name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, "e").replace(/[^a-z0-9]/g, "")}.com.br`;
}

/** Abas acessíveis (role=tablist, setas do teclado) com mockup desktop + celular. */
export function TemplatesTabs({ segments }: { segments: Segment[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const seg = segments[active];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (e.key in keys) {
      const next = (active + keys[e.key] + segments.length) % segments.length;
      setActive(next);
      tabs.current[next]?.focus();
      e.preventDefault();
    }
  };

  return (
    <div>
      <div role="tablist" aria-label="Segmentos" onKeyDown={onKey} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:justify-center md:px-0">
        {segments.map((s, i) => (
          <button
            key={s.slug}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`tab-${s.slug}`}
            aria-selected={i === active}
            aria-controls={`painel-${s.slug}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`h-11 shrink-0 rounded-full px-5 text-[15px] font-medium transition-colors ${
              i === active ? "bg-ink text-paper" : "border border-ink/15 text-ink hover:border-ink"
            }`}
          >
            {s.tab}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`painel-${seg.slug}`} aria-labelledby={`tab-${seg.slug}`} className="mt-8 grid items-center gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div key={seg.slug} className="fade-up relative pb-10 pr-[18%] md:pr-[16%]">
          <BrowserFrame url={domainFor(seg.mock.business)} scroll distance="58%">
            <SiteMock mock={seg.mock} variant="desktop" />
          </BrowserFrame>
          <PhoneFrame scroll distance="62%" delay="-4s" className="absolute bottom-0 right-0 w-[30%] max-w-[210px]">
            <SiteMock mock={seg.mock} variant="mobile" />
          </PhoneFrame>
        </div>
        <div>
          <p className="label-mono text-graphite">Modelo {seg.tab}</p>
          <h3 className="mt-3 text-3xl tracking-[-0.045em] md:text-4xl">{seg.title}</h3>
          <p className="mt-4 leading-relaxed text-graphite">{seg.intro}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {seg.includes.map((item) => (
              <li key={item} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/assinar/start?modelo=${seg.slug}`} className={buttonClass("primary", "lg")} data-track="plan_click" data-track-plan="start" data-track-origin={`modelo:${seg.slug}`}>
              Quero esse modelo <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
            </Link>
            <Link href={`/demo/${seg.slug}`} className={buttonClass("outline", "lg")}>
              Ver demo navegável
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
