import type { Metadata } from "next";
import { CheckoutComplete } from "@/components/checkout/CheckoutComplete";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Assinatura recebida | Supporta",
  description: "Recebemos a sua assinatura. Veja os próximos passos e quando o seu site entra no ar.",
  path: "/obrigado",
  noindex: true,
});

const next = [
  { n: "01", title: "Confirmação do pagamento", text: "Você recebe a confirmação por e-mail assim que o cartão for aprovado." },
  { n: "02", title: "Site no ar", text: "O site que você viu na prévia entra no ar sozinho em nome.supporta.com.br, com SSL, dados estruturados e llms.txt." },
  { n: "03", title: "Domínio próprio", text: "Quer usar o seu .com.br? A gente combina pelo WhatsApp e liga o domínio ao site." },
  { n: "04", title: "Ajustes do mês", text: "Todo plano inclui 1 ajuste por mês. É só mandar o que quer mudar pelo WhatsApp." },
];

export default function ObrigadoPage() {
  return (
    <section aria-labelledby="page-title" className="pb-24 pt-12 md:pt-20">
      <div className="container-site">
        <SectionLabel>Assinatura recebida</SectionLabel>
        <h1 id="page-title" className="mt-4 max-w-4xl text-[clamp(2.5rem,7vw,5rem)] leading-[1] tracking-[-0.055em]">
          Pronto. O seu site já está a caminho.
        </h1>
        <CheckoutComplete />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">Veja o que acontece a partir de agora.</p>

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
          <h2 className="text-2xl tracking-[-0.04em]">Quando o site entra no ar?</h2>
          <p className="mt-2 text-mist">Automaticamente, após a confirmação do pagamento. Em geral leva minutos, e no máximo 1 dia útil.</p>
          <div className="mt-8">
            <Button href={whatsappUrl("Oi! Acabei de assinar a Supporta e quero combinar o meu domínio próprio.")} variant="paper" size="lg" data-track="whatsapp_click" data-track-origin="obrigado">
              Combinar o domínio no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
