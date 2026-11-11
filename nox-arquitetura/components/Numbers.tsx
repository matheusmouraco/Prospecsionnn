"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { whenIdle } from "@/lib/idle";
import { NUMBERS } from "@/lib/data";

export default function Numbers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();
      const build = contextSafe!(() => mm.add(MOTION_OK, () => {
        const scope = root.current!;
        const items = gsap.utils.toArray<HTMLElement>("[data-stat]", scope);
        gsap.set(scope.querySelectorAll("[data-reveal]"), { visibility: "visible" });

        gsap.from("[data-head]", {
          yPercent: 110,
          duration: 1.2,
          scrollTrigger: { trigger: scope, start: "top 70%", once: true },
        });

        items.forEach((item, i) => {
          const out = item.querySelector<HTMLElement>("[data-value]")!;
          const target = Number(out.dataset.value);
          const counter = { v: 0 };
          out.textContent = "0";

          const tl = gsap.timeline({
            delay: i * 0.12,
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          });
          tl.fromTo(item.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2 })
            .from(item.querySelector("[data-label]"), { opacity: 0, y: 16, duration: 0.9 }, 0.3)
            .to(
              counter,
              {
                v: target,
                duration: 2,
                ease: "power3.inOut",
                onUpdate: () => {
                  out.textContent = String(Math.round(counter.v));
                },
              },
              0,
            );
        });
      }));
      return whenIdle(build);
    },
    { scope: root },
  );

  return (
    <section
      id="escritorio"
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-center bg-ink px-5 py-28 md:px-10 md:py-36"
      aria-labelledby="numeros-titulo"
    >
      <div className="mb-20 flex items-end justify-between gap-8 md:mb-28">
        <h2 id="numeros-titulo" className="mask-line overflow-hidden">
          <span data-head data-reveal className="display block text-[clamp(2.6rem,6vw,6rem)] text-bone">
            A NOX em números
          </span>
        </h2>
        <p className="eyebrow hidden md:block">Desde 2008</p>
      </div>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-10 sm:gap-y-16 lg:grid-cols-4">
        {NUMBERS.map((n) => (
          <li key={n.label} data-stat className="flex flex-col">
            <span data-rule className="mb-6 block sm:mb-8 h-px w-full origin-left bg-bone/15">
              <span className="block h-px w-10 bg-gold" />
            </span>
            <p className="display flex items-baseline text-[clamp(3.6rem,9vw,9.5rem)] text-bone tabular-nums">
              <span data-value={n.value} className="inline-block min-w-[2ch]">
                {n.value}
              </span>
              {n.suffix && <span className="ml-3 text-[0.32em] text-ash">{n.suffix.trim()}</span>}
            </p>
            <p data-label className="mt-4 max-w-[22ch] text-[0.85rem] sm:mt-5 sm:text-[0.9rem] leading-relaxed text-bone/65">
              {n.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
