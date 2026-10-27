// Envia leads e eventos para o CRM/WhatsApp via webhook ([WEBHOOK_URL]). Nunca derruba o fluxo do usuário.
export async function sendToWebhook(type: string, payload: Record<string, unknown>) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) {
    console.warn(`[leads] LEAD_WEBHOOK_URL não configurada; evento "${type}" não enviado.`);
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.LEAD_WEBHOOK_SECRET ? { "x-webhook-secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({ ...payload, type, sentAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[leads] webhook respondeu ${res.status} para "${type}".`);
    return res.ok;
  } catch (err) {
    console.error(`[leads] falha ao enviar "${type}":`, (err as Error).message);
    return false;
  }
}

export function isEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}
