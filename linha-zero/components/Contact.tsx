import { LogoMark } from './drawings/Logo';
import { ADDRESS, EMAIL, WHATSAPP_NUMBER, whatsappUrl } from '@/lib/site';

const phone = WHATSAPP_NUMBER.replace(/^55(\d{2})(\d{5})(\d{4})$/, '+55 $1 $2-$3');

export function Contact() {
  return (
    <section id="contato" className="relative isolate overflow-hidden bg-night text-line" aria-labelledby="contato-title">
      <div className="bp-grid absolute inset-0 -z-10 opacity-40" aria-hidden="true" />
      <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-24 sm:px-8 md:pt-40 lg:px-12">
        <p className="eyebrow text-cyan">Prancha 05 · Contato</p>
        <h2
          id="contato-title"
          data-split
          className="mt-8 text-[clamp(2.9rem,9vw,8.75rem)] font-medium leading-[0.9] tracking-[-0.05em] text-white"
        >
          Vamos traçar
          <br />
          a sua casa?
        </h2>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <p data-reveal="fade" className="max-w-[40ch] text-[15px] leading-relaxed text-line/70 sm:text-base">
              Conte sobre o terreno, a família e o prazo. Quem responde é alguém do time de projeto, no mesmo dia útil.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener"
              className="group mt-10 inline-flex flex-col gap-3 text-white"
            >
              <span className="text-[clamp(1.6rem,3.4vw,2.75rem)] font-medium tracking-[-0.03em]">
                Conversar no WhatsApp
              </span>
              <span className="cta-line block h-px w-full bg-cyan" />
              <span className="mono text-[11px] uppercase tracking-[0.14em] text-line/60">{phone}</span>
            </a>
          </div>
          <dl className="mono grid grid-cols-1 gap-8 self-end sm:grid-cols-2 text-[11px] uppercase tracking-[0.12em] md:col-span-5 md:col-start-8">
            <div>
              <dt className="text-line/45">Estúdio</dt>
              <dd className="mt-2 leading-relaxed text-line/85">
                {ADDRESS.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-line/45">Email</dt>
              <dd className="mt-2 normal-case tracking-[0.04em] text-line/85">
                <a href={`mailto:${EMAIL}`} className="underline decoration-line/30 underline-offset-4 hover:decoration-cyan">
                  {EMAIL}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* the zero line: the datum every drawing on this page was measured from */}
        <div className="relative mt-24 md:mt-36" aria-hidden="true">
          <svg className="draw h-6 w-full text-cyan" viewBox="0 0 1000 24" preserveAspectRatio="none">
            <path data-zero d="M0 12 H1000" strokeWidth={1} />
          </svg>
          <div className="mono mt-2 flex justify-between text-[10.5px] uppercase tracking-[0.14em] text-cyan">
            <span data-zero-note>±0,00</span>
            <span data-zero-note>Fim da prancha</span>
          </div>
        </div>

        <footer className="mono mt-16 flex flex-col gap-6 border-t border-line/15 pt-6 text-[10.5px] uppercase tracking-[0.12em] text-line/45 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-3 text-line/70">
            <LogoMark className="h-3 w-auto" />
            Linha Zero Arquitetura
          </span>
          <span>Escritório fictício · Fotos Unsplash · © 2026</span>
        </footer>
      </div>
    </section>
  );
}
