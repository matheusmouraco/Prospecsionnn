export function Manifesto() {
  return (
    <section id="manifesto" className="gutter py-[var(--section)]">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12">
        <div className="flex items-baseline gap-3 md:col-span-3" data-fade>
          <span className="folio">(01)</span>
          <span className="eyebrow">Manifesto</span>
        </div>
        <p
          data-split
          className="font-serif text-[clamp(2.15rem,5.3vw,5.6rem)] font-light leading-[1.06] tracking-[-0.012em] md:col-span-9"
        >
          <span className="inline-block w-[18%]" aria-hidden="true" />
          Uma casa começa muito antes da planta: na luz da manhã, no desenho do terreno e na rotina de quem vai viver
          ali. Por isso desenhamos <em className="text-clay italic">devagar</em>, e nada entra no projeto sem uma
          razão para ficar.
        </p>
      </div>
    </section>
  );
}
