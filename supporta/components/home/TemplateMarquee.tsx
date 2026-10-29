import { BrowserFrame } from "@/components/mockups/Frames";
import { SiteMock } from "@/components/mockups/SiteMock";
import { getSegment } from "@/lib/segments";
import { templates, type TemplateShowcase } from "@/lib/templates";

function Card({ t, eager }: { t: TemplateShowcase; eager?: boolean }) {
  const mock = t.segment ? getSegment(t.segment)?.mock : undefined;
  return (
    <BrowserFrame url={t.domain} ratio="880 / 605" className="shadow-[0_30px_60px_-24px_rgb(11_11_15/0.35)]">
      {t.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.image} alt={`Modelo de site: ${t.name}`} width={880} height={605} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "low" : undefined} decoding="async" className="h-full w-full object-cover object-top" />
      ) : mock ? (
        <SiteMock mock={mock} variant="desktop" />
      ) : null}
    </BrowserFrame>
  );
}

function Column({ items, reverse, duration, offset = "" }: { items: TemplateShowcase[]; reverse?: boolean; duration: string; offset?: string }) {
  // Lista duplicada para o loop não ter emenda; a cópia fica escondida dos leitores de tela.
  return (
    <div className={offset}>
      <div className="marquee-y flex flex-col gap-5" style={{ animationDuration: duration, animationDirection: reverse ? "reverse" : "normal" }}>
        {items.map((t, i) => <Card key={t.slug} t={t} eager={i === 0} />)}
        <div aria-hidden className="flex flex-col gap-5">
          {items.map((t) => <Card key={`${t.slug}-copia`} t={t} />)}
        </div>
      </div>
    </div>
  );
}

/** Parede de templates inclinada, passando em três colunas (desktop) ou em fila horizontal (celular). */
export function TemplateMarquee() {
  // Cada coluna começa num modelo diferente para a parede não repetir lado a lado.
  const rotated = [0, 4, 8].map((start) => [...templates.slice(start), ...templates.slice(0, start)].slice(0, 4));
  return (
    <div aria-label="Modelos de site da Supporta" role="region" className="relative min-w-0">
      <div className="marquee-wall hidden h-[720px] lg:block">
        <div className="marquee-tilt grid grid-cols-3 gap-5">
          <Column items={rotated[0]} duration="46s" />
          <Column items={rotated[1]} reverse duration="54s" offset="-mt-40" />
          <Column items={rotated[2]} duration="50s" offset="-mt-16" />
        </div>
      </div>
      <div className="marquee-frame -mx-5 overflow-hidden lg:hidden">
        <div className="marquee-x flex w-max gap-4 px-5 py-2">
          {[...templates, ...templates].map((t, i) => (
            <div key={`${t.slug}-${i}`} aria-hidden={i >= templates.length || undefined} className="w-[270px] shrink-0">
              <Card t={t} eager={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
