-- Cadência do "o que achou?": quando saiu o último retorno (intervalo mínimo e mensagens de horário marcado).
alter table supporta.conversas add column if not exists ultimo_retorno_em timestamptz;
