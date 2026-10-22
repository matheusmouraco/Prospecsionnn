# Prospector Matilab

Prospecção fria automatizada: Snov.io > análise do site > email personalizado > leitura de respostas > página de esboço > aviso ao Moura.

A especificação completa (regras, máquina de estados, fases) está em [`CLAUDE.md`](./CLAUDE.md).

## Requisitos

- Node.js 20+
- Um projeto no Supabase

## Banco

O sistema usa o projeto Supabase **metodo-tracao**, que também guarda outros apps. Todas as tabelas do prospector ficam no schema `prospector`, separadas do resto. As migrations 0001 e 0002 já foram aplicadas.

Passo manual obrigatório (uma vez): no painel do Supabase, **Project Settings > Data API > Exposed schemas**, adicione `prospector` e salve. Sem isso o backend não enxerga as tabelas. É seguro: só a service role tem permissão nesse schema.

## Primeiros passos (Fase 1)

```bash
npm install
cp .env.example .env
# preencha SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e SUPABASE_DB_URL
npm run db:migrate   # cria as tabelas e funções
npm run db:check     # confere conexão e tabelas
```

Onde achar cada valor no painel do Supabase:

- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`: Project Settings > API
- `SUPABASE_DB_URL`: botão **Connect** no topo do projeto > connection string (URI). Use a do *Session pooler* se o VPS não tiver IPv6. Troque `[YOUR-PASSWORD]` pela senha do banco.

Se preferir não usar `db:migrate`, dá para colar o conteúdo de `supabase/migrations/0001_init.sql` no SQL Editor do Supabase. Depois disso o `db:migrate` não deve ser usado nesse banco (ele não saberá que a migration já foi aplicada).

## Fase 2 (Snov)

```bash
# no .env: SNOV_CLIENT_ID, SNOV_CLIENT_SECRET (Snov > Settings > API)
npm run db:migrate                 # aplica a migration 0002
npm run snov:lists                 # descubra os ids e coloque em SNOV_SOURCE_LIST_IDS
npm run snov:inspect               # confira em out/snov-amostra.json se "interpretado.website" veio preenchido
npm run snov:import -- --preview   # contagem de empresas únicas com site, sem gravar
npm run snov:import                # grava no banco
```

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run typecheck` | Checa os tipos |
| `npm test` | Roda os testes |
| `npm run build` | Compila para `dist/` |
| `npm run db:migrate` | Aplica migrations pendentes de `supabase/migrations/` |
| `npm run db:check` | Critério da Fase 1: conexão ok e todas as tabelas acessíveis |
| `npm run snov:lists` | Lista as listas do Snov com os ids |
| `npm run snov:inspect -- <id>` | Salva uma amostra crua da lista em `out/snov-amostra.json` |
| `npm run snov:import -- --preview` | Lê e deduplica sem gravar nada (relatório em `out/importacao.md`) |
| `npm run snov:import` | Importa de verdade para o banco, status `novo` |

## Segurança

- `DRY_RUN` só desliga com o valor exato `false`. Qualquer outra coisa (vazio, erro de digitação) mantém o modo seguro.
- O logger (`src/lib/logger.ts`) remove valores das chaves do `.env`, campos com nome sensível (token, secret, key...) e formatos conhecidos de segredo (JWT, chaves Google/Anthropic, token do Telegram, senha em URL).
- Todas as tabelas têm RLS ligado sem políticas: só a service role (usada pelo backend) acessa.
