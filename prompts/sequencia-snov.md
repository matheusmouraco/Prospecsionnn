# Sequência para montar no Snov (Matheus cola uma vez)

Não é usado pelo código: é o texto da campanha que fica dentro do Snov.
Onde aparece `{campo}`, insira a variável correspondente pelo seletor de variáveis do Snov
(todos são custom fields com estes nomes exatos: `saudacao`, `nome_empresa`, `site_da_empresa`,
`observacao`, `problema_1`, `problema_2`, `problema_3`, `gancho`, `sugestao`, `nicho`).

Os problemas já chegam numerados ("1. ...", "2. ..."). Quando o site só tem dois problemas medidos,
`problema_3` vem vazio e no email sobra só uma linha em branco.

Não use o "First name" do Snov na saudação: em caixas como contato@ ou ibo@ ele traz a sigla da empresa.
O campo `saudacao` já vem pronto ("Oi Bruna" ou "Olá").

Assinatura: a campanha roda em 3 caixas (bruno@, isabella@ e matheus@matilabsites.com), então o nome
não fica fixo no texto. Onde aparece `{assinatura}`, use a assinatura da própria conta (no Snov:
Email accounts > conta > Sender name e Signature; no editor da campanha, inserir a assinatura).
Cada conta: Sender name "Bruno | Matilab", "Isabella | Matilab", "Matheus Moura | Matilab" e a
assinatura com o mesmo nome.

Configuração da campanha:
- Parar a sequência quando o contato responder.
- Follow-ups com o assunto em branco, para irem na mesma conversa do email 1 (aparecem como "Re: ...").

Por que estes assuntos: curtos, em minúsculas e com o nome da empresa, parecem mensagem de uma pessoa
e não de campanha. Nada de "proposta", "oportunidade", "grátis" ou ponto de exclamação, que derrubam a
entrega e a abertura.

---

## Email 1 (dia 0), sem link

**Assunto (principal):** {site_da_empresa}

Alternativas para teste A/B no Snov:
- vi o {site_da_empresa}
- esboço para o {site_da_empresa}

{saudacao}, tudo bem?

{observacao}

Olhando com calma, anotei alguns pontos:

{problema_1}
{problema_2}
{problema_3}

{gancho}

{sugestao}

Montei um esboço de como o site de vocês ficaria com isso resolvido. Quer que eu te mande?

{assinatura}

Se não fizer sentido, é só responder "sair".

---

## Follow-up 1 (dia 3), na mesma conversa

{saudacao}, conseguiu ver minha mensagem sobre o {site_da_empresa}?

O esboço já está pronto. Se quiser, te mando por aqui mesmo, sem compromisso.

{assinatura}

Se não fizer sentido, é só responder "sair".

---

## Follow-up 2 (dia 7), na mesma conversa

{saudacao}, essa é minha última mensagem sobre isso.

Se em algum momento fizer sentido melhorar o {site_da_empresa}, o esboço continua guardado. É só responder este email.

Abraço,
{assinatura}

Se não fizer sentido, é só responder "sair".

---

## Campanha 2: "Esboço pronto" (lista `SNOV_DRAFT_LIST_ID`, campanha 3206570)

O sistema coloca o lead nessa lista só depois que o Moura aprova o esboço no Telegram, com o custom field
`link_esboco` preenchido (mais os mesmos campos da campanha 1). Sai SÓ da caixa matheus@ (passagem de bastão:
a API de respostas não informa qual caixa recebeu a resposta). Um email só, sem follow-up, parar ao responder,
texto puro, rastreamento desligado, mesma agenda.

**Assunto:** esboço do {site_da_empresa}

{saudacao}, aqui é o Matheus, sócio da Matilab. Recebi seu retorno e preparei o esboço do site de vocês:

{link_esboco}

É uma proposta conceitual, montada a partir do site atual. Se fizer sentido conversar sobre colocar no ar, é só responder aqui ou me chamar no WhatsApp pelo botão da página.

{assinatura}
