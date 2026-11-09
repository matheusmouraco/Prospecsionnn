-- Robô de WhatsApp (Evolution): conversa de cada número, log de mensagens (sem duplicar) e ajustes da prévia pelo gerador.

create table if not exists supporta.conversas (
  telefone text primary key,                       -- só números, com 55
  nome text,                                       -- nome do perfil no WhatsApp
  etapa text not null default 'inicio'
    check (etapa in ('inicio', 'negocio', 'servicos', 'fotos', 'confirmacao', 'gerando', 'previa', 'dados', 'pagamento', 'pago', 'humano')),
  briefing jsonb not null default '{}',
  midias jsonb not null default '[]',              -- [{id, tipo: logo|foto, url, alt}]
  site_id uuid references supporta.sites (id),
  ultima_msg_cliente_em timestamptz,
  previa_em timestamptz,
  retornos int not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists conversas_site_idx on supporta.conversas (site_id);

create table if not exists supporta.mensagens (
  id bigint generated always as identity primary key,
  telefone text not null,
  direcao text not null check (direcao in ('in', 'out')),
  tipo text,
  corpo text,
  wa_id text,
  criado_em timestamptz not null default now()
);
create unique index if not exists mensagens_wa_id on supporta.mensagens (wa_id) where wa_id is not null;
create index if not exists mensagens_telefone on supporta.mensagens (telefone, criado_em desc);

-- Ajustes pedidos na prévia pelo WhatsApp: o gerador aplica e devolve para 'previa'.
alter table supporta.sites drop constraint if exists sites_status_check;
alter table supporta.sites add constraint sites_status_check
  check (status in ('na_fila', 'gerando', 'previa', 'ajuste', 'ajustando', 'erro', 'pago', 'publicando', 'no_ar', 'cancelado'));
alter table supporta.sites alter column contato_email set default '';

alter table supporta.conversas enable row level security;
alter table supporta.mensagens enable row level security;
revoke all on supporta.conversas, supporta.mensagens from anon, authenticated;
grant select, insert, update, delete on supporta.conversas, supporta.mensagens to service_role;
