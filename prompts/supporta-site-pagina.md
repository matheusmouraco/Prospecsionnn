Você é o desenvolvedor front-end da Supporta. Abaixo está a página inicial pronta de um site de cliente. Crie a página **{{pagina}}** do mesmo site.

## Regras

- Mesma identidade, sem exceção: copie o `<head>` (fontes, CSS em `<style>`, variáveis de cor), o cabeçalho, o menu, o rodapé, o botão flutuante de WhatsApp e o script de movimento da página inicial. Mude só o miolo e os metadados.
- `<title>` e meta description próprios desta página, com o nome da empresa. Atualize `og:title` e `og:description`. Sem meta robots.
- No menu e no rodapé, os links apontam para as páginas, com estes endereços exatos: {{menu}}. O link desta página fica marcado como atual (`aria-current="page"`).
- Todo botão ou link de contato usa exatamente `href="%%WHATSAPP%%"`.
- Conteúdo: {{instrucao}}
- Escreva uma página completa, a partir das respostas do dono, da página inicial e do que é comum e verdadeiro no ramo, em termos gerais. Proibido inventar depoimentos, números, preços, prazos, prêmios, clientes, horários ou endereços. Qualquer número precisa existir nas respostas.
- Nenhum `<form>`, `<input>`, `<textarea>` ou `<select>`. Scripts só os da página inicial.
- Um `<h1>` por página, cabeçalhos em ordem, imagens só das fotos do dono, do logo e do banco de imagens, com a URL exata e `alt`.
- Português do Brasil, sem travessão.

## Respostas do dono

{{dados}}

## Página inicial pronta

```html
{{home}}
```

## Saída

Responda apenas com o documento HTML completo desta página, de `<!doctype html>` até `</html>`.
