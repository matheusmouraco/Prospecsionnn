import { figures, numeros, principios } from '@/lib/data';
import Photo from './Photo';
import Rule from './Rule';

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative pt-24 md:pt-36" aria-labelledby="manifesto-title">
      <Rule />
      <div className="g pt-3 pb-12 md:pb-20">
        <p className="label c col-span-4 md:col-span-3" data-fade>
          (02) Manifesto
        </p>
        <h2
          id="manifesto-title"
          className="display c col-span-4 md:col-span-9 mt-6 md:mt-0 text-[clamp(1.9rem,4.4vw,4.75rem)] leading-[0.95]"
          data-split
        >
          O concreto não mente. Ele guarda a marca da fôrma, o peso da estrutura e o tempo da obra. Por isso a gente
          não esconde nada.
        </h2>
      </div>

      {/* three principles in columns 4 to 12 */}
      <div className="g">
        <p className="label c col-span-4 md:col-span-3 text-mute pb-6 md:pb-0" data-fade>
          Três princípios
        </p>
        {principios.map((p, i) => (
          <article
            key={p.n}
            className="c col-span-4 md:col-span-3 pb-10 md:pb-0 max-md:border-t max-md:border-ink max-md:pt-4"
            data-fade
            data-delay={String(i * 0.08)}
          >
            <p className="label text-accent">{p.n}</p>
            <h3 className="display text-[clamp(1.35rem,1.9vw,1.9rem)] mt-4 md:mt-6">{p.title}</h3>
            <p className="mt-4 text-[15px] md:text-base leading-[1.5] text-ink/85 max-w-[34ch]">{p.text}</p>
          </article>
        ))}
      </div>

      {/* figures: asymmetric placement on the grid */}
      <div className="g pt-20 md:pt-32 gap-y-12 items-end">
        <figure className="c col-span-3 md:col-span-4 md:col-start-4">
          <Photo src={figures[0]!.src} alt={figures[0]!.alt} sizes="(min-width: 768px) 33vw, 70vw" className="aspect-[4/5]" />
          <figcaption className="flex justify-between gap-4 pt-2.5">
            <span className="label">{figures[0]!.caption}</span>
            <span className="label text-mute text-right">{figures[0]!.label}</span>
          </figcaption>
        </figure>
        <figure className="c col-span-4 md:col-span-4 md:col-start-9 md:mb-24">
          <Photo src={figures[1]!.src} alt={figures[1]!.alt} sizes="(min-width: 768px) 33vw, 92vw" className="aspect-[4/3]" />
          <figcaption className="flex justify-between gap-4 pt-2.5">
            <span className="label">{figures[1]!.caption}</span>
            <span className="label text-mute text-right">{figures[1]!.label}</span>
          </figcaption>
        </figure>
      </div>

      {/* numbers band */}
      <div className="pt-20 md:pt-32">
        <Rule />
        <dl className="g">
          {numeros.map((item, i) => (
            <div
              key={item.label}
              className={`c col-span-2 md:col-span-3 pt-3 pb-8 md:pb-10 ${i > 0 ? 'md:border-l md:border-ink' : ''} ${i % 2 === 1 ? 'max-md:border-l max-md:border-ink' : ''} ${i > 1 ? 'max-md:border-t max-md:border-ink' : ''}`}
              data-fade
              data-delay={String(i * 0.06)}
            >
              <dt className="label text-mute">{item.label}</dt>
              <dd className="display text-[clamp(3rem,7.5vw,7.5rem)] leading-[0.85] mt-8 md:mt-14 tabular-nums">{item.value}</dd>
            </div>
          ))}
        </dl>
        <Rule />
      </div>
    </section>
  );
}
