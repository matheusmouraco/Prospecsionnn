'use client';

import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { filtros, projects, type Tipologia } from '@/lib/data';
import { loadGsap } from '@/lib/gsap';
import Photo from './Photo';
import Rule from './Rule';
import SectionHead from './SectionHead';

type Filtro = 'Todos' | Tipologia;
type Bundle = Awaited<ReturnType<typeof loadGsap>>;
type FlipState = ReturnType<Bundle['Flip']['getState']>;

const FOLLOW_MQ = '(min-width: 768px) and (hover: hover) and (pointer: fine)';
const pad = (n: number) => String(n).padStart(2, '0');

export default function Projects() {
  const [filter, setFilter] = useState<Filtro>('Todos');
  const [active, setActive] = useState<number | null>(null);
  const [armed, setArmed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const followRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const gsapRef = useRef<Bundle | null>(null);
  const flipState = useRef<FlipState | null>(null);
  const moveTo = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);
  const canFollow = useRef(false);

  // Load GSAP and mount the follower images only when the section gets close.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    canFollow.current = matchMedia(FOLLOW_MQ).matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        setArmed(true);
        loadGsap().then((b) => {
          gsapRef.current = b;
          const el = followRef.current;
          if (!el) return;
          b.gsap.set(el, { xPercent: 0, yPercent: -50, opacity: 0, scale: 0.92 });
          // The short lag between cursor and image comes from this tween length.
          moveTo.current = {
            x: b.gsap.quickTo(el, 'x', { duration: 0.65, ease: 'power2.out' }),
            y: b.gsap.quickTo(el, 'y', { duration: 0.65, ease: 'power2.out' }),
          };
        });
      },
      { rootMargin: '60% 0px' },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Filter change: animate rows from their previous layout with Flip.
  useLayoutEffect(() => {
    const b = gsapRef.current;
    const state = flipState.current;
    if (!b || !state) return;
    flipState.current = null;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    b.Flip.from(state, {
      duration: reduce ? 0 : 0.55,
      ease: 'power2.out',
      absolute: true,
      stagger: 0.03,
      onEnter: (els) => b.gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.4, delay: 0.15 }),
      onLeave: (els) => b.gsap.to(els, { opacity: 0, duration: reduce ? 0 : 0.25 }),
      onComplete: () => b.ScrollTrigger.refresh(),
    });
  }, [filter]);

  // Active row: cross-fade the follower stack, then bring the color in a beat later.
  useEffect(() => {
    const b = gsapRef.current;
    const el = followRef.current;
    if (!b || !el || active === null) return;
    const stacks = el.querySelectorAll<HTMLElement>('[data-stack]');
    stacks.forEach((stack, i) => {
      const isOn = i === active;
      b.gsap.to(stack, { opacity: isOn ? 1 : 0, duration: 0.3, overwrite: 'auto' });
      const color = stack.querySelector('.color');
      const img = stack.querySelector('[data-zoom]');
      if (isOn) {
        if (img) b.gsap.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 0.7, overwrite: 'auto' });
        if (color) b.gsap.fromTo(color, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.35, overwrite: 'auto' });
      } else if (color) {
        b.gsap.set(color, { opacity: 0, delay: 0.3 });
      }
    });
    const p = projects[active];
    if (captionRef.current && p) captionRef.current.textContent = `Nº ${p.n} / ${p.programa} / ${p.city}, ${p.year}`;
  }, [active]);

  const choose = (f: Filtro) => {
    if (f === filter) return;
    const b = gsapRef.current;
    if (b && listRef.current) flipState.current = b.Flip.getState(listRef.current.querySelectorAll('[data-row]'));
    setFilter(f);
  };

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = followRef.current;
    if (!canFollow.current || !moveTo.current || !el) return;
    const w = el.offsetWidth;
    const gutter = 24;
    const x = Math.min(e.clientX + 28, window.innerWidth - w - gutter);
    moveTo.current.x(x);
    moveTo.current.y(e.clientY);
  }, []);

  const onEnterList = (e: React.PointerEvent) => {
    const b = gsapRef.current;
    const el = followRef.current;
    if (!canFollow.current || !b || !el) return;
    const w = el.offsetWidth;
    b.gsap.set(el, { x: Math.min(e.clientX + 28, window.innerWidth - w - 24), y: e.clientY });
    b.gsap.to(el, { opacity: 1, scale: 1, duration: 0.4, overwrite: 'auto' });
  };

  const onLeaveList = () => {
    setActive(null);
    const b = gsapRef.current;
    if (b && followRef.current) b.gsap.to(followRef.current, { opacity: 0, scale: 0.92, duration: 0.3, overwrite: 'auto' });
  };

  const counts = (f: Filtro) => (f === 'Todos' ? projects.length : projects.filter((p) => p.tipologia === f).length);

  return (
    <section id="projetos" ref={sectionRef} className="relative pt-24 md:pt-36" aria-labelledby="projetos-title">
      <SectionHead index="01" label="Projetos" title="Seis obras, um só material." id="projetos-title" />

      <div className="g pb-5 md:pb-6 items-baseline">
        <p className="label c col-span-4 md:col-span-3 text-mute mb-3 md:mb-0" data-fade>
          Filtrar por tipologia
        </p>
        <div className="c col-span-4 md:col-span-9 flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label="Filtrar projetos" data-fade>
          {filtros.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => choose(f)}
              aria-pressed={filter === f}
              className={`label flex items-center gap-2 py-1 cursor-pointer ${filter === f ? 'text-ink' : 'text-mute hover:text-ink'}`}
            >
              <span className={`block size-2 ${filter === f ? 'bg-accent' : 'border border-current'}`} aria-hidden />
              <span>{f}</span>
              <span className="text-mute">{pad(counts(f))}</span>
            </button>
          ))}
        </div>
      </div>

      {/* column heads */}
      <Rule />
      <div className="hidden md:grid g py-2.5 text-mute" aria-hidden>
        <span className="label c col-span-1">Nº</span>
        <span className="label c col-span-6">Projeto</span>
        <span className="label c col-span-2">Tipologia</span>
        <span className="label c col-span-2">Cidade</span>
        <span className="label c col-span-1 text-right">Ano</span>
      </div>
      <Rule />

      <ul
        ref={listRef}
        className={`proj-list relative ${active !== null ? 'is-hovering' : ''}`}
        onPointerEnter={onEnterList}
        onPointerLeave={onLeaveList}
        onPointerMove={onMove}
      >
        {projects.map((p, i) => {
          const shown = filter === 'Todos' || p.tipologia === filter;
          return (
            <li
              key={p.n}
              data-row
              data-flip-id={p.n}
              className={`proj-row group relative ${active === i ? 'is-active' : ''} ${shown ? '' : 'hidden'}`}
              onPointerEnter={() => setActive(i)}
            >
              <div className="g items-center py-4 md:py-5 min-h-[88px] md:min-h-[104px]">
                <span className="hidden md:block c col-span-1 label relative tabular-nums">
                  {p.n}
                  <span className="proj-num-accent absolute inset-y-0 left-[var(--inset)] text-accent" aria-hidden>
                    {p.n}
                  </span>
                </span>
                <div className="c col-span-4 md:col-span-6 flex items-center gap-4 md:gap-5">
                  <Photo
                    src={p.img}
                    alt=""
                    sizes="68px"
                    quality={60}
                    className="proj-thumb w-[68px] md:w-[60px] aspect-[4/5] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="label text-mute md:hidden tabular-nums">{p.n}</p>
                    <h3 className="proj-name display text-[clamp(1.6rem,3.5vw,3.4rem)] leading-[0.95]">{p.name}</h3>
                    <p className="label text-mute mt-1.5 md:hidden">
                      {p.programa} / {p.city} / {p.year}
                    </p>
                  </div>
                </div>
                <span className="hidden md:block c col-span-2 label">
                  {p.tipologia}
                  <br />
                  <span className="text-mute">{p.programa}</span>
                </span>
                <span className="hidden md:block c col-span-2 label">{p.city}</span>
                <span className="hidden md:block c col-span-1 label text-right tabular-nums">{p.year}</span>
              </div>
              <Rule />
            </li>
          );
        })}
      </ul>


      {/* image that trails the cursor (desktop with a fine pointer only) */}
      <div
        ref={followRef}
        className="cursor-media pointer-events-none fixed left-0 top-0 z-30 w-[clamp(220px,21vw,330px)] opacity-0"
        aria-hidden
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#cfcfcb]">
          {armed &&
            projects.map((p) => (
              <div key={p.n} data-stack className="absolute inset-0 opacity-0">
                <div data-zoom className="photo absolute inset-0">
                  <Image src={p.img} alt="" fill sizes="330px" quality={65} className="bw" />
                  <Image src={p.img} alt="" fill sizes="330px" quality={65} className="color" style={{ transition: 'none' }} />
                </div>
              </div>
            ))}
        </div>
        <p ref={captionRef} className="label mt-2 bg-paper inline-block pr-2" />
      </div>
    </section>
  );
}
