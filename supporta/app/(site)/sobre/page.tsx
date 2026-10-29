import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Sobre a Supporta: sites por assinatura | Supporta",
  description: "A Supporta faz, hospeda e cuida do site de pequenas empresas por uma mensalidade, pensando no Google e nas IAs. Conheça como trabalhamos.",
  path: "/sobre",
});

const principles = [
  { n: "01", title: "Site não é projeto, é serviço", text: "Um site precisa de cuidado todo mês: segurança, ajustes, conteúdo novo. Por isso a gente cobra como serviço, não como obra entregue e esquecida." },
  { n: "02", title: "Sem promessa que não dá para provar", text: "Ninguém controla o Google nem as IAs. A gente mostra o que mede (velocidade, notas, citações) e trabalha para melhorar esses números." },
  { n: "03", title: "Simples para quem é ocupado", text: "Briefing em 10 minutos, ajustes pelo WhatsApp e área do cliente sem senha. O dono do negócio não precisa entender de tecnologia." },
  { n: "04", title: "Feito para virar fonte", text: "Toda resposta de IA se apoia em alguma fonte. Cada site sai organizado para ser essa fonte: claro, rápido e com dados estruturados." },
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Sobre", path: "/sobre" }]}
        label="Sobre a Supporta"
        title="Sites profissionais para quem não tem tempo de cuidar de site"
        lead="A Supporta faz, hospeda e mantém o site de pequenas e médias empresas por uma mensalidade, sem custo de criação. A gente cuida da tecnologia para você cuidar do negócio."
      />
      <Section tone="white" labelledBy="sobre-por-que">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading id="sobre-por-que" label="Por que existe" title="Por que site por assinatura?" />
          <div className="space-y-4 text-lg leading-relaxed text-graphite">
            <p>Porque o modelo tradicional não funciona para quem é pequeno. Paga-se caro para fazer o site, ele fica pronto, e depois ninguém atualiza. Em pouco tempo está lento, desatualizado e invisível.</p>
            <p>Na assinatura, o site nunca para: hospedagem, segurança, ajustes e conteúdo entram na mensalidade. E como os clientes agora também perguntam para o ChatGPT e o Gemini, cada site já sai pronto para ser lido e citado pelas IAs.</p>
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
          <Button href="/planos" size="lg" data-track="plan_click" data-track-origin="sobre">Ver planos <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" /></Button>
          <Button href="/contato" size="lg" variant="outline">Falar com a gente</Button>
        </div>
      </Section>
      <FinalCta />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: "Sobre a Supporta", url: absoluteUrl("/sobre"), about: { "@id": `${site.url}/#organization` } }} />
    </>
  );
}
