import { requireEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { telegram } from '../telegram/client.js';
import { executar } from '../telegram/commands.js';

const log = logger.child({ etapa: 'telegram' });

interface Update {
  update_id: number;
  message?: { chat: { id: number }; text?: string };
  callback_query?: { id: string; data?: string; message?: { chat: { id: number } } };
}

// `npm run telegram:bot`: long-polls the bot and answers Moura's commands and buttons.
// Messages from any other chat are ignored.
async function main(): Promise<void> {
  const dono = requireEnv('TELEGRAM_CHAT_ID');
  await telegram('setMyCommands', { commands: [
    { command: 'status', description: 'Como está o sistema hoje' },
    { command: 'pausar', description: 'Pausa tudo' },
    { command: 'retomar', description: 'Volta a rodar' },
    { command: 'ajuda', description: 'Lista de comandos' },
  ] });
  log.info('Bot do Telegram ouvindo');
  let offset = 0;
  for (;;) {
    let updates: Update[] = [];
    try {
      updates = await telegram<Update[]>('getUpdates', { offset, timeout: 50 });
    } catch (err) {
      log.warn('getUpdates falhou; tentando de novo em 5s', { err });
      await new Promise((r) => setTimeout(r, 5000));
      continue;
    }
    for (const u of updates) {
      offset = u.update_id + 1;
      const chat = String(u.message?.chat.id ?? u.callback_query?.message?.chat.id ?? '');
      const texto = u.message?.text ?? u.callback_query?.data;
      if (u.callback_query) await telegram('answerCallbackQuery', { callback_query_id: u.callback_query.id }).catch(() => undefined);
      if (chat !== dono || !texto) continue;
      try {
        const r = await executar(texto);
        await telegram('sendMessage', {
          chat_id: dono,
          text: r.texto,
          ...(r.botoes ? { reply_markup: { inline_keyboard: [r.botoes.map((b) => ({ text: b.texto, callback_data: b.dados }))] } } : {}),
        });
        log.info('Comando do Telegram', { comando: texto.split(/\s/)[0] });
      } catch (err) {
        log.error('Falha ao executar comando', { err });
        await telegram('sendMessage', { chat_id: dono, text: 'Deu erro ao executar. Veja o log no servidor.' }).catch(() => undefined);
      }
    }
  }
}

main().catch((err: unknown) => {
  log.error('telegram:bot falhou', { err });
  process.exitCode = 1;
});
