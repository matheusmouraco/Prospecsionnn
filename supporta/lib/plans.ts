export type PlanId = "start" | "pro" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  pitch: string;
  features: string[];
  /** Linha antes da lista, quando o plano soma ao anterior. */
  includes?: string;
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
    includes: "Tudo do Start, e mais:",
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
    includes: "Tudo do Pro, e mais:",
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

/** Ajustes incluídos por mês (null = ilimitado). */
export const adjustmentsPerMonth: Record<PlanId, number | null> = { start: 1, pro: 3, premium: null };

export function getPlan(id: string) {
  return plans.find((p) => p.id === id);
}

/** Como a assinatura é cobrada: todo mês ou uma vez por ano. */
export type Cycle = "mensal" | "anual";
export const cycles: Cycle[] = ["mensal", "anual"];
export const parseCycle = (v: unknown): Cycle => (v === "anual" ? "anual" : "mensal");

/** Regras comerciais da assinatura. Mudar aqui muda o site, o checkout, os Termos e o llms.txt. */
export const billing = {
  /** Prazo mínimo de contrato, em meses. */
  minMonths: 12,
  /** Cancelamento antes do fim do prazo mínimo: multa sobre o valor das mensalidades que faltam. */
  earlyCancelFeePct: 30,
  /** Desconto na mensalidade a partir do 13º mês, para quem continua. */
  loyaltyDiscountPct: 10,
  /** No anual, o cliente paga este número de mensalidades e leva 12 meses. */
  annualMonthsCharged: 10,
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Valor de cada cobrança no ciclo escolhido (mensalidade ou anuidade). */
export function priceFor(plan: Pick<Plan, "price">, cycle: Cycle) {
  return cycle === "anual" ? plan.price * billing.annualMonthsCharged : plan.price;
}

/** Valor de cada cobrança a partir do 13º mês, já com o desconto de quem continua. */
export function loyaltyPriceFor(plan: Pick<Plan, "price">, cycle: Cycle) {
  return round2(priceFor(plan, cycle) * (1 - billing.loyaltyDiscountPct / 100));
}

/** Meses grátis no anual (12 menos os meses cobrados). */
export const annualFreeMonths = 12 - billing.annualMonthsCharged;

/** Multa de cancelamento antecipado no plano mensal, dado quantas mensalidades já foram pagas. */
export function earlyCancelFee(plan: Pick<Plan, "price">, paidMonths: number) {
  const remaining = Math.max(0, billing.minMonths - paidMonths);
  return round2(remaining * plan.price * (billing.earlyCancelFeePct / 100));
}

const perPlan = (fn: (p: Plan) => string) => Object.fromEntries(plans.map((p) => [p.id, fn(p)])) as Record<PlanId, string>;

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
      { label: "Pagamento no cartão", values: { start: "Mensal ou anual", pro: "Mensal ou anual", premium: "Mensal ou anual" } },
      { label: `Anual (${billing.annualMonthsCharged} mensalidades por 12 meses)`, values: perPlan((p) => `R$${priceFor(p, "anual").toLocaleString("pt-BR")}/ano`) },
      { label: "Prazo mínimo", values: { start: "12 meses", pro: "12 meses", premium: "12 meses" } },
      { label: "Desconto a partir do 13º mês", values: perPlan(() => `${billing.loyaltyDiscountPct}%`) },
    ],
  },
];
