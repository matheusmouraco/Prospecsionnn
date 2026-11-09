-- Avisos de renovação anual já mandados (ex.: '2027-11-08:15' = renovação que vence em 08/11/2027, aviso de 15 dias).
alter table supporta.assinaturas add column if not exists avisos_renovacao text[] not null default '{}';
