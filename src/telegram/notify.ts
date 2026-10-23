import { getEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { sendMessage } from './client.js';

const log = logger.child({ etapa: 'telegram' });

// Sends a message to Moura. Never throws: a Telegram outage must not stop the pipeline.
export async function notify(text: string): Promise<boolean> {
  const env = getEnv();
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    log.warn('Telegram não configurado; aviso não enviado', { texto: text.slice(0, 120) });
    return false;
  }
  try {
    await sendMessage(env.TELEGRAM_CHAT_ID, env.DRY_RUN ? `[teste, DRY_RUN]\n${text}` : text);
    return true;
  } catch (err) {
    log.error('Falha ao enviar aviso no Telegram', { err });
    return false;
  }
}

export interface AvisoLead {
  nome: string | null;
  empresa: string | null;
  dominio: string | null;
  email: string;
  categoria: string;
  resumo: string;
  texto: string;
  linkEsboco?: string | null;
}

export function formatLead(a: AvisoLead): string {
  return [
    `🔥 Lead respondeu (${a.categoria})`,
    `${a.nome ?? 'Sem nome'} · ${a.empresa ?? a.dominio ?? ''}`,
    a.dominio ? `Site: https://${a.dominio}` : '',
    `Email: ${a.email}`,
    a.linkEsboco ? `Esboço: ${a.linkEsboco}` : '',
    '',
    `Resumo: ${a.resumo}`,
    '',
    `Resposta: "${a.texto.replace(/\s+/g, ' ').slice(0, 700)}"`,
  ].filter((l, i, all) => l !== '' || (all[i - 1] ?? '') !== '').join('\n');
}
