import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { priceLabel, pricing } from "@/lib/plans";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Sobre a Supporta: sites profissionais com IA | Supporta",
  description: `A Supporta cria e hospeda o site de pequenas empresas por ${priceLabel(pricing.site)} pago uma vez, pensando no Google e nas IAs. Conheça como trabalhamos.`,
  path: "/sobre",
});

const principles = [
  { n: "01", title: "Preço claro, sem surpresa", text: `Você sabe tudo o que vai pagar antes de começar: ${priceLabel(pricing.site)} pelo site, uma vez, e ${priceLabel(pricing.endereco)} por ano a partir do 2º ano para manter o site no ar. Sem mensalidade e sem multa.` },
  { n: "02", title: "Sem promessa que não dá para provar", text: "Ninguém controla o Google nem as IAs. A gente mostra o que dá para medir (velocidade e notas do Google) e entrega o site pronto para ser lido pelas IAs." },
  { n: "03", title: "Simples para quem é ocupado", text: `Site montado pela IA e no ar em até ${pricing.prazoHoras}h, alterações pelo WhatsApp e área do cliente sem senha. O dono do negócio não precisa entender de tecnologia.` },
  { n: "04", title: "Feito para virar fonte", text: "Toda resposta de IA se apoia em alguma fonte. Cada site sai organizado para ser essa fonte: claro, rápido e com dados estruturados." },
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Sobre", path: "/sobre" }]}
        label="Sobre a Supporta"
        title="Sites profissionais para quem não tem tempo de cuidar de site"
        lead={`A Supporta cria e hospeda o site de pequenas e médias empresas por ${priceLabel(pricing.site)}, pago uma vez. A gente cuida da tecnologia para você cuidar do negócio.`}
      />
      <Section tone="white" labelledBy="sobre-por-que">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading id="sobre-por-que" label="Por que existe" title="Por que um site feito pela IA?" />
          <div className="space-y-4 text-lg leading-relaxed text-graphite">
            <p>Porque o modelo tradicional não funciona para quem é pequeno. Paga-se caro para fazer o site, ele fica pronto, e depois ninguém atualiza. Em pouco tempo está lento, desatualizado e invisível.</p>
            <p>Com a IA, o site sai pronto em até {pricing.prazoHoras} horas, com a sua marca, por {priceLabel(pricing.site)} pago uma vez, e a hospedagem segue cuidada pela Supporta. E como os clientes agora também perguntam para o ChatGPT e o Gemini, cada site já sai pronto para ser lido e citado pelas IAs.</p>
            <p>A Supporta nasceu dentro de uma agência que cria sites, sistemas e identidades visuais, vendo de perto quanto negócio bom perde cliente por causa de um site fraco.</p>
          </div>
        </div>
      </Section>
      <Section labelledBy="sobre-principios">
        <SectionHeading id="sobre-principios" label="Como trabalhamos" title="O que guia o nosso trabalho?" />
        <ol className="mt-12 grid gap-4 md:grid-cols-2">
          {principles.map((p) => (
            <li key={p.n} className="rounded-3xl border border-line bg-white p-7">
              <span className="font-mono text-sm text-graphite">{p.n}</span>
              <h3 className="mt-6 text-2xl tracking-[-0.04em]">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-graphite">{p.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/planos" size="lg" data-track="plan_click" data-track-origin="sobre">Ver o preço <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" /></Button>
          <Button href="/contato" size="lg" variant="outline">Falar com a gente</Button>
        </div>
      </Section>
      <FinalCta />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: "Sobre a Supporta", url: absoluteUrl("/sobre"), about: { "@id": `${site.url}/#organization` } }} />
    </>
  );
}
