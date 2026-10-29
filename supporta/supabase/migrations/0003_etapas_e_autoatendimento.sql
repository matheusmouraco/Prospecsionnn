-- Autoatendimento: etapa do projeto e prévia para aprovar, modelo escolhido na vitrine,
-- pedidos do cliente (revisão da prévia, troca de plano, cancelamento) e cancelamento agendado.

alter table supporta.clientes
  add column if not exists etapa text not null default 'briefing'
    check (etapa in ('briefing', 'producao', 'previa', 'revisao', 'aprovado', 'publicado')),
  add column if not exists previa_url text,
  add column if not exists previa_em timestamptz,
  add column if not exists aprovado_em timestamptz,
  add column if not exists publicado_em timestamptz;

-- Quem já mandou o briefing está em produção; quem já tem site no ar entra como publicado.
update supporta.clientes c set etapa = 'producao'
from supporta.assinaturas a
where a.id = c.assinatura_id and a.briefing_enviado_em is not null and c.etapa = 'briefing';

alter table supporta.assinaturas
  add column if not exists modelo text,
  add column if not exists cancelamento_pedido_em timestamptz,
  -- Último dia com o site no ar depois de um cancelamento (fim do período já pago).
  add column if not exists cancelar_em date;

create table if not exists supporta.solicitacoes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references supporta.clientes (id),
  tipo text not null check (tipo in ('revisao_previa', 'mudar_plano', 'cancelar')),
  descricao text not null default '',
  dados jsonb not null default '{}',
  status text not null default 'aberto' check (status in ('aberto', 'feito')),
  criado_em timestamptz not null default now(),
  concluido_em timestamptz
);
create index if not exists solicitacoes_cliente_idx on supporta.solicitacoes (cliente_id, criado_em);

alter table supporta.solicitacoes enable row level security;
revoke all on supporta.solicitacoes from anon, authenticated;
