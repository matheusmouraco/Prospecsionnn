-- Prospector Matilab: initial schema.
-- Status list must match src/domain/status.ts (test/status.test.ts checks it).
-- Everything lives in its own schema so it never mixes with other apps in the same project.

create schema if not exists prospector;
set search_path = prospector, public;

-- Keeps updated_at current on every update.
create or replace function set_updated_at() returns trigger
language plpgsql set search_path = prospector, pg_temp as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table empresas (
  id uuid primary key default gen_random_uuid(),
  dominio text unique not null check (dominio = lower(dominio)),
  nome text,
  nicho text,
  cidade text,
  created_at timestamptz default now()
);

create table prospects (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references empresas(id),
  snov_prospect_id text,
  email text unique not null check (email = lower(email)),
  primeiro_nome text,
  cargo text,
  lista_origem text,
  status text not null default 'novo' check (status in (
    'novo', 'site_ok_ou_sem_site', 'analisando', 'descartado_site_bom', 'analisado',
    'email_pronto', 'enviado_snov', 'respondeu_quer_ver', 'gerando_esboco',
    'esboco_publicado', 'link_enviado', 'respondeu_interesse', 'notificado_moura',
    'respondeu_nao', 'respondeu_descadastro', 'respondeu_ausente', 'sem_resposta',
    'erro', 'erro_final'
  )),
  status_anterior text,   -- step that failed, used to retry from status 'erro'
  tentativas int default 0,
  locked_at timestamptz,
  erro text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- One contact per company (rule 2).
create unique index prospects_empresa_unica on prospects (empresa_id) where empresa_id is not null;
create index prospects_status_idx on prospects (status, updated_at);

create trigger prospects_updated_at before update on prospects
  for each row execute function set_updated_at();

create table analises (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references empresas(id) unique,
  pagespeed_mobile jsonb,
  pagespeed_desktop jsonb,
  print_desktop_url text,
  print_mobile_url text,
  marca jsonb,            -- logo_url, cores[], fontes[], textos, servicos[], contato
  problemas jsonb,        -- lista de problemas medidos, cada um com evidência
  nota_site int check (nota_site between 0 and 100),
  created_at timestamptz default now()
);

create table emails (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid references prospects(id),
  campos jsonb,           -- custom fields enviados ao Snov
  enviado_em timestamptz
);
create index emails_prospect_idx on emails (prospect_id);

create table respostas (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid references prospects(id),
  texto text,
  categoria text check (categoria in ('quer_ver', 'interesse', 'nao', 'descadastro', 'ausente', 'outro')),
  confianca numeric check (confianca between 0 and 1),
  acao_tomada text,
  recebida_em timestamptz default now()
);
create index respostas_prospect_idx on respostas (prospect_id);

create table esbocos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references empresas(id) unique,
  slug text unique,
  url text,
  nota_juiz int check (nota_juiz between 0 and 100),
  tentativas int default 0,
  expira_em timestamptz,
  created_at timestamptz default now()
);

create table bloqueados (
  email text primary key check (email = lower(email)),
  dominio text,
  motivo text,
  created_at timestamptz default now()
);
create index bloqueados_dominio_idx on bloqueados (dominio);

create table metricas_diarias (
  dia date primary key,
  enviados int default 0,
  bounces int default 0,
  respostas int default 0,
  positivas int default 0,
  descadastros int default 0,
  esbocos_gerados int default 0,
  custo_api_usd numeric default 0
);

create table controle (
  chave text primary key,
  valor text
);

insert into controle (chave, valor) values
  ('pausado', 'false'),
  ('motivo_pausa', '');

-- Atomically claims up to p_limit prospects in p_status, skipping rows locked
-- in the last 15 minutes and rows another cycle is claiming right now.
create or replace function claim_prospects(p_status text, p_limit int)
returns setof prospects
language sql set search_path = prospector, pg_temp as $$
  update prospects p
     set locked_at = now()
   where p.id in (
     select id from prospects
      where status = p_status
        and (locked_at is null or locked_at < now() - interval '15 minutes')
      order by updated_at
      limit p_limit
      for update skip locked
   )
  returning p.*;
$$;

-- Adds p_valor to one counter of the day's metrics, creating the row if needed.
create or replace function incrementar_metrica(p_campo text, p_valor numeric, p_dia date default current_date)
returns void
language plpgsql set search_path = prospector, pg_temp as $$
begin
  if p_campo not in ('enviados', 'bounces', 'respostas', 'positivas', 'descadastros', 'esbocos_gerados', 'custo_api_usd') then
    raise exception 'campo de métrica inválido: %', p_campo;
  end if;
  insert into metricas_diarias (dia) values (p_dia) on conflict (dia) do nothing;
  execute format('update metricas_diarias set %I = coalesce(%I, 0) + $1 where dia = $2', p_campo, p_campo)
    using p_valor, p_dia;
end;
$$;

-- The app only uses the service role key, which bypasses RLS. Enabling RLS with
-- no policies keeps the anon/public key from reading anything.
alter table empresas enable row level security;
alter table prospects enable row level security;
alter table analises enable row level security;
alter table emails enable row level security;
alter table respostas enable row level security;
alter table esbocos enable row level security;
alter table bloqueados enable row level security;
alter table metricas_diarias enable row level security;
alter table controle enable row level security;

-- Only the backend (service role) may touch this schema. anon/authenticated get nothing,
-- even if the schema is exposed in the API settings.
revoke all on schema prospector from public;
revoke execute on all functions in schema prospector from public;
alter default privileges in schema prospector revoke execute on functions from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant usage on schema prospector to service_role;
    grant select, insert, update, delete on all tables in schema prospector to service_role;
    grant execute on all functions in schema prospector to service_role;
    alter default privileges in schema prospector grant select, insert, update, delete on tables to service_role;
    alter default privileges in schema prospector grant execute on functions to service_role;
  end if;
end;
$$;
