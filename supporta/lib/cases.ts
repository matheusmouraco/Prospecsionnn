// Cases reais de clientes. A seção e a página /cases só aparecem quando houver pelo menos um.
// Regra: só números medidos (PageSpeed antes e depois, citações) e depoimento autorizado por escrito.

export type Case = {
  slug: string;
  empresa: string;
  segmento: string; // slug de lib/segments.ts
  cidade: string;
  plano: "start" | "pro" | "premium";
  site: string;
  resumo: string;
  antes: { performance: number; seo: number; medidoEm: string };
  depois: { performance: number; seo: number; medidoEm: string };
  depoimento?: { texto: string; autor: string; cargo: string; autorizadoEm: string };
};

export const cases: Case[] = [
  // Exemplo de preenchimento (apague o comentário e use dados reais):
  // {
  //   slug: "clinica-exemplo",
  //   empresa: "Clínica Exemplo",
  //   segmento: "odontologia",
  //   cidade: "Curitiba",
  //   plano: "pro",
  //   site: "https://clinicaexemplo.com.br",
  //   resumo: "Saiu de um site lento feito em construtor para um site rápido com página por tratamento.",
  //   antes: { performance: 38, seo: 72, medidoEm: "2026-11-02" },
  //   depois: { performance: 97, seo: 100, medidoEm: "2026-11-20" },
  //   depoimento: { texto: "...", autor: "Nome", cargo: "Sócia", autorizadoEm: "2026-11-25" },
  // },
];
