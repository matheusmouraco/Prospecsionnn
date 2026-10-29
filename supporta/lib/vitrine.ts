// Modelos de demonstração (templates HTML traduzidos, com o logo da Supporta), servidos em public/vitrine/<slug>/index.html.
// São só a home de cada modelo, com noindex: servem para o cliente ver o estilo antes de assinar.

export type VitrineItem = { slug: string; name: string; category: string };

export const vitrine: VitrineItem[] = [
  { slug: "contador", name: "Escritório contábil", category: "Serviços profissionais" },
  { slug: "contabilidade", name: "Contabilidade", category: "Serviços profissionais" },
  { slug: "financas", name: "Consultoria financeira", category: "Serviços profissionais" },
  { slug: "consultoria", name: "Consultoria empresarial", category: "Serviços profissionais" },
  { slug: "fintech", name: "Finanças e fintech", category: "Serviços profissionais" },
  { slug: "terapia", name: "Terapia e psicologia", category: "Saúde e bem-estar" },
  { slug: "veterinaria", name: "Clínica veterinária", category: "Saúde e bem-estar" },
  { slug: "academia", name: "Academia", category: "Saúde e bem-estar" },
  { slug: "hotel-pet", name: "Hotel para pets", category: "Saúde e bem-estar" },
  { slug: "arquitetura", name: "Arquitetura", category: "Casa e construção" },
  { slug: "construtora", name: "Construtora", category: "Casa e construção" },
  { slug: "construcao", name: "Construção e reformas", category: "Casa e construção" },
  { slug: "assistencia-tecnica", name: "Assistência técnica", category: "Casa e construção" },
  { slug: "restaurante", name: "Restaurante", category: "Comida e eventos" },
  { slug: "cervejaria", name: "Cervejaria", category: "Comida e eventos" },
  { slug: "floricultura", name: "Floricultura", category: "Comida e eventos" },
  { slug: "eventos", name: "Eventos", category: "Comida e eventos" },
  { slug: "parque", name: "Parque e lazer", category: "Comida e eventos" },
  { slug: "agencia", name: "Agência criativa", category: "Agências e estúdios" },
  { slug: "agencia-criativa", name: "Estúdio criativo", category: "Agências e estúdios" },
  { slug: "agencia-digital", name: "Agência digital", category: "Agências e estúdios" },
  { slug: "marketing", name: "Marketing digital", category: "Agências e estúdios" },
  { slug: "estudio-design", name: "Estúdio de design", category: "Agências e estúdios" },
  { slug: "grafica", name: "Gráfica", category: "Agências e estúdios" },
  { slug: "portfolio", name: "Portfólio pessoal", category: "Agências e estúdios" },
  { slug: "coworking", name: "Coworking", category: "Negócios e tecnologia" },
  { slug: "comunidade", name: "Comunidade e associação", category: "Negócios e tecnologia" },
  { slug: "saas", name: "Software e SaaS", category: "Negócios e tecnologia" },
  { slug: "produto", name: "Página de produto", category: "Negócios e tecnologia" },
];

export const vitrineUrl = (slug: string) => `/vitrine/${slug}/index.html`;
export const vitrineThumb = (slug: string) => `/vitrine/${slug}.webp`;
export const vitrineCategories = [...new Set(vitrine.map((v) => v.category))];
