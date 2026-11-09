import { tryDb } from "@/lib/db";
import { getSitePage, type Site } from "@/lib/repo";
import { botWhatsappUrl, site as supporta } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOINDEX = { "x-robots-tag": "noindex, nofollow", "cache-control": "private, no-store" };
const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Faixa fixa no rodapé da tela (no topo ela cobriria o menu fixo dos sites): deixa claro que é uma prévia e leva ao WhatsApp do robô para publicar ou ajustar. */
function faixa(s: Site) {
  const link = botWhatsappUrl(`Oi! Vi a prévia do site da ${s.empresa} (analise.supporta.com.br/${s.slug}) e quero publicar.`);
  return `<div id="supporta-faixa" style="position:fixed;bottom:0;left:0;right:0;z-index:2147483647;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 14px;padding:9px 16px;background:#0B0B0F;color:#F5F5F2;font:500 13px/1.35 Inter,Helvetica,Arial,sans-serif;text-align:center;box-shadow:0 -1px 0 rgba(255,61,113,.5)">
<span>Prévia criada pela <strong style="color:#fff">Supporta</strong> para ${esc(s.empresa)}. Ainda não publicada.</span>
<a href="${esc(link)}" target="_blank" rel="noopener" style="display:inline-block;padding:5px 12px;border-radius:999px;background:#FF3D71;color:#0B0B0F;font-weight:600;text-decoration:none">Publicar ou ajustar no WhatsApp</a>
</div><div aria-hidden="true" style="height:64px"></div>`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const partes = (await params).slug ?? [];
  if (!partes.length) return Response.redirect(supporta.url, 302);
  if (partes[0] === "robots.txt") {
    return new Response("User-agent: *\nDisallow: /\n", { headers: { "content-type": "text/plain; charset=utf-8", ...NOINDEX } });
  }
  const slug = partes[0].toLowerCase();
  const s = /^[a-z0-9-]{2,60}$/.test(slug)
    ? await tryDb("analise", async (sql) => (await sql<Site[]>`select * from sites where slug = ${slug} and status <> 'cancelado'`)[0] ?? null)
    : null;
  if (s?.status === "no_ar") return Response.redirect(s.dominio ? `https://${s.dominio}` : `https://${s.slug}.supporta.com.br`, 302);
  const page = s ? await getSitePage(s.id, "/") : null;
  if (!s || !page) {
    const msg = s ? "O site ainda está sendo montado. Volte em alguns minutos." : "Prévia não encontrada.";
    return new Response(`<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Supporta</title><body style="font:16px/1.5 Inter,Helvetica,Arial,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center"><p>${msg}<br><a href="${supporta.url}">supporta.com.br</a></p>`, {
      status: s ? 200 : 404,
      headers: { "content-type": "text/html; charset=utf-8", ...NOINDEX },
    });
  }
  // Antes do pagamento só a página inicial existe: links internos (/sobre, /servicos, #secao) ficam dentro da prévia.
  let html = page.html
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, "")
    .replace(/href=(["'])\/(?!\/)([^"'#]*)(#[^"']*)?\1/g, (_m, q: string, _p: string, hash = "") => `href=${q}/${s.slug}${hash}${q}`);
  html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => `${m}<meta name="robots" content="noindex, nofollow">`) : `<meta name="robots" content="noindex, nofollow">${html}`;
  html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${faixa(s)}</body>`) : html + faixa(s);
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", ...NOINDEX } });
}
