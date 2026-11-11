"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import { CONTACT_IMAGE, whatsappUrl } from "@/lib/data";
import { whenIdle } from "@/lib/idle";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();
      const setup = contextSafe!(() => mm.add(MOTION_OK, () => {
        const scope = root.current!;
        const title = scope.querySelector<HTMLElement>("[data-title]")!;
        let split: SplitText | undefined;

        gsap.fromTo(
          "[data-img]",
          { yPercent: -12, scale: 1.15 },
          { yPercent: 0, scale: 1, ease: "none", scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom bottom", scrub: true } },
        );

        const build = contextSafe!(() => {
          split = SplitText.create(title, {
            type: "lines",
            mask: "lines",
            linesClass: "ln",
            autoSplit: true,
            onSplit(self) {
              gsap.set(title, { visibility: "visible" });
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.3,
                stagger: 0.12,
                scrollTrigger: { trigger: scope, start: "top 55%", once: true },
              });
            },
          });
          gsap.set("[data-fade]", { visibility: "visible" });
          gsap.from("[data-fade]", {
            opacity: 0,
            y: 24,
            duration: 1.1,
            stagger: 0.1,
            scrollTrigger: { trigger: scope, start: "top 45%", once: true },
          });
        });

        document.fonts.ready.then(build);
        return () => split?.revert();
      }));
      return whenIdle(setup);
    },
    { scope: root },
  );

  const wa = whatsappUrl("Olá, NOX. Quero conversar sobre um projeto.");

  return (
    <section
      id="contato"
      ref={root}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink"
      aria-labelledby="contato-titulo"
    >
      <div data-img className="absolute inset-0 will-change-transform">
        <Image
          src={CONTACT_IMAGE.src}
          alt={CONTACT_IMAGE.alt}
          fill
          sizes="100vw"
          quality={55}
          className="object-cover object-[30%_50%]"
        />
      </div>
      <div className="absolute inset-0 bg-ink/60" />
      <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-ink via-ink/80 to-transparent md:w-3/4" />

      <div className="relative flex flex-1 flex-col justify-center px-5 pb-16 pt-32 md:items-end md:px-10 md:text-right">
        <p data-fade data-reveal className="eyebrow mb-8">
          Contato
        </p>
        <h2
          id="contato-titulo"
          data-title
          data-reveal
          className="display max-w-[11ch] text-[clamp(3.4rem,10vw,11rem)] text-bone"
        >
          Vamos desenhar a sua noite
        </h2>
        <p data-fade data-reveal className="mt-8 max-w-[36ch] text-[0.95rem] leading-relaxed text-bone/75 md:mt-10 md:text-base">
          Conte o terreno, o prazo e o que você imagina. A gente responde no mesmo dia útil.
        </p>
        <a
          data-fade
          data-reveal
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Abrir"
          className="group relative mt-12 inline-flex items-center gap-5 self-start overflow-hidden rounded-full border border-bone/40 py-5 pl-7 pr-6 md:self-end md:gap-6 md:pl-8 text-bone transition-colors duration-500 hover:text-ink md:mt-14"
        >
          <span className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-bone transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100" />
          <span className="relative whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.2em] md:text-[0.8rem] md:tracking-[0.24em]">Conversar no WhatsApp</span>
          <span className="relative h-px w-10 bg-gold transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-150" />
        </a>
      </div>

      <footer className="relative flex flex-col gap-3 border-t border-bone/10 px-5 py-7 text-[0.75rem] text-bone/50 md:flex-row md:items-center md:justify-between md:px-10">
        <span className="display text-[1.1rem] tracking-[0.06em] text-bone/80">NOX</span>
        <a href="mailto:contato@noxarquitetura.com.br" className="transition-colors hover:text-bone">
          contato@noxarquitetura.com.br
        </a>
        <span>Pinheiros, São Paulo</span>
        <span>© {new Date().getFullYear()} NOX Arquitetura</span>
      </footer>
    </section>
  );
}
