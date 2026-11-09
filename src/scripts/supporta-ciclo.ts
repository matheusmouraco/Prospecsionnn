import { logger } from '../lib/logger.js';
import { getEnv } from '../config/env.js';
import { aplicarAjustes, aplicarAjustesNoAr, gerarPrevia, publicarPago } from '../supporta/cycle.js';

// Supporta builder worker (runs every minute from the scheduler): paid sites first (a client is waiting
// on a published site), then previews. A few per run so one slow generation never blocks the queue for long.
const log = logger.child({ etapa: 'supporta' });

/** WhatsApp bot follow-ups ("o que achou?") live on the Supporta site; the scheduler just knocks every minute. */
async function retornos() {
  const env = getEnv();
  if (!env.SUPPORTA_URL || !env.SUPPORTA_WORKER_SECRET) return;
  try {
    const res = await fetch(`${env.SUPPORTA_URL.replace(/\/$/, '')}/api/interno/retornos`, {
      method: 'POST',
      headers: { authorization: `Bearer ${env.SUPPORTA_WORKER_SECRET}` },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) log.warn('Retornos do robô falharam', { status: res.status });
  } catch (err) {
    log.warn('Retornos do robô falharam', { erro: (err as Error).message });
  }
}

async function main() {
  let feitos = 0;
  await retornos();
  for (let i = 0; i < 2 && (await publicarPago()); i++) feitos++;
  for (let i = 0; i < 3 && (await aplicarAjustes()); i++) feitos++;
  for (let i = 0; i < 3 && (await aplicarAjustesNoAr()); i++) feitos++;
  for (let i = 0; i < 3 && (await gerarPrevia()); i++) feitos++;
  if (feitos) log.info('Ciclo da Supporta terminou', { sites: feitos });
}

main().catch((err) => {
  log.error('Ciclo da Supporta falhou', { erro: (err as Error).message });
  process.exit(1);
});
