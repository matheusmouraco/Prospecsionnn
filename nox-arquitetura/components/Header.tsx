"use client";

import { useRef } from "react";
import { gsap, useGSAP, onReady, MOTION_OK } from "@/lib/gsap";

const LINKS = [
  { href: "#projetos", label: "Projetos" },
  { href: "#escritorio", label: "Escritório" },
  { href: "#contato", label: "Contato" },
];

export default function Header() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(root.current, { visibility: "visible" });
        const tween = gsap.from("[data-h]", { yPercent: -120, opacity: 0, duration: 1, stagger: 0.06, paused: true, delay: 0.5 });
        return onReady(() => tween.play());
      });
    },
    { scope: root },
  );

  return (
    <header
      ref={root}
      data-reveal
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 mix-blend-difference md:px-10 md:py-7"
    >
      <a href="#top" data-h className="flex items-baseline gap-3 text-bone" aria-label="NOX Arquitetura, voltar ao início">
        <span className="display text-[1.75rem] tracking-[0.04em]">NOX</span>
        <span className="eyebrow hidden !text-bone/70 sm:inline">Arquitetura</span>
      </a>
      <nav aria-label="Principal" className="flex items-center gap-8">
        {LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            data-h
            className={`group relative text-[0.75rem] uppercase tracking-[0.22em] text-bone ${i < 2 ? "hidden md:inline" : ""}`}
          >
            {l.label}
            <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-bone transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:origin-left group-hover:scale-x-100" />
          </a>
        ))}
      </nav>
    </header>
  );
}
