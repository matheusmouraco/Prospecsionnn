import { FloorPlan } from './drawings/FloorPlan';

const titleLines = ['Do traço', 'à obra pronta.'];

export function Hero() {
  return (
    <section
      id="topo"
      data-hero
      className="hero-ready relative isolate flex min-h-[640px] flex-col overflow-hidden bg-night text-line"
      style={{ height: '100svh' }}
      aria-labelledby="hero-title"
    >
      {/* depth 1: blueprint grid, the slowest layer */}
      <div data-depth="1" className="bp-grid absolute -inset-x-0 -top-[15%] -bottom-[15%] -z-10" aria-hidden="true" />

      {/* depth 2 + 3: the plan and its annotations share one box and separate on scroll */}
      <div
        className="pointer-events-none absolute -z-10 left-1/2 top-[14%] w-[150vw] -translate-x-[46%] sm:top-[11%] sm:w-[118vw] md:left-auto md:right-[-6vw] md:top-[10%] md:w-[64vw] md:translate-x-0 lg:right-[1vw] lg:top-[11%] lg:w-[53vw]"
        aria-hidden="true"
      >
        <div className="relative aspect-[1000/640]">
          <div data-depth="2" data-reveal="hero" className="absolute inset-0">
            <FloorPlan id="hero-plan" layers={['walls', 'inner', 'openings', 'labels']} className="h-full w-full text-line/90" />
          </div>
          <div data-depth="3" data-reveal="hero" className="absolute inset-0">
            <FloorPlan id="hero-notes" layers={['dims', 'marks']} className="h-full w-full text-line/80" />
          </div>
        </div>
      </div>

      {/* fades the plan behind the type on small screens so the title always reads */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%] bg-gradient-to-t from-night via-night/85 to-transparent md:h-[55%] md:via-night/40"
        aria-hidden="true"
      />

      <div className="mx-auto mt-auto w-full max-w-[1600px] px-4 pb-10 sm:px-8 sm:pb-14 lg:px-12">
        <div data-hero-copy className="max-w-[1100px]">
          <p className="eyebrow mb-6 text-cyan sm:mb-8">Arquitetura residencial · São Paulo</p>
          <h1
            id="hero-title"
            className="text-[clamp(2.6rem,11.4vw,4.5rem)] sm:text-[clamp(3rem,9vw,6rem)] lg:text-[clamp(4rem,7.1vw,8.25rem)] font-medium leading-[0.9] tracking-[-0.045em] text-white"
          >
            {titleLines.map((line, i) => (
              <span key={line} className="line-mask" style={{ ['--i' as string]: i }}>
                <span className={i === 1 ? 'md:pl-[0.9em]' : undefined}>{line}</span>
              </span>
            ))}
          </h1>
          <div className="mt-8 flex flex-col gap-8 sm:mt-10 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[34ch] text-[15px] leading-relaxed text-line/75 sm:text-base">
              Projetamos casas do primeiro croqui à entrega das chaves. O mesmo time e o mesmo desenho, do começo ao
              fim da obra.
            </p>
            <div className="flex items-end gap-10">
              <div className="flex items-center gap-4" aria-hidden="true">
                <span className="eyebrow text-line/60">Role para construir</span>
                <span className="relative block h-12 w-px overflow-hidden bg-line/15">
                  <span data-scroll-cue className="absolute inset-0 origin-top bg-cyan" />
                </span>
              </div>
            {/* title block (carimbo), like the corner stamp of a drawing sheet */}
            <dl
              className="mono hidden grid-cols-[auto_auto] border border-line/20 text-[10.5px] uppercase tracking-[0.12em] text-line/65 xl:grid"
              aria-label="Carimbo da prancha"
            >
              {[
                ['Projeto', 'Casa Jatobá'],
                ['Desenho', 'Planta térreo'],
                ['Escala', '1:100'],
                ['Folha', '01 / 05'],
              ].map(([k, v], i, all) => {
                const edge = i < all.length - 1 ? 'border-b border-line/20' : '';
                return (
                  <div key={k} className="contents">
                    <dt className={`border-r border-line/20 px-3 py-2 opacity-60 ${edge}`}>{k}</dt>
                    <dd className={`px-3 py-2 text-line ${edge}`}>{v}</dd>
                  </div>
                );
              })}
            </dl>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
