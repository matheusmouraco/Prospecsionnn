// Preço da Supporta (nov/2026): o site é pago uma vez. Depois do 1º ano, só renova o endereço;
// domínio próprio é opcional. Mudar aqui muda o site, o checkout, os Termos e o llms.txt.

// O banco aceita 'start' | 'pro' | 'premium' (assinaturas antigas); o produto atual é um só: 'pro'.
export type PlanId = "start" | "pro" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  pitch: string;
  features: string[];
  highlight?: boolean;
};

export const pricing = {
  /** Site profissional, pago uma vez. */
  site: 99,
  /** Horas até o site ficar pronto depois do pagamento. */
  prazoHoras: 2,
  /** Endereço nome.supporta.com.br (hospedagem incluída): incluso no 1º ano, renova por ano a partir do 2º. */
  endereco: 45,
  /** Domínio próprio .com.br, opcional, por ano desde o 1º ano. */
  dominio: 75,
  /** Alterações sem custo até estes dias depois da entrega do site. */
  diasAlteracaoGratis: 30,
  /** Cada alteração depois desse prazo. */
  alteracao: 50,
};

export const plans: Plan[] = [
  {
    id: "pro",
    name: "Site profissional",
    price: pricing.site,
    pitch: `Pago uma vez, pronto em até ${pricing.prazoHoras}h. Criado pela IA a partir das suas respostas, com a sua marca.`,
    highlight: true,
    features: [
      "Site completo com até 5 páginas: início, sobre, serviços, perguntas e contato",
      "Feito pro celular, com botão de WhatsApp e Google Maps",
      "Endereço nome.supporta.com.br e hospedagem com SSL inclusos no 1º ano",
      "GEO: dados estruturados, llms.txt e robots liberado pras IAs",
      `Alterações sem custo nos primeiros ${pricing.diasAlteracaoGratis} dias`,
    ],
  },
];

export const site99 = plans[0];

/** Linhas do "tudo o que você paga". */
export const priceRows = [
  { item: "Site profissional", detail: `pago uma vez, pronto em até ${pricing.prazoHoras}h`, value: pricing.site, per: "", obrigatorio: true },
  { item: "Endereço .supporta.com.br", detail: "incluso no 1º ano, depois renova todo ano", value: pricing.endereco, per: "/ano", obrigatorio: true },
  { item: "Domínio próprio .com.br", detail: "renova todo ano", value: pricing.dominio, per: "/ano", obrigatorio: false },
  { item: "Alteração no site", detail: `depois de ${pricing.diasAlteracaoGratis} dias da entrega`, value: pricing.alteracao, per: "/cada", obrigatorio: false },
];

/** Projeto sob medida: fora do site automático, falado direto com o Matheus. */
export const customProject = {
  label: "Quer algo personalizado?",
  cta: "Falar com o Matheus",
  whatsapp: "+55 11 99264-4010",
  message: "Oi, Matheus! Vim pela Supporta, mas quero um projeto personalizado.",
};

/** Preço formatado com centavos, como aparece para o cliente (R$ 99,00). */
export const priceLabel = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const planIds = plans.map((p) => p.id);

/** Assinaturas antigas podem ter outros ids; todas valem como o produto atual. */
export function getPlan(id: string): Plan | undefined {
  if (id === "start" || id === "premium") return { ...site99, id };
  return plans.find((p) => p.id === id);
}

/** O que o cliente paga hoje e a cada ano a partir do 2º, com ou sem domínio próprio. */
export function chargesFor(dominio: boolean) {
  return {
    hoje: pricing.site + (dominio ? pricing.dominio : 0),
    anual: pricing.endereco + (dominio ? pricing.dominio : 0),
  };
}

/** Alteração sem custo enquanto o site tem até `diasAlteracaoGratis` dias no ar (ou ainda não foi entregue). */
export function alteracaoGratis(publicadoEm: Date | string | null, agora = new Date()) {
  if (!publicadoEm) return true;
  const dias = (agora.getTime() - new Date(publicadoEm).getTime()) / 86_400_000;
  return dias <= pricing.diasAlteracaoGratis;
}
