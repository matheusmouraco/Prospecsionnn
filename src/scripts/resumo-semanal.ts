import { logger } from '../lib/logger.js';
import { renderSemana, resumoSemana } from '../telegram/dados.js';
import { notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'resumo' });

// `npm run semana`: Friday 18h, the week in numbers (sends, reply rate, best niches).
resumoSemana()
  .then((s) => notify(renderSemana(s)))
  .then((ok) => log.info(ok ? 'Resumo da semana enviado' : 'Resumo da semana não enviado'))
  .catch((err: unknown) => {
    log.error('semana falhou', { err });
    process.exitCode = 1;
  });
