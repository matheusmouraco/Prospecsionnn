import { cookies } from "next/headers";
import { isDemo } from "@/lib/ai/providers";
import { serverEnv } from "@/lib/server/env";
import { ACCESS_COOKIE, accessToken, hasAccess } from "@/lib/server/guard";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ required: Boolean(serverEnv().accessPassword), ok: await hasAccess(), demo: isDemo() });
}

export async function POST(req: Request) {
  const { accessPassword } = serverEnv();
  const body = (await req.json().catch(() => null)) as { senha?: string } | null;
  if (!accessPassword) return Response.json({ ok: true });
  if (body?.senha !== accessPassword) {
    await new Promise((r) => setTimeout(r, 600));
    return Response.json({ ok: false, error: "Senha incorreta." }, { status: 401 });
  }
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, accessToken(accessPassword), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30, path: "/" });
  return Response.json({ ok: true });
}
