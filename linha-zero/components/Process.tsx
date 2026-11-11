import { ProcessSketch } from './drawings/ProcessSketches';
import { steps } from '@/lib/site';

export function Process() {
  return (
    <section id="processo" className="relative isolate bg-night text-line" aria-labelledby="processo-title">
      <div className="bp-grid absolute inset-0 -z-10 opacity-50" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1600px] gap-16 px-4 py-24 sm:px-8 md:grid-cols-12 md:gap-8 md:py-40 lg:px-12">
        <header className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <p className="eyebrow text-cyan">Prancha 04 · Processo</p>
            <h2
              id="processo-title"
              data-split
              className="mt-6 text-[clamp(2.4rem,4.4vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.045em] text-white"
            >
              Cinco etapas.
              <br />
              Um só traço.
            </h2>
            <p data-reveal="fade" className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-line/70 sm:text-base">
              A mesma casa atravessa todas as fases. Nada se perde entre quem desenha e quem constrói, porque é o
              mesmo time do começo ao fim.
            </p>
          </div>
        </header>

        <ol data-timeline className="relative md:col-span-7 md:col-start-6">
          {/* the line that draws itself with scroll */}
          <svg
            className="draw pointer-events-none absolute left-[7px] top-2 h-[calc(100%-1rem)] w-[2px] text-line/60"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path data-timeline-line d="M1 0 V100" strokeWidth={1} />
          </svg>

          {steps.map((s, i) => (
            <li key={s.n} data-step className="relative grid gap-6 pb-20 pl-10 last:pb-0 sm:pl-14 lg:grid-cols-[1fr_minmax(220px,300px)] lg:gap-10">
              {/* node */}
              <svg className="draw absolute left-0 top-1 h-4 w-4 text-cyan" viewBox="0 0 16 16" aria-hidden="true">
                <circle data-node cx="8" cy="8" r="5" strokeWidth={1.2} className="fill-night" />
              </svg>
              <div>
                <p className="mono text-sm text-cyan">{s.n}</p>
                <h3 data-reveal="fade" className="mt-2 text-[clamp(1.6rem,2.6vw,2.25rem)] font-medium leading-tight tracking-[-0.03em] text-white">
                  {s.title}
                </h3>
                <p data-reveal="fade" className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-line/70">
                  {s.text}
                </p>
                {/* the duration, drawn like a dimension line */}
                <div className="mt-6 flex items-center gap-3 text-cyan">
                  <svg className="draw h-3 w-28 shrink-0" viewBox="0 0 112 12" aria-hidden="true">
                    <path data-dim d="M2 6 H110 M2 1 V11 M110 1 V11 M-2 10 L6 2 M106 10 L114 2" strokeWidth={1} />
                  </svg>
                  <span className="mono text-[11px] uppercase tracking-[0.12em]">{s.time}</span>
                </div>
              </div>
              <div className="relative aspect-[3/2] w-full max-w-[300px] border border-line/15 bg-night/60 p-3 text-line">
                <ProcessSketch stage={i} />
                <span className="eyebrow absolute bottom-2 right-3 text-[9px] text-line/40">Fig. {s.n}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
