import { getEnv, requireEnv } from '../config/env.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { markPublished, publishedDrafts } from '../draft/store.js';
import { buildSite } from './site.js';
import { deploy, ensureDomain } from './vercel.js';

export interface Publicacao { producao: boolean; deploy: string; base: string; slugs: string[] }

// Redeploys every published draft. DRY_RUN=true: protected preview; false: production on DRAFT_BASE_URL.
export async function publicarTodos(producaoForcada?: boolean): Promise<Publicacao> {
  const env = getEnv();
  const o = { token: requireEnv('VERCEL_TOKEN'), teamId: env.VERCEL_TEAM_ID, project: env.VERCEL_PROJECT };
  const base = env.DRAFT_BASE_URL.replace(/\/$/, '');
  const drafts = await publishedDrafts();
  if (!drafts.length) throw new Error('Nenhum esboço marcado para publicar');
  const producao = producaoForcada ?? !env.DRY_RUN;
  const url = await deploy(o, buildSite(drafts), producao);
  if (producao) await ensureDomain(o, new URL(base).hostname);
  return { producao, deploy: url, base, slugs: drafts.map((d) => d.slug) };
}

// Publishes one freshly generated or adjusted draft on DRAFT_BASE_URL right away (noindex, banner and
// no form are enforced by the draft rules and the site headers). Moura authorized this even in DRY_RUN:
// the page is public but only reachable by its random slug; nothing goes to the lead without approval.
export async function publicarEsboco(dominio: string): Promise<string> {
  const base = getEnv().DRAFT_BASE_URL.replace(/\/$/, '');
  const html = await readFile(join('out/esbocos', dominio, 'index.html'), 'utf8');
  const slug = await markPublished(dominio, html, base, undefined, { exigirAprovacao: false });
  await publicarTodos(true);
  return `${base}/${slug}`;
}
