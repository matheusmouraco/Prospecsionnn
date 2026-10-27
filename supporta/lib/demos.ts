// Conteúdo das demos navegáveis (/demo/<segmento>). Empresas fictícias, sinalizadas na página.

export type Demo = {
  services: { name: string; text: string }[];
  highlights: string[];
  about: string[];
  faq: { q: string; a: string }[];
  address: string;
  hours: string[];
  aboutTitle: string;
};

export const demos: Record<string, Demo> = {
  arquitetura: {
    services: [
      { name: "Projeto residencial", text: "Casas e apartamentos do estudo inicial ao projeto executivo, com acompanhamento de obra." },
      { name: "Interiores", text: "Layout, marcenaria, iluminação e escolha de materiais para cada ambiente." },
      { name: "Projeto comercial", text: "Lojas, consultórios e escritórios pensados para o fluxo de clientes e da equipe." },
      { name: "Consultoria", text: "Visita técnica e orientação para quem vai reformar e quer decidir com segurança." },
    ],
    highlights: ["Projeto em 3D antes da obra", "Acompanhamento de obra", "Orçamento por etapa"],
    aboutTitle: "Arquitetura feita para o jeito que você vive",
    about: [
      "O Atelier Linha nasceu da ideia de que um bom projeto começa por ouvir. Antes do primeiro traço, entendemos a rotina de quem vai usar o espaço.",
      "Trabalhamos com poucos projetos ao mesmo tempo para acompanhar cada obra de perto.",
    ],
    faq: [
      { q: "Quanto tempo leva um projeto de interiores?", a: "Depende do tamanho, mas um apartamento costuma levar de 30 a 60 dias entre o estudo e o projeto final." },
      { q: "Vocês acompanham a obra?", a: "Sim. As visitas de acompanhamento podem fazer parte do contrato ou ser contratadas à parte." },
      { q: "Atendem fora da cidade?", a: "Atendemos projetos em outras cidades com reuniões online e visitas programadas." },
    ],
    address: "Rua Exemplo, 100, Centro",
    hours: ["Segunda a sexta, 9h às 18h", "Atendimento com hora marcada"],
  },
  restaurante: {
    services: [
      { name: "Massas frescas", text: "Talharim, ravióli e nhoque feitos na casa todos os dias, com molhos clássicos." },
      { name: "Almoço executivo", text: "Entrada, prato principal e sobremesa de segunda a sexta, com cardápio que muda toda semana." },
      { name: "Forno a lenha", text: "Pizzas de fermentação lenta e assados servidos à noite e nos fins de semana." },
      { name: "Eventos", text: "Espaço reservado para aniversários e confraternizações de até 40 pessoas." },
    ],
    highlights: ["Massa feita na casa", "Reserva pelo WhatsApp", "Opções vegetarianas"],
    aboutTitle: "Receitas de família, servidas sem pressa",
    about: [
      "A Cantina Nonna Rosa guarda as receitas da avó que dá nome à casa. A massa é aberta à mão todas as manhãs.",
      "O ambiente é simples e acolhedor, pensado para reunir família e amigos em volta da mesa.",
    ],
    faq: [
      { q: "Precisa reservar?", a: "Nos fins de semana recomendamos reservar pelo WhatsApp. Durante a semana atendemos por ordem de chegada." },
      { q: "Tem opção sem glúten?", a: "Temos massas sem glúten feitas em área separada. Avise na hora do pedido." },
      { q: "Fazem entrega?", a: "Sim, pelos aplicativos de entrega e pelo WhatsApp, no almoço e no jantar." },
    ],
    address: "Avenida Exemplo, 250, Bairro Centro",
    hours: ["Terça a sexta, 11h30 às 15h e 19h às 23h", "Sábado e domingo, 12h às 23h"],
  },
  odontologia: {
    services: [
      { name: "Implantes", text: "Avaliação com exame de imagem e planejamento para repor dentes com segurança." },
      { name: "Ortodontia", text: "Aparelhos fixos e alinhadores transparentes para crianças e adultos." },
      { name: "Clareamento", text: "Clareamento de consultório e caseiro, sempre depois de avaliação." },
      { name: "Clínica geral", text: "Limpeza, restaurações e acompanhamento preventivo para toda a família." },
    ],
    highlights: ["Atendimento para toda a família", "Agendamento pelo WhatsApp", "Responsável técnico identificado"],
    aboutTitle: "Cuidado do primeiro dente ao implante",
    about: [
      "A Clínica Sorrir Bem reúne dentistas de várias especialidades em um só lugar, para que você resolva tudo sem precisar trocar de clínica.",
      "Cada tratamento começa com uma avaliação e um plano explicado em linguagem simples.",
    ],
    faq: [
      { q: "Vocês atendem convênio?", a: "Atendemos alguns convênios e também particular. Pergunte pelo WhatsApp se o seu está na lista." },
      { q: "A primeira avaliação é cobrada?", a: "A política de avaliação é informada no agendamento, antes de qualquer cobrança." },
      { q: "Atendem crianças?", a: "Sim, temos atendimento de odontopediatria com hora marcada." },
    ],
    address: "Rua Exemplo, 45, sala 12, Centro",
    hours: ["Segunda a sexta, 8h às 19h", "Sábado, 8h às 12h"],
  },
  advocacia: {
    services: [
      { name: "Direito empresarial", text: "Contratos, societário e consultoria preventiva para pequenas e médias empresas." },
      { name: "Direito trabalhista", text: "Assessoria a empresas e atuação em reclamações trabalhistas." },
      { name: "Contratos", text: "Elaboração e revisão de contratos com linguagem clara e foco em prevenir conflitos." },
      { name: "Família e sucessões", text: "Inventários, planejamento sucessório e acordos de família." },
    ],
    highlights: ["Atendimento presencial e online", "Linguagem clara", "Equipe com registro na OAB"],
    aboutTitle: "Orientação jurídica clara para decidir com segurança",
    about: [
      "O escritório Moraes & Lima atua de forma consultiva, ajudando clientes a evitar problemas antes que eles cheguem ao Judiciário.",
      "Quando o processo é necessário, cada etapa é explicada sem juridiquês.",
    ],
    faq: [
      { q: "Como funciona a primeira consulta?", a: "A primeira conversa serve para entender o caso e explicar os caminhos possíveis. As condições são informadas no agendamento." },
      { q: "Atendem online?", a: "Sim, atendemos por videochamada clientes de qualquer cidade." },
      { q: "Quanto tempo leva um processo?", a: "Varia muito com o tipo de causa e a vara. Na consulta explicamos a estimativa para o seu caso." },
    ],
    address: "Avenida Exemplo, 1000, conjunto 501, Centro",
    hours: ["Segunda a sexta, 9h às 18h"],
  },
  saude: {
    services: [
      { name: "Clínica geral", text: "Consultas de rotina, check-up e acompanhamento de doenças crônicas." },
      { name: "Fisioterapia", text: "Reabilitação ortopédica, pós-operatório e tratamento de dores na coluna." },
      { name: "Nutrição", text: "Plano alimentar individual e acompanhamento mensal." },
      { name: "Psicologia", text: "Atendimento para adultos e adolescentes, presencial e online." },
    ],
    highlights: ["Várias especialidades no mesmo lugar", "Agendamento pelo WhatsApp", "Atendimento presencial e online"],
    aboutTitle: "Um time cuidando de você junto",
    about: [
      "A Clínica Viva Integrada reúne profissionais de saúde que conversam entre si sobre o seu caso, para um cuidado mais completo.",
      "Todos os profissionais têm registro no respectivo conselho, informado em cada perfil.",
    ],
    faq: [
      { q: "Preciso de pedido médico para fisioterapia?", a: "Depende do seu convênio. Para atendimento particular, a avaliação inicial é feita pelo fisioterapeuta." },
      { q: "Atendem por convênio?", a: "Algumas especialidades atendem convênios. Confirme pelo WhatsApp antes de agendar." },
      { q: "Tem atendimento online?", a: "Psicologia e nutrição têm opção online." },
    ],
    address: "Rua Exemplo, 300, Jardim Exemplo",
    hours: ["Segunda a sexta, 7h às 20h", "Sábado, 8h às 13h"],
  },
  servicos: {
    services: [
      { name: "Instalações elétricas", text: "Instalação de tomadas, chuveiros, iluminação e circuitos novos em casas e comércios." },
      { name: "Manutenção", text: "Diagnóstico de curto-circuito, disjuntor desarmando e troca de fiação antiga." },
      { name: "Quadros elétricos", text: "Montagem e adequação de quadros de distribuição com identificação dos circuitos." },
      { name: "Atendimento comercial", text: "Contratos de manutenção preventiva para lojas, escritórios e condomínios." },
    ],
    highlights: ["Orçamento pelo WhatsApp", "Equipe própria", "Atendimento em toda a região"],
    aboutTitle: "Serviço bem feito, no horário combinado",
    about: [
      "A Volt Instalações atende residências e comércios com equipe própria e material de qualidade.",
      "Antes de começar, você recebe o orçamento por escrito com o que será feito.",
    ],
    faq: [
      { q: "Fazem orçamento sem compromisso?", a: "Sim. Envie fotos pelo WhatsApp e, se precisar, agendamos uma visita." },
      { q: "Atendem emergências?", a: "Atendemos emergências conforme a disponibilidade da equipe. Chame no WhatsApp." },
      { q: "Quais regiões atendem?", a: "Atendemos a cidade e os bairros vizinhos. Pergunte pelo seu endereço." },
    ],
    address: "Atendimento em domicílio na cidade e região",
    hours: ["Segunda a sexta, 8h às 18h", "Sábado, 8h às 12h"],
  },
};
