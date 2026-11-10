"use client";

import { ChevronsLeftRight } from "lucide-react";
import { useRef, useState } from "react";

/** Draggable before/after comparison (mouse, touch and keyboard). */
export function BeforeAfter({ before, after, width, height }: { before: string; after: string; width: number; height: number }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative max-h-full max-w-full touch-none overflow-hidden rounded-2xl select-none"
      style={{ aspectRatio: `${width} / ${height}` }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="Depois" className="block size-full object-cover" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt="Antes" className="block size-full object-cover" draggable={false} />
      </div>
      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase backdrop-blur">Antes</span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold tracking-wide text-accent-ink uppercase">Depois</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,.5)]" style={{ left: `${pos}%` }} />
      <button
        type="button"
        role="slider"
        aria-label="Comparar antes e depois"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
        }}
        className="absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-black shadow-xl focus-visible:outline-2 focus-visible:outline-accent"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight className="size-5" />
      </button>
    </div>
  );
}
