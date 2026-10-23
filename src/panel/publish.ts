import { getEnv, requireEnv } from '../config/env.js';
import { deploy } from '../publish/vercel.js';
import { renderPainel } from './render.js';
import { loadPainel } from './store.js';

// Builds the dashboard from the database and deploys it as a Vercel PREVIEW: preview URLs only open
// for people logged in to Moura's Vercel team (Vercel Authentication), so lead data never goes public.
export async function publishPainel(): Promise<string> {
  const env = getEnv();
  const html = renderPainel(await loadPainel());
  return deploy(
    { token: requireEnv('VERCEL_TOKEN'), teamId: env.VERCEL_TEAM_ID, project: env.VERCEL_PANEL_PROJECT },
    [
      { file: 'index.html', data: html },
      { file: 'vercel.json', data: JSON.stringify({ headers: [{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'Cache-Control', value: 'no-store' }] }] }) },
    ],
    false,
  );
}
