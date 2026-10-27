// Envio de e-mail transacional pela API REST do Resend. Sem chave, só registra no log e devolve false.

export type Mail = { to: string | string[]; subject: string; html: string; text: string; replyTo?: string };

export async function sendEmail(mail: Mail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.warn(`[email] RESEND_API_KEY/EMAIL_FROM não configurados; "${mail.subject}" não enviado.`);
    return false;
  }
  try {
    const res = await fetch(`${process.env.RESEND_API_URL ?? "https://api.resend.com"}/emails`, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        reply_to: mail.replyTo ?? process.env.EMAIL_REPLY_TO ?? undefined,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error(`[email] Resend respondeu ${res.status} para "${mail.subject}".`);
    return res.ok;
  } catch (err) {
    console.error(`[email] falha ao enviar "${mail.subject}":`, (err as Error).message);
    return false;
  }
}

/** Aviso interno para a equipe (TEAM_EMAIL). */
export async function notifyTeam(subject: string, lines: string[]) {
  const to = process.env.TEAM_EMAIL;
  if (!to) return false;
  const { layout, p } = await import("./templates");
  return sendEmail({ to, subject: `[Supporta] ${subject}`, html: layout(subject, lines.map(p).join("")), text: lines.join("\n") });
}
