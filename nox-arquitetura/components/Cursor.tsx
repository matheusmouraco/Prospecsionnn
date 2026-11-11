"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce || !root.current) return;

    const el = root.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    let active: Element | null = null;
    let shown = false;

    const grow = (text: string) => {
      label.current!.textContent = text;
      gsap.to(ring.current, { scale: 1, duration: 0.6, ease: "power3.inOut", overwrite: true });
      gsap.to(label.current, { opacity: 1, duration: 0.4, delay: 0.15, ease: "power3.inOut", overwrite: true });
    };
    const shrink = () => {
      gsap.to(ring.current, { scale: 0.125, duration: 0.5, ease: "power3.inOut", overwrite: true });
      gsap.to(label.current, { opacity: 0, duration: 0.2, ease: "power3.inOut", overwrite: true });
    };

    let px = -1;
    let py = -1;
    const sync = (under: Element | null) => {
      const target = under?.closest?.("[data-cursor]") ?? null;
      if (target === active) return;
      active = target;
      if (target) grow(target.getAttribute("data-cursor") || "");
      else shrink();
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!shown) {
        gsap.set(el, { x: px, y: py });
        gsap.to(el, { opacity: 1, duration: 0.3 });
        shown = true;
      }
      xTo(px);
      yTo(py);
      sync(e.target as Element);
    };

    // Wheel scrolling moves content under a still pointer: re-check what is beneath it.
    let raf = 0;
    const onScroll = () => {
      if (px < 0 || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sync(document.elementFromPoint(px, py));
      });
    };
    const onLeave = () => {
      gsap.to(el, { opacity: 0, duration: 0.3 });
      shown = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="cursor pointer-events-none fixed left-0 top-0 z-[90] opacity-0"
      style={{ willChange: "transform" }}
    >
      <div
        ref={ring}
        className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-bone"
        style={{ transform: "scale(0.125)" }}
      />
      <span
        ref={label}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.625rem] font-medium uppercase tracking-[0.22em] text-ink opacity-0"
      />
    </div>
  );
}
