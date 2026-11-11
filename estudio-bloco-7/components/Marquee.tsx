import { keywords } from '@/lib/data';

function Run({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {keywords.map((word) => (
        <li key={word} className="flex items-center">
          <span className="display text-[clamp(1.75rem,3.4vw,3.25rem)] px-[clamp(1rem,2vw,2rem)] whitespace-nowrap">{word}</span>
          <span className="block size-2.5 md:size-3 bg-accent" aria-hidden />
        </li>
      ))}
    </ul>
  );
}

/** Slow keyword band. Pure CSS transform loop, paused on hover and off for reduced motion. */
export default function Marquee() {
  return (
    <section
      className="marquee relative z-10 -mx-[var(--gutter)] overflow-hidden bg-ink text-paper"
      aria-label="Palavras-chave do estúdio"
    >
      <div className="py-5 md:py-6">
        <div className="marquee-track">
          <Run />
          <Run hidden />
        </div>
      </div>
    </section>
  );
}
