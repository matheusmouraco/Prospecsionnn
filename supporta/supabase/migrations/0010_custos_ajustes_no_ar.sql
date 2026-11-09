-- Custo de API por cliente e por dia (Anthropic, OpenAI, Apify, Google) e ajustes automáticos do site já publicado.
create table if not exists supporta.custos (
  id bigint generated always as identity primary key,
  dia date not null default (now() at time zone 'America/Sao_Paulo')::date,
  site_id uuid references supporta.sites (id),
  telefone text,
  fornecedor text not null,   -- anthropic | openai | apify | google
  operacao text not null,     -- conversa | foto | transcricao | instagram | google | previa | ajuste | publicacao | ajuste_no_ar
  usd numeric(10, 5) not null default 0,
  criado_em timestamptz not null default now()
);
create index if not exists custos_dia on supporta.custos (dia);
create index if not exists custos_site on supporta.custos (site_id, dia);
create index if not exists custos_telefone on supporta.custos (telefone, dia);
alter table supporta.custos enable row level security;
revoke all on supporta.custos from anon, authenticated;
grant select, insert, update, delete on supporta.custos to service_role;
grant usage, select on sequence supporta.custos_id_seq to service_role;

-- Site no ar: pedido de alteração nos 30 dias vira 'ajuste_no_ar' > 'ajustando_no_ar' > volta a 'no_ar'.
alter table supporta.sites drop constraint if exists sites_status_check;
alter table supporta.sites add constraint sites_status_check
  check (status in ('na_fila', 'gerando', 'previa', 'ajuste', 'ajustando', 'erro', 'pago', 'publicando', 'no_ar', 'ajuste_no_ar', 'ajustando_no_ar', 'cancelado'));
