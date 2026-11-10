import "server-only";
import { createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { serverEnv } from "./env";

export const ACCESS_COOKIE = "render_acesso";

export function accessToken(password: string): string {
  return createHash("sha256").update(`render:${password}`).digest("hex");
}

/** True when no password is configured or the visitor has the right cookie. */
export async function hasAccess(): Promise<boolean> {
  const { accessPassword } = serverEnv();
  if (!accessPassword) return true;
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value === accessToken(accessPassword);
}

const hits = new Map<string, number[]>();

/**
 * Best-effort per-IP hourly limit (in memory, per server instance). Stage 3
 * replaces this with per-user credits and limits stored in the database.
 */
export async function rateLimit(cost = 1): Promise<boolean> {
  const { maxRendersPerHour } = serverEnv();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  if (list.length + cost > maxRendersPerHour) {
    hits.set(ip, list);
    return false;
  }
  for (let i = 0; i < cost; i++) list.push(now);
  hits.set(ip, list);
  return true;
}
