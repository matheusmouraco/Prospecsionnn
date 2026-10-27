import { Check, Minus } from "lucide-react";
import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import type { Faq as FaqItem } from "@/lib/faqs";
import { faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Supporta, construtor de sites, agência ou freelancer?",
  description: "Compare as formas de ter um site: fazer sozinho num construtor, contratar freelancer, agência ou assinatura Supporta. Custo, tempo e manutenção.",
  path: "/comparativo",
});

type V = boolean | string;
const cols = ["Construtor (você faz)", "Freelancer", "Agência", "Supporta"];
const rows: { label: string; v: V[] }[] = [
  { label: "Custo de criação", v: ["Seu tempo", "Pagamento único", "Pagamento único, maior", "R$0"] },
  { label: "Mensalidade", v: ["Plano do construtor", "Hospedagem à parte", "Hospedagem e manutenção à parte", "De R$89 a R$389, tudo incluso"] },
  { label: "Quem escreve os textos", v: ["Você", "Você, na maioria das vezes", "Agência, geralmente", "A Supporta"] },
  { label: "Feito pro celular e rápido", v: ["Depende do modelo", "Depende do profissional", true, "Meta de 90+ no PageSpeed"] },
  { label: "Dados estruturados e llms.txt", v: [false, "Raramente", "Às vezes", true] },
  { label: "Robôs das IAs liberados", v: ["Depende do construtor", "Raramente conferido", "Às vezes", true] },
  { label: "Ajustes depois de pronto", v: ["Você faz", "Cobrado à parte", "Cobrado à parte", "Inclusos no plano"] },
  { label: "Se a pessoa sumir", v: ["Não se aplica", "Site fica sem suporte", "Contrato", "Contrato e área do cliente"] },
  { label: "Modelo de contratação", v: ["Assinatura do construtor", "Compra do site", "Compra do site", "Assinatura do site (mínimo de 12 meses)"] },
  { label: "Se parar de pagar", v: ["Site sai do ar", "Site continua, sem manutenção", "Site continua, sem manutenção", "Site sai do ar; o domínio é seu"] },
];

const faq: FaqItem[] = [
  { q: "Vale a pena fazer o site sozinho num construtor?", a: "Vale se você tem tempo e gosta de mexer. O custo aparece no seu tempo: escrever textos, ajustar no celular, cuidar de SEO e manter atualizado. Muita gente começa e o site fica pela metade." },
  { q: "Quando faz sentido contratar uma agência?", a: "Quando o projeto é grande ou muito específico: lojas virtuais complexas, sistemas, integrações. Para um site institucional de empresa local, a assinatura costuma resolver com menos custo e menos dor de cabeça." },
  { q: "O site da Supporta é meu?", a: "A Supporta é uma assinatura, não a venda de um site. O domínio e o conteúdo que você envia são seus; o site fica no ar e mantido enquanto a assinatura estiver ativa. É como uma assinatura de serviço: você não paga uma obra, paga para ter o site funcionando todo mês." },
];

function Cell({ v, highlight }: { v: V; highlight: boolean }) {
  return (
    <td className={`px-4 py-3.5 text-center ${highlight ? "bg-pink-light/60 font-medium" : ""}`}>
      {v === true ? <><Check aria-hidden strokeWidth={1.75} className="mx-auto h-5 w-5" /><span className="sr-only">Sim</span></> : v === false ? <><Minus aria-hidden strokeWidth={1.75} className="mx-auto h-5 w-5 text-graphite" /><span className="sr-only">Não</span></> : v}
    </td>
  );
}

export default function ComparativoPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Comparativo", path: "/comparativo" }]}
        label="Comparativo"
        title="Qual a melhor forma de ter um site para a minha empresa?"
        lead="Depende de quanto tempo você tem e de quanto quer investir de uma vez. Esta comparação mostra o que muda em cada caminho, sem marca e sem preço inventado."
      />
      <section aria-label="Tabela comparativa" className="pb-20 md:pb-28">
        <div className="container-site">
          <div className="relative overflow-x-auto rounded-[2rem] border border-line bg-white">
            <table className="w-full min-w-[760px] text-left text-[15px]">
              <caption className="sr-only">Comparação entre construtor de sites, freelancer, agência e Supporta</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-6 py-4 font-medium text-graphite">Critério</th>
                  {cols.map((c, i) => <th key={c} scope="col" className={`px-4 py-4 text-center font-semibold ${i === 3 ? "bg-pink-light" : ""}`}>{c}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className="px-6 py-3.5 font-normal">{r.label}</th>
                    {r.v.map((v, i) => <Cell key={i} v={v} highlight={i === 3} />)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-graphite">Comparação geral. Cada construtor, freelancer e agência trabalha de um jeito; use como ponto de partida para as suas perguntas.</p>
        </div>
      </section>
      <Section tone="white" labelledBy="comp-faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="comp-faq" label="Dúvidas" title="Perguntas sobre cada opção" />
          <Faq items={faq} />
        </div>
      </Section>
      <FinalCta />
      <JsonLd data={faqSchema(faq)} />
    </>
  );
}
