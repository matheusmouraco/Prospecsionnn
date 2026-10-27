import type { ReactNode } from "react";

type Tone = "light" | "dark" | "pink" | "pink-light";

const tones: Record<Tone, string> = {
  light: "bg-white border border-line text-ink",
  dark: "bg-card-dark border border-line-dark text-paper",
  pink: "bg-pink text-ink on-pink",
  "pink-light": "bg-pink-light text-ink",
};

export function Card({ tone = "light", className = "", children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return <div className={`rounded-3xl p-6 md:p-8 ${tones[tone]} ${className}`}>{children}</div>;
}
