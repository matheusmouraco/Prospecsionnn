export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  date: string;
  readingMinutes: number;
};

// O corpo de cada artigo fica em content/blog/<slug>.mdx.
export const posts: Post[] = [
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
