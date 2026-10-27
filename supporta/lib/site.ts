// Dados públicos da empresa. Tudo que estiver entre colchetes é placeholder a preencher no .env.
const env = (value: string | undefined, fallback: string) => (value && value.trim() ? value.trim() : fallback);

export const site = {
  name: "Supporta",
  url: env(process.env.NEXT_PUBLIC_SITE_URL, "https://supporta.com.br").replace(/\/$/, ""),
  tagline: "Seu site no ar. Todo mês.",
  signature: "A IA sempre se apoia em alguma fonte. Faça ser a sua.",
  description:
    "Site profissional, hospedagem, manutenção e GEO numa assinatura só. A partir de R$89/mês, sem custo de criação.",
  whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP, "+55 11 99264-4010"),
  email: env(process.env.NEXT_PUBLIC_EMAIL, "contato@supporta.com.br"),
  razaoSocial: env(process.env.NEXT_PUBLIC_RAZAO_SOCIAL, "Matilab Tecnologia"),
  cnpj: env(process.env.NEXT_PUBLIC_CNPJ, "40.283.248/0001-21"),
  instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM, ""),
  locale: "pt_BR",
  // Prazos de entrega em dias úteis, contados a partir do briefing completo. Confirmar antes de publicar.
  deliveryDays: { start: 7, pro: 15, premium: 30 } as Record<string, number>,
  termsVersion: "2026-10",
};

export const termsAcceptanceText = "Li e aceito os Termos da assinatura, incluindo o prazo mínimo de 12 meses";

/** Número só com dígitos, pronto para o wa.me. Vazio enquanto for placeholder. */
export function whatsappDigits() {
  return site.whatsapp.replace(/\D/g, "");
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${whatsappDigits()}?text=${encodeURIComponent(message)}`;
}

/** Mensagem pré-preenchida do WhatsApp de acordo com a página. */
export function whatsappMessageFor(pathname: string) {
  if (pathname === "/") return "Oi! Vim pelo site da Supporta e quero saber mais.";
  if (pathname.startsWith("/planos")) return "Oi! Vim pela página de planos.";
  if (pathname.startsWith("/modelos/")) {
    const segment = pathname.split("/")[2] ?? "";
    return `Oi! Vim pela página de modelos (${segment}).`;
  }
  if (pathname.startsWith("/modelos")) return "Oi! Vim pela página de modelos.";
  if (pathname.startsWith("/diagnostico")) return "Oi! Fiz o diagnóstico do meu site e quero ajuda.";
  if (pathname.startsWith("/assinar")) return "Oi! Estou assinando e tenho uma dúvida.";
  if (pathname.startsWith("/geo")) return "Oi! Vim pela página de GEO e quero aparecer nas IAs.";
  if (pathname.startsWith("/blog")) return "Oi! Vim pelo blog da Supporta.";
  return "Oi! Vim pelo site da Supporta.";
}

export const nav = [
  { href: "/planos", label: "Planos" },
  { href: "/modelos", label: "Modelos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/geo", label: "GEO" },
  { href: "/#duvidas", label: "Dúvidas" },
];

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
