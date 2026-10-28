import { Clock, Mail, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contato: fale com a Supporta pelo WhatsApp | Supporta",
  description: "Fale com a Supporta pelo WhatsApp ou e-mail. Tire dúvidas sobre planos, modelos e como ter o site da sua empresa no ar.",
  path: "/contato",
});

export default function ContatoPage() {
  const cards = [
    { icon: MessageCircle, title: "WhatsApp", text: "O jeito mais rápido. Respondemos em horário comercial.", value: site.whatsapp, href: whatsappUrl("Oi! Vim pela página de contato da Supporta."), cta: "Chamar no WhatsApp", track: "whatsapp_click" },
    { icon: Mail, title: "E-mail", text: "Para propostas, parcerias e assuntos que precisam de anexo.", value: site.email, href: `mailto:${site.email}`, cta: "Enviar e-mail" },
  ];
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contato", path: "/contato" }]}
        label="Contato"
        title="Como falar com a Supporta?"
        lead="Pelo WhatsApp, com gente de verdade do outro lado. Se preferir, mande um e-mail."
      />
      <section aria-label="Canais de contato" className="pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container-site grid gap-4 md:grid-cols-2">
          {cards.map(({ icon: Icon, ...c }) => (
            <div key={c.title} className="rounded-[2rem] border border-line bg-white p-7 md:p-9">
              <Icon aria-hidden strokeWidth={1.75} className="h-7 w-7" />
              <h2 className="mt-6 text-2xl tracking-[-0.04em]">{c.title}</h2>
              <p className="mt-2 text-graphite">{c.text}</p>
              <p className="mt-5 font-medium">{c.value}</p>
              <Button href={c.href} size="lg" className="mt-6" data-track={c.track} data-track-origin="contato">{c.cta}</Button>
            </div>
          ))}
          <div className="flex items-start gap-4 rounded-[2rem] bg-ink p-7 text-paper md:col-span-2 md:p-9">
            <Clock aria-hidden strokeWidth={1.75} className="mt-1 h-6 w-6 shrink-0 text-pink" />
            <div>
              <h2 className="text-xl tracking-[-0.03em]">Já é cliente?</h2>
              <p className="mt-2 text-mist">Peça ajustes e acompanhe tudo pela área do cliente. É mais rápido que o e-mail e fica registrado.</p>
              <Button href="/cliente" variant="paper" size="md" className="mt-5">Entrar na área do cliente</Button>
            </div>
          </div>
        </div>
      </section>
      <FinalCta />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: "Contato Supporta", url: absoluteUrl("/contato"), mainEntity: { "@id": `${site.url}/#organization` } }} />
    </>
  );
}
