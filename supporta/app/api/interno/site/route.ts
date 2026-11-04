import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { notifyTeam, sendEmail } from "@/lib/email/send";
import { noticeEmail } from "@/lib/email/templates";
import { tryDb } from "@/lib/db";
import { getSiteByToken } from "@/lib/repo";
import { absoluteUrl } from "@/lib/site";

export const runtime = "nodejs";

function autorizado(request: Request) {
  const secret = process.env.SUPPORTA_WORKER_SECRET ?? "";
  const given = (request.headers.get("authorization") ?? "").replace(/^Bearer /, "");
  return secret.length >= 24 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

/**
 * Avisos do gerador do VPS: prévia pronta, site no ar ou falha.
 * Manda o e-mail certo ao cliente e, quando publica, atualiza a área do cliente.
 */
export async function POST(request: Request) {
  if (!autorizado(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const site = await getSiteByToken(String(body?.token ?? ""));
  if (!site) return NextResponse.json({ error: "Site não encontrado." }, { status: 404 });
  const nome = site.contato_nome.split(" ")[0];
  const link = absoluteUrl(`/criar/${site.token}`);

  if (body?.evento === "previa") {
    await sendEmail({
      to: site.contato_email,
      ...noticeEmail("Seu site ficou pronto", [`Oi, ${nome}. A IA terminou o site da ${site.empresa}.`, "Abra para ver no computador e no celular. Se gostar, escolha o plano e ele vai ao ar em minutos."], undefined, { label: "Ver o meu site", href: link }),
    });
  } else if (body?.evento === "no_ar") {
    const endereco = site.dominio ? `https://${site.dominio}` : `https://${site.slug}.supporta.com.br`;
    if (site.assinatura_id) {
      await tryDb("sitePublicado", (sql) => sql`
        update clientes set etapa = 'publicado', site_url = ${endereco}, publicado_em = coalesce(publicado_em, now()),
          nomes_busca = (select array(select distinct unnest(nomes_busca || ${[site.empresa, `${site.slug}.supporta.com.br`]}::text[])))
        where assinatura_id = ${site.assinatura_id}`);
    }
    await sendEmail({
      to: site.contato_email,
      ...noticeEmail("Seu site está no ar", [
        `Oi, ${nome}. O site da ${site.empresa} está publicado: ${endereco}`,
        "Para usar o seu próprio domínio (.com.br), é só chamar a gente no WhatsApp que a gente aponta para o mesmo site.",
        "Ajustes você pede pela área do cliente.",
      ], undefined, { label: "Abrir o meu site", href: endereco }),
    });
    await notifyTeam(`Site no ar: ${site.empresa}`, [endereco, `Plano ${site.plano} · ${site.contato_email} · ${site.contato_whatsapp}`]);
  } else if (body?.evento === "erro") {
    await notifyTeam(`Gerador falhou: ${site.empresa}`, [String(body?.detalhe ?? "").slice(0, 500), link]);
  } else {
    return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
