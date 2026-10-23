import { logger } from '../lib/logger.js';
import { resumoAtual } from '../telegram/commands.js';
import { notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'resumo' });

// `npm run resumo`: sends the daily summary to Telegram (19h on the VPS cron).
// pm2 also starts cron jobs once on every deploy; `--agendado` skips those runs outside 19h.
const hora = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hourCycle: 'h23' }).format(new Date()));
if (process.argv.includes('--agendado') && hora !== 19) {
  log.info('Fora do horário do resumo; nada enviado');
} else resumoAtual()
  .then(notify)
  .then((ok) => log.info(ok ? 'Resumo enviado' : 'Resumo não enviado'))
  .catch((err: unknown) => {
    log.error('resumo falhou', { err });
    process.exitCode = 1;
  });
