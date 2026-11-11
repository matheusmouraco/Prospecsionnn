import Image from 'next/image';
import { Croqui } from './drawings/Croquis';
import { projects, type Project } from '@/lib/site';

function ProjectRow({ p, flip }: { p: Project; flip: boolean }) {
  const portrait = p.aspect === 'portrait';
  const aspect = portrait ? 'aspect-[4/5]' : 'aspect-[4/3]';

  // Column placement on the 12-col grid. The portrait project breaks the rhythm on purpose.
  const sketchCols = portrait ? 'md:col-span-4 md:col-start-2' : flip ? 'md:col-span-5 md:col-start-8' : 'md:col-span-5';
  const photoCols = portrait ? 'md:col-span-5 md:col-start-7' : flip ? 'md:col-span-7 md:col-start-1 md:row-start-1' : 'md:col-span-7';
  const metaCols = portrait ? 'md:col-span-7 md:col-start-2' : flip ? 'md:col-span-6 md:col-start-1' : 'md:col-span-6 md:col-start-6';

  return (
    <article data-project className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-12 md:gap-y-10 lg:gap-x-8" aria-labelledby={`p-${p.id}`}>
      <figure data-depth="1" className={`${sketchCols} md:mt-16`}>
        <div className={`relative ${aspect} overflow-hidden bg-night text-line`}>
          <div className="bp-grid absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="absolute inset-0 p-[6%]">
            <Croqui id={p.sketch} index={p.index} />
          </div>
        </div>
        <figcaption className="eyebrow mt-3 flex justify-between text-graphite">
          <span>Croqui</span>
          <span>{p.index} / 03</span>
        </figcaption>
      </figure>

      <figure className={photoCols}>
        <div data-photo-outer className={`relative ${aspect} overflow-hidden`}>
          <div data-photo-inner className="absolute inset-0 overflow-hidden">
            <div data-depth="2" className="absolute inset-0 md:-inset-y-[8%]">
              <Image
                src={p.photo.src}
                alt={p.photo.alt}
                fill
                sizes={portrait ? '(min-width: 768px) 40vw, 100vw' : '(min-width: 768px) 56vw, 100vw'}
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <figcaption className="eyebrow mt-3 flex justify-between text-graphite">
          <span>Obra pronta</span>
          <span>{p.year}</span>
        </figcaption>
      </figure>

      <div data-depth="3" className={`${metaCols} mt-4 md:mt-0`}>
        <div className="flex items-baseline gap-5">
          <span className="mono text-sm text-graphite">{p.index}</span>
          <h3 id={`p-${p.id}`} data-reveal="fade" className="text-[clamp(1.9rem,3.6vw,3.25rem)] font-medium leading-none tracking-[-0.035em]">
            {p.name}
          </h3>
        </div>
        <p data-reveal="fade" className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink/75 sm:text-base">
          {p.text}
        </p>
        <dl className="mono mt-7 grid grid-cols-3 border-t border-ink/15 text-[11px] uppercase tracking-[0.12em]">
          {[
            ['Local', p.place.split(',')[0]],
            ['Ano', p.year],
            ['Área', p.area],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-ink/15 py-3 pr-3">
              <dt className="text-graphite">{k}</dt>
              <dd className="mt-1 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projetos" className="relative bg-paper text-ink" aria-labelledby="projetos-title">
      <div className="mx-auto max-w-[1600px] px-4 pb-28 pt-24 sm:px-8 md:pb-40 md:pt-36 lg:px-12">
        <header className="mb-16 grid gap-6 md:mb-28 md:grid-cols-12">
          <p className="eyebrow text-graphite md:col-span-3">Prancha 03 · Obras</p>
          <h2
            id="projetos-title"
            data-split
            className="text-[clamp(2.4rem,6.4vw,6rem)] font-medium leading-[0.95] tracking-[-0.045em] md:col-span-9"
          >
            Três casas,
            <br />
            do croqui à chave.
          </h2>
          <p data-reveal="fade" className="max-w-[44ch] text-[15px] leading-relaxed text-ink/70 sm:text-base md:col-span-5 md:col-start-4">
            Todo projeto começa à mão. O croqui decide a implantação, o volume e a luz. A obra só confirma o que o
            desenho já sabia.
          </p>
        </header>
        <div className="flex flex-col gap-28 md:gap-44">
          {projects.map((p, i) => (
            <ProjectRow key={p.id} p={p} flip={i === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
