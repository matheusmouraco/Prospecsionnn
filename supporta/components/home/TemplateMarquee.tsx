import { BrowserFrame } from "@/components/mockups/Frames";
import { SiteMock } from "@/components/mockups/SiteMock";
import { getSegment } from "@/lib/segments";
import { templates, type TemplateShowcase } from "@/lib/templates";

function Card({ t, eager }: { t: TemplateShowcase; eager?: boolean }) {
  const mock = getSegment(t.segment)?.mock;
  return (
    <BrowserFrame url={t.domain} ratio="720 / 495" className="shadow-[0_20px_50px_-20px_rgb(11_11_15/0.25)]">
      {t.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.image} alt={`Modelo de site ${t.name}`} width={720} height={495} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "low" : undefined} decoding="async" className="h-full w-full object-cover object-top" />
      ) : mock ? (
        <SiteMock mock={mock} variant="desktop" />
      ) : null}
    </BrowserFrame>
  );
}

function Column({ items, reverse, duration }: { items: TemplateShowcase[]; reverse?: boolean; duration: string }) {
  // Lista duplicada para o loop não ter emenda; a cópia fica escondida dos leitores de tela.
  return (
    <div className="marquee-y flex flex-col gap-5" style={{ animationDuration: duration, animationDirection: reverse ? "reverse" : "normal" }}>
      {items.map((t, i) => <Card key={t.slug} t={t} eager={i === 0} />)}
      <div aria-hidden className="flex flex-col gap-5">
        {items.map((t) => <Card key={`${t.slug}-copia`} t={t} />)}
      </div>
    </div>
  );
}

/** Templates passando em duas colunas (desktop) ou em fila horizontal (celular). */
export function TemplateMarquee() {
  const half = Math.ceil(templates.length / 2);
  const a = templates.slice(0, half);
  const b = templates.slice(half);
  return (
    <div aria-label="Modelos de site da Supporta" role="region" className="marquee-frame relative min-w-0">
      <div className="hidden h-[620px] grid-cols-2 gap-5 overflow-hidden lg:grid">
        <Column items={a} duration="38s" />
        <div className="pt-24">
          <Column items={b} reverse duration="44s" />
        </div>
      </div>
      <div className="-mx-5 overflow-hidden lg:hidden">
        <div className="marquee-x flex w-max gap-4 px-5">
          {[...templates, ...templates].map((t, i) => (
            <div key={`${t.slug}-${i}`} aria-hidden={i >= templates.length || undefined} className="w-[260px] shrink-0">
              <Card t={t} eager={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
