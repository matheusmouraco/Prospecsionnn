# Renderiza (nome provisório)

SaaS de render fotorrealista com IA: o usuário manda um print do SketchUp/Promob/Revit/Lumion, uma foto do ambiente, um croqui ou uma fachada, define tudo num wizard visual e recebe o render mantendo a geometria original. Sem escrever prompt.

App Next.js isolado dentro deste repositório (não depende do prospector nem da Supporta).

## Status das etapas

- [x] **Etapa 2: editor** (wizard de 11 etapas + modo rápido, prompt builder, geração, antes e depois, variações, upscale HD, edição por texto, edição de área com pincel, versões, presets, assistente, histórico)
- [ ] Etapa 3: login (link mágico + Google), créditos e Stripe
- [ ] Etapa 4: projetos, link público com comentários e voto
- [ ] Etapa 5: landing page
- [ ] Etapa 6: admin e controle de custo

## Rodar localmente

```bash
cd render
npm install
cp .env.example .env.local   # preencha GEMINI_API_KEY
npm run dev                   # http://localhost:3000/editor
```

Sem `GEMINI_API_KEY` o editor roda em **modo demonstração**: o fluxo inteiro funciona, mas a imagem só recebe um ajuste de cor (não gasta nada).

Comandos: `npm run typecheck`, `npm test`, `npm run build`.

## Variáveis de ambiente

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_APP_NAME` | Nome do produto na interface |
| `GEMINI_API_KEY` | Chave do Google AI Studio. Sem ela, modo demonstração |
| `GEMINI_MODEL_STANDARD` | Modelo do Padrão 1K (padrão `gemini-3.1-flash-image`, o Nano Banana 2) |
| `GEMINI_MODEL_HD` | Modelo do HD 2K e do upscale (padrão `gemini-3-pro-image`, o Nano Banana Pro) |
| `GEMINI_MODEL_TEXT` | Modelo de texto para detectar o tipo de imagem e o assistente |
| `GEMINI_API_STYLE` | `interactions` (API atual do Google) ou `generateContent` (antiga). Se uma recusar, o código tenta a outra |
| `GEMINI_API_REVISION` | Cabeçalho `Api-Revision` da Interactions API |
| `COST_USD_STANDARD` / `COST_USD_HD` | Custo estimado por imagem (para margem no admin) |
| `ACCESS_PASSWORD` | Senha do editor enquanto não há login. **Obrigatória em produção**, senão qualquer um gasta sua chave |
| `MAX_RENDERS_PER_HOUR` | Limite simples por IP (até a etapa 3) |

## Deploy na Vercel

1. Novo projeto na Vercel apontando para este repositório, **Root Directory = `render`**.
2. Cadastre as variáveis acima (no mínimo `GEMINI_API_KEY` e `ACCESS_PASSWORD`).
3. Deploy. A rota `/api/render` usa até 180 s (`maxDuration`); o plano Hobby limita em 60 s, então para o HD 2K use o plano Pro ou Fluid Compute.

## Como funciona

```
navegador                                  servidor (Vercel)                 Google
---------                                  -----------------                 ------
comprime a imagem (2048px, JPEG)  ──────►  /api/detect  ── modelo de texto ──► tipo + ambiente
wizard (escolhas em Choices)
"Gerar render" (N variações em paralelo) ►  /api/render
                                             prompt-builder: escolhas > prompt em inglês
                                             provider (1K ou 2K) ──────────────► imagem
                                             sharp: converte para JPEG
recola pixels fora da máscara  ◄──────────  imagem + prompt + custo
antes e depois, edições, versões
histórico no IndexedDB, presets no localStorage
```

### Pastas

- `config/options.ts`: **todas as opções do wizard**, com rótulo em português, texto do prompt em inglês e amostra visual. Editar aqui muda o prompt sem mexer no resto (na etapa 6 vai para o banco e é editável pelo admin).
- `lib/ai/prompt-builder.ts`: transforma as escolhas no prompt estruturado (trava de geometria, materiais por superfície, paleta, luz, mobiliário, câmera, máscara, referências, negativo).
- `lib/ai/summary.ts`: resumo em linguagem natural da tela de confirmação.
- `lib/ai/providers/`: camada de provedor. `gemini-client.ts` fala com a Interactions API e com o `generateContent`; trocar de modelo ou de fornecedor mexe só aqui.
- `app/api/render`: geração (modos `render`, `variation`, `edit`, `upscale`).
- `app/api/detect`: detecta 3D, foto, croqui ou fachada e sugere o ambiente.
- `app/api/assistant`: transforma uma descrição livre em escolhas do wizard (só aceita ids válidos).
- `components/editor/`: editor, etapas, pincel de máscara, antes e depois, tela de geração, resultado.

### Decisões técnicas

- **Geometria travada de verdade:** o Gemini não aceita máscara nativa. A máscara vai como imagem extra com instrução e, depois de gerar, o navegador recola os pixels originais fora da área pintada (borda suavizada). O que está travado fica idêntico.
- **Formato diferente do original** obriga a IA a completar ou cortar as bordas; o wizard avisa e o padrão é "original" (a proporção mais próxima suportada é enviada ao modelo).
- **Resposta em JPEG** para caber no limite de 4,5 MB das funções da Vercel. Na etapa 3 as imagens passam para o Supabase Storage com URLs assinadas, o que também libera o 4K.
- **Erros amigáveis:** filtro de segurança, fila cheia (429), demora e chave inválida viram mensagens em português; o crédito da imagem que falhou não é cobrado (o débito real entra na etapa 3).
