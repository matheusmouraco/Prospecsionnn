import { getEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { notify } from '../telegram/notify.js';

// 19h05: asks the Supporta site for the daily report (it also sends it to Moura's WhatsApp) and posts the same text on Telegram.
const log = logger.child({ etapa: 'supporta' });

async function main() {
  const env = getEnv();
  if (!env.SUPPORTA_URL || !env.SUPPORTA_WORKER_SECRET) return log.warn('SUPPORTA_URL ou SUPPORTA_WORKER_SECRET ausente; sem relatório da Supporta');
  const res = await fetch(`${env.SUPPORTA_URL.replace(/\/$/, '')}/api/interno/relatorio`, {
    method: 'POST',
    headers: { authorization: `Bearer ${env.SUPPORTA_WORKER_SECRET}` },
    signal: AbortSignal.timeout(60_000),
  });
  const data = (await res.json().catch(() => ({}))) as { texto?: string };
  if (!res.ok || !data.texto) throw new Error(`relatório da Supporta: HTTP ${res.status}`);
  // WhatsApp uses *bold*; Telegram gets plain text.
  await notify(data.texto.replace(/\*/g, ''));
  log.info('Relatório da Supporta enviado');
}

main().catch((err) => {
  log.error('Relatório da Supporta falhou', { erro: (err as Error).message });
  process.exit(1);
});
