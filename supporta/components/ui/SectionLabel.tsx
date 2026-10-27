import type { ReactNode } from "react";

/** Rótulo mono em caixa alta com a marquinha da barra do meio. */
export function SectionLabel({ children, tone = "light", className = "" }: { children: ReactNode; tone?: "light" | "dark" | "pink"; className?: string }) {
  const color = tone === "dark" ? "text-mist" : tone === "pink" ? "text-ink" : "text-graphite";
  const bar = tone === "pink" ? "bg-white" : "bg-pink";
  return (
    <p className={`label-mono inline-flex items-center gap-2.5 ${color} ${className}`}>
      <span aria-hidden className={`inline-block h-1.5 w-5 rounded-full ${bar}`} />
      {children}
    </p>
  );
}
