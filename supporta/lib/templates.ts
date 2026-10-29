import { vitrine, vitrineThumb, vitrineUrl } from "./vitrine";

// Modelos que passam na parede do hero: uma seleção variada da vitrine (lib/vitrine.ts), com o print de cada um.
export type TemplateShowcase = {
  slug: string;
  name: string;
  segment?: string; // slug de lib/segments.ts, para o mock de reserva quando não houver print
  domain: string;
  image?: string;
  demo?: string; // caminho da prévia navegável
};

const picks = ["restaurante", "arquitetura", "terapia", "consultoria", "veterinaria", "construtora", "academia", "financas", "floricultura", "marketing", "contador", "saas"];

export const templates: TemplateShowcase[] = picks
  .map((slug) => vitrine.find((v) => v.slug === slug))
  .filter((v): v is NonNullable<typeof v> => Boolean(v))
  .map((v) => ({ slug: v.slug, name: v.name, domain: `${v.slug.replace(/-/g, "")}.com.br`, image: vitrineThumb(v.slug), demo: vitrineUrl(v.slug) }));
