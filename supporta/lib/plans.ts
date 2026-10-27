export type PlanId = "start" | "pro" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  pitch: string;
  features: string[];
  highlight?: boolean;
};

export const plans: Plan[] = [
  {
    id: "start",
    name: "Start",
    price: 89,
    pitch: "Para colocar a empresa no ar com cara profissional.",
    features: [
      "Site one page em modelo pronto com a marca do cliente",
      "Domínio .com.br incluso no 1º ano",
      "Hospedagem, SSL e manutenção",
      "Botão de WhatsApp e Google Maps",
      "GEO básico (dados estruturados, llms.txt, robots liberado pras IAs)",
      "1 ajuste por mês",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 189,
    pitch: "Para quem quer ser encontrado e escolhido todo mês.",
    highlight: true,
    features: [
      "Até 5 páginas com design personalizado a partir do modelo",
      "Blog com 2 artigos por mês feitos pra aparecer nas IAs",
      "Google Meu Negócio otimizado",
      "3 ajustes por mês",
      "Relatório mensal de visitas",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 389,
    pitch: "Para virar a referência do seu segmento nas IAs.",
    features: [
      "Site sob medida",
      "GEO avançado e monitoramento mensal de citações no ChatGPT, Gemini e Perplexity",
      "4 artigos por mês",
      "Ajustes ilimitados (prazo de até 48h)",
      "Suporte prioritário no WhatsApp",
    ],
  },
];

export const planIds = plans.map((p) => p.id);

export function getPlan(id: string) {
  return plans.find((p) => p.id === id);
}

/** Linhas da tabela comparativa. true = incluso, false = não incluso, string = valor. */
export const comparison: { group: string; rows: { label: string; values: Record<PlanId, boolean | string> }[] }[] = [
  {
    group: "Site",
    rows: [
      { label: "Tipo de site", values: { start: "One page em modelo pronto", pro: "Até 5 páginas personalizadas", premium: "Sob medida" } },
      { label: "Sua marca (logo, cores, textos)", values: { start: true, pro: true, premium: true } },
      { label: "Feito pro celular", values: { start: true, pro: true, premium: true } },
      { label: "Botão de WhatsApp e Google Maps", values: { start: true, pro: true, premium: true } },
      { label: "Blog", values: { start: false, pro: "2 artigos por mês", premium: "4 artigos por mês" } },
    ],
  },
  {
    group: "Infraestrutura",
    rows: [
      { label: "Domínio .com.br", values: { start: "Incluso no 1º ano", pro: "Incluso no 1º ano", premium: "Incluso no 1º ano" } },
      { label: "Hospedagem e SSL (cadeado)", values: { start: true, pro: true, premium: true } },
      { label: "Manutenção e atualizações", values: { start: true, pro: true, premium: true } },
      { label: "Ajustes por mês", values: { start: "1", pro: "3", premium: "Ilimitados (até 48h)" } },
    ],
  },
  {
    group: "Google e IAs",
    rows: [
      { label: "Dados estruturados e llms.txt", values: { start: true, pro: true, premium: true } },
      { label: "robots.txt liberado pras IAs", values: { start: true, pro: true, premium: true } },
      { label: "Google Meu Negócio otimizado", values: { start: false, pro: true, premium: true } },
      { label: "GEO avançado", values: { start: false, pro: false, premium: true } },
      { label: "Monitoramento de citações no ChatGPT, Gemini e Perplexity", values: { start: false, pro: false, premium: "Mensal" } },
    ],
  },
  {
    group: "Acompanhamento",
    rows: [
      { label: "Relatório mensal de visitas", values: { start: false, pro: true, premium: true } },
      { label: "Suporte no WhatsApp", values: { start: "Padrão", pro: "Padrão", premium: "Prioritário" } },
    ],
  },
  {
    group: "Contrato",
    rows: [
      { label: "Custo de criação", values: { start: "R$0", pro: "R$0", premium: "R$0" } },
      { label: "Pagamento", values: { start: "Cartão, todo mês", pro: "Cartão, todo mês", premium: "Cartão, todo mês" } },
      { label: "Fidelidade", values: { start: "12 meses", pro: "12 meses", premium: "12 meses" } },
    ],
  },
];
