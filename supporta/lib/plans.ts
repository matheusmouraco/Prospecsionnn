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

// Os três planos têm os mesmos extras; muda só o tamanho do site. Sob medida vai para o WhatsApp do Matheus (customProject).
const extras = [
  "Criado pela IA a partir das suas respostas, com a sua marca",
  "Domínio .com.br incluso no 1º ano",
  "Hospedagem, SSL e manutenção",
  "Botão de WhatsApp e Google Maps",
  "GEO: dados estruturados, llms.txt e robots liberado pras IAs",
  "1 ajuste por mês",
];

export const plans: Plan[] = [
  {
    id: "start",
    name: "Landing page",
    price: 49.9,
    pitch: "Uma página completa para apresentar a empresa e levar ao WhatsApp.",
    features: ["Site de 1 página (landing page)", ...extras],
  },
  {
    id: "pro",
    name: "Site",
    price: 99.9,
    pitch: "Site com até 5 páginas: início, sobre, serviços, perguntas e contato.",
    highlight: true,
    features: ["Site com até 5 páginas", ...extras],
  },
  {
    id: "premium",
    name: "Site com blog",
    price: 149.9,
    pitch: "O site de 5 páginas com um blog para aparecer em mais buscas e nas IAs.",
    features: ["Site com até 5 páginas e blog", "2 artigos iniciais no blog, escritos pela IA", ...extras],
  },
];

/** Projeto sob medida: fora da assinatura automática, falado direto com o Matheus. */
export const customProject = {
  label: "Quer algo personalizado?",
  cta: "Falar com o Matheus",
  whatsapp: "+55 11 99264-4010",
  message: "Oi, Matheus! Vim pela Supporta, mas quero um projeto personalizado.",
};

/** Preço formatado com centavos, como aparece para o cliente (R$ 49,90). */
export const priceLabel = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const planIds = plans.map((p) => p.id);

/** Ajustes incluídos por mês (null = ilimitado). */
export const adjustmentsPerMonth: Record<PlanId, number | null> = { start: 1, pro: 1, premium: 1 };

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
  return round2(cycle === "anual" ? plan.price * billing.annualMonthsCharged : plan.price);
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
      { label: "Tamanho", values: { start: "1 página", pro: "Até 5 páginas", premium: "Até 5 páginas" } },
      { label: "Blog", values: { start: false, pro: false, premium: "Com 2 artigos iniciais" } },
      { label: "Criado pela IA com a sua marca", values: { start: true, pro: true, premium: true } },
      { label: "Feito pro celular", values: { start: true, pro: true, premium: true } },
      { label: "Botão de WhatsApp e Google Maps", values: { start: true, pro: true, premium: true } },
    ],
  },
  {
    group: "Infraestrutura e GEO",
    rows: [
      { label: "Domínio .com.br", values: { start: "Incluso no 1º ano", pro: "Incluso no 1º ano", premium: "Incluso no 1º ano" } },
      { label: "Hospedagem, SSL e manutenção", values: { start: true, pro: true, premium: true } },
      { label: "Dados estruturados, llms.txt e robots pras IAs", values: { start: true, pro: true, premium: true } },
      { label: "Ajustes por mês", values: { start: "1", pro: "1", premium: "1" } },
    ],
  },
  {
    group: "Contrato",
    rows: [
      { label: "Custo de criação", values: { start: "R$0", pro: "R$0", premium: "R$0" } },
      { label: "Pagamento no cartão", values: { start: "Mensal ou anual", pro: "Mensal ou anual", premium: "Mensal ou anual" } },
      { label: `Anual (${billing.annualMonthsCharged} mensalidades por 12 meses)`, values: perPlan((p) => `${priceLabel(priceFor(p, "anual"))}/ano`) },
      { label: "Prazo mínimo", values: { start: "12 meses", pro: "12 meses", premium: "12 meses" } },
      { label: "Desconto a partir do 13º mês", values: perPlan(() => `${billing.loyaltyDiscountPct}%`) },
    ],
  },
];
