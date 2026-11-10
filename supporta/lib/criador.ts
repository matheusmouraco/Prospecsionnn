// Criador gamificado (/criar): o que o cliente escolhe vira o briefing que a IA usa para montar o site.
// Este arquivo é a fonte das opções do jogo, da validação no servidor e do texto que o gerador recebe.

import type { PlanId } from "./plans";

export type Ramo = { slug: string; nome: string; emoji: string; segmento: string; servicos: string[] };

/** Ramos do jogo. `segmento` liga ao segmento do site (lib/segments.ts) quando existe. */
export const ramos: Ramo[] = [
  { slug: "odontologia", nome: "Dentista", emoji: "🦷", segmento: "odontologia", servicos: ["Limpeza", "Clareamento", "Implantes", "Ortodontia", "Odontopediatria", "Lentes de contato dental"] },
  { slug: "saude", nome: "Clínica ou médico", emoji: "🩺", segmento: "saude", servicos: ["Consultas", "Exames", "Check-up", "Telemedicina", "Retorno", "Atendimento domiciliar"] },
  { slug: "psicologia", nome: "Psicologia e terapia", emoji: "🧠", segmento: "saude", servicos: ["Terapia individual", "Terapia de casal", "Atendimento online", "Ansiedade", "Orientação para pais", "Avaliação psicológica"] },
  { slug: "estetica", nome: "Beleza e estética", emoji: "💅", segmento: "servicos", servicos: ["Limpeza de pele", "Design de sobrancelhas", "Depilação", "Massagem", "Unhas", "Cabelo"] },
  { slug: "academia", nome: "Academia e esporte", emoji: "🏋️", segmento: "servicos", servicos: ["Musculação", "Funcional", "Pilates", "Personal trainer", "Aulas em grupo", "Avaliação física"] },
  { slug: "advocacia", nome: "Advocacia", emoji: "⚖️", segmento: "advocacia", servicos: ["Direito de família", "Trabalhista", "Previdenciário", "Empresarial", "Consumidor", "Imobiliário"] },
  { slug: "contabilidade", nome: "Contabilidade", emoji: "📊", segmento: "servicos", servicos: ["Abertura de empresa", "MEI", "Imposto de renda", "Folha de pagamento", "Planejamento tributário", "BPO financeiro"] },
  { slug: "arquitetura", nome: "Arquitetura e interiores", emoji: "📐", segmento: "arquitetura", servicos: ["Projeto residencial", "Projeto comercial", "Interiores", "Reforma", "Consultoria", "Acompanhamento de obra"] },
  { slug: "construcao", nome: "Construção e reformas", emoji: "🏗️", segmento: "servicos", servicos: ["Reforma completa", "Construção", "Elétrica", "Hidráulica", "Pintura", "Orçamento sem compromisso"] },
  { slug: "restaurante", nome: "Restaurante ou café", emoji: "🍽️", segmento: "restaurante", servicos: ["Almoço", "Jantar", "Delivery", "Café da manhã", "Eventos", "Encomendas"] },
  { slug: "comercio", nome: "Loja e comércio", emoji: "🛍️", segmento: "servicos", servicos: ["Pronta entrega", "Encomendas", "Entrega na região", "Atacado", "Presentes", "Assistência"] },
  { slug: "servicos", nome: "Prestador de serviço", emoji: "🧰", segmento: "servicos", servicos: ["Orçamento grátis", "Atendimento em domicílio", "Manutenção", "Instalação", "Emergência", "Contrato mensal"] },
  { slug: "tecnologia", nome: "Tecnologia e agência", emoji: "💻", segmento: "servicos", servicos: ["Sites", "Sistemas", "Suporte de TI", "Marketing digital", "Consultoria", "Automação"] },
  { slug: "educacao", nome: "Escola e cursos", emoji: "🎓", segmento: "servicos", servicos: ["Aulas particulares", "Cursos online", "Reforço escolar", "Idiomas", "Preparatório", "Turmas presenciais"] },
  { slug: "pet", nome: "Pet e veterinária", emoji: "🐾", segmento: "servicos", servicos: ["Consultas", "Banho e tosa", "Vacinas", "Hotel", "Creche", "Pet shop"] },
  { slug: "outro", nome: "Outro ramo", emoji: "✨", segmento: "outro", servicos: [] },
];

/** Ids antigos de estilo: só para ler pedidos feitos antes do jogo novo. */
export const estiloDoModelo: Record<string, string> = {};

/**
 * Rodadas de direção visual. O cliente responde sobre o gosto dele, nunca sobre modelos prontos:
 * a composição do site nasce das respostas e não de um template.
 */
export type OpcaoDirecao = { id: string; nome: string; desc: string; demo: { bg: string; fg: string; font: string; peso: number; texto: string } };
export type Direcao = { id: string; pergunta: string; ajuda: string; opcoes: OpcaoDirecao[] };

export const direcoes: Direcao[] = [
  {
    id: "fundo",
    pergunta: "O site é mais claro ou mais escuro?",
    ajuda: "Pense no ambiente do seu negócio.",
    opcoes: [
      { id: "claro", nome: "Claro e arejado", desc: "Muito espaço em branco, leve de ler", demo: { bg: "#F7F7F4", fg: "#111111", font: "inherit", peso: 500, texto: "Aa" } },
      { id: "escuro", nome: "Escuro e marcante", desc: "Fundo escuro, presença forte", demo: { bg: "#0F0F12", fg: "#FFFFFF", font: "inherit", peso: 500, texto: "Aa" } },
    ],
  },
  {
    id: "letra",
    pergunta: "Qual letra tem a sua voz?",
    ajuda: "A letra diz muito antes de a pessoa ler.",
    opcoes: [
      { id: "classica", nome: "Clássica", desc: "Serifada, tradicional e elegante", demo: { bg: "#FFFFFF", fg: "#111111", font: "Georgia, serif", peso: 400, texto: "Aa" } },
      { id: "moderna", nome: "Moderna", desc: "Limpa, direta e atual", demo: { bg: "#FFFFFF", fg: "#111111", font: "inherit", peso: 500, texto: "Aa" } },
      { id: "impacto", nome: "Grande e forte", desc: "Títulos enormes que chamam atenção", demo: { bg: "#FFFFFF", fg: "#111111", font: "Impact, 'Arial Black', sans-serif", peso: 800, texto: "AA" } },
    ],
  },
  {
    id: "protagonista",
    pergunta: "O que vende mais o seu trabalho?",
    ajuda: "Isso define o que aparece primeiro.",
    opcoes: [
      { id: "imagens", nome: "As imagens", desc: "Fotos grandes contam a história", demo: { bg: "#E8E4DC", fg: "#111111", font: "inherit", peso: 500, texto: "▧" } },
      { id: "palavras", nome: "As palavras", desc: "Explicar bem é o que convence", demo: { bg: "#FFFFFF", fg: "#111111", font: "inherit", peso: 500, texto: "¶" } },
    ],
  },
  {
    id: "ritmo",
    pergunta: "Qual é o ritmo do seu negócio?",
    ajuda: "Vale para as cores, os espaços e o movimento.",
    opcoes: [
      { id: "calmo", nome: "Calmo", desc: "Sóbrio, sem pressa, transmite segurança", demo: { bg: "#EEF1EE", fg: "#2B3A33", font: "inherit", peso: 400, texto: "~" } },
      { id: "vibrante", nome: "Vibrante", desc: "Muita energia e movimento na tela", demo: { bg: "#111111", fg: "#FFFFFF", font: "inherit", peso: 800, texto: "!" } },
    ],
  },
];

export const personalidades = ["Elegante", "Moderno", "Acolhedor", "Ousado", "Minimalista", "Divertido", "Sério e técnico", "Natural"];

export type Paleta = { id: string; nome: string; cores: [string, string, string] };

export const paletas: Paleta[] = [
  { id: "azul", nome: "Azul confiança", cores: ["#1E3A8A", "#3B82F6", "#EFF6FF"] },
  { id: "verde", nome: "Verde natural", cores: ["#14532D", "#22C55E", "#F0FDF4"] },
  { id: "terracota", nome: "Terracota acolhedor", cores: ["#7C2D12", "#EA580C", "#FFF7ED"] },
  { id: "dourado", nome: "Preto e dourado", cores: ["#111111", "#B8892B", "#FAF7F0"] },
  { id: "rosa", nome: "Rosa vibrante", cores: ["#831843", "#EC4899", "#FDF2F8"] },
  { id: "lilas", nome: "Lilás calmo", cores: ["#4C1D95", "#8B5CF6", "#F5F3FF"] },
  { id: "laranja", nome: "Laranja energia", cores: ["#111827", "#F97316", "#FFF7ED"] },
  { id: "cinza", nome: "Cinza minimal", cores: ["#111111", "#6B7280", "#F5F5F5"] },
];

export const objetivos = ["Receber mais contatos no WhatsApp", "Passar mais confiança", "Aparecer no Google e nas IAs", "Mostrar meu trabalho"];

export type Cores =
  | { modo: "paleta"; paleta: string }
  | { modo: "propria"; primaria: string; secundaria: string }
  | { modo: "ia" };

export type Respostas = {
  empresa: string;
  ramo: string;
  ramoOutro: string;
  frase: string;
  estilos: string[];
  personalidade: string[];
  cores: Cores;
  /** De onde vieram as cores. Vazio: o cliente ainda não decidiu. */
  coresOrigem: "" | "logo" | "cliente" | "ia";
  direcao: Record<string, string>;
  historia: string;
  duvidas: string;
  admira: string;
  evitar: string;
  servicos: string[];
  diferenciais: string;
  publico: string;
  objetivo: string;
  cidade: string;
  endereco: string;
  horario: string;
  whatsappSite: string;
  instagram: string;
  siteAtual: string;
  logo: string;
  fotos: string[];
};

export const respostasVazias: Respostas = {
  empresa: "",
  ramo: "",
  ramoOutro: "",
  frase: "",
  estilos: [],
  personalidade: [],
  cores: { modo: "ia" },
  coresOrigem: "",
  direcao: {},
  historia: "",
  duvidas: "",
  admira: "",
  evitar: "",
  servicos: [],
  diferenciais: "",
  publico: "",
  objetivo: objetivos[0],
  cidade: "",
  endereco: "",
  horario: "",
  whatsappSite: "",
  instagram: "",
  siteAtual: "",
  logo: "",
  fotos: [],
};

export type Contato = { nome: string; email: string; whatsapp: string };

const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown, n: number, max: number) => (Array.isArray(v) ? v.map((x) => s(x, max)).filter(Boolean).slice(0, n) : []);
const hex = (v: unknown) => (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v.toUpperCase() : "");
const noDash = (t: string) => t.replace(/\s*[—–]\s*/g, ", ");

/** Imagens só do bucket público da Supporta (vêm do upload do próprio criador). */
export function isOwnImage(url: string) {
  const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
  return Boolean(base) && url.startsWith(`${base}/storage/v1/object/public/supporta-sites/`);
}

/** Limpa e valida o que veio do navegador. Devolve as respostas e a lista do que falta. */
export function parseRespostas(body: unknown): { respostas: Respostas; faltando: string[] } {
  const r = (body ?? {}) as Record<string, unknown>;
  const c = (r.cores ?? {}) as Record<string, unknown>;
  const cores: Cores =
    c.modo === "paleta" && paletas.some((p) => p.id === c.paleta)
      ? { modo: "paleta", paleta: String(c.paleta) }
      : c.modo === "propria" && hex(c.primaria)
        ? { modo: "propria", primaria: hex(c.primaria), secundaria: hex(c.secundaria) || hex(c.primaria) }
        : { modo: "ia" };
  const respostas: Respostas = {
    empresa: noDash(s(r.empresa, 80)),
    ramo: ramos.some((x) => x.slug === r.ramo) ? String(r.ramo) : "outro",
    ramoOutro: noDash(s(r.ramoOutro, 80)),
    frase: noDash(s(r.frase, 220)),
    estilos: [],
    personalidade: list(r.personalidade, 2, 30).filter((x) => personalidades.includes(x)),
    cores,
    coresOrigem: r.coresOrigem === "logo" || r.coresOrigem === "cliente" ? r.coresOrigem : "ia",
    direcao: Object.fromEntries(
      direcoes.flatMap((d) => {
        const v = ((r.direcao ?? {}) as Record<string, unknown>)[d.id];
        return d.opcoes.some((o) => o.id === v) ? [[d.id, String(v)]] : [];
      }),
    ),
    historia: noDash(s(r.historia, 600)),
    duvidas: noDash(s(r.duvidas, 500)),
    admira: noDash(s(r.admira, 300)),
    evitar: noDash(s(r.evitar, 300)),
    servicos: list(r.servicos, 8, 60).map(noDash),
    diferenciais: noDash(s(r.diferenciais, 600)),
    publico: noDash(s(r.publico, 300)),
    objetivo: objetivos.includes(String(r.objetivo)) ? String(r.objetivo) : objetivos[0],
    cidade: noDash(s(r.cidade, 120)),
    endereco: noDash(s(r.endereco, 200)),
    horario: noDash(s(r.horario, 160)),
    whatsappSite: s(r.whatsappSite, 20).replace(/\D/g, ""),
    instagram: s(r.instagram, 60).replace(/^@/, ""),
    siteAtual: s(r.siteAtual, 120),
    logo: isOwnImage(s(r.logo, 400)) ? s(r.logo, 400) : "",
    fotos: list(r.fotos, 8, 400).filter(isOwnImage),
  };
  const faltando: string[] = [];
  if (respostas.empresa.length < 2) faltando.push("nome do negócio");
  if (respostas.frase.length < 8) faltando.push("o que você faz");
  if (!respostas.servicos.length) faltando.push("pelo menos um serviço");
  if (respostas.cidade.length < 2) faltando.push("cidade");
  return { respostas, faltando };
}

export function parseContato(body: unknown): { contato: Contato; faltando: string[] } {
  const c = (body ?? {}) as Record<string, unknown>;
  const contato = { nome: s(c.nome, 80), email: s(c.email, 160).toLowerCase(), whatsapp: s(c.whatsapp, 20).replace(/\D/g, "") };
  const faltando: string[] = [];
  if (contato.nome.length < 2) faltando.push("seu nome");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contato.email)) faltando.push("e-mail");
  if (contato.whatsapp.length < 10 || contato.whatsapp.length > 11) faltando.push("WhatsApp com DDD");
  return { contato, faltando };
}

/** Subdomínio a partir do nome: minúsculo, sem acento, só letras, números e hífen. */
export function slugify(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "") || "meu-site";
}

/** Subdomínios que não podem ser de cliente. */
export const slugsReservados = new Set(["www", "app", "api", "admin", "painel", "cliente", "blog", "mail", "email", "suporte", "status", "criar", "previa", "vitrine", "supporta", "teleprompter", "casafirme"]);

/** Produto único (site profissional): todo site novo é "pro" (uma página completa; mais páginas só com `respostas.multipagina`). O parâmetro fica por compatibilidade de links antigos. */
export const planoValido = (_v?: unknown): PlanId => "pro";
