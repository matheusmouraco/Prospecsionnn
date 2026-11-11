"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import { whenIdle } from "@/lib/idle";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();
      const build = contextSafe!(() => mm.add(MOTION_OK, () => {
        const scope = root.current!;
        const text = scope.querySelector<HTMLElement>("[data-text]")!;
        // Words do not depend on font metrics, so this runs right away and the pin is in place
        // before the projects pin below measures its start.
        const split = SplitText.create(text, { type: "words", aria: "none" });
        {
          gsap.set(text, { visibility: "visible" });
          // The sentence lights up word by word while the screen holds still.
          gsap
            .timeline({
              scrollTrigger: {
                trigger: scope,
                start: "top top",
                end: "+=120%",
                pin: true,
                scrub: 0.8,
                anticipatePin: 1,
              },
            })
            .fromTo(split.words, { opacity: 0.4 }, { opacity: 1, stagger: 0.12, duration: 0.6, ease: "power3.inOut" })
            .fromTo("[data-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" }, "-=0.6");
        }
        return () => split.revert();
      }));
      return whenIdle(build);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] min-h-[560px] flex-col justify-center bg-ink px-5 md:px-10"
      aria-label="Manifesto"
    >
      <p className="eyebrow absolute left-5 top-24 md:left-10 md:top-28">O escritório</p>
      <p
        data-text
        data-reveal
        className="display max-w-[15ch] text-[clamp(3rem,9.6vw,11rem)] text-bone"
      >
        Desenhamos para a hora em que a luz natural vai embora.
      </p>
      <div className="absolute inset-x-5 bottom-10 flex items-center gap-6 md:inset-x-10 md:bottom-14">
        <span data-rule className="block h-px flex-1 origin-left bg-gold/60" />
        <span className="eyebrow shrink-0">Desde 2008</span>
      </div>
    </section>
  );
}
