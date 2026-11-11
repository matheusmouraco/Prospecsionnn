import { studio } from "@/lib/content";

const details: { label: string; value: string; href?: string }[] = [
  { label: "Email", value: studio.email, href: `mailto:${studio.email}` },
  { label: "Instagram", value: studio.instagram },
  { label: "Ateliê", value: "Pinheiros, São Paulo. Visitas com hora marcada." },
  { label: "Horário", value: "Segunda a sexta, das 9h às 18h" },
];

export function Contact() {
  return (
    <section id="contato" className="gutter pt-[var(--section)] pb-8">
      <div className="flex items-baseline gap-3" data-fade>
        <span className="folio">(05)</span>
        <span className="eyebrow">Contato</span>
      </div>

      <h2 data-split className="display mt-10 max-w-[14ch] text-[clamp(3.4rem,10.4vw,12.5rem)]">
        Tem um terreno, uma casa ou <em className="italic">só uma ideia?</em>
      </h2>

      <div className="mt-[clamp(4.5rem,9vw,9rem)] grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-12">
        <div className="md:col-span-7" data-fade>
          <a
            href={studio.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-link inline-block"
            aria-label="Conversar com o Atelier Vareda no WhatsApp (abre em nova aba)"
          >
            <span className="font-serif text-[clamp(2.3rem,4.5vw,5rem)] font-light leading-none tracking-[-0.02em]">
              Conversar no{" "}
              <span className="whitespace-nowrap">
                WhatsApp{"\u00a0"}
                <span className="wa-arrow inline-block font-sans text-[0.62em] font-normal text-clay" aria-hidden="true">
                  {/* Inter's Latin subset has ↑ but not ↗: rotate it instead of falling back to a system font */}
                  <span className="inline-block rotate-45">↑</span>
                </span>
              </span>
            </span>
            <span className="wa-rule mt-4 block h-px bg-ink" aria-hidden="true" />
          </a>
          <p className="mt-7 max-w-[24rem] text-[1rem] leading-[1.65] text-ink/75">
            Conte um pouco sobre o terreno e a família. Respondemos em até um dia útil, sempre por alguém do ateliê.
          </p>
        </div>

        <dl className="space-y-6 md:col-span-4 md:col-start-9" data-fade>
          {details.map((d) => (
            <div key={d.label} className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-t border-line pt-4">
              <dt className="eyebrow pt-0.5 text-mute">{d.label}</dt>
              <dd className="text-[0.9375rem] leading-[1.55]">
                {d.href ? (
                  <a href={d.href} className="ulink">
                    {d.value}
                  </a>
                ) : (
                  d.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <footer className="eyebrow mt-[clamp(6rem,13vw,12rem)] flex flex-col gap-4 border-t border-line pt-6 text-mute md:flex-row md:items-center md:justify-between">
        <span>© 2026 Atelier Vareda Arquitetura</span>
        <span>Escritório fictício · projeto conceitual · fotos Unsplash</span>
        <a href="#topo" className="ulink self-start text-ink md:self-auto">
          Voltar ao topo ↑
        </a>
      </footer>
    </section>
  );
}
