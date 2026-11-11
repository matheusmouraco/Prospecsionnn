// Fictional studio. All names, numbers and addresses below are invented for this concept.

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const studio = {
  name: "Atelier Vareda",
  city: "São Paulo, Brasil",
  since: 2009,
  email: "ola@ateliervareda.com.br",
  instagram: "@ateliervareda",
  // Placeholder number: replace with the real one before publishing.
  whatsapp:
    "https://wa.me/5511900000000?text=" +
    encodeURIComponent("Olá, Atelier Vareda. Quero conversar sobre um projeto residencial."),
};

export const hero = {
  image: {
    src: unsplash("1523217582562-09d0def993a6"),
    alt: "Casa de volumes brancos sob céu azul, com jardim baixo e caminho de pedra até a entrada",
  },
};

export type Project = {
  n: string;
  name: string;
  place: string;
  year: number;
  area: string;
  note: string;
  shape: "portrait" | "landscape";
  image: { src: string; alt: string };
};

export const projects: Project[] = [
  {
    n: "01",
    name: "Casa Figueira",
    place: "Granja Viana, Cotia",
    year: 2024,
    area: "820 m²",
    note: "A casa se abre em L para não tocar nas raízes de uma figueira de sessenta anos.",
    shape: "portrait",
    image: {
      src: unsplash("1600585154340-be6161a56a0c"),
      alt: "Casa escura em L iluminada ao entardecer, com uma grande árvore no centro do jardim",
    },
  },
  {
    n: "02",
    name: "Casa Mirante",
    place: "Ilhabela",
    year: 2023,
    area: "640 m²",
    note: "Dois volumes brancos sobre a encosta e uma piscina que termina no horizonte.",
    shape: "landscape",
    image: {
      src: unsplash("1613490493576-7fde63acd811"),
      alt: "Casa branca de dois pavimentos com beiral de madeira e piscina longa à frente",
    },
  },
  {
    n: "03",
    name: "Casa Ripa",
    place: "Alto de Pinheiros, São Paulo",
    year: 2022,
    area: "510 m²",
    note: "Um muxarabi de cumaru filtra a rua e deixa a luz da tarde entrar inteira.",
    shape: "portrait",
    image: {
      src: unsplash("1600566753190-17f0baa2a6c3"),
      alt: "Fachada com painel de madeira ripada, vidro e muro escuro, vista da rua",
    },
  },
  {
    n: "04",
    name: "Casa Varanda",
    place: "Porto Feliz",
    year: 2025,
    area: "930 m²",
    note: "Uma sala de doze metros que vira varanda quando os caixilhos correm.",
    shape: "landscape",
    image: {
      src: unsplash("1618221195710-dd6b41faaea6"),
      alt: "Sala ampla em tons de terra com janela em fita, sofá baixo e plantas junto ao vidro",
    },
  },
];

export const steps = [
  {
    n: "01",
    title: "Escuta",
    text: "Visitamos o terreno em horários diferentes e passamos horas entendendo a rotina da família. Saímos de lá com um programa escrito à mão, não com um formulário.",
    time: "4 a 6 semanas",
  },
  {
    n: "02",
    title: "Desenho",
    text: "Estudos, maquetes físicas e amostras de material sobre a mesa. Só seguimos quando cada ambiente faz sentido no papel e na luz real do lugar.",
    time: "3 a 5 meses",
  },
  {
    n: "03",
    title: "Obra",
    text: "Acompanhamos a construção toda semana, com a mesma equipe que desenhou. Cada detalhe resolvido na obra foi pensado antes, no ateliê.",
    time: "12 a 20 meses",
  },
];

export const about = {
  portrait: {
    src: unsplash("1502005229762-cf1b2da7c5d6"),
    alt: "Escada de madeira e ferro em pé-direito triplo, vista de cima, com luminárias pendentes",
  },
  detail: {
    src: unsplash("1487958449943-2429e8be8625"),
    alt: "Detalhe de arquitetura branca e geométrica contra o céu claro",
  },
  stats: [
    { value: "64", label: "casas entregues" },
    { value: "6", label: "projetos por ano" },
    { value: "11", label: "pessoas no ateliê" },
  ],
};
