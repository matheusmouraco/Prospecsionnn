import { annualFreeMonths, billing, earlyCancelFee, plans } from "./plans";
import { formatBRLCents } from "./site";

export type Faq = { q: string; a: string };

const { minMonths, earlyCancelFeePct: fee, loyaltyDiscountPct: loyalty } = billing;

export const homeFaq: Faq[] = [
  {
    q: "Por que tem fidelidade de 12 meses?",
    a: "É o que permite não cobrar a criação do site. A Supporta não vende um site: é uma assinatura. Você paga a mensalidade e tem o site no ar, hospedado e cuidado, enquanto a assinatura estiver ativa. Os 12 meses são o prazo mínimo do contrato.",
  },
  {
    q: "E depois dos 12 meses?",
    a: `O site segue no ar e você ganha ${loyalty}% de desconto na mensalidade a partir do 13º mês, como agradecimento por continuar. Daí em diante dá para cancelar quando quiser, sem multa.`,
  },
  {
    q: "Como funciona o cancelamento?",
    a: `Depois dos ${minMonths} meses, você cancela quando quiser, sem multa, com aviso pelo WhatsApp ou e-mail. Antes disso, a multa é de ${fee}% do valor das mensalidades que faltam para completar os ${minMonths} meses. Exemplo no Start: cancelando depois de 8 meses pagos, faltam 4 mensalidades de R$${plans[0].price}, e a multa fica em ${formatBRLCents(earlyCancelFee(plans[0], 8))}.`,
  },
  {
    q: "O que acontece com o site e o domínio se eu cancelar?",
    a: "O site fica no ar enquanto a assinatura estiver ativa. Com o cancelamento ele sai do ar e nada é entregue, porque você assinou um serviço, não comprou um site. O domínio .com.br é registrado no seu CPF ou CNPJ, então o endereço continua seu. A partir do 2º ano, a renovação do domínio é paga por você direto no Registro.br.",
  },
  {
    q: "Qual o prazo para o site ficar pronto?",
    a: "Depois do briefing completo, o Start fica pronto em até 7 dias úteis, o Pro em até 15 e o Premium em até 30. Você aprova antes de publicar.",
  },
  {
    q: "Quem escreve os textos do site?",
    a: "A gente. Você responde um briefing de 10 minutos e nossa equipe escreve os textos pensando no Google e nas IAs. Você revisa e aprova tudo antes de ir ao ar.",
  },
  {
    q: "Posso mudar de plano depois?",
    a: "Pode. Subir de plano vale a partir da próxima cobrança. Para descer de plano, fale com a gente pelo WhatsApp e ajustamos respeitando o contrato.",
  },
  {
    q: "O que é GEO?",
    a: "GEO (Generative Engine Optimization) é preparar o seu site para ser citado por IAs como ChatGPT, Gemini e Perplexity. Inclui dados estruturados, textos que respondem perguntas reais, llms.txt e liberar os robôs dessas IAs para lerem o site.",
  },
  {
    q: "Funciona para o meu segmento?",
    a: "Temos modelos para arquitetura, restaurantes, odontologia, advocacia, saúde e serviços em geral. Se o seu negócio atende clientes e precisa ser encontrado, funciona. Na dúvida, chame no WhatsApp.",
  },
  {
    q: "Preciso ter CNPJ para assinar?",
    a: "Não. Dá para assinar com CPF. Se tiver CNPJ, o domínio .com.br e a nota fiscal saem no nome da empresa.",
  },
  {
    q: "Como peço ajustes no site?",
    a: "Pelo WhatsApp. Você manda o que quer mudar (texto, foto, horário, preço) e a gente faz. O Start inclui 1 ajuste por mês, o Pro 3 e o Premium ajustes ilimitados com prazo de até 48h.",
  },
];

export const billingFaq: Faq[] = [
  {
    q: "Como é feita a cobrança?",
    a: `No cartão de crédito, do jeito que você preferir: mensal, com uma cobrança por mês, ou anual, com uma cobrança por ano em que você paga ${billing.annualMonthsCharged} mensalidades e leva 12 (${annualFreeMonths} meses grátis).`,
  },
  {
    q: "Tem custo de criação ou taxa de setup?",
    a: "Não. Você paga só a mensalidade do plano escolhido. Criação, hospedagem e manutenção fazem parte da assinatura.",
  },
  {
    q: "Por que tem fidelidade de 12 meses?",
    a: `É o que permite não cobrar a criação do site. Depois dos ${minMonths} meses, a assinatura continua com ${loyalty}% de desconto e pode ser cancelada quando você quiser, sem multa.`,
  },
  {
    q: "O valor da mensalidade muda?",
    a: `O valor fica fixo durante os ${minMonths} meses do contrato. A partir do 13º mês ele cai ${loyalty}%. Um eventual reajuste depois disso é avisado com pelo menos 30 dias de antecedência.`,
  },
  {
    q: "Posso pagar no boleto ou Pix?",
    a: "No momento a assinatura é só no cartão de crédito, porque a cobrança recorrente evita atrasos e mantém o site sempre no ar.",
  },
  {
    q: "O que acontece se o cartão for recusado?",
    a: "A gente avisa por e-mail e WhatsApp e tenta de novo nos dias seguintes. Você pode trocar o cartão a qualquer momento. O site só sai do ar depois de 15 dias de atraso, e volta assim que o pagamento é regularizado.",
  },
  {
    q: "Recebo nota fiscal?",
    a: "Sim. A nota fiscal é emitida a cada cobrança no CPF ou CNPJ informado na assinatura.",
  },
  {
    q: "Vale mais a pena o mensal ou o anual?",
    a: `No anual você economiza ${annualFreeMonths} mensalidades por ano, mas paga tudo de uma vez. No mensal o valor é dividido mês a mês. Os dois têm os mesmos itens, o mesmo prazo mínimo de ${minMonths} meses e o mesmo desconto de ${loyalty}% a partir do 13º mês.`,
  },
  {
    q: "E se eu cancelar o anual antes de 12 meses?",
    a: `Você recebe de volta o valor proporcional aos meses que não usou, descontada a multa de ${fee}% sobre esse valor. Nos primeiros 7 dias, vale o direito de arrependimento com devolução integral.`,
  },
];

export const geoFaq: Faq[] = [
  {
    q: "Qual a diferença entre SEO, AEO e GEO?",
    a: "SEO é aparecer bem no Google. AEO é virar a resposta direta, como os trechos em destaque e as respostas por voz. GEO é ser citado pelas IAs generativas, como ChatGPT, Gemini e Perplexity. Um site bem feito trabalha os três ao mesmo tempo.",
  },
  {
    q: "O que é llms.txt?",
    a: "É um arquivo de texto na raiz do site que resume, em linguagem simples, quem é a empresa, o que ela faz e quais são as páginas mais importantes. Funciona como um guia para as IAs entenderem o seu site.",
  },
  {
    q: "Dá para garantir que o ChatGPT vai citar minha empresa?",
    a: "Não, e desconfie de quem garante. Ninguém controla a resposta das IAs. O que dá para fazer é deixar o seu site claro, confiável e fácil de ler, o que aumenta as chances de ele ser usado como fonte.",
  },
  {
    q: "Em quanto tempo aparecem os resultados?",
    a: "O Google costuma levar algumas semanas para indexar e posicionar páginas novas. Nas IAs o tempo varia, porque cada uma atualiza suas fontes de um jeito. Por isso o trabalho é mensal.",
  },
  {
    q: "Preciso fazer algo além do site?",
    a: "Ajuda manter o Google Meu Negócio atualizado, pedir avaliações para clientes satisfeitos e ter o mesmo nome, endereço e telefone em todos os lugares. No plano Pro a gente cuida do Google Meu Negócio pra você.",
  },
];
