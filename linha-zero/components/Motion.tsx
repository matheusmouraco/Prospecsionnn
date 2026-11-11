'use client';

import { useEffect } from 'react';

/*
  All motion for the page lives here, wired by data attributes so every section stays a server component.
  GSAP, its plugins and Lenis are imported after hydration, outside the critical path.

  Rules kept everywhere:
  - only transform, opacity and stroke (DrawSVG) are animated
  - scrubbed tweens use ease "none"; entrances use "expo.out"
  - prefers-reduced-motion: nothing loads, the markup already ships in its final state
  - mobile: one light parallax layer, shorter pin

  Performance: each section is set up in its own task (yielding to the main thread in between),
  hero first. One big setup used to be a ~0.5 s long task on a throttled phone and cost the TBT.
*/

declare global {
  interface Window {
    __lzMotion?: boolean;
  }
}

type Ctx = { desktop: boolean };
type Setup = (ctx: Ctx) => void;

const yieldToMain = () =>
  new Promise<void>((resolve) => {
    const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
    if (s?.yield) s.yield().then(resolve);
    else setTimeout(resolve, 0);
  });

export function Motion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { DrawSVGPlugin }, { SplitText }, { default: Lenis }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/DrawSVGPlugin'),
        import('gsap/SplitText'),
        import('lenis'),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);
      ScrollTrigger.config({ ignoreMobileResize: true });
      window.__lzMotion = true;

      const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
        Array.from(root.querySelectorAll<T>(sel));
      const one = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
        root.querySelector<T>(sel);

      /* ---------- smooth scroll ---------- */
      const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const onAnchor = (e: MouseEvent) => {
        const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a) return;
        const target = one(a.getAttribute('href') || '');
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) });
      };
      document.addEventListener('click', onAnchor);

      /* ---------- 1. HERO: the plan draws itself on load ---------- */
      const hero: Setup = ({ desktop }) => {
        const root = one('[data-hero]');
        if (!root) return;
        const plan = one('#hero-plan', root)!;
        const notes = one('#hero-notes', root)!;
        gsap.set($('[data-reveal="hero"]', root), { opacity: 1 });

        gsap
          .timeline({ defaults: { ease: 'expo.out' }, delay: 0.25 })
          .from($('[data-layer="walls"] path', plan), { drawSVG: 0, duration: 1.5, stagger: 0.07 })
          .from($('[data-layer="inner"] path', plan), { drawSVG: 0, duration: 1.2, stagger: 0.06 }, 0.7)
          .from($('[data-layer="openings"] path', plan), { drawSVG: 0, duration: 1, stagger: 0.03 }, 1.2)
          .from($('[data-layer="labels"] text', plan), { opacity: 0, y: 6, duration: 1, stagger: 0.06 }, 1.6)
          // dimensions arrive like annotations: line, then ticks, then the value
          .from($('[data-layer="dims"] path', notes), { drawSVG: 0, duration: 1.2, stagger: 0.08 }, 1.8)
          .from($('[data-layer="dims"] text', notes), { opacity: 0, y: 4, duration: 0.9, stagger: 0.07 }, 2.3)
          .from($('[data-layer="marks"] path', notes), { drawSVG: 0, duration: 1.2, stagger: 0.04 }, 2.2)
          .from($('[data-layer="marks"] text', notes), { opacity: 0, duration: 0.8, stagger: 0.05 }, 2.6)
          .fromTo('[data-scroll-cue]', { scaleY: 0 }, { scaleY: 1, duration: 1.2 }, 2.4);

        // scroll cue keeps travelling down its hairline
        gsap.to('[data-scroll-cue]', { yPercent: 100, duration: 1.6, ease: 'expo.inOut', repeat: -1, repeatDelay: 0.4, delay: 3.8 });

        // three depths of parallax. On mobile only the grid moves.
        const st = { trigger: root, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(one('[data-depth="1"]', root), { y: desktop ? 140 : 70, ease: 'none', scrollTrigger: st });
        if (desktop) {
          gsap.to(one('[data-depth="2"]', root), { y: 60, ease: 'none', scrollTrigger: st });
          gsap.to(one('[data-depth="3"]', root), { y: -70, ease: 'none', scrollTrigger: st });
          gsap.to(one('[data-hero-copy]', root), { y: -40, opacity: 0.15, ease: 'none', scrollTrigger: st });
        }
      };

      /* ---------- 2. PINNED: plan finishes, tilts, becomes the photo ---------- */
      const pinned: Setup = ({ desktop }) => {
        const pin = one('[data-pin]');
        if (!pin) return;
        const planWrap = one('[data-plan]', pin)!;
        const outer = one('[data-photo-outer]', pin)!;
        const inner = one('[data-photo-inner]', pin)!;
        const zoom = one('[data-photo-zoom]', pin)!;
        const scan = one('[data-scan]', pin)!;
        const paper = one('[data-bg-paper]', pin)!;
        const grid = one('[data-bg-grid]', pin)!;
        const uiNight = one('[data-ui="night"]', pin)!;
        const uiPaper = one('[data-ui="paper"]', pin)!;
        const progress = one('[data-progress]', pin);

        // starting state (markup ships in the final state)
        gsap.set(outer, { yPercent: 100 });
        gsap.set(inner, { yPercent: -100 });
        gsap.set(zoom, { scale: 1.14 });
        // the paper rises with the scan line (scaleY from the bottom) instead of cross-fading through grey
        gsap.set(paper, { scaleY: 0, transformOrigin: '50% 100%' });
        gsap.set(uiNight, { opacity: 1 });
        gsap.set(uiPaper, { opacity: 0 });

        let last = -1;
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: pin,
              start: 'top top',
              end: desktop ? '+=270%' : '+=190%',
              scrub: true,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                if (!progress) return;
                const v = Math.min(100, Math.round((self.progress / 0.42) * 100));
                if (v !== last) progress.textContent = String((last = v)).padStart(3, '0');
              },
            },
          })
          .from($('[data-layer="furniture"] path', pin), { drawSVG: 0, duration: 1, stagger: 0.025 }, 0)
          .from($('[data-layer="site"] path', pin), { drawSVG: 0, duration: 1.1, stagger: 0.08 }, 0.2)
          .from($('[data-layer="detail"] path', pin), { drawSVG: 0, duration: 0.6, stagger: 0.12 }, 0.8)
          .from($('[data-layer="detail"] text', pin), { opacity: 0, duration: 0.3, stagger: 0.12 }, 1.1)
          // the drawing lifts into perspective, like a sheet tilted on the table
          .to(planWrap, { rotateX: desktop ? 52 : 38, scale: 0.9, yPercent: -3, duration: 1 }, 1.7)
          // the photo wipes in from the bottom; the scan line rides the mask edge
          .to(scan, { opacity: 1, duration: 0.15 }, 2.35)
          .to(outer, { yPercent: 0, duration: 1.5 }, 2.4)
          .to(inner, { yPercent: 0, duration: 1.5 }, 2.4)
          .to(planWrap, { opacity: 0, duration: 1 }, 2.75)
          .to(grid, { opacity: 0, duration: 0.8 }, 2.8)
          .to(paper, { scaleY: 1, duration: 1.5 }, 2.4)
          .to(uiNight, { opacity: 0, duration: 0.6 }, 2.8)
          .to(uiPaper, { opacity: 1, duration: 0.5 }, 3.4)
          .to(scan, { opacity: 0, duration: 0.25 }, 3.75)
          .to(zoom, { scale: 1, duration: 1.4 }, 3.4)
          .to({}, { duration: 0.5 });
      };

      /* ---------- 3. PROJECTS: croqui traced on scrub, photo revealed on entry ---------- */
      const projectRow =
        (row: HTMLElement): Setup =>
        ({ desktop }) => {
          const sketch = one('[data-croqui]', row);
          if (sketch) {
            gsap
              .timeline({
                defaults: { ease: 'none' },
                scrollTrigger: { trigger: sketch, start: 'top 88%', end: 'bottom 40%', scrub: true },
              })
              .from($('[data-stroke]', sketch), { drawSVG: 0, duration: 1, stagger: 0.18 })
              .from($('[data-note]', sketch), { opacity: 0, duration: 0.4, stagger: 0.1 }, '-=0.5');
          }

          const outer = one('[data-photo-outer]', row);
          const inner = one('[data-photo-inner]', row);
          if (outer && inner) {
            const st = { trigger: outer, start: 'top 82%', once: true };
            gsap.fromTo(outer, { yPercent: 100 }, { yPercent: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: st });
            gsap.fromTo(inner, { yPercent: -100 }, { yPercent: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: st });
          }

          if (desktop) {
            const range = { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true };
            gsap.fromTo(one('[data-depth="1"]', row), { y: 50 }, { y: -50, ease: 'none', scrollTrigger: range });
            gsap.fromTo(one('[data-depth="2"]', row), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: range });
            gsap.fromTo(one('[data-depth="3"]', row), { y: 110 }, { y: -60, ease: 'none', scrollTrigger: range });
          }
        };

      /* ---------- 4. PROCESS: the timeline draws, each stage sketches itself ---------- */
      const processLine: Setup = () => {
        const timeline = one('[data-timeline]');
        if (!timeline) return;
        gsap.from(one('[data-timeline-line]', timeline), {
          drawSVG: 0,
          ease: 'none',
          scrollTrigger: { trigger: timeline, start: 'top 72%', end: 'bottom 72%', scrub: true },
        });
      };
      const processStep =
        (step: HTMLElement): Setup =>
        () => {
          const t = gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: step, start: 'top 78%', end: 'top 38%', scrub: true },
            })
            .from(one('[data-node]', step), { scale: 0, transformOrigin: '50% 50%', duration: 0.3 })
            .from($('[data-stage] [data-stroke]', step), { drawSVG: 0, duration: 1, stagger: 0.12 }, 0.1)
            .from(one('[data-dim]', step), { drawSVG: 0, duration: 0.6 }, 0.4);
          const notes = $('[data-stage] [data-note]', step);
          if (notes.length) t.from(notes, { opacity: 0, duration: 0.3, stagger: 0.08 }, 0.7);
        };

      /* ---------- 5. CONTACT: the zero line crosses the page ---------- */
      const contact: Setup = () => {
        const zero = one('[data-zero]');
        if (!zero) return;
        gsap
          .timeline({
            scrollTrigger: { trigger: zero, start: 'top bottom', end: 'max', scrub: true },
            defaults: { ease: 'none' },
          })
          .from(zero, { drawSVG: 0, duration: 1 })
          .from($('[data-zero-note]'), { opacity: 0, duration: 0.3, stagger: 0.4 }, 0.2);
      };

      /* ---------- shared: split titles and fades (entrances, expo.out) ---------- */
      const titles: Setup = () => {
        $('[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 125,
                duration: 1.5,
                ease: 'expo.out',
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: 'top 86%', once: true },
              }),
          });
        });
      };
      const fades: Setup = () => {
        $('[data-reveal="fade"]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } },
          );
        });
      };

      // Order matters: the pin must exist before anything below it measures its start.
      const setups: Setup[] = [
        hero,
        pinned,
        ...$('[data-project]').map(projectRow),
        processLine,
        ...$('[data-step]').map(processStep),
        contact,
        titles,
        fades,
      ];

      const mm = gsap.matchMedia();
      cleanup = () => {
        document.removeEventListener('click', onAnchor);
        mm.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };

      const conditions = { desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' };
      for (const setup of setups) {
        if (disposed) return;
        mm.add(conditions, (c) => setup({ desktop: Boolean(c.conditions?.desktop) }));
        await yieldToMain();
      }

      // every trigger measured itself when created; re-measure only if web fonts were still loading
      if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(() => ScrollTrigger.refresh());
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return null;
}
