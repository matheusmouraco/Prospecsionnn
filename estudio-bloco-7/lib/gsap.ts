import type { gsap as GSAP } from 'gsap';
import type { Flip as FlipType } from 'gsap/Flip';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import type { SplitText as SplitTextType } from 'gsap/SplitText';

type Bundle = {
  gsap: typeof GSAP;
  ScrollTrigger: typeof ScrollTriggerType;
  SplitText: typeof SplitTextType;
  Flip: typeof FlipType;
};

let pending: Promise<Bundle> | null = null;

/** Loads GSAP and its plugins once, after hydration, so they stay out of the critical path. */
export function loadGsap(): Promise<Bundle> {
  pending ??= Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText'),
    import('gsap/Flip'),
  ]).then(([g, st, sp, fl]) => {
    const gsap = g.gsap;
    gsap.registerPlugin(st.ScrollTrigger, sp.SplitText, fl.Flip);
    gsap.defaults({ ease: 'power2.out' });
    return { gsap, ScrollTrigger: st.ScrollTrigger, SplitText: sp.SplitText, Flip: fl.Flip };
  });
  return pending;
}
