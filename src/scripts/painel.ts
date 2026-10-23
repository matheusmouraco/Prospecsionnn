import { logger } from '../lib/logger.js';
import { publishPainel } from '../panel/publish.js';
import { notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'painel' });

// `npm run painel`: rebuilds the private dashboard on Vercel and sends the link to Telegram.
publishPainel()
  .then(async (url) => {
    log.info('Painel atualizado', { url });
    await notify(`📈 Painel atualizado (abre logado na Vercel):\n${url}`);
  })
  .catch((err: unknown) => {
    log.error('painel falhou', { err });
    process.exitCode = 1;
  });
