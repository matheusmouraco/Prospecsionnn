import { chargesFor, customProject, priceLabel, pricing } from "./plans";

export type Faq = { q: string; a: string };

const { site: preco, endereco, dominio, alteracao, diasAlteracaoGratis: dias, prazoHoras: horas } = pricing;
const comDominio = chargesFor(true);

export const homeFaq: Faq[] = [
  {
    q: "Quanto custa o site da Supporta?",
    a: `${priceLabel(preco)}, pago uma vez. O site fica pronto em até ${horas}h, em uma página completa (apresentação, serviços, sobre, perguntas e contato), feito pela IA a partir das suas respostas e com a sua marca. O endereço nome.supporta.com.br, com hospedagem e SSL, já vem incluso no 1º ano.`,
  },
  {
    q: "Tem mensalidade?",
    a: `Não. Você paga ${priceLabel(preco)} uma vez pelo site. A partir do 2º ano, só renova o endereço nome.supporta.com.br com hospedagem e SSL, por ${priceLabel(endereco)} por ano. Se quiser domínio próprio .com.br, ele custa ${priceLabel(dominio)} por ano.`,
  },
  {
    q: "E depois do 1º ano?",
    a: `O site continua no ar com a renovação anual do endereço e da hospedagem, por ${priceLabel(endereco)} por ano. Com domínio próprio, a renovação fica em ${priceLabel(comDominio.anual)} por ano (${priceLabel(endereco)} do endereço e hospedagem + ${priceLabel(dominio)} do domínio).`,
  },
  {
    q: "Posso cancelar?",
    a: "Pode, quando quiser e sem multa. Não existe prazo mínimo nem fidelidade. Se você cancelar a renovação anual, o site fica no ar até o fim do ano já pago e depois sai do ar.",
  },
  {
    q: "Quanto tempo leva para o site ficar pronto?",
    a: `Até ${horas} horas depois do pagamento. Antes disso, você conversa com a gente no WhatsApp, a IA monta o site e você vê a prévia sem pagar nada. Depois do pagamento, o site entra no ar em nome.supporta.com.br. O domínio próprio .com.br a gente combina com você pelo WhatsApp.`,
  },
  {
    q: "Quem escreve os textos do site?",
    a: "A IA da Supporta, a partir do que você conta no WhatsApp (e do seu Instagram ou site, se tiver). Os textos já saem pensados para o Google e para as IAs, com a sua marca, e você vê a prévia completa antes de pagar.",
  },
  {
    q: "Como peço alterações no site?",
    a: `Pelo WhatsApp. Você manda o que quer mudar (texto, foto, horário, preço) e a gente faz. Nos primeiros ${dias} dias depois da entrega, as alterações não têm custo. Depois disso, cada alteração custa ${priceLabel(alteracao)}.`,
  },
  {
    q: "Preciso ter domínio próprio?",
    a: `Não. O site já vai ao ar em nome.supporta.com.br, com hospedagem e SSL inclusos no 1º ano. O domínio próprio .com.br é opcional e custa ${priceLabel(dominio)} por ano desde o 1º ano.`,
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
    q: "Preciso ter CNPJ para contratar?",
    a: "Não. Dá para contratar com CPF. Se tiver CNPJ, a nota fiscal sai no nome da empresa.",
  },
  {
    q: customProject.label,
    a: `O site da Supporta é montado pela IA a partir das suas respostas. Se você precisa de um projeto personalizado, fale com o Matheus no WhatsApp ${customProject.whatsapp}.`,
  },
];

export const billingFaq: Faq[] = [
  {
    q: "Como é feito o pagamento?",
    a: `No cartão de crédito. Você paga ${priceLabel(preco)} uma vez pelo site (${priceLabel(comDominio.hoje)} se incluir o domínio próprio). Depois, só a renovação anual a partir do 2º ano.`,
  },
  {
    q: "O que está incluso nos R$99?",
    a: `O site completo em uma página, criado pela IA com a sua marca, feito pro celular, com botão de WhatsApp, Google Maps e GEO. O endereço nome.supporta.com.br, a hospedagem e o SSL vêm inclusos no 1º ano, e as alterações não têm custo nos primeiros ${dias} dias.`,
  },
  {
    q: "Quanto custa a renovação?",
    a: `A partir do 2º ano, ${priceLabel(endereco)} por ano para manter o endereço nome.supporta.com.br, a hospedagem e o SSL. Com domínio próprio, soma ${priceLabel(dominio)} por ano do domínio, total de ${priceLabel(comDominio.anual)} por ano.`,
  },
  {
    q: "O domínio próprio é obrigatório?",
    a: `Não. É opcional e custa ${priceLabel(dominio)} por ano desde o 1º ano, renovando todo ano. Sem ele, o site fica em nome.supporta.com.br.`,
  },
  {
    q: "Quanto custa uma alteração no site?",
    a: `Nos primeiros ${dias} dias depois da entrega, nada: você aprova o site e tem 1 mês de alterações sem custo. Depois disso, ${priceLabel(alteracao)} por alteração.`,
  },
  {
    q: "Posso cancelar a renovação?",
    a: "Pode, quando quiser e sem multa. O site fica no ar até o fim do ano já pago.",
  },
  {
    q: "Posso pagar no boleto ou Pix?",
    a: "No momento o pagamento é só no cartão de crédito.",
  },
  {
    q: "O que acontece se o cartão for recusado na renovação?",
    a: "A gente avisa por e-mail e WhatsApp e tenta de novo nos dias seguintes. Você pode trocar o cartão a qualquer momento. O site só sai do ar depois de 15 dias de atraso, e volta assim que o pagamento é regularizado.",
  },
  {
    q: "Recebo nota fiscal?",
    a: "Sim. A nota fiscal é emitida a cada cobrança no CPF ou CNPJ informado na contratação.",
  },
  {
    q: "E se eu me arrepender?",
    a: "Você tem 7 dias depois do pagamento para desistir, com reembolso integral, como prevê o Código de Defesa do Consumidor (art. 49). Vale também para quem contrata com CNPJ.",
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
    a: "O Google costuma levar algumas semanas para indexar e posicionar páginas novas. Nas IAs o tempo varia, porque cada uma atualiza suas fontes de um jeito. Por isso vale manter o site atualizado.",
  },
  {
    q: "Preciso fazer algo além do site?",
    a: "Ajuda manter o Google Meu Negócio atualizado, pedir avaliações para clientes satisfeitos e ter o mesmo nome, endereço e telefone em todos os lugares. O seu site já sai com esses dados em texto e em dados estruturados, para bater com o perfil no Google.",
  },
];
