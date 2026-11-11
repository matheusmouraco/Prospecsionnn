import { site, whatsappUrl } from '@/lib/data';
import Rule from './Rule';

export default function Contact() {
  return (
    <section id="contato" className="relative pt-24 md:pt-36" aria-labelledby="contato-title">
      <Rule />
      <div className="g pt-3">
        <p className="label c col-span-4 md:col-span-3" data-fade>
          (04) Contato
        </p>
      </div>

      <h2 id="contato-title" className="display c text-[clamp(3rem,10.4vw,11.5rem)] leading-[0.84] pt-10 md:pt-14 pb-12 md:pb-20" data-split>
        Tem um terreno?
        <br />
        Vamos conversar.
      </h2>

      <div className="g gap-y-12 pb-16 md:pb-24">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta group relative col-span-4 md:col-span-6 block overflow-hidden bg-ink text-paper"
          data-fade
        >
          <span className="cta-fill absolute inset-0 bg-accent" aria-hidden />
          <span className="relative flex min-h-[180px] md:min-h-[240px] flex-col justify-between p-[calc(var(--inset)+4px)] md:p-6">
            <span className="flex items-start justify-between">
              <span className="label">Resposta em até 1 dia útil</span>
              <svg className="cta-arrow" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                <path d="M7 21L21 7M21 7H9M21 7V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </span>
            <span>
              <span className="display block text-[clamp(2.5rem,5.4vw,5.5rem)] leading-[0.85]">WhatsApp</span>
              <span className="label block mt-3 tabular-nums text-[13px]">{site.whatsappLabel}</span>
            </span>
          </span>
        </a>

        <dl className="col-span-4 md:col-span-5 md:col-start-8 grid grid-cols-2 md:grid-cols-5 self-end gap-y-8">
          <div className="c col-span-2 md:col-span-5">
            <dt className="label text-mute">E-mail</dt>
            <dd className="mt-2 text-lg md:text-xl font-medium">
              <a href={`mailto:${site.email}`} className="link-u break-all">
                {site.email}
              </a>
            </dd>
          </div>
          <div className="c col-span-2 md:col-span-3">
            <dt className="label text-mute">Estúdio</dt>
            <dd className="mt-2 text-base leading-snug">
              {site.address[0]}
              <br />
              {site.address[1]}
            </dd>
          </div>
          <div className="c col-span-1 md:col-span-2">
            <dt className="label text-mute">Horário</dt>
            <dd className="mt-2 text-base leading-snug">{site.hours}</dd>
          </div>
          <div className="c col-span-1 md:col-span-5">
            <dt className="label text-mute">Instagram</dt>
            <dd className="mt-2 text-base">{site.instagram}</dd>
          </div>
        </dl>
      </div>

      <footer className="relative">
        <Rule />
        <div className="g py-4 gap-y-2">
          <p className="label c col-span-4 md:col-span-3">© {new Date().getFullYear()} {site.name}</p>
          <p className="label c col-span-4 md:col-span-6 text-mute">Escritório fictício. Fotos: Unsplash.</p>
          <a href="#topo" className="label c col-span-4 md:col-span-3 md:text-right">
            <span className="link-u">Voltar ao topo</span> <span aria-hidden>↑</span>
          </a>
        </div>
      </footer>
    </section>
  );
}
