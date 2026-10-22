set search_path = prospector, public;

-- AI search (GEO) and agent-navigation readiness measured during the site analysis.
alter table analises add column if not exists prontidao_ia jsonb;
