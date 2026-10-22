-- Replies read from Snov: dedupe by Snov id, keep the summary and the actions taken.
-- "Agora não" is not blocked forever: the prospect is contacted again after retomar_em (6 months).
set search_path = prospector, public;

alter table respostas add column if not exists snov_id text;
alter table respostas add column if not exists resumo text;
alter table respostas add column if not exists categoria_modelo text;
create unique index if not exists respostas_snov_id_key on respostas (snov_id) where snov_id is not null;

alter table prospects add column if not exists retomar_em timestamptz;
create index if not exists prospects_retomar_idx on prospects (retomar_em) where retomar_em is not null;
