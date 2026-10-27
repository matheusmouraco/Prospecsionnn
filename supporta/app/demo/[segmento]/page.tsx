import { ArrowRight, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Symbol } from "@/components/brand/Symbol";
import { demos } from "@/lib/demos";
import { getSegment, segments } from "@/lib/segments";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ segmento: string }> };

export function generateStaticParams() {
  return segments.map((s) => ({ segmento: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seg = getSegment((await params).segmento);
  if (!seg) return {};
  return pageMetadata({
    title: `Demo: ${seg.title.toLowerCase()} | Supporta`,
    description: `Demonstração navegável do modelo de ${seg.title.toLowerCase()} da Supporta. Empresa fictícia, para você ver como o seu site pode ficar.`,
    path: `/demo/${seg.slug}`,
    noindex: true,
  });
}

/** Forma abstrata no lugar de foto: no site do cliente entram as fotos reais da empresa. */
function Visual({ variant = 0, label }: { variant?: number; label: string }) {
  return (
    <div role="img" aria-label={label} className="relative aspect-[4/3] overflow-hidden rounded-[2rem]" style={{ background: variant ? "color-mix(in srgb, var(--d-accent) 18%, white)" : "var(--d-accent)" }}>
      <div className="absolute -bottom-[18%] left-[10%] aspect-square w-[56%] rounded-t-full" style={{ background: variant ? "color-mix(in srgb, var(--d-accent) 40%, white)" : "color-mix(in srgb, var(--d-text) 30%, var(--d-accent))" }} />
      <div className="absolute right-[10%] top-[14%] aspect-square w-[24%] rounded-full" style={{ background: variant ? "var(--d-accent)" : "rgba(255,255,255,.3)" }} />
      <div className="absolute bottom-[12%] right-[8%] h-[8%] w-[36%] rounded-full" style={{ background: "rgba(255,255,255,.55)" }} />
    </div>
  );
}

export default async function DemoPage({ params }: Props) {
  const seg = getSegment((await params).segmento);
  const demo = seg ? demos[seg.slug] : undefined;
  if (!seg || !demo) notFound();
  const m = seg.mock;
  const vars = { "--d-accent": m.accent, "--d-surface": m.surface, "--d-text": m.text } as CSSProperties;
  const heading = m.serif ? "font-serif font-medium tracking-[-0.02em]" : "tracking-[-0.05em]";
  const btn = "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white";

  return (
    <div style={vars} className="bg-[var(--d-surface)] text-[var(--d-text)]">
      <div className="sticky top-0 z-50 bg-ink text-paper">
        <div className="container-site flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2 text-sm">
          <p className="flex items-center gap-2">
            <Symbol tone="dark" className="h-5 w-5" />
            <span>Demonstração do modelo {seg.tab} da Supporta. Empresa e dados fictícios.</span>
          </p>
          <span className="flex gap-2">
            <Link href={`/modelos/${seg.slug}`} className="rounded-full border border-paper/25 px-4 py-1.5 hover:border-paper">Voltar</Link>
            <Link href={`/assinar/start?modelo=${seg.slug}&origem=demo`} className="rounded-full bg-pink px-4 py-1.5 font-medium text-ink" data-track="plan_click" data-track-origin={`demo:${seg.slug}`}>
              Quero esse modelo
            </Link>
          </span>
        </div>
      </div>

      <header className="container-site flex items-center justify-between py-6">
        <span className={`text-xl font-semibold ${heading}`}>{m.business}</span>
        <nav aria-label="Demonstração" className="hidden gap-8 text-[15px] opacity-80 md:flex">
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre</a>
          <a href="#duvidas">Dúvidas</a>
          <a href="#contato">Contato</a>
        </nav>
        <a href="#contato" className={`${btn} hidden sm:inline-flex`} style={{ background: m.accent }}>{m.cta}</a>
      </header>

      <main>
        <section className="container-site grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="label-mono opacity-70">{m.kicker}</p>
            <h1 className={`mt-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] ${heading}`}>{m.headline}</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed opacity-80">{m.about}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contato" className={btn} style={{ background: m.accent }}>{m.cta} <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" /></a>
              <a href="#servicos" className="inline-flex h-12 items-center rounded-full border px-6 text-[15px] font-semibold" style={{ borderColor: `${m.text}33` }}>Ver serviços</a>
            </div>
          </div>
          <Visual label={`Imagem principal de ${m.business}`} />
        </section>

        <section aria-label="Diferenciais" className="border-y bg-white" style={{ borderColor: `${m.text}14` }}>
          <ul className="container-site grid gap-4 py-6 md:grid-cols-3">
            {demo.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 font-medium">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: m.accent }} />
                {h}
              </li>
            ))}
          </ul>
        </section>

        <section id="servicos" className="bg-white py-16 md:py-24">
          <div className="container-site">
            <h2 className={`text-[clamp(2rem,4.5vw,3rem)] ${heading}`}>Serviços</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {demo.services.map((s, i) => (
                <article key={s.name} className="rounded-[1.75rem] border p-7" style={{ borderColor: `${m.text}1a` }}>
                  <span aria-hidden className="block h-10 w-10 rounded-full" style={{ background: i === 0 ? m.accent : `${m.accent}33` }} />
                  <h3 className={`mt-6 text-2xl ${heading}`}>{s.name}</h3>
                  <p className="mt-2 leading-relaxed opacity-80">{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre" className="container-site grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <Visual variant={1} label={`Foto do espaço de ${m.business}`} />
          <div>
            <h2 className={`text-[clamp(2rem,4.5vw,3rem)] leading-[1.05] ${heading}`}>{demo.aboutTitle}</h2>
            {demo.about.map((p) => <p key={p.slice(0, 20)} className="mt-4 text-lg leading-relaxed opacity-80">{p}</p>)}
          </div>
        </section>

        <section id="duvidas" className="bg-white py-16 md:py-24">
          <div className="container-site max-w-3xl">
            <h2 className={`text-[clamp(2rem,4.5vw,3rem)] ${heading}`}>Perguntas frequentes</h2>
            <div className="mt-8 border-t" style={{ borderColor: `${m.text}1a` }}>
              {demo.faq.map((f) => (
                <details key={f.q} className="border-b py-5" style={{ borderColor: `${m.text}1a` }}>
                  <summary className="text-lg font-semibold">{f.q}</summary>
                  <p className="mt-3 leading-relaxed opacity-80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" style={{ background: m.text, color: m.surface }} className="py-16 md:py-24">
          <div className="container-site grid gap-10 md:grid-cols-2">
            <div>
              <h2 className={`text-[clamp(2rem,4.5vw,3rem)] ${heading}`}>Vamos conversar?</h2>
              <p className="mt-4 max-w-md text-lg opacity-80">No seu site, este botão abre o WhatsApp da sua empresa com uma mensagem pronta.</p>
              <span className="mt-8 inline-flex h-12 items-center rounded-full px-6 text-[15px] font-semibold" style={{ background: m.surface, color: m.text }}>{m.cta} pelo WhatsApp</span>
              <ul className="mt-10 space-y-3 opacity-90">
                <li className="flex gap-3"><MapPin aria-hidden strokeWidth={1.75} className="mt-1 h-5 w-5 shrink-0" />{demo.address}</li>
                {demo.hours.map((h) => <li key={h} className="flex gap-3"><Clock aria-hidden strokeWidth={1.75} className="mt-1 h-5 w-5 shrink-0" />{h}</li>)}
              </ul>
            </div>
            <div role="img" aria-label="Espaço do mapa do Google" className="relative min-h-64 overflow-hidden rounded-[2rem]" style={{ background: `${m.surface}1f` }}>
              <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${m.surface}14 1px, transparent 1px), linear-gradient(90deg, ${m.surface}14 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-[50%_50%_50%_0]" style={{ background: m.surface }} />
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: m.text, color: m.surface }} className="border-t" >
        <div className="container-site flex flex-col justify-between gap-2 py-6 text-sm opacity-80 md:flex-row">
          <span>© {m.business}. Empresa fictícia.</span>
          <span>Site por assinatura <Link href="/" className="underline">Supporta</Link></span>
        </div>
      </footer>
    </div>
  );
}
