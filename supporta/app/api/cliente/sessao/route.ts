import { NextResponse, type NextRequest } from "next/server";
import { getClient } from "@/lib/repo";
import { readLoginToken, sessionCookie } from "@/lib/session";

export const runtime = "nodejs";

/** Link do e-mail: troca o token de 20 minutos por uma sessão de 30 dias. */
export async function GET(request: NextRequest) {
  const cid = readLoginToken(request.nextUrl.searchParams.get("token"));
  const client = cid ? await getClient(cid) : null;
  if (!client?.ativo) return NextResponse.redirect(new URL("/cliente/entrar?erro=link", request.url));
  const res = NextResponse.redirect(new URL("/cliente", request.url));
  const cookie = sessionCookie(client.id);
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
