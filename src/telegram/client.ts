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
