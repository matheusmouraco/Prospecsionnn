// Pre-sized JPEG from Unsplash; next/image resizes and re-encodes it from here.
const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=2400&q=80&fm=jpg`;

export const site = {
  name: 'Estúdio Bloco 7',
  // Fictional studio: swap for the real number before publishing.
  whatsapp: '5511900000000',
  whatsappLabel: '+55 11 90000-0000',
  whatsappText: 'Olá, Bloco 7. Tenho um projeto e queria conversar.',
  email: 'contato@estudiobloco7.com.br',
  address: ['Rua Original, 707', 'Vila Madalena, São Paulo'],
  hours: 'Seg a sex, 9h às 18h',
  instagram: '@estudiobloco7',
  coords: "23°33'S 46°41'W",
};

export const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappText)}`;

export type Tipologia = 'Residencial' | 'Cultural' | 'Institucional';

export type Project = {
  n: string;
  name: string;
  tipologia: Tipologia;
  programa: string;
  city: string;
  year: number;
  img: string;
  alt: string;
};

export const projects: Project[] = [
  {
    n: '01',
    name: 'Casa Pátio Cego',
    tipologia: 'Residencial',
    programa: 'Casa',
    city: 'São Paulo',
    year: 2025,
    img: u('1717477660140-8709f24e2894'),
    alt: 'Pátio interno com paredes altas de concreto e um recorte retangular para o céu',
  },
  {
    n: '02',
    name: 'Capela do Vale',
    tipologia: 'Cultural',
    programa: 'Capela',
    city: 'Cunha',
    year: 2024,
    img: u('1759300632008-a752203c16cf'),
    alt: 'Paredes angulosas de concreto com um feixe de luz entrando por uma abertura',
  },
  {
    n: '03',
    name: 'Biblioteca Lâmina',
    tipologia: 'Cultural',
    programa: 'Biblioteca',
    city: 'Belo Horizonte',
    year: 2023,
    img: u('1769610324847-72fb036317b9'),
    alt: 'Laje de concreto em balanço vista de baixo contra o céu claro',
  },
  {
    n: '04',
    name: 'Galpão Sete',
    tipologia: 'Institucional',
    programa: 'Retrofit',
    city: 'Porto Alegre',
    year: 2022,
    img: u('1780362507842-f9e75fbdce03'),
    alt: 'Cobertura de concreto com grelha de claraboias quadradas',
  },
  {
    n: '05',
    name: 'Edifício Prumo',
    tipologia: 'Residencial',
    programa: 'Habitação',
    city: 'Curitiba',
    year: 2021,
    img: u('1770891948880-65950e82697d'),
    alt: 'Fachada de concreto com malha regular de janelas recuadas',
  },
  {
    n: '06',
    name: 'Pavilhão Contraforte',
    tipologia: 'Institucional',
    programa: 'Pavilhão',
    city: 'Recife',
    year: 2019,
    img: u('1569258592171-357ea26da4df'),
    alt: 'Pilares inclinados de concreto formando um V sob uma laje',
  },
];

export const filtros: Array<'Todos' | Tipologia> = ['Todos', 'Residencial', 'Cultural', 'Institucional'];

export const heroImage = {
  src: u('1546414701-81cc6963c67f'),
  alt: 'Edifício de concreto com volumes escalonados sobre uma plataforma, contra o céu',
};

export const figures = [
  {
    src: u('1759998084337-dee6ca953a50'),
    alt: 'Fachada de concreto com janelas recuadas em caixas profundas',
    caption: 'Fig. 01',
    label: 'Janela em caixa, 60 cm de espessura',
  },
  {
    src: u('1579724175242-0204ecac28cb'),
    alt: 'Degraus de concreto com sombras de galhos sobre a superfície',
    caption: 'Fig. 02',
    label: 'Escada moldada in loco',
  },
];

export const keywords = ['Concreto aparente', 'Massa', 'Fôrma de tábua', 'Luz zenital', 'Estrutura', 'Silêncio', 'Pátio', 'Tempo de obra'];

export const principios = [
  {
    n: 'I',
    title: 'Estrutura é fachada',
    text: 'O que sustenta o edifício é o que ele mostra. Não existe camada para esconder decisão mal tomada, então cada pilar e cada viga é desenhado para ser visto.',
  },
  {
    n: 'II',
    title: 'A fôrma é desenho',
    text: 'Paginamos tábuas, furos de tirante e juntas de concretagem com o mesmo rigor da planta. A marca da madeira fica para sempre na parede.',
  },
  {
    n: 'III',
    title: 'Luz é material',
    text: 'Rasgos, sheds e pátios fazem o concreto mudar de tom ao longo do dia. A luz é o último material a entrar na obra, e o que termina o projeto.',
  },
];

export const numeros = [
  { value: '2011', label: 'Fundação' },
  { value: '38', label: 'Obras entregues' },
  { value: '12', label: 'Pessoas no estúdio' },
  { value: '1', label: 'Material' },
];

export const servicos = [
  { n: '01', name: 'Projeto de arquitetura', scope: 'Estudo de massa, anteprojeto, legal e executivo', time: '6 a 10 meses' },
  { n: '02', name: 'Concreto aparente', scope: 'Traço, paginação de fôrma, amostras e protótipos em obra', time: 'Sob demanda' },
  { n: '03', name: 'Retrofit', scope: 'Levantamento, diagnóstico estrutural e reuso de galpões e edifícios', time: '4 a 8 meses' },
  { n: '04', name: 'Interiores', scope: 'Mobiliário fixo em concreto, madeira maciça e aço', time: '3 a 5 meses' },
  { n: '05', name: 'Acompanhamento de obra', scope: 'Visitas semanais, compatibilização e controle de concretagem', time: 'Toda a obra' },
  { n: '06', name: 'Concursos', scope: 'Propostas para edifícios públicos, culturais e educacionais', time: 'Por edital' },
];
