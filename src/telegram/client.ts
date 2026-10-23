import { requireEnv } from '../config/env.js';

const API = 'https://api.telegram.org';

// Minimal Telegram Bot API client. The token never goes to logs (it is part of the URL only).
export async function telegram<T = unknown>(method: string, body: Record<string, unknown> = {}, fetchFn: typeof fetch = fetch): Promise<T> {
  const token = requireEnv('TELEGRAM_BOT_TOKEN');
  const res = await fetchFn(`${API}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; result?: T; description?: string };
  if (!json.ok) throw new Error(`Telegram ${method} falhou: ${json.description ?? res.status}`);
  return json.result as T;
}

export async function sendMessage(chatId: string, text: string): Promise<void> {
  await telegram('sendMessage', { chat_id: chatId, text });
}

export interface Botao { texto: string; dados: string }

export async function sendMessageWithButtons(chatId: string, text: string, botoes: Botao[][]): Promise<void> {
  await telegram('sendMessage', {
    chat_id: chatId, text,
    reply_markup: { inline_keyboard: botoes.map((linha) => linha.map((b) => ({ text: b.texto, callback_data: b.dados }))) },
  });
}

// Uploads a local image (multipart, as the Bot API requires for files).
export async function sendPhoto(chatId: string, png: Buffer, caption = ''): Promise<void> {
  const token = requireEnv('TELEGRAM_BOT_TOKEN');
  const form = new FormData();
  form.append('chat_id', chatId);
  if (caption) form.append('caption', caption.slice(0, 1000));
  form.append('photo', new Blob([new Uint8Array(png)], { type: 'image/png' }), 'esboco.png');
  const res = await fetch(`${API}/bot${token}/sendPhoto`, { method: 'POST', body: form });
  const json = (await res.json()) as { ok: boolean; description?: string };
  if (!json.ok) throw new Error(`Telegram sendPhoto falhou: ${json.description ?? res.status}`);
}

// Sends a local file (reports in out/*.md) as a Telegram document.
export async function sendDocument(chatId: string, conteudo: Buffer, nome: string, caption = ''): Promise<void> {
  const token = requireEnv('TELEGRAM_BOT_TOKEN');
  const form = new FormData();
  form.append('chat_id', chatId);
  if (caption) form.append('caption', caption.slice(0, 1000));
  form.append('document', new Blob([new Uint8Array(conteudo)], { type: 'text/markdown' }), nome);
  const res = await fetch(`${API}/bot${token}/sendDocument`, { method: 'POST', body: form });
  const json = (await res.json()) as { ok: boolean; description?: string };
  if (!json.ok) throw new Error(`Telegram sendDocument falhou: ${json.description ?? res.status}`);
}
