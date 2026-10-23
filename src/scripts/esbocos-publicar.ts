import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getEnv, requireEnv } from '../config/env.js';
import { markPublished, publishedDrafts } from '../draft/store.js';
import { logger } from '../lib/logger.js';
import { buildSite } from '../publish/site.js';
import { deploy, ensureDomain } from '../publish/vercel.js';
import { notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'publicar' });

// `npm run esbocos:publicar -- [site.com.br ...]`: saves the approved local drafts in the database and
// redeploys every published draft to Vercel. With DRY_RUN=true the deploy is a preview (protected
// Vercel URL, not analise.matilab.com.br); with DRY_RUN=false it goes to production on DRAFT_BASE_URL.
async function main(): Promise<void> {
  const env = getEnv();
  const o = { token: requireEnv('VERCEL_TOKEN'), teamId: env.VERCEL_TEAM_ID, project: env.VERCEL_PROJECT };
  const base = env.DRAFT_BASE_URL.replace(/\/$/, '');

  for (const dominio of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
    const html = await readFile(join('out', 'esbocos', dominio, 'index.html'), 'utf8');
    const slug = await markPublished(dominio, html, base);
    log.info('Esboço pronto para publicar', { dominio, link: `${base}/${slug}` });
  }

  const drafts = await publishedDrafts();
  if (!drafts.length) {
    log.warn('Nenhum esboço aprovado e marcado para publicar. Informe o site: npm run esbocos:publicar -- site.com.br');
    return;
  }
  const production = !env.DRY_RUN;
  const url = await deploy(o, buildSite(drafts), production);
  log.info(production ? 'Publicado em produção' : 'Prévia publicada (DRY_RUN=true)', { deploy: url, esbocos: drafts.length });

  if (production) {
    const d = await ensureDomain(o, new URL(base).hostname);
    log.info('Domínio', d);
    await notify(`🌐 ${drafts.length} esboço(s) no ar:\n${drafts.map((x) => `${base}/${x.slug}`).join('\n')}`);
  } else {
    await notify(`🔎 Prévia dos esboços (só abre logado na Vercel):\n${drafts.map((x) => `${url}/${x.slug}`).join('\n')}`);
  }
}

main().catch((err: unknown) => {
  log.error('esbocos:publicar falhou', { err });
  process.exitCode = 1;
});
