import { about } from "@/lib/content";
import { RevealImage } from "./RevealImage";

export function About() {
  return (
    <section id="atelie" className="gutter pb-[var(--section)]">
      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="flex items-baseline gap-3" data-fade>
            <span className="folio">(04)</span>
            <span className="eyebrow">Ateliê</span>
          </div>
          <h2 data-split className="display mt-10 text-[clamp(3.2rem,7.2vw,8.4rem)]">
            Um ateliê pequeno, <em className="italic">por escolha.</em>
          </h2>
          <div className="mt-12 max-w-[34rem] space-y-6 text-[1.0625rem] leading-[1.7] text-ink/80 md:mt-16 md:text-[1.1875rem]">
            <p data-fade>
              O Atelier Vareda nasceu em 2009, quando Helena Vareda e Tomás Albuquerque deixaram os grandes escritórios
              para desenhar casas do jeito que acreditavam: com tempo, maquete na mesa e obra acompanhada de perto.
            </p>
            <p data-fade>
              Hoje somos onze pessoas numa casa de vila em Pinheiros. Aceitamos no máximo seis projetos por ano, para
              que cada família tenha a atenção inteira de quem desenha.
            </p>
          </div>
        </div>

        <div className="mt-16 md:col-span-5 md:col-start-8 md:mt-28">
          <RevealImage
            src={about.portrait.src}
            alt={about.portrait.alt}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="aspect-[4/5] w-full"
          />
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 items-end gap-x-6 gap-y-16 md:mt-[-6vw] md:grid-cols-12">
        <div className="md:col-span-3 md:col-start-2">
          <RevealImage
            src={about.detail.src}
            alt={about.detail.alt}
            sizes="(min-width: 768px) 24vw, 70vw"
            className="aspect-[4/5] w-[62%] md:w-full"
          />
        </div>
        <dl className="grid grid-cols-3 gap-x-5 md:col-span-6 md:col-start-7 md:gap-x-6">
          {about.stats.map((s) => (
            <div key={s.label} className="relative pt-5">
              <span data-rule className="absolute inset-x-0 top-0 h-px bg-ink/40" aria-hidden="true" />
              <dt className="sr-only">{s.label}</dt>
              <dd data-fade>
                <span className="display block text-[clamp(3.2rem,6vw,6rem)] leading-none">{s.value}</span>
                <span className="eyebrow mt-3 block text-mute">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
