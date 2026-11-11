import { steps } from "@/lib/content";

export function Process() {
  return (
    <section id="processo" className="gutter py-[var(--section)]">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12">
        <div className="flex items-baseline gap-3 md:col-span-3" data-fade>
          <span className="folio">(03)</span>
          <span className="eyebrow">Processo</span>
        </div>
        <h2 data-split className="display text-[clamp(3.1rem,7.6vw,8.8rem)] md:col-span-9">
          Do primeiro café à <em className="italic">entrega</em> das chaves.
        </h2>
      </div>

      <ol className="mt-[clamp(5rem,11vw,10rem)]">
        {steps.map((s) => (
          <li key={s.n} className="relative grid grid-cols-1 gap-x-6 pt-9 pb-16 md:grid-cols-12 md:pt-12 md:pb-24">
            <span data-rule className="absolute inset-x-0 top-0 h-px bg-line" aria-hidden="true" />
            <span
              data-fade
              className="display text-clay italic text-[clamp(5.5rem,13vw,12.5rem)] leading-[0.78] md:col-span-3"
              aria-hidden="true"
            >
              {s.n}
            </span>
            <h3
              data-fade
              className="mt-8 font-serif text-[clamp(2.4rem,4.2vw,4rem)] font-light leading-none tracking-[-0.02em] md:col-span-4 md:mt-3"
            >
              <span className="sr-only">Etapa {s.n}: </span>
              {s.title}
            </h3>
            <div data-fade className="mt-6 md:col-span-4 md:col-start-9 md:mt-4">
              <p className="max-w-[26rem] text-[1rem] leading-[1.7] text-ink/75">{s.text}</p>
              <p className="eyebrow mt-7 text-mute">Duração média · {s.time}</p>
            </div>
          </li>
        ))}
      </ol>
      <span data-rule className="block h-px bg-line" aria-hidden="true" />
    </section>
  );
}
