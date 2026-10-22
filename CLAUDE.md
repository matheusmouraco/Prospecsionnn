# Prospector Matilab

Sistema 100% automatizado de prospecção fria da Matilab. Roda sozinho em um VPS, sem intervenção humana, do lead até a conversa pronta.

Fluxo resumido: puxa prospects das listas do Snov.io > analisa o site de cada empresa > descarta sites bons > escreve email personalizado com problemas reais medidos > envia pela campanha do Snov > lê as respostas > gera uma página "seu site, só que melhor" para quem pedir > avisa o Moura só quando o lead quer conversar.

---

## Status das fases

- [x] Fase 1: Setup (migrations aplicadas e schema `prospector` exposto no projeto `metodo-tracao`; falta rodar `npm run db:check` com o `.env` real)
- [x] Fase 2: Snov (28 dentistas importados da lista 40679415)
- [x] Fase 3: Análise (10 sites reais analisados e aprovados pelo Moura)
- [x] Fase 4: Email (21 emails reais gerados e revisados pelo Moura; campos `saudacao` e `site_da_empresa` acrescentados na revisão. O envio ao Snov, com custom fields + lista de saída, ainda não foi feito: exige conferir os endpoints na doc, regra 9)
- [ ] Fase 5: Esboço (código e templates prontos e testados; falta rodar `npm run esbocos -- --limit 5` com dados reais e revisar)
- [ ] Fase 6: Respostas
- [ ] Fase 7: Cloudflare + Telegram + travas + resumo diário
- [ ] Fase 8: Produção

---

## Regras inegociáveis

1. **Nunca inventar problema.** Todo problema citado em email ou página precisa vir de uma métrica medida (PageSpeed, HTML, print). Se não foi medido, não entra.
2. **Uma empresa = uma análise = um contato.** Deduplicar por domínio. Nunca contatar o mesmo domínio duas vezes.
3. **Respeitar opt-out sempre.** Quem pedir para sair vai para a do-not-email do Snov e para a tabela `bloqueados`. Para sempre.
4. **Primeiro email sem link.** Link só no follow-up ou depois de resposta positiva.
5. **Página de esboço nunca pode se passar pelo site real:** faixa fixa de "Proposta conceitual", noindex, sem formulário funcional, expira em 30 dias.
6. **Trava de segurança automática:** se as métricas passarem dos limites (ver seção Travas), o sistema pausa sozinho e notifica.
7. **Modo DRY_RUN obrigatório** em todas as etapas que enviam ou publicam algo. Começa sempre em `DRY_RUN=true`.
8. **Nunca escrever chaves no código nem em logs.** Tudo vem do `.env`.
9. **Antes de implementar qualquer endpoint do Snov.io, consultar a documentação oficial em https://snov.io/api** e confirmar nome, parâmetros e limites. Não confiar em memória.

---

## Stack

- Node.js 20+ com TypeScript
- Playwright (Chromium headless) para print e extração de marca
- Google PageSpeed Insights API v5 (estratégias mobile e desktop)
- Anthropic SDK (`@anthropic-ai/sdk`) com visão
- Supabase (Postgres) como banco e fila de estados
- Cloudflare (Worker + R2 ou Pages) para hospedar as páginas de esboço em `analise.matilab.com.br/<slug>`
- `node-cron` + `pm2` no VPS
- Notificações: Telegram Bot por padrão (grátis e simples), WhatsApp via provedor opcional

Modelos (sempre via env, nunca hardcoded):
- `MODEL_FAST` (padrão `claude-sonnet-5-5`): análise, emails, classificação de respostas
- `MODEL_DESIGN` (padrão `claude-opus-5-5`): geração da página e juiz de qualidade

---

## Variáveis de ambiente

Ver `.env.example` (fonte de verdade) e `src/config/env.ts` (validação com zod).

---

## Máquina de estados (tabela `prospects.status`)

```
novo > site_ok_ou_sem_site (fim)
novo > analisando > descartado_site_bom (fim)
                  > analisado > email_pronto > enviado_snov
enviado_snov > respondeu_quer_ver > gerando_esboco > esboco_publicado > link_enviado
             > respondeu_interesse > notificado_moura (fim, humano assume)
             > respondeu_nao (fim, bloqueado)
             > respondeu_descadastro (fim, bloqueado)
             > respondeu_ausente (aguarda, sem ação)
             > sem_resposta (fim após sequência)
qualquer etapa > erro (com retry até 3x, depois erro_final + notificação no resumo diário)
```

Cada ciclo do cron pega registros por status e avança um passo. Nunca processar o mesmo registro em dois ciclos ao mesmo tempo (usar `locked_at` com expiração de 15 min). Implementado em `src/domain/status.ts` e na função SQL `claim_prospects` (usar sempre `claimProspects` de `src/db/queue.ts`).

---

## Banco (Supabase)

Projeto Supabase: `metodo-tracao` (ref `bzarlpqkbbvhuwmmdzem`), compartilhado com outros apps (Método Tração, gd, srg, buscaepoxi...). Por isso **tudo do prospector fica no schema Postgres `prospector`**, nunca em `public`. Só a `service_role` tem acesso ao schema; anon/authenticated não têm nem `usage`. Funções sempre com `set search_path = prospector, pg_temp`. O cliente usa `db: { schema: 'prospector' }` (`src/db/client.ts`).

Schemas expostos na API: neste projeto são definidos **no banco** (`alter role authenticator set pgrst.db_schemas = ...`), o que sobrepõe o campo Exposed schemas do painel. Valor atual: `public, graphql_public, nexoleum, buscaepoxi, prospector`. Ao mexer, manter todos os existentes e rodar `notify pgrst, 'reload config'`.

Schema em `supabase/migrations/`. Controle de aplicadas em `prospector._migrations` (usado pelo `db:migrate`; se aplicar migration por outro meio, registrar lá também). Tabelas: `empresas`, `prospects`, `analises`, `emails`, `respostas`, `esbocos`, `bloqueados`, `metricas_diarias`, `controle`. Nunca editar uma migration já aplicada; criar uma nova.

---

## Etapa 1: Importar do Snov.io

- Autenticar no Snov via OAuth (client credentials) e renovar token quando expirar.
- Para cada lista em `SNOV_SOURCE_LIST_IDS`, ler os prospects paginando (endpoint de prospects da lista, sem custo de crédito; confirmar na doc).
- Ignorar quem: não tem Company Website, está em `bloqueados`, já existe em `prospects`, ou cujo domínio já foi contatado.
- Normalizar domínio (sem www, sem path, minúsculo). Ignorar domínios de redes sociais, marketplaces e provedores genéricos (instagram.com, facebook.com, linktr.ee, wa.me, gmail.com, etc).
- Se a empresa tiver mais de um contato, escolher um só pela prioridade de cargo: sócio/fundador/CEO/diretor > marketing > comercial > resto.

## Etapa 2: Análise do site

1. **Acessibilidade:** se o site não carrega, dá erro de SSL ou redireciona para domínio de terceiros, registrar como problema forte (é argumento de venda) e seguir.
2. **PageSpeed** mobile e desktop: guardar performance, SEO, acessibilidade, best practices, LCP, CLS, TBT.
3. **Playwright:** print desktop (1440px) e mobile (390px), ambos acima da dobra e página inteira. Subir para o R2 com acesso privado.
4. **Checagens técnicas no HTML:** title, meta description, H1, viewport, HTTPS, alt em imagens, botão de WhatsApp/contato visível, formulário, ano do copyright (site abandonado), favicon, Open Graph.
5. **Extração de marca:** logo (img com "logo" em src/alt/class, depois og:image, depois apple-touch-icon), paleta (variáveis CSS + 5 cores dominantes do print), fontes (computed style de h1 e body), textos principais, serviços, telefone, endereço, fotos reaproveitáveis.
6. **Avaliação visual com Claude (`MODEL_FAST` com visão):** recebe os prints e os dados medidos e devolve JSON:

```json
{
  "nota_site": 0,
  "problemas": [
    {"tipo": "mobile|velocidade|seo|design|conversao|tecnico", "descricao_curta": "", "evidencia": "", "gravidade": 1}
  ],
  "nicho_detectado": ""
}
```

Regra do prompt: só listar problema que tenha evidência no print ou nas métricas fornecidas. Proibido supor.

7. Se `nota_site >= MIN_SITE_SCORE_TO_SKIP`, status `descartado_site_bom`.

## Etapa 3: Email

Gerar com `MODEL_FAST` os custom fields abaixo (cada um com no máximo 255 caracteres, limite do Snov; validar no código e reescrever se passar):

- `nome_empresa`
- `problema_1` (o mais grave, linguagem de dono de negócio, não de dev)
- `problema_2`
- `gancho` (uma frase ligando o problema a perda de cliente ou venda)
- `nicho`

Diretrizes de texto:
- Português do Brasil, tom de conversa, curto. Sem jargão técnico (nada de "LCP", "CLS"; usar "demora X segundos para abrir no celular").
- Sem travessão. Sem frases de IA ("espero que esteja bem", "no cenário atual").
- Números reais quando houver (ex: "seu site leva 7,2 segundos para abrir no celular").

A sequência fica montada **dentro do Snov** (o Moura cria uma vez) usando as variáveis:
- Email 1 (dia 0): problemas + oferta "fiz um esboço de como seu site ficaria, quer que eu te mande?". **Sem link.**
- Follow-up 1 (dia 3): reforço curto.
- Follow-up 2 (dia 7): encerramento educado.
- Rodapé com linha de opt-out ("se não fizer sentido, é só responder 'sair'").
- Campanha configurada para parar quando o prospect responder.

Envio: atualizar o prospect no Snov com os custom fields e adicioná-lo à `SNOV_OUTREACH_LIST_ID` (a campanha começa sozinha). Respeitar `MAX_NEW_PER_DAY`.

## Etapa 4: Leitura de respostas

- Preferência: webhook do Snov para eventos de resposta (confirmar na doc quais eventos existem). Fallback: polling da API de campanha a cada ciclo.
- Classificar com `MODEL_FAST` em JSON `{categoria, confianca, resumo}`:
  - `quer_ver`: pediu o esboço ou disse sim
  - `interesse`: perguntou preço, prazo, quer conversar, pediu ligação
  - `nao`: sem interesse
  - `descadastro`: pediu para sair, reclamou
  - `ausente`: resposta automática de férias/ausência
  - `outro`: qualquer coisa ambígua
- Se `confianca < 0.8`, tratar como `outro`.

Ações:
- `quer_ver` > Etapa 5.
- `interesse` e `outro` > notificar Moura no Telegram com nome, empresa, site, resumo, texto da resposta e link do esboço (se existir). Humano assume.
- `nao` e `descadastro` > do-not-email no Snov + `bloqueados`.
- `ausente` > nada.

## Etapa 5: Página de esboço

1. Montar o briefing a partir de `analises.marca` + textos do site + nicho.
2. Gerar com `MODEL_DESIGN` um HTML único, autocontido, responsivo, partindo de um dos templates em `/templates` (o modelo escolhe o mais adequado ao nicho e adapta). Usar logo e paleta originais, refinando contraste e hierarquia. Manter os serviços e informações reais da empresa. Não inventar depoimentos, números, prêmios ou clientes.
3. Obrigatório no HTML:
   - Faixa fixa no topo: "Proposta conceitual criada pela {SENDER_BRAND} para {nome_empresa}. Este não é o site oficial."
   - `<meta name="robots" content="noindex, nofollow">` e header `X-Robots-Tag: noindex` no Worker
   - Nenhum `<form>` funcional, nenhum campo de input
   - CTA principal levando para `SENDER_WHATSAPP_URL`
   - Seção final curta comparando "site atual" vs "proposta" com 3 ganhos medidos
4. **Juiz:** renderizar o HTML no Playwright, tirar print desktop e mobile, mandar para `MODEL_DESIGN` avaliar (fidelidade à marca, qualidade visual, legibilidade mobile, presença das regras do item 3). Nota 0 a 100. Abaixo de `JUDGE_MIN_SCORE`, regenerar com o feedback do juiz. Máximo 3 tentativas; se falhar, notificar Moura em vez de enviar.
5. Publicar em `DRAFT_BASE_URL/<slug>` (slug = nome da empresa normalizado + 4 caracteres aleatórios). Worker serve 404 após `expira_em`.
6. Enviar o link: preferir responder na mesma thread pela API do Gmail/Google Workspace da caixa que enviou; se não houver acesso, atualizar custom field `link_esboco` e adicionar à `SNOV_DRAFT_LIST_ID`.

### Templates

Pasta `/templates` com 3 a 4 bases HTML premium (Moura fornece ou Claude Code cria na Fase 5). Cada template tem: hero, serviços, sobre, prova/diferenciais, contato, rodapé. O modelo nunca cria estrutura do zero, só adapta.

## Etapa 6: Travas e monitoramento

Pausar tudo automaticamente (`controle.pausado = true`) e notificar se, nas últimas 24h:
- bounce > 3%
- descadastros + reclamações > 1% dos enviados
- custo de API > limite diário configurado (`MAX_DAILY_API_COST_USD`)
- erro na autenticação do Snov ou Anthropic por 3 ciclos seguidos

Resumo diário às 19h no Telegram: enviados, respostas, positivas, esboços gerados, leads passados para o Moura, custo do dia, erros.

---

## Fases de construção (fazer nesta ordem, uma por vez)

Cada fase só termina quando os critérios passarem. Sempre em `DRY_RUN=true` até a Fase 8.

1. **Setup:** projeto TS, `.env.example`, cliente Supabase, migrations, logger sem vazar segredos. *Critério:* tabelas criadas e conexão ok.
2. **Snov:** auth + leitura de listas + dedupe. *Critério:* importar uma lista real e mostrar contagem de empresas únicas com site.
3. **Análise:** PageSpeed + Playwright + extração de marca + avaliação visual. *Critério:* rodar em 10 sites reais e gerar relatório local em `/out/analises.md` para revisão.
4. **Email:** geração dos custom fields com validação de 255 caracteres. *Critério:* 10 emails gerados em `/out/emails.md`, todos citando só problemas com evidência.
5. **Esboço:** templates + geração + juiz + render local. *Critério:* 5 páginas geradas em `/out/esbocos/` com nota do juiz.
6. **Respostas:** classificador testado com 20 respostas de exemplo. *Critério:* tabela de acerto em `/out/classificacao.md`.
7. **Cloudflare + Telegram + travas + resumo diário.** *Critério:* esboço publicado de teste com noindex conferido e notificação recebida.
8. **Produção:** `DRY_RUN=false`, `MAX_NEW_PER_DAY` baixo (20) na primeira semana, subir gradualmente. pm2 + cron no VPS.

---

## Setup manual (Moura faz uma vez, fora do código)

- Comprar 2 ou 3 domínios secundários (nunca enviar do matilab.com.br principal)
- Criar 2 caixas Google Workspace por domínio, configurar SPF, DKIM e DMARC
- Conectar as caixas no Snov e ligar o aquecimento por 2 a 3 semanas antes de enviar
- Criar no Snov a lista de saída + campanha de 3 emails com as variáveis acima e "parar ao responder"
- Criar projeto no Supabase, conta Cloudflare com o subdomínio `analise.matilab.com.br`, bot no Telegram
- VPS com Node 20 e dependências do Playwright

## Convenções

- Código e comentários em inglês, textos gerados e logs de negócio em português
- Prompts do Claude API ficam em `/prompts/*.md`, nunca inline no código
- Toda chamada ao Claude registra tokens e custo em `metricas_diarias.custo_api_usd` (via RPC `incrementar_metrica`)
- Toda resposta do Claude que deveria ser JSON é validada com zod; se falhar, uma nova tentativa com o erro no prompt
- Logs sempre pelo `logger` de `src/lib/logger.ts` (redige segredos automaticamente). Nunca `console.log` com dados de config.
- Config sempre por `getEnv()` / `requireEnv()` de `src/config/env.ts`. Nunca ler `process.env` direto fora desse arquivo.

## Comandos

- `npm run typecheck` / `npm test` / `npm run build`
- `npm run db:migrate`: aplica `supabase/migrations/*.sql` em ordem (precisa `SUPABASE_DB_URL`)
- `npm run db:check`: confere conexão e existência das tabelas (critério da Fase 1)
- `npm run snov:lists`: mostra as listas da conta e seus ids
- `npm run snov:inspect -- <listId>`: salva 5 prospects crus em `out/snov-amostra.json` para conferir os nomes de campo
- `npm run snov:import -- [--preview] [listIds...]`: importa e deduplica; relatório em `out/importacao.md` (critério da Fase 2)
- `npm run analyze -- [--limit N]`: analisa prospects `novo` e gera `out/analises.md` (critério da Fase 3)
- `npm run analyze -- --dominio site.com.br`: analisa um site avulso, sem mexer na fila
- `npm run emails -- [--limit N]`: escreve os custom fields dos prospects `analisado`, grava em `emails`, move para `email_pronto` e gera `out/emails.md` (critério da Fase 4). Não envia nada.

- `npm run referencias [-- --refazer]`: captura os sites de `referencias/lista.txt` e os prints de `referencias/manuais/` e gera as fichas; catálogo em `out/referencias.md`
- `npm run esbocos:aprovar -- site.com.br [--reprovar]`: aprovação manual do esboço
- `npm run esbocos:ajustar -- site.com.br --pedidos ajustes.txt [--base versao.html]`: aplica ajustes (um por linha) mantendo o layout; não gera do zero. Cada geração ou ajuste move os arquivos anteriores para `out/esbocos/<dominio>/historico/<data>/`
- `npm run esbocos -- [--limit N | --dominio site.com.br | --refazer]`: gera esboços em `out/esbocos/<dominio>/index.html` com nota do juiz e `out/esbocos.md` (critério da Fase 5). Não publica nada.

## Notas sobre o esboço (Fase 5)

- **Decisão do Moura (out/2026):** templates genéricos ficaram com cara de IA. Agora cada esboço é **personalizado**, criado pelo MODEL_DESIGN em esforço `high` (`max` gastou 128 mil tokens pensando e cortou o HTML), usando como régua sites de referência. Os templates antigos viraram fixtures de teste (`test/fixtures/esbocos/`).
- Referências: `referencias/lista.txt` (trabalhos da Matilab + mercado; `*` = favorito, régua de qualidade). `npm run referencias` captura prints (não versionados) e gera `referencias/<slug>/ficha.json` (versionada) com segmentos, estilo, tipografia, paleta, padrões, movimento (bibliotecas detectadas na página) e nível. Rodar uma vez em cada máquina. Prints salvos à mão (png/jpg/webp) vão em `referencias/manuais/` (não versionada) e viram referências `manual-<nome>`, sem print de celular.
- Para cada empresa: `chooseReferences` pega a referência mais próxima do nicho + uma favorita. O gerador recebe os prints delas, o print do site atual e a ficha. Inspiração, nunca copiar texto/imagem.
- Direção de arte em `prompts/esboco-gerar.md` (lista do que dá cara de IA e é proibido). Juiz em `prompts/esboco-juiz.md` com notas de nível das referências e originalidade; nota geral não passa de 70 se uma delas ficar abaixo de 70.
- `src/draft/rules.ts`: o código força a faixa com o texto exato e o noindex; scripts só para animação (GSAP/ScrollTrigger e Lenis de CDN com versão fixa, mais JS inline sem fetch, cookies, storage, eval ou troca de URL; o resto é removido ou recusado). Conteúdo visível sem JS (padrão `html.js`), respeitando `prefers-reduced-motion`; recusa form/input, botão sem WhatsApp (`%%WHATSAPP%%`), texto de exemplo, travessão e número que não exista no texto do site original. schema.org da empresa injetado pelo código. Marcador `<!-- COMPARATIVO -->` recebe o comparativo medido (`src/draft/gains.ts`).
- Pedidos do Moura (out/2026): fundo branco (nada de bege), visual clean com pouco preto, sem texto riscado (o código recusa), sem forçar cidade na copy, sem texto sobre foto fora do hero. Selo de qualidade (`assets/selo-matilab.webp`) inserido pelo código no fim de toda página. Comparativo em cards e só com 2 ganhos ou mais.
- **Aprovação manual obrigatória** (`esbocos.aprovado`): `npm run esbocos:aprovar -- site.com.br` (ou `--reprovar`). Gerar de novo zera a aprovação. Só esboço aprovado pode ser publicado/enviado (Fase 7).
- `npm run esbocos -- --refazer --limit 5` refaz os não aprovados. `npm run analyze -- --dominio x` grava a análise nova no banco se a empresa existir (útil depois de melhorar o extrator).
- Extrator de marca acha logo em `<img>`, SVG inline, fundo CSS ou primeira imagem do cabeçalho, e fotos em `<img>` lazy/srcset e fundos CSS.

## Notas sobre o email (Fase 4)

- Quem escolhe os dois problemas é o código (`src/email/select.ts`): problema_1 é o mais grave (medido ganha empate); problema_2 é o problema `ia` mais grave quando existe, senão o próximo de outro tipo. O Claude só reescreve.
- `src/email/validate.ts` recusa: consequência dentro da frase do problema ("desiste", "vai embora", "perde"; consequência só no gancho), campo acima de 255 caracteres, travessão, jargão técnico, frase de IA, link, número que não está na evidência do problema e qualquer número no gancho (sem estatística inventada). Recusou, o Claude reescreve com a lista do que corrigir (até 3 tentativas).
- Campos do Snov: `saudacao` (código, `src/email/greeting.ts`: "Oi Bruna" ou "Olá" quando o first name é sigla da empresa ou caixa genérica), `nome_empresa`, `site_da_empresa` (Claude escolhe o artigo: "site do Grupo Rios"), `problema_1`, `problema_2`, `gancho`, `nicho`. A sequência não usa o First name do Snov.
- `emails.campos` guarda os campos do Snov e `fontes`, com o problema e a evidência de onde cada frase saiu.
- Texto da sequência para montar no Snov: `prompts/sequencia-snov.md` (não é usado pelo código).
- "Site abandonado" só com © de 3 anos ou mais atrás (© 2024 em 2026 não conta).

## Notas sobre a análise (Fase 3)

- Problemas vêm de duas fontes, marcadas em `origem`: `medido` (PageSpeed e HTML, em `src/analysis/checks.ts`, com o número na evidência) e `visual` (Claude, só o que aparece no print). O Claude nunca reescreve os medidos.
- **Busca por IA (GEO) e agentes:** `src/analysis/ai-readiness.ts` mede robots.txt bloqueando robôs de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended...), texto que só existe com JavaScript, dados estruturados schema.org, FAQ, telefone/endereço em texto, botões sem nome (agentes que navegam), acessibilidade do PageSpeed, sitemap e llms.txt. Vira problemas do tipo `ia` e fica em `analises.prontidao_ia`.
- Pedido do Moura para os emails (Fase 4): usar o ângulo "seus clientes hoje também pesquisam no ChatGPT, Gemini e no Google com IA, e seu site não está preparado para aparecer lá", sempre apoiado num problema `ia` medido do próprio site. Não citar estatísticas de mercado sem fonte.
- O nicho usado no email e no esboço é `empresas.nicho` (detectado no site), não o nome da lista.
- Prints ficam em `out/analises/<dominio>/` e o caminho local vai para `analises.print_*_url`. Na Fase 7 passam para o R2 privado.
- Cores da marca: variáveis CSS do `:root` + 5 cores mais presentes medidas no DOM (por área), não por pixel do print.
- O script de extração (`src/analysis/extract-script.ts`) é JS em texto: funções compiladas pelo tsx quebram dentro do `page.evaluate`.
- Custo de cada chamada ao Claude: `src/lib/cost.ts` (tabela de preços por modelo) somado em `metricas_diarias.custo_api_usd`.
- Playwright fixado em 1.56.1. No Mac/VPS rodar `npx playwright install chromium` uma vez.

## Notas sobre a API do Snov

- Referência confirmada (out/2026): token em `POST /v1/oauth/access_token` (1h), `GET /v1/get-user-lists`, `/v1/prospect-list` (listId, page, perPage até 5000, sem custo de crédito), limite de 60 req/min.
- A doc diverge sobre `prospect-list` ser POST ou GET: o cliente tenta POST e cai para GET em 405.
- **Confirmado numa lista real:** `prospect-list` devolve só `id, name, firstName, lastName, emails, source`. Empresa, cargo e site vêm de `/v1/get-prospect-by-id` (1 chamada por prospect, ~1/s pelo limite). O importador faz essa consulta para quem não tem site ou cargo.
- Páginas de franquia (`franquia.`, `franqueado.`, `seja-franqueado.`...) são descartadas, sem plano B pelo email (decisão do Moura).
- Empresas fora do nicho da lista entram normalmente: análise, email e esboço se adaptam ao nicho detectado no site (`nicho_detectado`), não ao nome da lista.
- Sem site no Snov: usa o domínio do email corporativo como site (`domainSource = 'email'`). Email genérico (gmail etc.) sem site é descartado.
- O formato da resposta do `get-prospect-by-id` ainda não foi confirmado com dados reais. `src/snov/parse.ts` procura em vários nomes (inclui `social[]`). Rodar `snov:inspect` e ajustar lá se preciso, com teste.
- Inserção sempre via RPC `importar_prospect` (empresa + contato na mesma transação; recusa domínio/email já existente ou bloqueado).
