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
  { slug: "agencia-criativa", name: "Estúdio criativo", category: "Agências e estúdios" },
  { slug: "marketing", name: "Marketing digital", category: "Agências e estúdios" },
  { slug: "estudio-design", name: "Estúdio de design", category: "Agências e estúdios" },
  { slug: "grafica", name: "Gráfica", category: "Agências e estúdios" },
  { slug: "portfolio", name: "Portfólio pessoal", category: "Agências e estúdios" },
  { slug: "coworking", name: "Coworking", category: "Negócios e tecnologia" },
  { slug: "comunidade", name: "Comunidade e associação", category: "Negócios e tecnologia" },
  { slug: "saas", name: "Software e SaaS", category: "Negócios e tecnologia" },
];

export const vitrineUrl = (slug: string) => `/vitrine/${slug}/index.html`;
export const vitrineThumb = (slug: string) => `/vitrine/${slug}.webp`;
export const vitrineCategories = [...new Set(vitrine.map((v) => v.category))];

/** Modelo da vitrine mostrado em cada página de segmento (lib/segments.ts). */
export const segmentModel: Record<string, string> = {
  arquitetura: "arquitetura",
  restaurante: "restaurante",
  odontologia: "terapia",
  advocacia: "financas",
  saude: "terapia",
  servicos: "assistencia-tecnica",
};

export const vitrineMobileThumb = (slug: string) => `/vitrine/${slug}-mobile.webp`;

/** Uma frase por categoria, para a vitrine por segmento da home. */
export const categoryIntro: Record<string, string> = {
  "Serviços profissionais": "Para contadores, consultores e escritórios: serviços explicados com clareza, preços à vista e um caminho direto para o contato.",
  "Saúde e bem-estar": "Para clínicas, terapeutas, academias e veterinárias: acolhimento, especialidades e agendamento em poucos toques.",
  "Casa e construção": "Para arquitetos, construtoras e assistências: obras em destaque, etapas do serviço e pedido de orçamento rápido.",
  "Comida e eventos": "Para restaurantes, cervejarias, floriculturas e eventos: cardápio, horários, reservas e fotos que dão vontade.",
  "Agências e estúdios": "Para agências, estúdios e portfólios: o trabalho em primeiro plano, com personalidade forte.",
  "Negócios e tecnologia": "Para coworkings, comunidades, softwares e produtos: proposta clara, planos lado a lado e chamada para testar.",
};
