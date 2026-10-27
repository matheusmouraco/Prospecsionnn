type Tone = "light" | "dark" | "pink" | "mono-ink" | "mono-paper";

const palette: Record<Tone, { outer: string; middle: string }> = {
  light: { outer: "var(--ink)", middle: "var(--pink)" },
  dark: { outer: "var(--paper)", middle: "var(--pink)" },
  pink: { outer: "var(--ink)", middle: "var(--white)" },
  "mono-ink": { outer: "var(--ink)", middle: "var(--ink)" },
  "mono-paper": { outer: "var(--paper)", middle: "var(--paper)" },
};

/** Símbolo Camadas: três barras empilhadas e deslocadas. Nunca girar nem pôr rosa em mais de uma barra. */
export function Symbol({ tone = "light", className, title }: { tone?: Tone; className?: string; title?: string }) {
  const { outer, middle } = palette[tone];
  return (
    <svg viewBox="0 0 48 48" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <rect x="16" y="8" width="26" height="8" rx="4" fill={outer} />
      <rect x="9" y="20" width="30" height="8" rx="4" fill={middle} />
      <rect x="6" y="32" width="26" height="8" rx="4" fill={outer} />
    </svg>
  );
}
