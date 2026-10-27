import type { Metadata } from "next";
import { CheckoutComplete } from "@/components/checkout/CheckoutComplete";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { plans } from "@/lib/plans";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Assinatura recebida | Supporta",
  description: "Recebemos a sua assinatura. Veja os próximos passos e o prazo para o seu site ficar pronto.",
  path: "/obrigado",
  noindex: true,
});

const next = [
  { n: "01", title: "Confirmação do pagamento", text: "Você recebe a confirmação por e-mail assim que o cartão for aprovado." },
  { n: "02", title: "Briefing completo pelo WhatsApp", text: "Em até 1 dia útil a gente chama você para o briefing de 10 minutos e para receber logo e fotos." },
  { n: "03", title: "Primeira versão para aprovar", text: "Você recebe o link da primeira versão, pede os ajustes e aprova." },
  { n: "04", title: "Site no ar", text: "Publicamos com domínio, SSL, dados estruturados, llms.txt e tudo configurado." },
];

export default function ObrigadoPage() {
  return (
    <section aria-labelledby="page-title" className="pb-24 pt-12 md:pt-20">
      <div className="container-site">
        <SectionLabel>Assinatura recebida</SectionLabel>
        <h1 id="page-title" className="mt-4 max-w-4xl text-[clamp(2.5rem,7vw,5rem)] leading-[1] tracking-[-0.055em]">
          Pronto. Agora é com a gente.
        </h1>
        <CheckoutComplete />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">Veja o que acontece a partir de agora e quando o seu site fica pronto.</p>

        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {next.map((s) => (
            <li key={s.n} className="rounded-3xl border border-line bg-white p-6">
              <span className="font-mono text-sm text-graphite">{s.n}</span>
              <h2 className="mt-6 text-xl tracking-[-0.03em]">{s.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-graphite">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-[2rem] bg-ink p-7 text-paper md:p-10">
          <h2 className="text-2xl tracking-[-0.04em]">Prazo de entrega</h2>
          <p className="mt-2 text-mist">Contado em dias úteis a partir do briefing completo.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {plans.map((p) => (
              <li key={p.id} className="rounded-2xl border border-line-dark bg-card-dark p-5">
                <p className="label-mono text-mist">{p.name}</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">até {site.deliveryDays[p.id]} dias</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={whatsappUrl("Oi! Acabei de assinar a Supporta e quero começar o briefing.")} variant="paper" size="lg" data-track="whatsapp_click" data-track-origin="obrigado">
              Adiantar o briefing no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
