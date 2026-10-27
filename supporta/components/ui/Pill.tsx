import type { ReactNode } from "react";

type Tone = "light" | "pink" | "dark" | "outline" | "dashed";

const tones: Record<Tone, string> = {
  light: "bg-white text-ink border border-line",
  pink: "bg-pink-light text-ink",
  dark: "bg-card-dark text-paper border border-line-dark",
  outline: "border border-ink/15 text-ink",
  dashed: "dashed-pill text-pink",
};

export function Pill({ tone = "light", className = "", children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
