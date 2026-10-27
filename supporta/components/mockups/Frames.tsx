import type { CSSProperties, ReactNode } from "react";

type ScrollProps = { scroll?: boolean; distance?: string; delay?: string };

function Viewport({ children, scroll, distance, delay, ratio }: ScrollProps & { children: ReactNode; ratio: string }) {
  return (
    <div className="relative overflow-hidden [container-type:inline-size]" style={{ aspectRatio: ratio }}>
      <div
        className={scroll ? "mock-scroll" : undefined}
        style={{ "--scroll-distance": distance, animationDelay: delay } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

/** Moldura de navegador com barra de endereço. */
export function BrowserFrame({
  url,
  children,
  className = "",
  ratio = "16 / 10.5",
  ...scroll
}: ScrollProps & { url: string; children: ReactNode; className?: string; ratio?: string }) {
  return (
    <div className={`mock-frame overflow-hidden rounded-2xl border border-line bg-white ${className}`}>
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
        <span className="flex-1 truncate rounded-full bg-paper px-3 py-1 font-mono text-[11px] text-graphite">{url}</span>
      </div>
      <Viewport ratio={ratio} {...scroll}>
        {children}
      </Viewport>
    </div>
  );
}

/** Moldura de celular. */
export function PhoneFrame({ children, className = "", ...scroll }: ScrollProps & { children: ReactNode; className?: string }) {
  return (
    <div className={`mock-frame rounded-[2rem] border border-line-dark bg-ink p-2 ${className}`}>
      <div className="overflow-hidden rounded-[1.6rem] bg-white">
        <Viewport ratio="9 / 19" {...scroll}>
          {children}
        </Viewport>
      </div>
    </div>
  );
}
