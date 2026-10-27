import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/home/FinalCta";
import { Button } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { geoFaq } from "@/lib/faqs";
import { articleSchema, faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "O que é GEO, AEO e SEO: guia simples | Supporta",
  description:
    "Entenda SEO, AEO, GEO e llms.txt em linguagem simples e saiba como preparar o site da sua empresa para ser citado pelo ChatGPT, Gemini e Perplexity.",
  path: "/geo",
});

const sections = [
  {
    id: "seo",
    title: "O que é SEO?",
    answer: "SEO é o conjunto de cuidados que fazem o seu site aparecer bem posicionado no Google.",
    body: [
      "Isso inclui um site rápido no celular, títulos e descrições claros em cada página, textos que falam do que o cliente procura e links organizados. O Google usa centenas de sinais, mas a base é simples: ele quer mostrar a página que melhor resolve a busca.",
      "Para uma empresa local, SEO também é deixar claro onde você atende. Cidade, bairro e região escritos no site ajudam o Google a mostrar você para quem está perto.",
    ],
  },
  {
    id: "aeo",
    title: "O que é AEO?",
    answer: "AEO (Answer Engine Optimization) é preparar o conteúdo para virar a resposta direta de uma pergunta.",
    body: [
      "Quando alguém pergunta \"quanto tempo dura um implante dentário?\", o Google muitas vezes mostra um trecho de um site no topo, antes dos resultados. Assistentes de voz fazem o mesmo. Esse trecho sai de páginas que respondem a pergunta logo na primeira frase.",
      "Na prática, AEO é escrever como uma boa resposta: pergunta no título, resposta curta e direta logo abaixo, detalhes depois. É o padrão que usamos em todas as páginas da Supporta, inclusive nesta.",
    ],
  },
  {
    id: "geo",
    title: "O que é GEO?",
    answer: "GEO (Generative Engine Optimization) é fazer o seu site ser usado como fonte pelas IAs generativas, como ChatGPT, Gemini e Perplexity.",
    body: [
      "Essas IAs montam respostas a partir de páginas que conseguem ler e em que confiam. Quando alguém pergunta \"qual advogado trabalhista você indica em Campinas?\", a IA busca fontes, compara e cita algumas empresas. GEO é o trabalho de ser uma dessas fontes.",
      "Os pilares são: deixar os robôs das IAs entrarem no site, organizar as informações com dados estruturados, escrever conteúdo que responde perguntas reais e manter nome, endereço e telefone iguais em todos os lugares onde a empresa aparece.",
    ],
  },
  {
    id: "llms-txt",
    title: "O que é llms.txt?",
    answer: "llms.txt é um arquivo de texto na raiz do site que resume a empresa e aponta as páginas mais importantes para as IAs.",
    body: [
      "Ele funciona como um guia de leitura: quem é a empresa, o que faz, onde atende e quais páginas explicam cada assunto. É um padrão novo e simples, e todo site da Supporta já sai com o seu.",
    ],
    extra: (
      <p className="mt-4 text-lg leading-relaxed text-graphite">
        Veja o da própria Supporta:{" "}
        <Link href="/llms.txt" className="link text-ink">supporta.com.br/llms.txt</Link>.
      </p>
    ),
  },
  {
    id: "robots",
    title: "Os robôs das IAs conseguem ler o meu site?",
    answer: "Depende do arquivo robots.txt do seu site, que diz quais robôs podem entrar.",
    body: [
      "Muitos sites bloqueiam sem querer robôs como GPTBot (OpenAI), ClaudeBot (Anthropic), PerplexityBot e Google-Extended. Se eles não entram, a IA não lê o seu conteúdo e não tem como indicar você. Nos sites da Supporta, esses robôs são liberados por padrão.",
    ],
  },
  {
    id: "dados-estruturados",
    title: "O que são dados estruturados?",
    answer: "Dados estruturados são informações escritas num formato padrão (schema.org) que robôs entendem sem precisar interpretar o texto.",
    body: [
      "Com eles, o Google e as IAs sabem com certeza qual é o nome da empresa, o endereço, o horário, os serviços, os preços e as perguntas frequentes. É invisível para quem visita, mas faz muita diferença para quem lê o site por máquina.",
    ],
  },
  {
    id: "como-fazemos",
    title: "Como a Supporta faz GEO para a sua empresa?",
    answer: "Todo plano já inclui o GEO básico, e os planos Pro e Premium vão além com conteúdo e monitoramento.",
    body: [
      "Start: dados estruturados, llms.txt e robots.txt liberado para as IAs. Pro: tudo do Start, mais 2 artigos por mês escritos para responder perguntas reais dos seus clientes e o Google Meu Negócio otimizado. Premium: GEO avançado, 4 artigos por mês e monitoramento mensal de citações no ChatGPT, Gemini e Perplexity.",
    ],
  },
];

export default function GeoPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "GEO", path: "/geo" }]}
        label="Guia simples"
        title="SEO, AEO e GEO: como ser encontrado no Google e nas IAs"
        lead="Seus clientes buscam no Google e perguntam para o ChatGPT. Este guia explica, sem jargão, o que faz um site aparecer nos dois lugares."
      >
        <nav aria-label="Nesta página" className="mt-10">
          <ol className="flex flex-wrap gap-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-[15px] hover:border-ink">
                  <span className="font-mono text-xs text-graphite">{String(i + 1).padStart(2, "0")}</span>
                  {s.title.replace("?", "")}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHero>

      <section aria-label="Guia" className="bg-white py-20 md:py-28">
        <div className="container-site">
          <ol className="space-y-20 md:space-y-28">
            {sections.map((s, i) => (
              <li key={s.id} id={s.id} className="grid gap-6 md:grid-cols-[160px_1fr] md:gap-12">
                <span aria-hidden className="font-mono text-5xl font-medium tracking-[-0.04em] text-graphite md:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="max-w-3xl">
                  <h2 className="text-[clamp(1.9rem,4.5vw,3rem)] tracking-[-0.05em]">{s.title}</h2>
                  <p className="mt-5 text-xl font-medium leading-snug tracking-[-0.02em] text-ink">{s.answer}</p>
                  {s.body.map((p) => (
                    <p key={p.slice(0, 24)} className="mt-4 text-lg leading-relaxed text-graphite">
                      {p}
                    </p>
                  ))}
                  {s.extra}
                  {i === 2 || i === 6 ? (
                    <Button href={i === 2 ? "/diagnostico" : "/#planos"} size="lg" className="mt-8" data-track={i === 6 ? "plan_click" : undefined} data-track-origin="geo">
                      {i === 2 ? "Testar se meu site está pronto pras IAs" : "Ver planos"} <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section labelledBy="geo-faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="geo-faq" label="Dúvidas" title="Perguntas sobre GEO" />
          <Faq items={geoFaq} />
        </div>
      </Section>
      <FinalCta />
      <JsonLd
        data={[
          articleSchema({
            title: "SEO, AEO e GEO: como ser encontrado no Google e nas IAs",
            description: "Guia simples sobre SEO, AEO, GEO, llms.txt e dados estruturados para pequenas empresas.",
            path: "/geo",
            date: "2026-10-01",
          }),
          faqSchema(geoFaq),
        ]}
      />
    </>
  );
}
