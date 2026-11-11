'use client';

import { useEffect } from 'react';
import { loadGsap } from '@/lib/gsap';

const EASE = 'power2.out';

/**
 * Resolves on the first sign of engagement (scroll, touch, pointer, key) or after a short timeout.
 * The first viewport animates in CSS, so GSAP is only needed once the visitor starts moving,
 * and loading it later keeps the main thread free while the page paints.
 */
function whenEngaged(timeout = 3500): Promise<void> {
  return new Promise((resolve) => {
    const events = ['scroll', 'wheel', 'touchstart', 'pointermove', 'keydown'] as const;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, go));
      window.clearTimeout(timer);
      resolve();
    };
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const timer = window.setTimeout(() => {
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(go, { timeout: 1000 });
      else go();
    }, timeout);
  });
}

/**
 * Page-wide motion: Lenis smooth scroll, rules drawing on scroll,
 * masked line reveals, slight parallax and touch colorize. Only transform and opacity animate.
 * One-shot reveals use IntersectionObserver (no layout reads up front); ScrollTrigger is kept
 * for the scrubbed parallax and the touch colorize band.
 */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      await whenEngaged();
      if (cancelled) return;
      const { gsap, ScrollTrigger, SplitText } = await loadGsap();
      if (cancelled) return;

      const colorize = () =>
        gsap.utils.toArray<HTMLElement>('[data-colorize]').map((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: 'top 62%',
            end: 'bottom 38%',
            toggleClass: { targets: el, className: 'is-color' },
          }),
        );

      if (reduce) {
        const triggers = touch ? colorize() : [];
        cleanup = () => triggers.forEach((t) => t.kill());
        return;
      }

      const { default: Lenis } = await import('lenis');
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => 1 - (1 - t) * (1 - t),
        anchors: { offset: -48 },
      });
      lenis.on('scroll', ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      await document.fonts.ready;
      if (cancelled) return;

      // If the boot fallback already revealed everything, keep it that way and skip the reveals.
      const animate = root.classList.contains('motion');
      const splits: SplitText[] = [];

      const reveal = (el: HTMLElement) => {
        const delay = Number(el.dataset.delay ?? 0);
        if (el.hasAttribute('data-rule')) {
          gsap.to(el, { scaleX: 1, duration: 1.1, ease: EASE, delay });
        } else if (el.hasAttribute('data-fade')) {
          gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE, delay });
        } else if (el.hasAttribute('data-split')) {
          const split = SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'line',
            aria: 'none', // lines keep whole words, so reading order stays intact
          });
          split.masks.forEach((m) => m.classList.add('line-mask'));
          gsap.set(el, { opacity: 1 });
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 0.9,
            ease: EASE,
            stagger: 0.08,
            delay,
            onComplete: () => split.revert(), // back to plain text so resizes reflow naturally
          });
          splits.push(split);
        }
      };

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            io.unobserve(entry.target);
            reveal(entry.target as HTMLElement);
          });
        },
        { rootMargin: '0px', threshold: 0 },
      );
      if (animate) {
        document.querySelectorAll<HTMLElement>('[data-rule], [data-fade], [data-split]').forEach((el) => io.observe(el));
      }

      // Large photos drift slightly inside their frame.
      const parallax = gsap.utils.toArray<HTMLElement>('[data-parallax]').flatMap((frame) => {
        const inner = frame.querySelector('[data-parallax-inner]');
        if (!inner) return [];
        return [
          gsap.fromTo(
            inner,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          ),
        ];
      });

      const touchTriggers = touch ? colorize() : [];
      root.classList.add('motion-ready');

      cleanup = () => {
        io.disconnect();
        parallax.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
        touchTriggers.forEach((t) => t.kill());
        splits.forEach((s) => s.revert());
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
