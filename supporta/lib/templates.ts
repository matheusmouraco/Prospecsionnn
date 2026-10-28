import { segments } from "./segments";

// Templates que aparecem passando no hero e na vitrine de modelos.
// Quando houver print real de um template, coloque o arquivo em public/templates/<slug>.webp e preencha `image`.
export type TemplateShowcase = {
  slug: string;
  name: string;
  segment: string; // slug de lib/segments.ts
  domain: string;
  image?: string;
  demo?: string; // caminho da prévia navegável, se existir
};

export const templates: TemplateShowcase[] = segments.map((s) => ({
  slug: s.slug,
  name: s.mock.business,
  segment: s.slug,
  domain: `${s.mock.business.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, "e").replace(/[^a-z0-9]/g, "")}.com.br`,
  demo: `/demo/${s.slug}`,
  // Prints das demos (gerados a partir de /demo). Trocar pelos prints dos templates definitivos quando chegarem.
  image: `/templates/${s.slug}.webp`,
}));
