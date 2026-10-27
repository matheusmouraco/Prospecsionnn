export type Segment = {
  slug: string;
  tab: string;
  professional: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  aiQuestion: string;
  sections: { heading: string; body: string }[];
  includes: string[];
  faq: { q: string; a: string }[];
  mock: {
    business: string;
    kicker: string;
    headline: string;
    cta: string;
    services: string[];
    about: string;
    accent: string;
    surface: string;
    text: string;
    serif?: boolean;
  };
};

export const segments: Segment[] = [
  {
    slug: "arquitetura",
    tab: "Arquitetura",
    professional: "arquiteto",
    title: "Site para arquiteto",
    metaTitle: "Site para arquiteto e escritório de arquitetura",
    metaDescription:
      "Site para arquiteto com portfólio, contato pelo WhatsApp e pronto pro Google e pras IAs. Assinatura a partir de R$89/mês, sem custo de criação.",
    intro:
      "Um site de arquitetura precisa mostrar o trabalho antes de qualquer conversa. O modelo da Supporta coloca seus projetos em primeiro plano, explica como você trabalha e leva o cliente direto pro WhatsApp.",
    aiQuestion: "Quem é um bom arquiteto de interiores perto de mim?",
    sections: [
      {
        heading: "O que um site de arquiteto precisa ter?",
        body: "Portfólio com fotos grandes, uma página por tipo de projeto (residencial, comercial, interiores), o passo a passo do seu processo e um jeito fácil de pedir orçamento. É isso que o modelo entrega, com a sua identidade.",
      },
      {
        heading: "Como aparecer quando alguém procura arquiteto na sua cidade?",
        body: "Com o nome do escritório, a cidade e os serviços escritos de forma clara no site, dados estruturados de negócio local e um perfil no Google Meu Negócio ligado ao site. Assim o Google e as IAs entendem quem você é e onde atende.",
      },
    ],
    includes: ["Galeria de projetos", "Página de processo de trabalho", "Botão de orçamento pelo WhatsApp", "Mapa do escritório"],
    faq: [
      {
        q: "Posso atualizar o portfólio com novos projetos?",
        a: "Pode. Você manda as fotos e a descrição pelo WhatsApp e a gente publica dentro dos ajustes do seu plano.",
      },
      {
        q: "As fotos pesadas vão deixar o site lento?",
        a: "Não. Todas as imagens são convertidas para formatos modernos (AVIF e WebP) e carregadas no tamanho certo para cada tela.",
      },
      {
        q: "Serve para escritório pequeno ou arquiteto autônomo?",
        a: "Serve. O plano Start já resolve para quem trabalha sozinho. O Pro é indicado para quem quer páginas separadas por tipo de projeto e blog.",
      },
    ],
    mock: {
      business: "Atelier Linha",
      kicker: "Arquitetura e interiores",
      headline: "Espaços pensados para durar.",
      cta: "Pedir orçamento",
      services: ["Residencial", "Comercial", "Interiores"],
      about: "Projetos autorais com acompanhamento de obra do início ao fim.",
      accent: "#1F1F1F",
      surface: "#EDEAE4",
      text: "#1F1F1F",
    },
  },
  {
    slug: "restaurante",
    tab: "Restaurante",
    professional: "restaurante",
    title: "Site para restaurante",
    metaTitle: "Site para restaurante com cardápio e reservas",
    metaDescription:
      "Site para restaurante com cardápio, horário, mapa e reserva pelo WhatsApp. Pronto pro Google e pras IAs, a partir de R$89/mês.",
    intro:
      "Quem procura onde comer quer três respostas rápidas: o que tem no cardápio, se está aberto e como chegar. O modelo de restaurante responde as três na primeira tela do celular.",
    aiQuestion: "Onde comer uma boa massa no centro hoje à noite?",
    sections: [
      {
        heading: "O que um site de restaurante precisa ter?",
        body: "Cardápio fácil de ler no celular, horário de funcionamento, endereço com mapa, fotos dos pratos e um botão para reservar ou pedir pelo WhatsApp. Sem PDF pesado e sem cardápio em imagem que o Google não consegue ler.",
      },
      {
        heading: "Por que o cardápio em texto ajuda nas buscas?",
        body: "Porque o Google e as IAs leem texto. Quando alguém pergunta por um prato específico na sua região, um cardápio escrito no site aumenta a chance de o seu restaurante ser lembrado na resposta.",
      },
    ],
    includes: ["Cardápio em texto, fácil de atualizar", "Horário e mapa", "Reserva pelo WhatsApp", "Galeria de pratos"],
    faq: [
      {
        q: "Consigo mudar preços e pratos do cardápio?",
        a: "Consegue. Mudanças de cardápio entram como ajuste do plano. No Premium os ajustes são ilimitados, com prazo de até 48h.",
      },
      {
        q: "Dá para ligar com o iFood ou outro app de pedidos?",
        a: "Dá. Colocamos botões levando para o seu perfil no app de pedidos e para o WhatsApp.",
      },
      {
        q: "O site mostra se estamos abertos?",
        a: "O horário fica publicado no site e nos dados estruturados, que é a informação que o Google usa para mostrar se você está aberto.",
      },
    ],
    mock: {
      business: "Cantina Nonna Rosa",
      kicker: "Massas artesanais desde 1998",
      headline: "Massa fresca, feita todo dia.",
      cta: "Reservar mesa",
      services: ["Cardápio", "Almoço executivo", "Eventos"],
      about: "Receitas de família, forno a lenha e ambiente para reunir quem você gosta.",
      accent: "#8C2F1B",
      surface: "#F6EFE6",
      text: "#2A1A12",
      serif: true,
    },
  },
  {
    slug: "odontologia",
    tab: "Odontologia",
    professional: "dentista",
    title: "Site para dentista",
    metaTitle: "Site para dentista e clínica odontológica",
    metaDescription:
      "Site para dentista e clínica odontológica com tratamentos, convênios e agendamento pelo WhatsApp. Pronto pro Google e pras IAs, a partir de R$89/mês.",
    intro:
      "Paciente novo escolhe dentista pelo celular, comparando duas ou três clínicas em poucos minutos. O modelo de odontologia passa confiança logo de cara e leva direto para o agendamento no WhatsApp.",
    aiQuestion: "Qual clínica de implante dentário é boa no meu bairro?",
    sections: [
      {
        heading: "O que um site de dentista precisa ter?",
        body: "Os tratamentos explicados em linguagem simples, a equipe com número do CRO, convênios aceitos, endereço com mapa e agendamento pelo WhatsApp. O modelo segue as regras de publicidade do CFO, sem promessa de resultado.",
      },
      {
        heading: "Como a clínica aparece quando alguém pergunta pra IA?",
        body: "As IAs citam fontes que explicam bem um assunto e deixam claro quem atende onde. Uma página por tratamento, perguntas frequentes respondidas e dados da clínica bem estruturados ajudam a sua clínica a virar essa fonte.",
      },
    ],
    includes: ["Página por tratamento", "Equipe com CRO", "Convênios aceitos", "Agendamento pelo WhatsApp"],
    faq: [
      {
        q: "O site segue as regras do Conselho de Odontologia?",
        a: "O modelo foi pensado para seguir as regras de publicidade do CFO: sem promessa de resultado e com identificação do responsável técnico. A revisão final dos textos é sua.",
      },
      {
        q: "Posso mostrar fotos de antes e depois?",
        a: "Só dentro do que as regras do CFO permitem. Na dúvida, a gente prefere não publicar e usar fotos da clínica e da equipe.",
      },
      {
        q: "Funciona para clínica com várias unidades?",
        a: "Funciona. No Pro cada unidade pode ter sua página, com endereço e mapa próprios.",
      },
    ],
    mock: {
      business: "Clínica Sorrir Bem",
      kicker: "Odontologia para a família",
      headline: "Cuidado com o seu sorriso, sem pressa.",
      cta: "Agendar avaliação",
      services: ["Implantes", "Ortodontia", "Clareamento"],
      about: "Equipe completa, atendimento humanizado e estrutura moderna.",
      accent: "#0E6B70",
      surface: "#EEF5F5",
      text: "#0F2A2C",
    },
  },
  {
    slug: "advocacia",
    tab: "Advocacia",
    professional: "advogado",
    title: "Site para advogado",
    metaTitle: "Site para advogado e escritório de advocacia",
    metaDescription:
      "Site para advogado com áreas de atuação, conteúdo informativo e contato pelo WhatsApp, dentro das regras da OAB. A partir de R$89/mês.",
    intro:
      "Na advocacia, o site é o seu cartão de visitas e a sua prova de conhecimento. O modelo apresenta áreas de atuação com clareza, publica conteúdo informativo e respeita as regras de publicidade da OAB.",
    aiQuestion: "Preciso de um advogado trabalhista, quem você indica?",
    sections: [
      {
        heading: "O que um site de advogado precisa ter?",
        body: "Áreas de atuação explicadas sem juridiquês, quem são os advogados (com número da OAB), endereço e um canal de contato discreto. Tudo com tom informativo, como pede o Provimento 205/2021 da OAB.",
      },
      {
        heading: "Conteúdo jurídico ajuda a aparecer nas IAs?",
        body: "Ajuda muito. Quando alguém pergunta uma dúvida jurídica, a IA procura fontes que expliquem o assunto com clareza. Artigos bem escritos no seu site (planos Pro e Premium) fazem do escritório essa fonte.",
      },
    ],
    includes: ["Página por área de atuação", "Equipe com OAB", "Artigos informativos", "Contato discreto pelo WhatsApp"],
    faq: [
      {
        q: "O site segue as regras de publicidade da OAB?",
        a: "Segue a linha do Provimento 205/2021: conteúdo informativo, sem captação ostensiva e sem promessa de resultado. A revisão final dos textos é sua.",
      },
      {
        q: "Quem escreve os artigos jurídicos?",
        a: "A gente escreve a partir dos temas que você indicar e você revisa antes de publicar. Nada vai ao ar sem a sua aprovação.",
      },
      {
        q: "Posso ter uma página para cada área de atuação?",
        a: "Pode. O plano Pro tem até 5 páginas e o Premium é sob medida, sem limite de páginas.",
      },
    ],
    mock: {
      business: "Moraes & Lima Advogados",
      kicker: "Direito empresarial e trabalhista",
      headline: "Clareza para decisões importantes.",
      cta: "Falar com o escritório",
      services: ["Empresarial", "Trabalhista", "Contratos"],
      about: "Atuação consultiva e contenciosa com atendimento próximo.",
      accent: "#1E2A44",
      surface: "#F2F1EC",
      text: "#141B2D",
      serif: true,
    },
  },
  {
    slug: "saude",
    tab: "Saúde",
    professional: "clínica",
    title: "Site para clínica e profissional de saúde",
    metaTitle: "Site para clínica médica e profissional de saúde",
    metaDescription:
      "Site para clínica, médico, psicólogo, fisioterapeuta e nutricionista, com agendamento pelo WhatsApp e pronto pras IAs. A partir de R$89/mês.",
    intro:
      "Clínicas, médicos, psicólogos, fisioterapeutas e nutricionistas precisam de um site que acolha e explique. O modelo de saúde mostra especialidades, equipe e convênios, e facilita o agendamento.",
    aiQuestion: "Tem fisioterapeuta bom pra coluna aqui perto?",
    sections: [
      {
        heading: "O que um site de clínica precisa ter?",
        body: "Especialidades e exames explicados em linguagem simples, a equipe com registro no conselho, convênios aceitos, horário, endereço com mapa e agendamento pelo WhatsApp. Sem promessa de cura, como pedem as regras do CFM e dos demais conselhos.",
      },
      {
        heading: "Como pacientes encontram clínicas pela IA?",
        body: "Perguntando sintomas e especialidades no ChatGPT, no Gemini e no Google. A IA cita fontes que explicam bem e que deixam claro onde atendem. Página por especialidade e perguntas frequentes fazem diferença.",
      },
    ],
    includes: ["Página por especialidade", "Equipe com registro no conselho", "Convênios e horários", "Agendamento pelo WhatsApp"],
    faq: [
      {
        q: "Serve para psicólogo, nutricionista e fisioterapeuta?",
        a: "Serve. O modelo de saúde se adapta a qualquer profissional ou clínica. A gente ajusta os textos e as seções para a sua área.",
      },
      {
        q: "O site segue as regras do CFM e dos conselhos?",
        a: "O modelo foi pensado para seguir as regras de publicidade dos conselhos de saúde: sem promessa de resultado e com identificação do responsável técnico. A revisão final é sua.",
      },
      {
        q: "Dá para integrar com sistema de agendamento online?",
        a: "Dá para colocar o link do seu sistema de agendamento nos botões do site. Integrações mais complexas são avaliadas no Premium.",
      },
    ],
    mock: {
      business: "Clínica Viva Integrada",
      kicker: "Saúde e bem-estar",
      headline: "Atendimento completo, num só lugar.",
      cta: "Agendar consulta",
      services: ["Clínica geral", "Fisioterapia", "Nutrição"],
      about: "Profissionais de várias especialidades trabalhando juntos por você.",
      accent: "#2F6B3A",
      surface: "#F1F5EF",
      text: "#15291A",
    },
  },
  {
    slug: "servicos",
    tab: "Serviços",
    professional: "prestador de serviço",
    title: "Site para prestador de serviço",
    metaTitle: "Site para prestador de serviço e comércio local",
    metaDescription:
      "Site para prestador de serviço e comércio local com orçamento pelo WhatsApp, mapa e região de atendimento. A partir de R$89/mês, sem custo de criação.",
    intro:
      "Eletricista, contador, oficina, salão, escola, loja de bairro. Quem presta serviço local precisa ser achado rápido e passar confiança. O modelo de serviços mostra o que você faz, onde atende e como pedir orçamento.",
    aiQuestion: "Preciso de um eletricista de confiança hoje, quem chamar?",
    sections: [
      {
        heading: "O que um site de prestador de serviço precisa ter?",
        body: "Lista clara de serviços, região de atendimento, horário, fotos de trabalhos feitos e um botão de orçamento pelo WhatsApp em todas as telas. Direto ao ponto, porque o cliente normalmente tem pressa.",
      },
      {
        heading: "Como aparecer pra quem procura no bairro?",
        body: "Com a região de atendimento escrita no site, dados estruturados de negócio local e o Google Meu Negócio bem cuidado (incluso no Pro). Isso ajuda o Google e as IAs a recomendarem você para quem está perto.",
      },
    ],
    includes: ["Lista de serviços", "Região de atendimento", "Orçamento pelo WhatsApp", "Fotos de trabalhos"],
    faq: [
      {
        q: "Meu negócio é pequeno, vale a pena ter site?",
        a: "Vale. O site é onde o Google e as IAs confirmam que você existe, o que faz e onde atende. O plano Start foi feito para começar com pouco.",
      },
      {
        q: "Atendo em várias cidades, dá para mostrar isso?",
        a: "Dá. Listamos as cidades e bairros atendidos. No Pro é possível ter páginas separadas por região.",
      },
      {
        q: "Tenho loja física e também vendo pelo Instagram. Serve?",
        a: "Serve. O site organiza tudo num lugar só, com mapa da loja e botões para o Instagram e o WhatsApp.",
      },
    ],
    mock: {
      business: "Volt Instalações",
      kicker: "Elétrica residencial e comercial",
      headline: "Serviço bem feito, no horário combinado.",
      cta: "Pedir orçamento",
      services: ["Instalações", "Manutenção", "Quadros elétricos"],
      about: "Equipe própria, garantia nos serviços e atendimento em toda a região.",
      accent: "#B4530A",
      surface: "#F7F4EE",
      text: "#1E1A14",
    },
  },
];

export function getSegment(slug: string) {
  return segments.find((s) => s.slug === slug);
}
