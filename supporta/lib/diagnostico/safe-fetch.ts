import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// Proteção contra SSRF: só busca hosts públicos, revalidando a cada redirecionamento.

function isPrivateIPv4(ip: string) {
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19)) || a >= 224
  );
}

function isPrivateIp(ip: string) {
  if (isIP(ip) === 4) return isPrivateIPv4(ip);
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateIPv4(v6.slice(7));
  return v6 === "::" || v6 === "::1" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe8") || v6.startsWith("fe9") || v6.startsWith("fea") || v6.startsWith("feb");
}

export function normalizeUrl(input: string) {
  let raw = input.trim();
  if (!raw || raw.length > 300) return null;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (url.username || url.password) return null;
    if (url.port && !["80", "443"].includes(url.port)) return null;
    if (!url.hostname.includes(".") || isIP(url.hostname)) return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

async function assertPublicHost(hostname: string) {
  const addresses = await lookup(hostname, { all: true });
  if (!addresses.length || addresses.some((a) => isPrivateIp(a.address))) {
    throw new Error("Endereço não permitido.");
  }
}

export async function safeFetch(url: URL, { maxBytes = 1_500_000, timeoutMs = 10_000 } = {}) {
  let current = url;
  for (let hop = 0; hop < 4; hop++) {
    await assertPublicHost(current.hostname);
    const res = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "user-agent": "SupportaDiagnostico/1.0 (+https://supporta.com.br/diagnostico)", accept: "text/html,text/plain,*/*" },
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      const next = new URL(res.headers.get("location")!, current);
      if (!["http:", "https:"].includes(next.protocol)) throw new Error("Redirecionamento inválido.");
      current = next;
      continue;
    }
    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) {
          await reader.cancel();
          break;
        }
        chunks.push(value);
      }
    }
    const text = new TextDecoder().decode(Buffer.concat(chunks));
    return { status: res.status, finalUrl: current, contentType: res.headers.get("content-type") ?? "", text };
  }
  throw new Error("Redirecionamentos demais.");
}
