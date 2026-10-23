import { isPaused } from '../db/control.js';
import { cicloEsbocos } from '../flow/lead-esboco.js';
import { logger } from '../lib/logger.js';

// `npm run ciclo:esbocos`: leads who asked for the draft get one, and Moura approves it on Telegram.
async function main(): Promise<void> {
  if (await isPaused()) return;
  const n = await cicloEsbocos();
  logger.info('Ciclo de esboços', { leads: n });
}

main().catch((err: unknown) => {
  logger.error('ciclo:esbocos falhou', { err });
  process.exitCode = 1;
});
