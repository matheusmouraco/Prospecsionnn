import { Symbol } from "./Symbol";

type Tone = "light" | "dark" | "pink";

/** Logo horizontal: símbolo + "supporta" em minúsculas, Geist 600, tracking -0.045em. */
export function Logo({ tone = "light", className = "" }: { tone?: Tone; className?: string }) {
  const text = tone === "dark" ? "text-paper" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Symbol tone={tone} className="h-8 w-8 shrink-0" />
      <span className={`text-[22px] font-semibold leading-none tracking-[-0.045em] ${text}`}>supporta</span>
    </span>
  );
}
