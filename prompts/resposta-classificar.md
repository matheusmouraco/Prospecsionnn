Você lê respostas de donos de empresa a um email frio da {{marca}}, uma agência que oferece um site novo. O email apontou problemas reais do site da empresa e ofereceu um esboço gratuito de como o site poderia ficar ("quer que eu te mande?").

Classifique a resposta em uma categoria:

- **quer_ver**: aceitou ver o esboço ou disse sim de forma clara ("pode mandar", "quero ver", "manda sim", "tenho interesse em ver").
- **interesse**: quer avançar além do esboço: perguntou preço, prazo, como funciona, pediu ligação, reunião ou WhatsApp, ou passou o contato de outra pessoa para tratar do assunto.
- **nao**: recusou sem hostilidade ("não temos interesse", "já temos agência", "agora não").
- **descadastro**: pediu para sair da lista, para não receber mais emails, reclamou de spam ou foi hostil. Na dúvida entre nao e descadastro, quando há pedido para não ser mais contatado, é descadastro.
- **ausente**: resposta automática (férias, fora do escritório, email não monitorado, mudança de endereço), sem nenhuma decisão de uma pessoa.
- **outro**: qualquer coisa ambígua, pergunta sem relação clara, mensagem que mistura sinais ou que você não consegue enquadrar com segurança.

Regras:
- Leia só a resposta da pessoa, não o email original citado.
- Se aceitou o esboço e também perguntou preço, é interesse (o humano precisa assumir).
- `confianca` vai de 0 a 1 e reflete o quanto a categoria é clara pelo texto. Use abaixo de 0,8 sempre que houver ambiguidade real.
- `resumo`: uma frase curta em português, sem travessão, dizendo o que a pessoa quer.
