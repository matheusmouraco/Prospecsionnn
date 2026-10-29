export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  date: string;
  readingMinutes: number;
  segment?: string;
};

// O corpo de cada artigo fica em content/blog/<slug>.mdx.
export const posts: Post[] = [
  {
    slug: "prestador-de-servico-nas-ias",
    title: "Como o prestador de serviço local aparece nas IAs",
    metaTitle: "Prestador de serviço nas IAs: como ser indicado",
    description:
      "Eletricista, encanador ou diarista: veja o que o site precisa dizer sobre serviços, área de atendimento e horários para o Google e as IAs indicarem você.",
    date: "2026-10-26",
    readingMinutes: 9,
    segment: "servicos",
  },
  {
    slug: "arquiteto-no-google-e-nas-ias",
    title: "Como o arquiteto aparece no Google e nas IAs",
    metaTitle: "Arquiteto no Google e nas IAs: portfólio que é achado",
    description:
      "Por que o portfólio do arquiteto precisa de texto, como organizar páginas de projeto e processo e o que ajuda o Google e as IAs a indicarem seu escritório.",
    date: "2026-10-25",
    readingMinutes: 8,
    segment: "arquitetura",
  },
  {
    slug: "clinica-de-saude-nas-ias",
    title: "Como a clínica de saúde aparece nas IAs",
    metaTitle: "Clínica de saúde nas IAs: como aparecer no ChatGPT",
    description:
      "Páginas por especialidade, profissionais identificados e textos sem promessa de cura, dentro da Resolução CFM 2.336/2023. Veja o que fazer.",
    date: "2026-10-24",
    readingMinutes: 9,
    segment: "saude",
  },
  {
    slug: "restaurante-no-google-e-nas-ias",
    title: "Como o restaurante aparece no Google e nas IAs",
    metaTitle: "Restaurante no Google e nas IAs: o que o site precisa",
    description:
      "Cardápio em texto e não em PDF, horários certos e dados estruturados. O que o site do restaurante precisa para aparecer no Google e nas IAs.",
    date: "2026-10-23",
    readingMinutes: 9,
    segment: "restaurante",
  },
  {
    slug: "advogado-nas-ias",
    title: "Como o escritório de advocacia aparece nas IAs",
    metaTitle: "Advogado nas IAs: como o escritório aparece",
    description:
      "Como o escritório de advocacia aparece no ChatGPT, Gemini e Google, dentro do Provimento 205/2021 da OAB: páginas por área, FAQ e dados estruturados.",
    date: "2026-10-22",
    readingMinutes: 9,
    segment: "advocacia",
  },
  {
    slug: "dentista-no-chatgpt",
    title: "Como o dentista aparece no ChatGPT",
    metaTitle: "Dentista no ChatGPT: como aparecer nas IAs",
    description:
      "Veja como o consultório odontológico aparece no ChatGPT e no Google: páginas por tratamento, dados estruturados e o que o CFO permite publicar.",
    date: "2026-10-21",
    readingMinutes: 9,
    segment: "odontologia",
  },
  {
    slug: "seo-aeo-geo-diferenca",
    title: "SEO, AEO e GEO: a diferença",
    metaTitle: "SEO, AEO e GEO: qual a diferença e por onde começar",
    description:
      "SEO é aparecer no Google, AEO é virar a resposta direta e GEO é ser citado pelas IAs. Entenda a diferença e como trabalhar os três no seu site.",
    date: "2026-10-20",
    readingMinutes: 9,
  },
  {
    slug: "como-a-ia-escolhe-quem-indicar",
    title: "Como a IA escolhe quem indicar",
    metaTitle: "Como o ChatGPT e outras IAs escolhem quem indicar",
    description:
      "Entenda como ChatGPT, Gemini e Perplexity escolhem as empresas que aparecem nas respostas e o que fazer para o seu negócio ser uma delas.",
    date: "2026-10-13",
    readingMinutes: 9,
  },
  {
    slug: "5-motivos-site-nao-aparece-no-google",
    title: "5 motivos pro seu site não aparecer no Google",
    metaTitle: "5 motivos para seu site não aparecer no Google",
    description:
      "Site lento, sem título, robôs bloqueados, pouco texto e falta de dados locais: veja como identificar e resolver cada motivo, sem refazer o site do zero.",
    date: "2026-10-06",
    readingMinutes: 8,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}
