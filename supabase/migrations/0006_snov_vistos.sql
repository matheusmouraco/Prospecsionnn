-- Snov prospects already read (imported or discarded), so every list is processed only once.
set search_path = prospector, public;

create table if not exists snov_vistos (
  snov_id text primary key,
  lido_em timestamptz default now()
);
alter table snov_vistos enable row level security;
grant all on snov_vistos to service_role;
