"use client";

import { useEffect } from "react";

type GSAP = typeof import("gsap").gsap;
type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type Split = typeof import("gsap/SplitText").SplitText;
type Kit = { gsap: GSAP; ScrollTrigger: ST; SplitText: Split };

const EASE = "expo.out";
const expoOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const $$ = (sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<HTMLElement>(sel));

/** Hand the main thread back to the browser between setup steps (keeps tasks short). */
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/** Bottom-to-top reveal: the mask slides up while its inner layer slides down by the same amount. */
function revealTimeline({ gsap }: Kit, frame: HTMLElement, vars: gsap.TimelineVars) {
  return gsap
    .timeline({ defaults: { ease: EASE, duration: 1.9 }, ...vars })
    .fromTo(frame.querySelector(".reveal-mask"), { y: 0, yPercent: 100 }, { yPercent: 0 })
    .fromTo(frame.querySelector(".reveal-inner"), { y: 0, yPercent: -100 }, { yPercent: 0 }, 0)
    .fromTo(frame.querySelector("[data-zoom]"), { scale: 1.2 }, { scale: 1, duration: 2.6 }, 0);
}

// Created first: its pin spacer changes the position of everything below it.
function setupGallery(kit: Kit) {
  const { gsap } = kit;
  const section = document.querySelector<HTMLElement>("[data-gallery]");
  const track = section?.querySelector<HTMLElement>("[data-gallery-track]");
  if (!section || !track) return;

  const bar = section.querySelector<HTMLElement>("[data-gallery-bar]");
  const count = section.querySelector<HTMLElement>("[data-gallery-count]");
  const items = $$("[data-gallery-item]", section);
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const setBar = bar ? gsap.quickSetter(bar, "scaleX") : () => {};
  let current = 1;

  const move = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 1.1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        setBar(self.progress);
        const n = Math.min(items.length, Math.round(self.progress * (items.length - 1)) + 1);
        if (count && n !== current) {
          current = n;
          count.textContent = String(n).padStart(2, "0");
        }
      },
    },
  });

  items.forEach((item) => {
    const frame = item.querySelector<HTMLElement>('[data-reveal="gallery"]');
    const caption = item.querySelector("[data-gcap]");
    const layer = item.querySelector('[data-parallax="x"]');
    const visibleAtStart = item.getBoundingClientRect().left < window.innerWidth;

    // Items already in view when the section arrives reveal on vertical scroll;
    // the rest reveal as the horizontal track brings them in.
    const trigger: ScrollTrigger.Vars = visibleAtStart
      ? { trigger: section, start: "top 65%", once: true }
      : { trigger: item, containerAnimation: move, start: "left 88%", once: true };

    if (frame) {
      const tl = revealTimeline(kit, frame, { scrollTrigger: trigger });
      if (caption) tl.fromTo(caption, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.4 }, 0.45);
    }
    if (layer) {
      gsap.fromTo(
        layer,
        { xPercent: -6 },
        {
          xPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: item, containerAnimation: move, start: "left right", end: "right left", scrub: true },
        },
      );
    }
  });
}

function setupImages(kit: Kit) {
  const { gsap } = kit;
  $$('[data-reveal="scroll"]').forEach((frame) =>
    revealTimeline(kit, frame, { scrollTrigger: { trigger: frame, start: "top 88%", once: true } }),
  );

  $$('[data-parallax="y"]').forEach((layer) =>
    gsap.fromTo(
      layer,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: layer.closest(".reveal") ?? layer, start: "top bottom", end: "bottom top", scrub: true },
      },
    ),
  );

  // Hero picture is already on screen: start at rest so nothing jumps when JS arrives.
  $$('[data-parallax="hero"]').forEach((layer) =>
    gsap.to(layer, {
      yPercent: 7,
      ease: "none",
      scrollTrigger: { trigger: layer.closest(".reveal") ?? layer, start: "clamp(top bottom)", end: "bottom top", scrub: true },
    }),
  );

  // The hero title drifts up a little slower than the page.
  $$("[data-drift]").forEach((el) =>
    gsap.to(el, {
      yPercent: -14,
      ease: "none",
      scrollTrigger: { trigger: "#topo", start: "top top", end: "bottom top", scrub: true },
    }),
  );
}

function setupText({ gsap, ScrollTrigger, SplitText }: Kit) {
  $$("[data-split]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      tag: "span",
      linesClass: "split-line",
      // Lines only: words stay whole, so screen readers read the text as written.
      aria: "none",
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { opacity: 1 });
        return gsap.from(self.lines, {
          yPercent: 115,
          duration: 1.7,
          ease: EASE,
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
        });
      },
    });
  });

  ScrollTrigger.batch("[data-fade]", {
    start: "top 90%",
    once: true,
    onEnter: (batch) =>
      gsap.fromTo(batch, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.5, ease: EASE, stagger: 0.1 }),
  });

  $$("[data-rule]").forEach((el) =>
    gsap.fromTo(
      el,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.8, ease: EASE, scrollTrigger: { trigger: el, start: "top 92%", once: true } },
    ),
  );
}

export function Experience() {
  useEffect(() => {
    const root = document.documentElement;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("js");
      return;
    }

    let cancelled = false;
    let cleanup = () => {};

    const start = async () => {
      // Animation code is fetched after hydration, so it never delays the first paint.
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
        import("lenis"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      // Every image box has a fixed aspect ratio, so the load event never moves layout:
      // skipping the automatic refresh there avoids one long task.
      ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: "visibilitychange,DOMContentLoaded,resize" });
      const kit: Kit = { gsap, ScrollTrigger, SplitText };
      const ctx = gsap.context(() => {});

      const lenis = new Lenis({
        lerp: 0.075,
        wheelMultiplier: 0.9,
        autoRaf: false,
        anchors: { duration: 2.2, easing: expoOut },
      });
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);

      // Header leaves on the way down and comes back on the way up.
      const header = document.querySelector<HTMLElement>("[data-header]");
      let last = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        if (header && Math.abs(y - last) > 4) {
          header.dataset.hidden = String(y > last && y > 140);
          last = y;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        gsap.ticker.remove(tick);
        lenis.destroy();
        ctx.revert();
        if (header) delete header.dataset.hidden;
      };

      for (const step of [setupGallery, setupImages, setupText]) {
        await yieldToMain();
        if (cancelled) return;
        ctx.add(() => step(kit));
      }

      if (document.fonts && document.fonts.status !== "loaded") {
        document.fonts.ready.then(() => !cancelled && ScrollTrigger.refresh());
      }
    };

    // Wait for the page (and the hero photo) to finish loading, then for an idle moment:
    // the hero is animated by CSS, so nothing above the fold waits for this.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    let handle = 0;
    const schedule = () => {
      handle = idle(() => void start(), { timeout: 800 }) as number;
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      window.cancelIdleCallback?.(handle);
      cleanup();
    };
  }, []);

  return null;
}
