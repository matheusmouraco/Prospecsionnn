import { comSelo } from "@/lib/selo";
import { getSiteByToken, getSitePage } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BADGE = `<div id="supporta-previa" style="position:fixed;left:12px;bottom:12px;z-index:2147483647;padding:8px 14px;border-radius:999px;background:#0B0B0F;color:#F5F5F2;font:500 13px/1.2 Inter,Helvetica,Arial,sans-serif;box-shadow:0 0 0 1px rgba(255,61,113,.6),0 0 18px rgba(255,61,113,.3)">Prévia do seu site · <strong style="color:#fff">Supporta</strong></div>`;

/** Prévia da home montada pela IA: fora do Google, com um selo de prévia no canto. */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const site = /^[A-Za-z0-9_-]{20,40}$/.test(token) ? await getSiteByToken(token) : null;
  const page = site && site.status !== "cancelado" ? await getSitePage(site.id, "/") : null;
  if (!page) {
    return new Response("Prévia ainda não está pronta.", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex, nofollow" } });
  }
  const html = comSelo(page.html).replace(/<\/body>/i, `${BADGE}</body>`);
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex, nofollow", "cache-control": "private, no-store" },
  });
}
