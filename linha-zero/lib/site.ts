// Fictional studio. Change the WhatsApp number before publishing anywhere real.
export const WHATSAPP_NUMBER = '5511900000000';
export const WHATSAPP_MESSAGE = 'Olá, Linha Zero! Quero conversar sobre um projeto.';
export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const EMAIL = 'estudio@linhazero.arq.br';
export const ADDRESS = ['Rua Fidalga, 420', 'Vila Madalena, São Paulo'];

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70`;

export const heroHouse = {
  src: unsplash('1600585154340-be6161a56a0c'),
  alt: 'Casa contemporânea em L com volume superior preto, fachada de madeira e varanda envidraçada aberta para o gramado ao entardecer',
  name: 'Casa Jatobá',
  place: 'Granja Viana, Cotia',
  year: '2025',
};

export type Project = {
  id: string;
  index: string;
  name: string;
  place: string;
  year: string;
  area: string;
  text: string;
  photo: { src: string; alt: string };
  aspect: 'landscape' | 'portrait';
  sketch: 'ipe' | 'mirante' | 'alva';
};

export const projects: Project[] = [
  {
    id: 'ipe',
    index: '01',
    name: 'Casa Ipê',
    place: 'Alto de Pinheiros, São Paulo',
    year: '2024',
    area: '286 m²',
    text: 'Um volume de madeira suspenso sobre um pano de vidro de pé-direito duplo. O muro preto segura a rua e libera o jardim para dentro.',
    photo: {
      src: unsplash('1600566753190-17f0baa2a6c3'),
      alt: 'Fachada com volume revestido de madeira sobre caixilhos de vidro, muro preto à direita e cobertura inclinada no último pavimento',
    },
    aspect: 'landscape',
    sketch: 'ipe',
  },
  {
    id: 'mirante',
    index: '02',
    name: 'Casa Mirante',
    place: 'Ilhabela, São Paulo',
    year: '2025',
    area: '412 m²',
    text: 'Duas lajes brancas e um forro de cumaru emolduram a vista do canal. A piscina continua a linha do térreo até a borda do terreno.',
    photo: {
      src: unsplash('1613490493576-7fde63acd811'),
      alt: 'Casa branca de dois pavimentos com forro de madeira, guarda-corpo de vidro e piscina em primeiro plano',
    },
    aspect: 'landscape',
    sketch: 'mirante',
  },
  {
    id: 'alva',
    index: '03',
    name: 'Casa Alva',
    place: 'Campinas, São Paulo',
    year: '2023',
    area: '198 m²',
    text: 'Volumes brancos empilhados que fazem sombra uns nos outros. Janelas pequenas onde o sol da tarde bate, aberturas generosas onde o jardim está.',
    photo: {
      src: unsplash('1523217582562-09d0def993a6'),
      alt: 'Casa de volumes brancos cúbicos com janelas pequenas, acesso em piso claro e gramado com pinheiro ao fundo',
    },
    aspect: 'portrait',
    sketch: 'alva',
  },
];

export const steps = [
  {
    n: '01',
    title: 'Escuta',
    text: 'Visitamos o terreno e a rotina de quem vai morar. Daqui sai o programa: o que a casa precisa ter e o que ela não pode ter.',
    time: '≈ 2 semanas',
  },
  {
    n: '02',
    title: 'Estudo preliminar',
    text: 'Diagramas, zoneamento e as primeiras massas. Testamos sol, vento e vista antes de desenhar qualquer parede.',
    time: '≈ 4 semanas',
  },
  {
    n: '03',
    title: 'Anteprojeto',
    text: 'A planta ganha paredes, cortes e fachadas. Um modelo 3D deixa você caminhar pela casa antes dela existir.',
    time: '≈ 6 semanas',
  },
  {
    n: '04',
    title: 'Projeto executivo',
    text: 'Cada cota, cada detalhe, cada encontro com estrutura e instalações. É o desenho que a obra vai seguir à risca.',
    time: '≈ 10 semanas',
  },
  {
    n: '05',
    title: 'Obra acompanhada',
    text: 'Visitas semanais, decisões no canteiro e o desenho ajustado até a última peça. Entregamos a casa, não a prancha.',
    time: '12 a 18 meses',
  },
] as const;
