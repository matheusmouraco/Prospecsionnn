import Image from 'next/image';
import { FloorPlan } from './drawings/FloorPlan';
import { heroHouse } from '@/lib/site';

/*
  Pinned scene. The scroll timeline lives in Motion.tsx:
  plan finishes (furniture, site, interior dims) > tilts into perspective > the photo wipes in
  from the bottom behind a scan line while the plan cross-fades out and the page turns from night to paper.
  The UI around the frame exists twice (night and paper tones) and cross-fades, so no colour is animated.
  Markup ships in the final state (photo, paper); GSAP sets the starting state before the section scrolls in.
*/

function FrameUI({ tone }: { tone: 'night' | 'paper' }) {
  const night = tone === 'night';
  return (
    <div
      data-ui={tone}
      className={`pointer-events-none absolute inset-0 ${night ? 'text-line opacity-0' : 'text-ink'}`}
      aria-hidden="true"
    >
      <div className="mx-auto flex h-full max-w-[1600px] flex-col px-4 pb-6 pt-20 sm:px-8 sm:pb-8 sm:pt-24 lg:px-12">
        <div className="flex items-start justify-between gap-6">
          <p className={`eyebrow ${night ? 'text-cyan' : 'text-graphite'}`}>Prancha 02 · Do traço à obra</p>
          <p className="eyebrow hidden opacity-60 sm:block">{night ? 'Planta térreo · 1:100' : 'Fotografia da obra'}</p>
        </div>
        <p
          className={`mt-4 max-w-[22ch] text-[clamp(1.6rem,2.9vw,2.9rem)] font-medium leading-[1] tracking-[-0.035em] ${night ? 'text-white' : 'text-ink'}`}
        >
          {night ? 'O desenho termina de ser traçado.' : 'E vira a casa onde alguém mora.'}
        </p>
        <div className="mt-auto flex items-end justify-between gap-6">
          <p className="mono max-w-[38ch] text-[11px] uppercase leading-relaxed tracking-[0.12em] opacity-70">
            {night ? (
              <>
                Mobiliário · implantação · cotas internas
                <br />
                Nível de referência ±0,00
              </>
            ) : (
              <>
                {heroHouse.name} · {heroHouse.place}
                <br />
                Obra concluída em {heroHouse.year}
              </>
            )}
          </p>
          {night && (
            <p className="mono text-[11px] uppercase tracking-[0.12em] opacity-70">
              Traçado <span data-progress>000</span>%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CropMarks() {
  const c = 'absolute h-4 w-4 border-current';
  return (
    <div className="pointer-events-none absolute -inset-3 opacity-50" aria-hidden="true">
      <span className={`${c} left-0 top-0 border-l border-t`} />
      <span className={`${c} right-0 top-0 border-r border-t`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}

export function PlanToPhoto() {
  return (
    <section data-pin className="relative isolate overflow-hidden bg-night" style={{ height: '100svh' }} aria-labelledby="traco-title">
      <h2 id="traco-title" className="sr-only">
        Do traço à obra: a planta da {heroHouse.name} se transforma na fotografia da casa construída
      </h2>
      <div data-bg-paper className="absolute inset-0 -z-10 bg-paper" aria-hidden="true" />
      <div data-bg-grid className="bp-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />

      <FrameUI tone="night" />
      <FrameUI tone="paper" />

      <div className="absolute inset-0 flex items-center justify-center px-4 pb-28 pt-[210px] sm:px-8 sm:pt-[230px] md:pb-[124px] md:pt-[214px]">
        <div
          data-frame
          className="relative aspect-square w-full max-w-[460px] text-line sm:aspect-[1000/640] sm:max-w-[min(76vw,1180px)] md:max-h-full"
          style={{ perspective: '1600px' }}
        >
          <CropMarks />
          <div data-plan className="absolute inset-0 flex items-center" style={{ transformOrigin: '50% 80%' }}>
            <FloorPlan
              layers={['site', 'furniture', 'walls', 'inner', 'openings', 'labels', 'dims', 'marks', 'detail']}
              className="h-full w-full text-line"
            />
          </div>
          <div data-photo-outer className="absolute inset-0 overflow-hidden">
            <div data-photo-inner className="absolute inset-0 overflow-hidden">
              <div data-photo-zoom className="absolute inset-0">
                <Image
                  src={heroHouse.src}
                  alt={heroHouse.alt}
                  fill
                  sizes="(min-width: 1560px) 1180px, (min-width: 640px) 76vw, 92vw"
                  className="object-cover"
                />
              </div>
            </div>
            <span data-scan className="absolute inset-x-0 top-0 block h-px bg-cyan opacity-0 shadow-[0_0_18px_2px_rgba(143,195,214,0.55)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
