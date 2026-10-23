import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getEnv } from '../config/env.js';
import { markPublished } from '../draft/store.js';
import { logger } from '../lib/logger.js';
import { publicarTodos } from '../publish/publicar.js';
import { notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'publicar' });

// `npm run esbocos:publicar -- [site.com.br ...]`: saves the approved local drafts in the database and
// redeploys every published draft to Vercel. With DRY_RUN=true the deploy is a preview (protected
// Vercel URL, not analise.matilab.com.br); with DRY_RUN=false it goes to production on DRAFT_BASE_URL.
async function main(): Promise<void> {
  const env = getEnv();
  const base = env.DRAFT_BASE_URL.replace(/\/$/, '');
  for (const dominio of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
    const html = await readFile(join('out', 'esbocos', dominio, 'index.html'), 'utf8');
    const slug = await markPublished(dominio, html, base);
    log.info('Esboço pronto para publicar', { dominio, link: `${base}/${slug}` });
  }
  const p = await publicarTodos();
  log.info(p.producao ? 'Publicado em produção' : 'Prévia publicada (DRY_RUN=true)', { deploy: p.deploy, esbocos: p.slugs.length });
  await notify(p.producao
    ? `🌐 ${p.slugs.length} esboço(s) no ar:\n${p.slugs.map((s) => `${p.base}/${s}`).join('\n')}`
    : `🔎 Prévia dos esboços (só abre logado na Vercel):\n${p.slugs.map((s) => `${p.deploy}/${s}`).join('\n')}`);
}

main().catch((err: unknown) => {
  log.error('esbocos:publicar falhou', { err });
  process.exitCode = 1;
});
