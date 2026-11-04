-- Old slugs of a renamed draft. The static site is rebuilt from this table on every publish,
-- so each old slug becomes a permanent redirect to the current one (links already sent keep working).
alter table prospector.esbocos add column if not exists slugs_antigos text[] not null default '{}';
