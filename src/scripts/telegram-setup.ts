import { getEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { sendMessage, telegram } from '../telegram/client.js';

const log = logger.child({ etapa: 'telegram' });

interface Update { message?: { chat: { id: number; first_name?: string; username?: string } } }

// `npm run telegram:setup`: finds the chat id of whoever sent the bot a message and sends a test.
async function main(): Promise<void> {
  const env = getEnv();
  const me = await telegram<{ username: string }>('getMe');
  let chatId = env.TELEGRAM_CHAT_ID;
  if (!chatId) {
    const updates = await telegram<Update[]>('getUpdates');
    const chat = updates.map((u) => u.message?.chat).filter(Boolean).at(-1);
    if (!chat) {
      log.warn(`Nenhuma mensagem encontrada. Abra @${me.username} no Telegram, mande "oi" e rode de novo.`);
      return;
    }
    chatId = String(chat.id);
    log.info(`Coloque no .env: TELEGRAM_CHAT_ID=${chatId}`, { de: chat.first_name ?? chat.username });
  }
  await sendMessage(chatId, 'Prospector Matilab conectado. As notificações vão chegar por aqui.');
  log.info('Mensagem de teste enviada', { bot: me.username });
}

main().catch((err: unknown) => {
  log.error('telegram:setup falhou', { err });
  process.exitCode = 1;
});
