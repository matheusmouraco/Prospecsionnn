import { cookies } from "next/headers";
import { getClient, type Cliente } from "./repo";
import { createToken, readToken } from "./tokens";

export const SESSION_COOKIE = "supporta_sessao";
const SESSION_DAYS = 30;

export function sessionCookie(clienteId: string) {
  return {
    name: SESSION_COOKIE,
    value: createToken({ cid: clienteId, kind: "sessao" }, SESSION_DAYS * 86400),
    options: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: SESSION_DAYS * 86400 },
  };
}

export const loginToken = (clienteId: string) => createToken({ cid: clienteId, kind: "login" }, 20 * 60);

export function readLoginToken(token: string | null) {
  const data = readToken<{ cid: string; kind: string }>(token);
  return data?.kind === "login" ? data.cid : null;
}

/** Cliente da sessão atual, ou null. */
export async function currentClient(): Promise<Cliente | null> {
  const store = await cookies();
  const data = readToken<{ cid: string; kind: string }>(store.get(SESSION_COOKIE)?.value);
  if (data?.kind !== "sessao") return null;
  const client = await getClient(data.cid);
  return client?.ativo ? client : null;
}
