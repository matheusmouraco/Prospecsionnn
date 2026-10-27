import { Section, SectionHeading } from "@/components/ui/Section";

const layers = [
  {
    tag: "SEO",
    title: "Aparecer no Google",
    text: "Site rápido, bem escrito e organizado para o Google entender o que você faz e mostrar você para quem procura.",
    offset: "lg:ml-[14%]",
    tone: "bg-white border border-line",
  },
  {
    tag: "AEO",
    title: "Virar a resposta direta",
    text: "Textos que respondem as perguntas reais dos clientes na primeira frase. É o que aparece nos destaques do Google e nas buscas por voz.",
    offset: "lg:ml-[6%]",
    tone: "bg-pink-light",
  },
  {
    tag: "GEO",
    title: "Ser citado pelas IAs",
    text: "Dados estruturados, llms.txt e robôs liberados para o ChatGPT, o Gemini e o Perplexity lerem o seu site e indicarem a sua empresa.",
    offset: "",
    tone: "bg-white border border-line",
  },
];

export function Layers() {
  return (
    <Section labelledBy="camadas-title">
      <SectionHeading
        id="camadas-title"
        label="As 3 camadas"
        title="Como fazer o Google e as IAs indicarem você?"
        lead="Trabalhando três camadas ao mesmo tempo. Todo site da Supporta já sai com as três."
      />
      <ol className="mt-12 space-y-4 md:mt-16">
        {layers.map((l) => (
          <li key={l.tag} className={`grid gap-3 rounded-[2rem] p-6 md:grid-cols-[120px_1fr_1.4fr] md:items-center md:gap-8 md:rounded-full md:px-10 md:py-7 lg:max-w-[86%] ${l.tone} ${l.offset}`}>
            <span className="label-mono text-graphite">{l.tag}</span>
            <h3 className="text-2xl tracking-[-0.04em] md:text-[28px]">{l.title}</h3>
            <p className="leading-relaxed text-graphite">{l.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
