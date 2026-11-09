-- Preço único (nov/2026): o site é pago uma vez e a renovação anual (endereço e, se pedido, domínio) começa no 2º ano.
-- Alterações depois de 30 dias da entrega são cobradas à parte.

alter table supporta.assinaturas
  add column if not exists dominio_proprio boolean not null default false,
  add column if not exists valor_anual numeric(10, 2);

alter table supporta.ajustes
  add column if not exists valor numeric(10, 2) not null default 0,
  add column if not exists cobranca_url text,
  add column if not exists pago boolean not null default true;

alter table supporta.sites alter column plano set default 'pro';
