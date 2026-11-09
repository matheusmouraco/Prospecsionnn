-- Prévia no ar por 5 dias (até o fim do 5º dia depois de enviada, horário de São Paulo). Nada é apagado: só sai do ar.
alter table supporta.sites add column if not exists previa_expira_em timestamptz;
alter table supporta.sites add column if not exists aviso_expiracao_em timestamptz;

-- Prévias que já existem contam a partir de quando ficaram prontas.
update supporta.sites
set previa_expira_em = ((date_trunc('day', previa_em at time zone 'America/Sao_Paulo') + interval '6 days' - interval '1 second') at time zone 'America/Sao_Paulo')
where previa_expira_em is null and previa_em is not null and status in ('previa', 'ajuste', 'ajustando', 'erro');
