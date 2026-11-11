"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { whenIdle } from "@/lib/idle";
import { PROJECTS, whatsappUrl } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();
      const build = contextSafe!(() => mm.add(MOTION_OK, () => {
        const scope = root.current!;
        const panels = gsap.utils.toArray<HTMLElement>(".project-panel", scope);
        const q = (p: HTMLElement, s: string) => p.querySelectorAll<HTMLElement>(s);
        scope.classList.add("is-stacked");
        gsap.set(scope.querySelectorAll("[data-reveal]"), { visibility: "visible" });

        // First project: its name rises when the section arrives.
        gsap.from(q(panels[0], "[data-line]"), {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.1,
          scrollTrigger: { trigger: scope, start: "top 65%", toggleActions: "play none none reverse" },
        });
        gsap.from(q(panels[0], "[data-meta]"), {
          opacity: 0,
          y: 20,
          duration: 1,
          stagger: 0.08,
          scrollTrigger: { trigger: scope, start: "top 55%", toggleActions: "play none none reverse" },
        });

        const progress = scope.querySelector("[data-progress]");
        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: () => `+=${(panels.length - 1) * window.innerHeight * 1.3}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
          },
        });

        tl.to({}, { duration: 0.35 }); // hold on the first project
        panels.forEach((panel, i) => {
          if (i === 0) return;
          const prev = panels[i - 1];
          tl.addLabel(`p${i}`)
            // Mask wipe: the next project rises over the current one.
            .to(panel, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, `p${i}`)
            .fromTo(q(panel, "[data-img]"), { scale: 1.28, yPercent: 10 }, { scale: 1.04, yPercent: 0, duration: 1 }, `p${i}`)
            .to(q(prev, "[data-img]"), { yPercent: -12, scale: 1.12, duration: 1 }, `p${i}`)
            .to(q(prev, "[data-content]"), { opacity: 0, yPercent: -6, duration: 0.5 }, `p${i}`)
            .from(q(panel, "[data-line]"), { yPercent: 110, duration: 0.6, stagger: 0.08 }, `p${i}+=0.45`)
            .from(q(panel, "[data-meta]"), { opacity: 0, y: 20, duration: 0.5, stagger: 0.05 }, `p${i}+=0.55`)
            .to({}, { duration: 0.35 }); // hold
        });

        return () => scope.classList.remove("is-stacked");
      }));
      return whenIdle(build);
    },
    { scope: root },
  );

  return (
    <section
      id="projetos"
      ref={root}
      className="projects relative bg-ink [&.is-stacked]:h-[100svh] [&.is-stacked]:min-h-[560px] [&.is-stacked]:overflow-hidden"
      aria-labelledby="projetos-titulo"
    >
      <h2 id="projetos-titulo" className="sr-only">
        Projetos selecionados
      </h2>
      {PROJECTS.map((p, i) => (
        <a
          key={p.slug}
          href={whatsappUrl(`Olá, NOX. Vi o projeto ${p.name.join(" ")} e quero conversar sobre um projeto.`)}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Conversar"
          aria-label={`${p.name.join(" ")}, ${p.kind}, ${p.place}. Conversar sobre um projeto assim no WhatsApp`}
          className="project-panel relative block h-[100svh] min-h-[560px] overflow-hidden bg-ink"
          style={{ zIndex: i + 1 }}
        >
          <div data-img className="absolute inset-0 will-change-transform">
            <Image
              src={p.image.src}
              alt={p.image.alt}
              fill
              sizes="100vw"
              quality={58}
              className="object-cover"
              style={{ objectPosition: p.image.position }}
            />
          </div>
          <div className="absolute inset-0 bg-ink/30" />
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink/95 via-ink/45 to-transparent" />

          <div data-content className="relative flex h-full flex-col justify-between px-5 pb-10 pt-24 md:px-10 md:pb-14 md:pt-28">
            <div className="flex items-start justify-between">
              <p data-meta data-reveal className="eyebrow">
                {i === 0 ? "Projetos selecionados" : p.kind}
              </p>
              <p data-meta data-reveal className="font-display text-[1.1rem] tracking-[0.08em] text-bone/80 tabular-nums">
                {pad(i + 1)} <span className="text-bone/35">/ {pad(PROJECTS.length)}</span>
              </p>
            </div>

            <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <h3 className="display text-[clamp(4.2rem,15vw,15rem)] !leading-[1] text-bone">
                {p.name.map((line) => (
                  <span key={line} className="mask-line block overflow-hidden">
                    <span data-line data-reveal className="block">
                      {line}
                    </span>
                  </span>
                ))}
              </h3>
              <div className="max-w-[22rem] lg:pb-4">
                <p data-meta data-reveal className="mb-6 text-[0.95rem] leading-relaxed text-bone/80">
                  {p.line}
                </p>
                <dl data-meta data-reveal className="grid grid-cols-3 gap-4 border-t border-bone/15 pt-4">
                  {[
                    ["Tipo", p.kind],
                    ["Área", p.area],
                    ["Ano", p.year],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="eyebrow mb-1.5 !text-[0.625rem]">{k}</dt>
                      <dd className="text-[0.8rem] text-bone">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p data-meta data-reveal className="eyebrow mt-4">
                  {p.place}
                </p>
              </div>
            </div>
          </div>
        </a>
      ))}

      {/* Progress through the four projects (only while stacked) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden h-px bg-bone/10 [.is-stacked_&]:block">
        <div data-progress className="h-full origin-left scale-x-0 bg-gold" />
      </div>
    </section>
  );
}
