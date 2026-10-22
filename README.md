# Prospector Matilab

Prospecção fria automatizada: Snov.io > análise do site > email personalizado > leitura de respostas > página de esboço > aviso ao Moura.

A especificação completa (regras, máquina de estados, fases) está em [`CLAUDE.md`](./CLAUDE.md).

## Requisitos

- Node.js 20+
- Um projeto no Supabase

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

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run typecheck` | Checa os tipos |
| `npm test` | Roda os testes |
| `npm run build` | Compila para `dist/` |
| `npm run db:migrate` | Aplica migrations pendentes de `supabase/migrations/` |
| `npm run db:check` | Critério da Fase 1: conexão ok e todas as tabelas acessíveis |

## Segurança

- `DRY_RUN` só desliga com o valor exato `false`. Qualquer outra coisa (vazio, erro de digitação) mantém o modo seguro.
- O logger (`src/lib/logger.ts`) remove valores das chaves do `.env`, campos com nome sensível (token, secret, key...) e formatos conhecidos de segredo (JWT, chaves Google/Anthropic, token do Telegram, senha em URL).
- Todas as tabelas têm RLS ligado sem políticas: só a service role (usada pelo backend) acessa.
