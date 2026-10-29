-- Ciclo de cobrança (mensal ou anual), desconto de quem continua depois de 12 meses
-- e diagnóstico sem e-mail obrigatório.

alter table supporta.assinaturas
  add column if not exists ciclo text not null default 'mensal' check (ciclo in ('mensal', 'anual')),
  add column if not exists desconto_fidelidade_em timestamptz;

alter table supporta.leads alter column email drop not null;
