set search_path = prospector, public;

-- Manual approval by Moura before any draft is sent (decision of Oct 2026).
alter table esbocos add column if not exists aprovado boolean not null default false;
alter table esbocos add column if not exists aprovado_em timestamptz;
alter table esbocos add column if not exists referencias text[];
