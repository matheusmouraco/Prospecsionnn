import { getEnv, requireEnv } from '../config/env.js';
import { publishedDrafts } from '../draft/store.js';
import { buildSite } from './site.js';
import { deploy, ensureDomain } from './vercel.js';

export interface Publicacao { producao: boolean; deploy: string; base: string; slugs: string[] }

// Redeploys every published draft. DRY_RUN=true: protected preview; false: production on DRAFT_BASE_URL.
export async function publicarTodos(): Promise<Publicacao> {
  const env = getEnv();
  const o = { token: requireEnv('VERCEL_TOKEN'), teamId: env.VERCEL_TEAM_ID, project: env.VERCEL_PROJECT };
  const base = env.DRAFT_BASE_URL.replace(/\/$/, '');
  const drafts = await publishedDrafts();
  if (!drafts.length) throw new Error('Nenhum esboço aprovado e marcado para publicar');
  const producao = !env.DRY_RUN;
  const url = await deploy(o, buildSite(drafts), producao);
  if (producao) await ensureDomain(o, new URL(base).hostname);
  return { producao, deploy: url, base, slugs: drafts.map((d) => d.slug) };
}
