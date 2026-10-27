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
    metaTitle: "Prestador de serviço local: como aparecer nas IAs",
    description:
      "Área de atendimento em texto, Google Meu Negócio completo e nome, endereço e telefone iguais em todo lugar. O que o prestador local precisa para aparecer.",
    date: "2026-10-26",
    readingMinutes: 4,
    segment: "servicos",
  },
  {
    slug: "arquiteto-no-google-e-nas-ias",
    title: "Como o arquiteto aparece no Google e nas IAs",
    metaTitle: "Como o arquiteto aparece no Google e nas IAs",
    description:
      "Portfólio com texto, uma página por projeto e imagens leves. Veja o que o site do arquiteto precisa para ser encontrado no Google e citado pelas IAs.",
    date: "2026-10-25",
    readingMinutes: 4,
    segment: "arquitetura",
  },
  {
    slug: "clinica-de-saude-nas-ias",
    title: "Como a clínica de saúde aparece nas IAs",
    metaTitle: "Clínica de saúde nas IAs: como aparecer no ChatGPT",
    description:
      "Páginas por especialidade, profissionais identificados e conteúdo sem promessa de cura, dentro da Resolução CFM 2.336/2023. Veja o que fazer.",
    date: "2026-10-24",
    readingMinutes: 4,
    segment: "saude",
  },
  {
    slug: "restaurante-no-google-e-nas-ias",
    title: "Como o restaurante aparece no Google e nas IAs",
    metaTitle: "Como o restaurante aparece no Google e nas IAs",
    description:
      "Cardápio em texto e não em PDF, horários certos e dados estruturados. O que o site do restaurante precisa para ser encontrado no Google e nas IAs.",
    date: "2026-10-23",
    readingMinutes: 4,
    segment: "restaurante",
  },
  {
    slug: "advogado-nas-ias",
    title: "Como o escritório de advocacia aparece nas IAs",
    metaTitle: "Como o escritório de advocacia aparece nas IAs",
    description:
      "Conteúdo informativo por área de atuação, dentro do Provimento 205/2021 da OAB. Veja como o escritório pode ser citado pelo ChatGPT e outras IAs.",
    date: "2026-10-22",
    readingMinutes: 4,
    segment: "advocacia",
  },
  {
    slug: "dentista-no-chatgpt",
    title: "Como o dentista aparece no ChatGPT",
    metaTitle: "Como o dentista aparece no ChatGPT e nas IAs",
    description:
      "Páginas por tratamento, dados estruturados e conteúdo dentro das regras do CFO. Veja o que o site do dentista precisa para ser citado pelas IAs.",
    date: "2026-10-21",
    readingMinutes: 4,
    segment: "odontologia",
  },
  {
    slug: "seo-aeo-geo-diferenca",
    title: "SEO, AEO e GEO: a diferença",
    metaTitle: "SEO, AEO e GEO: qual a diferença e por que importa",
    description:
      "SEO, AEO e GEO explicados sem jargão: o que cada um faz, como se completam e o que o seu site precisa para aparecer no Google e nas IAs.",
    date: "2026-10-20",
    readingMinutes: 6,
  },
  {
    slug: "como-a-ia-escolhe-quem-indicar",
    title: "Como a IA escolhe quem indicar",
    metaTitle: "Como o ChatGPT e outras IAs escolhem quem indicar",
    description:
      "Entenda como ChatGPT, Gemini e Perplexity escolhem as empresas que aparecem nas respostas e o que fazer para o seu negócio ser uma delas.",
    date: "2026-10-13",
    readingMinutes: 7,
  },
  {
    slug: "5-motivos-site-nao-aparece-no-google",
    title: "5 motivos pro seu site não aparecer no Google",
    metaTitle: "5 motivos pro seu site não aparecer no Google",
    description:
      "Site lento, sem título, bloqueado para robôs ou sem conteúdo útil. Veja os 5 motivos mais comuns e como resolver cada um.",
    date: "2026-10-06",
    readingMinutes: 5,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}
