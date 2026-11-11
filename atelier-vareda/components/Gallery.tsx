import { projects } from "@/lib/content";
import { RevealImage } from "./RevealImage";

export function Gallery() {
  return (
    <section id="projetos" data-gallery aria-label="Projetos selecionados" className="relative">
      <div className="flex h-[100svh] flex-col justify-between pt-24 pb-8 md:pt-30 md:pb-12">
        <div className="gutter flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <span className="folio">(02)</span>
            <span className="eyebrow">Projetos selecionados</span>
          </div>
          <p className="eyebrow tabular-nums text-mute" aria-hidden="true">
            <span data-gallery-count className="text-ink">
              01
            </span>{" "}
            / {String(projects.length).padStart(2, "0")}
          </p>
        </div>

        <div className="gallery-viewport">
          <div data-gallery-track className="gutter flex w-max items-end gap-[14vw] md:gap-[7vw]">
            <div className="w-[74vw] shrink-0 self-center md:w-[27vw]">
              <h2 data-split className="display text-[19vw] md:text-[8.4vw]">
                Casas <em className="italic">recentes</em>
              </h2>
              <p data-fade className="mt-8 max-w-[19rem] text-[0.9375rem] leading-[1.65] text-ink/75">
                Quatro projetos entregues entre 2022 e 2025. Cada um respondeu a um terreno e a uma família diferentes.
              </p>
            </div>

            {projects.map((p, i) => (
              <figure
                key={p.n}
                data-gallery-item
                className={`shrink-0 ${p.shape === "landscape" ? "mb-[9svh] md:mb-[12vh]" : ""} ${
                  i === projects.length - 1 ? "mr-[6vw]" : ""
                }`}
              >
                <RevealImage
                  src={p.image.src}
                  alt={p.image.alt}
                  reveal="gallery"
                  parallax="x"
                  sizes={p.shape === "portrait" ? "(min-width: 768px) 44vh, 70vw" : "(min-width: 768px) 62vh, 86vw"}
                  className={
                    p.shape === "portrait"
                      ? "aspect-[3/4] h-[42svh] md:h-[53vh]"
                      : "aspect-[4/3] h-[28svh] md:h-[39vh]"
                  }
                />
                <figcaption data-gcap className="mt-5 grid max-w-[24rem] grid-cols-[2.2rem_1fr] gap-x-3">
                  <span className="folio pt-1.5">{p.n}</span>
                  <div>
                    <p className="font-serif text-[1.9rem] leading-none tracking-[-0.015em] md:text-[2.2rem]">{p.name}</p>
                    <p className="eyebrow mt-3 text-mute">
                      {p.place} · {p.year} · {p.area}
                    </p>
                    <p className="mt-3 hidden text-[0.875rem] leading-[1.6] text-ink/70 md:block">{p.note}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="gutter">
          <div className="relative h-px bg-line" aria-hidden="true">
            <div data-gallery-bar className="absolute inset-0 origin-left scale-x-0 bg-clay" />
          </div>
        </div>
      </div>
    </section>
  );
}
