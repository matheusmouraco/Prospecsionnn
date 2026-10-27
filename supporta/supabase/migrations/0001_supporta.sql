-- Supporta: leads, assinaturas, aceites, clientes, briefing, ajustes e relatórios.
-- Tudo no schema "supporta". O site acessa por conexão Postgres direta (SUPABASE_DB_URL, pooler),
-- então o schema NÃO precisa ser exposto na API REST. RLS ligado e sem políticas: anon/authenticated não leem nada.

create schema if not exists supporta;
revoke all on schema supporta from public, anon, authenticated;

create table if not exists supporta._migrations (
  nome text primary key,
  aplicada_em timestamptz not null default now()
);

create table supporta.leads (
  id uuid primary key default gen_random_uuid(),
  tipo text not null default 'diagnostico',
  email text not null,
  site text,
  ip text,
  relatorio jsonb,
  relatorio_enviado_em timestamptz,
  origem text,
  criado_em timestamptz not null default now()
);
create index on supporta.leads (email);

create table supporta.assinaturas (
  id uuid primary key default gen_random_uuid(),
  referencia text not null unique,
  plano text not null check (plano in ('start', 'pro', 'premium')),
  valor numeric(10, 2) not null,
  status text not null default 'aguardando_pagamento'
    check (status in ('aguardando_pagamento', 'ativa', 'pagamento_recusado', 'cancelada', 'teste')),
  provedor text not null,
  provedor_cliente_id text,
  provedor_assinatura_id text,
  empresa text not null,
  responsavel text not null,
  documento text not null,
  email text not null,
  whatsapp text not null,
  briefing_inicial jsonb not null default '{}',
  origem jsonb not null default '{}',
  boas_vindas_em timestamptz,
  briefing_enviado_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index on supporta.assinaturas (provedor_assinatura_id);
create index on supporta.assinaturas (email);

-- Registro do aceite dos Termos (fidelidade de 12 meses). Só insere, nunca altera.
create table supporta.aceites (
  id uuid primary key default gen_random_uuid(),
  assinatura_id uuid not null references supporta.assinaturas (id),
  texto text not null,
  versao_termos text not null,
  url_termos text not null,
  aceito_em timestamptz not null,
  ip text not null,
  user_agent text
);

create or replace function supporta.bloquear_alteracao() returns trigger
language plpgsql set search_path = supporta, pg_temp as $$
begin
  raise exception 'registros de aceite não podem ser alterados nem apagados';
end;
$$;
create trigger aceites_imutaveis before update or delete on supporta.aceites
  for each row execute function supporta.bloquear_alteracao();

create table supporta.eventos_pagamento (
  id uuid primary key default gen_random_uuid(),
  assinatura_id uuid references supporta.assinaturas (id),
  provedor text not null,
  evento text not null,
  tipo text not null,
  valor numeric(10, 2),
  bruto jsonb,
  recebido_em timestamptz not null default now()
);

create table supporta.clientes (
  id uuid primary key default gen_random_uuid(),
  assinatura_id uuid not null unique references supporta.assinaturas (id),
  nome text not null,
  email text not null,
  whatsapp text,
  plano text not null,
  segmento text,
  cidade text,
  site_url text,
  -- Monitoramento de citações (Premium): nomes que contam como citação e perguntas feitas às IAs.
  nomes_busca text[] not null default '{}',
  perguntas_ia text[] not null default '{}',
  -- Relatório de visitas (Pro e Premium): id do site no Plausible.
  plausible_site_id text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);
create index on supporta.clientes (lower(email));

create table supporta.briefings (
  id uuid primary key default gen_random_uuid(),
  assinatura_id uuid not null references supporta.assinaturas (id),
  respostas jsonb not null,
  arquivos jsonb not null default '[]',
  enviado_em timestamptz not null default now()
);

create table supporta.ajustes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references supporta.clientes (id),
  descricao text not null,
  status text not null default 'aberto' check (status in ('aberto', 'em_andamento', 'feito')),
  pedido_em timestamptz not null default now(),
  concluido_em timestamptz
);
create index on supporta.ajustes (cliente_id, pedido_em);

create table supporta.relatorios_visitas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references supporta.clientes (id),
  mes date not null,
  dados jsonb not null,
  enviado_em timestamptz,
  unique (cliente_id, mes)
);

create table supporta.citacoes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references supporta.clientes (id),
  mes date not null,
  motor text not null,
  pergunta text not null,
  citado boolean not null,
  trecho text,
  fontes jsonb not null default '[]',
  erro text,
  rodado_em timestamptz not null default now(),
  unique (cliente_id, mes, motor, pergunta)
);

create table supporta.relatorios_citacoes (
  cliente_id uuid not null references supporta.clientes (id),
  mes date not null,
  enviado_em timestamptz not null default now(),
  primary key (cliente_id, mes)
);

do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'supporta' loop
    execute format('alter table supporta.%I enable row level security', t);
    execute format('revoke all on supporta.%I from anon, authenticated', t);
  end loop;
end $$;

-- Arquivos do briefing (logo, fotos): bucket privado, acesso só por URL assinada gerada no servidor.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('supporta-briefings', 'supporta-briefings', false, 10485760,
        array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'])
on conflict (id) do nothing;

insert into supporta._migrations (nome) values ('0001_supporta.sql') on conflict do nothing;
