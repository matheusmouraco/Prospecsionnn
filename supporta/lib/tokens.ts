import { createHmac, timingSafeEqual } from "node:crypto";

// Tokens assinados (HMAC) para links de briefing e acesso à área do cliente. Sem tabela de sessão.

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.VERCEL_ENV === "production") throw new Error("SESSION_SECRET ausente ou curto (mínimo 32 caracteres).");
    return "dev-only-secret-change-me-dev-only-secret";
  }
  return s;
}

const b64 = (buf: Buffer | string) => Buffer.from(buf).toString("base64url");

export function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function verifySignature(value: string, signature: string) {
  const expected = Buffer.from(sign(value));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Token com dados e validade: base64url(json).assinatura */
export function createToken(payload: Record<string, unknown>, ttlSeconds: number) {
  const body = b64(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds }));
  return `${body}.${sign(body)}`;
}

export function readToken<T extends Record<string, unknown>>(token: string | undefined | null): T | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature || !verifySignature(body, signature)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof data.exp !== "number" || data.exp < Date.now() / 1000) return null;
    return data as T;
  } catch {
    return null;
  }
}

/** Assinatura do link do briefing (a referência da assinatura já é um UUID aleatório). */
export const briefingSignature = (reference: string) => sign(`briefing:${reference}`).slice(0, 24);
export const isBriefingSignature = (reference: string, sig: string) => briefingSignature(reference) === sig;
