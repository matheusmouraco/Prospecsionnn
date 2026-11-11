"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, SplitText, onReady, MOTION_OK } from "@/lib/gsap";
import { HERO_IMAGE } from "@/lib/data";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const scope = root.current!;
        const title = scope.querySelector<HTMLElement>("[data-title]")!;
        const zoom = scope.querySelector("[data-zoom]");
        const parallax = scope.querySelector("[data-parallax]");
        const content = scope.querySelector("[data-content]");

        // Slow, endless push-in on the photo.
        gsap.set(zoom, { scale: 1.18 });
        const drift = gsap.to(zoom, { scale: 1.06, duration: 2.6, ease: "power3.inOut", paused: true });
        const breathe = gsap.to(zoom, { scale: 1.16, duration: 22, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true });
        drift.eventCallback("onComplete", () => breathe.play());

        // Scroll out: the photo sinks, the copy lifts and fades.
        gsap.to(parallax, {
          yPercent: 16,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(content, {
          yPercent: -18,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "70% top", scrub: true },
        });

        let split: SplitText | undefined;
        const start = contextSafe!(() => {
          split = SplitText.create(title, {
            type: "lines",
            mask: "lines",
            linesClass: "ln",
            autoSplit: true,
            onSplit(self) {
              gsap.set(title, { visibility: "visible" });
              return gsap.from(self.lines, { yPercent: 110, duration: 1.3, stagger: 0.12, delay: 0.15 });
            },
          });
          gsap.set("[data-fade]", { visibility: "visible" });
          gsap.from("[data-fade]", { opacity: 0, y: 24, duration: 1.1, stagger: 0.1, delay: 0.7 });
          drift.play();
        });

        const offReady = onReady(() => {
          document.fonts.ready.then(start);
        });
        return () => {
          offReady();
          split?.revert();
        };
      });
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative h-[100svh] min-h-[560px] overflow-hidden" aria-label="Abertura">
      <div data-parallax className="absolute inset-0 will-change-transform">
        <div data-zoom className="absolute inset-0 will-change-transform">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            quality={60}
            className="object-cover object-[50%_30%]"
          />
        </div>
      </div>
      {/* Neutral black grade: keeps highlights, lets the type breathe. No colour. */}
      <div className="absolute inset-0 bg-ink/25" />
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-ink via-ink/60 to-transparent" />

      <div data-content className="relative flex h-full flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">
        <p data-fade data-reveal className="eyebrow mb-6 md:mb-8">
          <span className="mr-3 inline-block h-px w-8 translate-y-[-0.25em] bg-gold align-middle" />
          Arquitetura · São Paulo
        </p>
        <h1
          data-title
          data-reveal
          className="display max-w-[14ch] text-balance text-[clamp(4.1rem,12.5vw,13.5rem)] text-bone"
        >
          Arquitetura que acende a noite
        </h1>
        <div className="mt-8 flex items-end justify-between gap-8 md:mt-12">
          <p className="max-w-[34ch] text-[0.95rem] leading-relaxed text-bone/75 md:text-base">
            Projetos comerciais e residenciais de alto padrão, pensados para a luz que fica quando o sol vai embora.
          </p>
          <div data-fade data-reveal className="hidden shrink-0 items-center gap-4 md:flex">
            <span className="eyebrow">Role</span>
            <span className="relative block h-14 w-px overflow-hidden bg-bone/15">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-gold" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
