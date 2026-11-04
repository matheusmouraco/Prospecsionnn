-- Sites montados pela IA a partir do criador gamificado (/criar).
-- Fluxo: na_fila > gerando > previa (cliente vê e escolhe o plano) > pago > publicando > no_ar.
-- O gerador roda no VPS do Prospector, que lê e escreve aqui pela API do Supabase (service_role).

create table if not exists supporta.sites (
  id uuid primary key default gen_random_uuid(),
  -- Vai na URL da prévia (/previa/<token>): aleatório e longo, sem dado pessoal.
  token text not null unique,
  -- Subdomínio em supporta.com.br (nome.supporta.com.br), reservado na criação.
  slug text not null unique,
  status text not null default 'na_fila'
    check (status in ('na_fila', 'gerando', 'previa', 'erro', 'pago', 'publicando', 'no_ar', 'cancelado')),
  plano text not null default 'start' check (plano in ('start', 'pro', 'premium')),
  empresa text not null,
  contato_nome text not null,
  contato_email text not null,
  contato_whatsapp text not null,
  respostas jsonb not null,
  ip text,
  assinatura_id uuid references supporta.assinaturas (id),
  -- Domínio próprio, quando já apontado para a Vercel.
  dominio text unique,
  custo_usd numeric(10, 4) not null default 0,
  tentativas int not null default 0,
  erro text,
  locked_at timestamptz,
  criado_em timestamptz not null default now(),
  previa_em timestamptz,
  pago_em timestamptz,
  publicado_em timestamptz,
  atualizado_em timestamptz not null default now()
);
create index if not exists sites_status_idx on supporta.sites (status, criado_em);
create index if not exists sites_email_idx on supporta.sites (lower(contato_email));
create index if not exists sites_whatsapp_idx on supporta.sites (contato_whatsapp);

-- Páginas de cada site: '/' é a home (a prévia); as outras entram depois do pagamento, conforme o plano.
create table if not exists supporta.site_paginas (
  site_id uuid not null references supporta.sites (id) on delete cascade,
  caminho text not null,
  titulo text not null default '',
  html text not null,
  atualizado_em timestamptz not null default now(),
  primary key (site_id, caminho)
);

alter table supporta.assinaturas add column if not exists site_id uuid references supporta.sites (id);

-- Pega o próximo site de um status e trava (o gerador nunca processa o mesmo site duas vezes).
-- Trava esquecida (processo caiu) expira em 20 minutos e o site volta para a fila.
create or replace function supporta.claim_site(p_de text, p_para text)
returns setof supporta.sites
language plpgsql security definer
set search_path = supporta, pg_temp
as $$
begin
  return query
  update supporta.sites s set status = p_para, locked_at = now(), tentativas = s.tentativas + 1, atualizado_em = now()
  where s.id = (
    select id from supporta.sites
    where status = p_de or (status = p_para and locked_at < now() - interval '20 minutes')
    order by criado_em
    limit 1
    for update skip locked
  )
  returning s.*;
end $$;

alter table supporta.sites enable row level security;
alter table supporta.site_paginas enable row level security;
revoke all on supporta.sites, supporta.site_paginas from anon, authenticated;
revoke all on function supporta.claim_site(text, text) from public, anon, authenticated;

-- O gerador do VPS usa a API REST com service_role (o schema precisa estar exposto; anon e authenticated seguem sem acesso).
grant usage on schema supporta to service_role;
grant select, insert, update, delete on all tables in schema supporta to service_role;
grant execute on function supporta.claim_site(text, text) to service_role;

-- Logo e fotos enviados no criador: bucket público, porque entram no HTML do site publicado.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('supporta-sites', 'supporta-sites', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;
