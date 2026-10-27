// Acesso ao painel interno por HTTP Basic (ADMIN_USER / ADMIN_PASSWORD). Sem senha configurada, o painel fica fechado.

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isAdminAuthorization(header: string | null) {
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass || pass.length < 12 || !header?.startsWith("Basic ")) return false;
  try {
    return safeEqual(atob(header.slice(6)), `${user}:${pass}`);
  } catch {
    return false;
  }
}
