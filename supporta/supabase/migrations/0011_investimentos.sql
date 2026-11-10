-- Investimento em tráfego (anúncios etc.) lançado à mão no /admin, para medir o retorno por mês.
create table if not exists supporta.investimentos (
  id bigint generated always as identity primary key,
  mes date not null,                 -- primeiro dia do mês
  canal text not null default 'Tráfego pago',
  valor numeric(10, 2) not null check (valor >= 0),
  obs text,
  criado_em timestamptz not null default now()
);
create index if not exists investimentos_mes on supporta.investimentos (mes);
alter table supporta.investimentos enable row level security;
revoke all on supporta.investimentos from anon, authenticated;
grant select, insert, update, delete on supporta.investimentos to service_role;
