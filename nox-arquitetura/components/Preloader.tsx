"use client";

import { useRef } from "react";
import { gsap, useGSAP, markReady } from "@/lib/gsap";

const LETTERS = ["N", "O", "X"];

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.classList.contains("preload")) return;

      const finish = () => {
        html.classList.remove("preload");
        try {
          sessionStorage.setItem("nox-seen", "1");
        } catch {}
        window.__lenis?.start();
      };

      gsap
        .timeline({ defaults: { ease: "power3.inOut" }, onComplete: finish })
        .from("[data-letter]", { yPercent: 110, duration: 0.7, stagger: 0.06 })
        .from("[data-rule]", { scaleX: 0, duration: 0.8 }, 0.1)
        .from("[data-caption]", { opacity: 0, y: 8, duration: 0.45 }, 0.4)
        .to("[data-letter]", { yPercent: -110, duration: 0.55, stagger: 0.04 }, "+=0.1")
        .to(["[data-rule]", "[data-caption]"], { opacity: 0, duration: 0.35 }, "<")
        .add(markReady, "-=0.15")
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.85 }, "-=0.2");
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[100] flex-col items-center justify-center bg-ink"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="flex overflow-hidden">
        {LETTERS.map((l) => (
          <span key={l} data-letter className="display block text-[clamp(5rem,18vw,15rem)] text-bone">
            {l}
          </span>
        ))}
      </div>
      <span data-rule className="mt-5 block h-px w-[clamp(7rem,16vw,13rem)] origin-left bg-gold" />
      <span data-caption className="eyebrow mt-4">
        Arquitetura
      </span>
    </div>
  );
}
