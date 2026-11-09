import { comSelo, donoDoSite } from "@/lib/selo";
import { getLiveSiteByHost, getSitePage, listSitePages, type Site } from "@/lib/repo";

export const runtime = "nodejs";

const cache = { "cache-control": "public, s-maxage=300, stale-while-revalidate=86400" };

/** Subdomínio (nome.supporta.com.br, ou nome.localhost no teste local) ou domínio próprio. */
function hostKey(host: string) {
  const m = host.match(/^([a-z0-9-]+)\.(supporta\.com\.br|localhost)$/);
  return m ? { slug: m[1] } : { dominio: host.replace(/^www\./, "") };
}

function textFile(body: string, type = "text/plain") {
  return new Response(body, { headers: { "content-type": `${type}; charset=utf-8`, ...cache } });
}

function notFound() {
  return new Response("<!doctype html><meta charset=utf-8><title>Site não encontrado</title><p style=\"font:16px system-ui;padding:40px\">Este site não está no ar.</p>", {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
  });
}

async function extras(site: Site, base: string, file: string) {
  const pages = (await listSitePages(site.id)) ?? [];
  if (file === "robots.txt") return textFile(`User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
  if (file === "sitemap.xml") {
    const urls = pages.map((p) => `<url><loc>${base}${p.caminho === "/" ? "/" : p.caminho}</loc><lastmod>${new Date(p.atualizado_em).toISOString().slice(0, 10)}</lastmod></url>`).join("");
    return textFile(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, "application/xml");
  }
  // llms.txt: resumo do negócio para as IAs, montado das respostas do criador.
  const r = site.respostas as Record<string, unknown>;
  const servicos = Array.isArray(r.servicos) ? (r.servicos as string[]) : [];
  const linhas = [
    `# ${site.empresa}`,
    "",
    `> ${String(r.frase ?? "")}`,
    "",
    r.cidade ? `Atende em: ${r.cidade}` : "",
    r.endereco ? `Endereço: ${r.endereco}` : "",
    r.horario ? `Horário: ${r.horario}` : "",
    r.whatsappSite ? `WhatsApp: https://wa.me/55${String(r.whatsappSite).replace(/\D/g, "")}` : "",
    "",
    servicos.length ? "## Serviços" : "",
    ...servicos.map((s) => `- ${s}`),
    "",
    "## Páginas",
    ...pages.map((p) => `- [${p.titulo || p.caminho}](${base}${p.caminho})`),
  ];
  return textFile(linhas.filter((l, i, a) => l || a[i - 1]).join("\n"));
}

export async function GET(_request: Request, { params }: { params: Promise<{ host: string; caminho?: string[] }> }) {
  const { host, caminho = [] } = await params;
  const site = await getLiveSiteByHost(hostKey(decodeURIComponent(host)));
  if (!site) return notFound();
  const base = site.dominio ? `https://${site.dominio}` : `https://${site.slug}.supporta.com.br`;
  const path = `/${caminho.join("/")}`.replace(/\/+$/, "") || "/";
  if (["/robots.txt", "/sitemap.xml", "/llms.txt"].includes(path)) return extras(site, base, path.slice(1));
  const page = await getSitePage(site.id, path);
  if (!page) return notFound();
  // Site publicado vai para o Google: tira o noindex que só vale para a prévia.
  const html = comSelo(page.html.replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, ""), donoDoSite(site));
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", ...cache } });
}
