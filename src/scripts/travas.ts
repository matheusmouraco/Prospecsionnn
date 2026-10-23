import { getEnv } from '../config/env.js';
import { isPaused, setPaused } from '../db/control.js';
import { logger } from '../lib/logger.js';
import { motivosParaPausar } from '../monitor/locks.js';
import { metricasDoDia } from '../monitor/store.js';
import { notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'travas' });

// `npm run travas`: checks today's metrics against the limits and pauses everything if one is crossed (rule 6).
async function main(): Promise<void> {
  const env = getEnv();
  if (await isPaused()) return;
  const motivos = motivosParaPausar(await metricasDoDia(), env.MAX_DAILY_API_COST_USD);
  if (!motivos.length) {
    log.info('Travas ok');
    return;
  }
  await setPaused(true, motivos.join('; '));
  log.warn('Sistema pausado pelas travas', { motivos });
  await notify(`⛔ Pausei tudo automaticamente:\n${motivos.map((m) => `• ${m}`).join('\n')}\n\nQuando resolver, mande /retomar.`);
}

main().catch((err: unknown) => {
  log.error('travas falhou', { err });
  process.exitCode = 1;
});
