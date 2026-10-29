// Modelos de demonstração (templates HTML traduzidos, com o logo da Supporta), servidos em public/vitrine/<slug>/index.html.
// São só a home de cada modelo, com noindex: servem para o cliente ver o estilo antes de assinar.

// `path`: home de modelos exportados de Next/React que não fica na raiz da pasta.
export type VitrineItem = { slug: string; name: string; category: string; path?: string };

export const vitrine: VitrineItem[] = [
  { slug: "consultoria", name: "Consultoria empresarial", category: "Serviços profissionais" },
  { slug: "contador", name: "Escritório contábil", category: "Serviços profissionais" },
  { slug: "contabilidade", name: "Contabilidade", category: "Serviços profissionais" },
  { slug: "financas", name: "Consultoria financeira", category: "Serviços profissionais" },
  { slug: "fintech", name: "Finanças e fintech", category: "Serviços profissionais" },
  { slug: "odontologia-clinica", name: "Clínica odontológica", category: "Saúde e bem-estar" },
  { slug: "odontologia", name: "Consultório odontológico", category: "Saúde e bem-estar" },
  { slug: "clinica-medica", name: "Clínica médica", category: "Saúde e bem-estar" },
  { slug: "psicologia", name: "Psicologia", category: "Saúde e bem-estar" },
  { slug: "academia-fitness", name: "Estúdio fitness", category: "Saúde e bem-estar" },
  { slug: "terapia", name: "Terapia", category: "Saúde e bem-estar" },
  { slug: "veterinaria", name: "Clínica veterinária", category: "Saúde e bem-estar" },
  { slug: "academia", name: "Academia", category: "Saúde e bem-estar" },
  { slug: "hotel-pet", name: "Hotel para pets", category: "Saúde e bem-estar" },
  { slug: "arquitetura-estudio", name: "Estúdio de arquitetura", category: "Casa e construção" },
  { slug: "arquitetura-autoral", name: "Arquitetura autoral", category: "Casa e construção" },
  { slug: "construtora-obras", name: "Construtora e obras", category: "Casa e construção", path: "pages/homepage/home-1/" },
  { slug: "construtora-premium", name: "Construtora", category: "Casa e construção" },
  { slug: "construcao-civil", name: "Construção civil", category: "Casa e construção" },
  { slug: "reformas", name: "Reformas", category: "Casa e construção" },
  { slug: "interiores", name: "Design de interiores", category: "Casa e construção" },
  { slug: "imobiliaria", name: "Imobiliária", category: "Casa e construção" },
  { slug: "energia-solar", name: "Energia solar", category: "Casa e construção" },
  { slug: "arquitetura", name: "Arquitetura", category: "Casa e construção" },
  { slug: "construtora", name: "Construtora clássica", category: "Casa e construção" },
  { slug: "construcao", name: "Construção e reformas", category: "Casa e construção" },
  { slug: "assistencia-tecnica", name: "Assistência técnica", category: "Casa e construção" },
  { slug: "cafeteria", name: "Cafeteria", category: "Comida e eventos" },
  { slug: "restaurante", name: "Restaurante", category: "Comida e eventos" },
  { slug: "cervejaria", name: "Cervejaria", category: "Comida e eventos" },
  { slug: "floricultura", name: "Floricultura", category: "Comida e eventos" },
  { slug: "eventos", name: "Eventos", category: "Comida e eventos" },
  { slug: "agencia-design", name: "Agência de design", category: "Agências e estúdios" },
  { slug: "agencia-ia", name: "Agência de IA", category: "Agências e estúdios" },
  { slug: "agencia-portfolio", name: "Agência e portfólio", category: "Agências e estúdios" },
  { slug: "estudio-criativo", name: "Agência criativa", category: "Agências e estúdios" },
  { slug: "agencia-criativa", name: "Estúdio criativo", category: "Agências e estúdios" },
  { slug: "marketing", name: "Marketing digital", category: "Agências e estúdios" },
  { slug: "estudio-design", name: "Estúdio de design", category: "Agências e estúdios" },
  { slug: "grafica", name: "Gráfica", category: "Agências e estúdios" },
  { slug: "portfolio", name: "Portfólio pessoal", category: "Agências e estúdios" },
  { slug: "tecnologia", name: "TI e tecnologia", category: "Negócios e tecnologia" },
  { slug: "startup", name: "Startup", category: "Negócios e tecnologia" },
  { slug: "industria", name: "Indústria", category: "Negócios e tecnologia" },
  { slug: "locadora", name: "Locadora de veículos", category: "Negócios e tecnologia" },
  { slug: "saas", name: "Software e SaaS", category: "Negócios e tecnologia" },
  { slug: "coworking", name: "Coworking", category: "Negócios e tecnologia" },
  { slug: "comunidade", name: "Comunidade e associação", category: "Negócios e tecnologia" },
];

export const vitrineUrl = (slug: string) => {
  const path = vitrine.find((v) => v.slug === slug)?.path;
  return `/vitrine/${slug}/${path ?? "index.html"}`;
};
export const vitrineThumb = (slug: string) => `/vitrine/${slug}.webp`;
export const vitrineCategories = [...new Set(vitrine.map((v) => v.category))];

/** Modelo da vitrine mostrado em cada página de segmento (lib/segments.ts). */
export const segmentModel: Record<string, string> = {
  arquitetura: "arquitetura-estudio",
  restaurante: "restaurante",
  odontologia: "odontologia-clinica",
  advocacia: "consultoria",
  saude: "clinica-medica",
  servicos: "assistencia-tecnica",
};

export const vitrineMobileThumb = (slug: string) => `/vitrine/${slug}-mobile.webp`;

/** Uma frase por categoria, para a vitrine por segmento da home. */
export const categoryIntro: Record<string, string> = {
  "Serviços profissionais": "Para contadores, consultores e escritórios: serviços explicados com clareza, preços à vista e um caminho direto para o contato.",
  "Saúde e bem-estar": "Para dentistas, clínicas, psicólogos, academias e veterinárias: acolhimento, especialidades e agendamento em poucos toques.",
  "Casa e construção": "Para arquitetos, construtoras, imobiliárias, energia solar e reformas: obras em destaque, etapas do serviço e pedido de orçamento rápido.",
  "Comida e eventos": "Para cafeterias, restaurantes, cervejarias, floriculturas e eventos: cardápio, horários, reservas e fotos que dão vontade.",
  "Agências e estúdios": "Para agências, estúdios e portfólios: o trabalho em primeiro plano, com personalidade forte.",
  "Negócios e tecnologia": "Para empresas de TI, startups, indústrias, locadoras e softwares: proposta clara, planos lado a lado e chamada para testar.",
};
