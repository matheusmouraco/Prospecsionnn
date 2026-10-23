import { logger } from '../lib/logger.js';
import { resumoAtual } from '../telegram/commands.js';
import { notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'resumo' });

// `npm run resumo`: sends the daily summary to Telegram (19h on the VPS cron).
resumoAtual()
  .then(notify)
  .then((ok) => log.info(ok ? 'Resumo enviado' : 'Resumo não enviado'))
  .catch((err: unknown) => {
    log.error('resumo falhou', { err });
    process.exitCode = 1;
  });
