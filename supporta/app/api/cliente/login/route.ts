import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { loginEmail } from "@/lib/email/templates";
import { isEmail } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getClientByEmail } from "@/lib/repo";
import { loginToken } from "@/lib/session";
import { absoluteUrl } from "@/lib/site";

export const runtime = "nodejs";

// Sempre responde a mesma coisa, exista ou não o e-mail (não revela quem é cliente).
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  if (!rateLimit(`login:${ip}`, 8, 60 * 60 * 1000).ok) return NextResponse.json({ error: "Muitas tentativas. Tente mais tarde." }, { status: 429 });
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) return NextResponse.json({ error: "Digite um e-mail válido." }, { status: 400 });
  if (rateLimit(`login-email:${email}`, 4, 60 * 60 * 1000).ok) {
    const client = await getClientByEmail(email);
    if (client) await sendEmail({ to: client.email, ...loginEmail(absoluteUrl(`/api/cliente/sessao?token=${encodeURIComponent(loginToken(client.id))}`)) });
  }
  return NextResponse.json({ ok: true });
}
