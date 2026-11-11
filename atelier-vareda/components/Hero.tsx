import { hero, studio } from "@/lib/content";
import { RevealImage } from "./RevealImage";

const lines = [
  { text: "Casas que", className: "" },
  { text: "guardam", className: "italic pl-[0.62em] md:pl-[0.9em]" },
  { text: "o tempo.", className: "" },
];

export function Hero() {
  return (
    <section id="topo" className="gutter relative pt-28 pb-[calc(var(--section)*0.55)] md:pt-36">
      {/* Masthead row, like the top of a printed page */}
      <div
        className="hero-fade eyebrow flex justify-between border-t border-line pt-4 text-mute md:grid md:grid-cols-12 md:gap-x-6"
        style={{ "--d": "0.7s" } as React.CSSProperties}
      >
        <span className="whitespace-nowrap md:col-span-4">Arquitetura residencial</span>
        <span className="whitespace-nowrap md:col-span-4">
          São Paulo<span className="hidden md:inline">, Brasil</span>
        </span>
        <span className="hidden md:col-span-2 md:block">Desde {studio.since}</span>
        <span className="hidden text-right md:col-span-2 md:block">Edição 2026</span>
      </div>

      <div className="mt-14 grid grid-cols-1 items-end gap-x-6 md:mt-16 md:grid-cols-12">
        <h1 data-drift className="display text-[19.5vw] md:col-span-8 md:text-[11.2vw] xl:text-[11.6vw]">
          {lines.map((l, i) => (
            <span key={l.text} className="hero-line">
              <span className={l.className} style={{ "--i": i } as React.CSSProperties}>
                {l.text}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-14 md:col-span-4 md:mt-0">
          <RevealImage
            src={hero.image.src}
            alt={hero.image.alt}
            reveal="hero"
            parallax="hero"
            preload
            quality={60}
            sizes="(min-width: 768px) 32vw, 100vw"
            objectPosition="38% 50%"
            className="aspect-[4/5] w-full md:aspect-[3/4]"
          />
          <p className="hero-fade eyebrow mt-4 flex justify-between text-mute" style={{ "--d": "1.4s" } as React.CSSProperties}>
            <span>Casa Alvorada, Campinas</span>
            <span>2021</span>
          </p>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-x-6 md:mt-24 md:grid-cols-12">
        <p className="hero-fade max-w-[25rem] text-[1.0625rem] leading-[1.65] text-ink/80 md:col-span-5" style={{ "--d": "1.1s" } as React.CSSProperties}>
          Projetamos residências de alto padrão para quem quer morar devagar. Poucos projetos por ano, acompanhados
          do primeiro traço à entrega das chaves.
        </p>
        <a
          href="#manifesto"
          className="hero-fade group mt-12 flex items-center gap-4 self-end md:col-span-3 md:col-start-10 md:mt-0 md:justify-end"
          style={{ "--d": "1.6s" } as React.CSSProperties}
        >
          <span className="eyebrow">Role para ler</span>
          <span className="relative block h-10 w-px overflow-hidden bg-line" aria-hidden="true">
            <span className="cue-line absolute inset-0 bg-ink" />
          </span>
        </a>
      </div>
    </section>
  );
}
