// Fictional studio. Swap the WhatsApp number before going live.
export const WHATSAPP_NUMBER = "5511999990000";

export const whatsappUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Night grade applied by the Unsplash CDN: less saturation, more contrast, a stop darker.
const GRADE = "sat=-55&con=18&exp=-8";
const unsplash = (id: string, grade = GRADE) =>
  `https://images.unsplash.com/photo-${id}?${grade}`;

export const HERO_IMAGE = {
  src: unsplash("1511818966892-d7d671e672a2", "sat=-45&con=24&exp=-6"),
  alt: "Torres de vidro vistas de baixo sob um céu de tempestade, com poucas janelas acesas",
};

export type Project = {
  slug: string;
  name: string[]; // one entry per display line
  kind: string;
  area: string;
  year: string;
  place: string;
  line: string;
  image: { src: string; alt: string; position: string };
};

export const PROJECTS: Project[] = [
  {
    slug: "aroeira",
    name: ["Casa", "Aroeira"],
    kind: "Residencial",
    area: "820 m²",
    year: "2025",
    place: "Alto de Pinheiros, SP",
    line: "Uma casa desenhada ao redor de uma árvore de sessenta anos.",
    image: {
      src: unsplash("1600585154340-be6161a56a0c"),
      alt: "Casa contemporânea preta e branca iluminada à noite, com uma grande árvore no jardim",
      position: "50% 55%",
    },
  },
  {
    slug: "meridiano",
    name: ["Edifício", "Meridiano"],
    kind: "Comercial",
    area: "24.000 m²",
    year: "2024",
    place: "Faria Lima, SP",
    line: "Fachada de vidro que acende de dentro para fora depois das seis.",
    image: {
      src: unsplash("1431576901776-e539bd916ba2", "sat=-40&con=22&exp=-16"),
      alt: "Vista de baixo entre duas torres de vidro com escritórios acesos em tom âmbar",
      position: "50% 50%",
    },
  },
  {
    slug: "mare",
    name: ["Hotel", "Maré"],
    kind: "Hospitalidade",
    area: "11.500 m²",
    year: "2023",
    place: "Trancoso, BA",
    line: "Uma piscina que reflete o céu inteiro na hora azul.",
    image: {
      src: unsplash("1542314831-068cd1dbfeeb", "sat=-60&con=20&exp=-10"),
      alt: "Hotel com piscina iluminada ao anoitecer, pavilhão aberto e céu carregado",
      position: "50% 60%",
    },
  },
  {
    slug: "lume",
    name: ["Residência", "Lume"],
    kind: "Residencial",
    area: "640 m²",
    year: "2025",
    place: "Nova Lima, MG",
    line: "Uma escada de madeira que vira lanterna para a rua.",
    image: {
      src: unsplash("1600566753376-12c8ab7fb75b", "sat=-55&con=18&exp=-10"),
      alt: "Residência moderna na hora azul com escada de madeira iluminada atrás de uma fachada de vidro",
      position: "40% 50%",
    },
  },
];

export const NUMBERS = [
  { value: 18, suffix: "", label: "anos desenhando depois do pôr do sol" },
  { value: 140, suffix: "", label: "projetos entregues" },
  { value: 320, suffix: " mil", label: "metros quadrados construídos" },
  { value: 9, suffix: "", label: "cidades com obras da NOX" },
];

export const CONTACT_IMAGE = {
  src: unsplash("1496417263034-38ec4f0b665a", "sat=-45&con=15&exp=-14"),
  alt: "Abajur de latão aceso ao lado de uma cama com lençóis brancos, em um quarto de parede escura",
};
