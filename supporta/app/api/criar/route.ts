import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { parseContato, parseRespostas, planoValido, slugify, slugsReservados } from "@/lib/criador";
import { notifyTeam } from "@/lib/email/send";
import { sendToWebhook } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createSite, findSiteByContact, slugTaken } from "@/lib/repo";

export const runtime = "nodejs";

/** Subdomínio livre: o nome do negócio, e se já existir, com um número no fim. */
async function freeSlug(empresa: string) {
  const base = slugify(empresa);
  for (let i = 0; i < 20; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    if (slugsReservados.has(slug)) continue;
    const taken = await slugTaken(slug);
    if (taken === null) throw new Error("banco indisponível");
    if (!taken) return slug;
  }
  return `${base}-${randomBytes(2).toString("hex")}`;
}

/** Fim do jogo: grava as respostas e coloca o site na fila do gerador. Um site por e-mail ou WhatsApp. */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  if (!rateLimit(`criar:${ip}`, 4, 24 * 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Muitos sites criados deste aparelho hoje. Fale com a gente no WhatsApp." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const { respostas, faltando } = parseRespostas(body?.respostas);
  const { contato, faltando: faltaContato } = parseContato(body?.contato);
  const falta = [...faltando, ...faltaContato];
  if (falta.length) return NextResponse.json({ error: `Falta: ${falta.join(", ")}.` }, { status: 400 });

  const existente = await findSiteByContact(contato.email, contato.whatsapp);
  if (existente) return NextResponse.json({ token: existente.token, existente: true });

  try {
    const site = await createSite({
      token: randomBytes(18).toString("base64url"),
      slug: await freeSlug(respostas.empresa),
      plano: planoValido(body?.plano),
      empresa: respostas.empresa,
      contato,
      respostas,
      ip,
    });
    if (!site) throw new Error("banco indisponível");
    await Promise.all([
      notifyTeam(`Site novo no criador: ${site.empresa}`, [`${contato.nome} · ${contato.email} · ${contato.whatsapp}`, `Ramo: ${respostas.ramo} · ${respostas.cidade}`, "A IA está montando a prévia."]),
      sendToWebhook("site_criado", { empresa: site.empresa, slug: site.slug, plano: site.plano, contato, ramo: respostas.ramo, cidade: respostas.cidade }),
    ]);
    return NextResponse.json({ token: site.token });
  } catch (err) {
    console.error("[criar]", (err as Error).message);
    return NextResponse.json({ error: "Não conseguimos começar agora. Tente de novo em instantes ou fale com a gente no WhatsApp." }, { status: 503 });
  }
}
