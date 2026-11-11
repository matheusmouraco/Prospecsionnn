import { heroImage, projects, site } from '@/lib/data';
import Photo from './Photo';
import Rule from './Rule';

export default function Hero() {
  return (
    <section id="topo" className="relative pt-12" aria-labelledby="hero-title">
      {/* meta strip, like the title block of a drawing sheet */}
      <div className="g pt-3 pb-10 md:pb-20">
        <p className="label c col-span-2 md:col-span-3 hero-in" style={{ '--d': '0.30s' } as React.CSSProperties}>
          (00) Índice
        </p>
        <p className="label c col-span-2 md:col-span-3 max-md:text-right hero-in" style={{ '--d': '0.35s' } as React.CSSProperties}>
          Arquitetura autoral
        </p>
        <p className="label c hidden md:block md:col-span-3 hero-in" style={{ '--d': '0.40s' } as React.CSSProperties}>
          São Paulo, Brasil
        </p>
        <p className="label c hidden md:block md:col-span-3 text-right tabular-nums hero-in" style={{ '--d': '0.45s' } as React.CSSProperties}>
          {site.coords}
        </p>
      </div>

      <h1 id="hero-title" className="fit c" aria-label={site.name}>
        <span className="fit-line" style={{ '--k': 0.2814, '--ml': 0.065 } as React.CSSProperties} aria-hidden>
          <span>Estúdio</span>
        </span>
        <span className="fit-line" style={{ '--k': 0.2812, '--ml': 0.045, '--d': '0.09s' } as React.CSSProperties} aria-hidden>
          <span>Bloco 7</span>
        </span>
      </h1>

      <div className="g pt-8 pb-10 md:pt-12 md:pb-16">
        <p className="label c col-span-2 md:col-span-3 hero-in" style={{ '--d': '0.60s' } as React.CSSProperties}>
          Est. 2011
          <br />
          <span className="text-mute">Concreto aparente</span>
        </p>
        <p
          className="c col-span-4 md:col-span-5 order-last md:order-none mt-8 md:mt-0 text-[clamp(1.125rem,1.6vw,1.5rem)] leading-[1.2] font-medium tracking-[-0.01em] hero-in"
          style={{ '--d': '0.65s' } as React.CSSProperties}
        >
          Projetamos casas, edifícios culturais e retrofits em concreto aparente. A estrutura que sustenta é a mesma
          que aparece, sem revestimento e sem disfarce.
        </p>
        <a
          href="#projetos"
          className="label c col-span-2 md:col-span-3 md:col-start-10 text-right self-start hero-in" style={{ '--d': '0.70s' } as React.CSSProperties}
        >
          <span className="link-u">{String(projects.length).padStart(2, '0')} projetos selecionados</span>{' '}
          <span aria-hidden>↓</span>
        </a>
      </div>

      <figure className="relative">
        <Photo
          src={heroImage.src}
          alt={heroImage.alt}
          sizes="100vw"
          priority
          quality={60}
          parallax
          className="aspect-[4/3] md:aspect-[21/9]"
        />
        <figcaption className="g pt-2.5 pb-3">
          <span className="label c col-span-2 md:col-span-3">Fig. 00</span>
          <span className="label c col-span-2 md:col-span-6 text-mute max-md:text-right">Estudo de massa sobre plataforma</span>
          <span className="label c hidden md:block md:col-span-3 text-right text-mute">Foto: Unsplash</span>
        </figcaption>
      </figure>
      <Rule />
    </section>
  );
}
