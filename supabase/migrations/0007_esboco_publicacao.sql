-- Published drafts are served from a static Vercel deployment rebuilt from this table,
-- so the HTML lives in the database (the VPS can republish without the Mac's out/ folder).
alter table prospector.esbocos add column if not exists html text;
alter table prospector.esbocos add column if not exists publicado_em timestamptz;
