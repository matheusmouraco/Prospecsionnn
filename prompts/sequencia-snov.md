# Sequência para montar no Snov (Matheus cola uma vez)

Não é usado pelo código: é o texto da campanha que fica dentro do Snov.
Onde aparece `{campo}`, insira a variável correspondente pelo seletor de variáveis do Snov
(todos são custom fields com estes nomes exatos: `saudacao`, `nome_empresa`, `site_da_empresa`,
`problema_1`, `problema_2`, `gancho`, `nicho`).

Não use o "First name" do Snov na saudação: em caixas como contato@ ou ibo@ ele traz a sigla da empresa.
O campo `saudacao` já vem pronto ("Oi Bruna" ou "Olá").

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

Dei uma olhada no {site_da_empresa} e anotei dois pontos:

1. {problema_1}
2. {problema_2}

{gancho}

Fiz um esboço de como o site de vocês poderia ficar resolvendo isso. Quer que eu te mande?

Matheus Moura | Matilab

Se não fizer sentido, é só responder "sair".

---

## Follow-up 1 (dia 3), na mesma conversa

{saudacao}, conseguiu ver minha mensagem sobre o {site_da_empresa}?

O esboço já está pronto. Se quiser, te mando por aqui mesmo, sem compromisso.

Matheus Moura | Matilab

Se não fizer sentido, é só responder "sair".

---

## Follow-up 2 (dia 7), na mesma conversa

{saudacao}, essa é minha última mensagem sobre isso.

Se em algum momento fizer sentido melhorar o {site_da_empresa}, o esboço continua guardado. É só responder este email.

Abraço,
Matheus Moura | Matilab

Se não fizer sentido, é só responder "sair".
