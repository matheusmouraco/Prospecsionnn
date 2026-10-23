import { getEnv } from '../config/env.js';
import { getSupabase } from '../db/client.js';
import { businessDay } from '../lib/dates.js';
import { isPaused, setPaused } from '../db/control.js';
import { logger } from '../lib/logger.js';
import { motivosParaPausar } from '../monitor/locks.js';
import { metricasDoDia } from '../monitor/store.js';
import { notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'travas' });

// Heads-up once a day when spending passes 70% of the daily cap, before the lock pauses everything.
async function avisoDeCusto(custo: number, teto: number): Promise<void> {
  if (custo < teto * 0.7 || custo >= teto) return;
  const dia = businessDay();
  const db = getSupabase();
  const { data } = await db.from('controle').select('valor').eq('chave', 'alerta_custo').maybeSingle();
  if (data?.valor === dia) return;
  await db.from('controle').upsert({ chave: 'alerta_custo', valor: dia });
  await notify(`💸 Gasto de hoje em US$${custo.toFixed(2)}, ${Math.round((custo / teto) * 100)}% do teto de US$${teto}.\nSe chegar no teto eu pauso tudo. Para subir: /custo ${Math.ceil(teto * 1.5)}`);
}

// `npm run travas`: checks today's metrics against the limits and pauses everything if one is crossed (rule 6).
async function main(): Promise<void> {
  const env = getEnv();
  if (await isPaused()) return;
  const m = await metricasDoDia();
  await avisoDeCusto(m.custo_api_usd, env.MAX_DAILY_API_COST_USD);
  const motivos = motivosParaPausar(m, env.MAX_DAILY_API_COST_USD);
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
