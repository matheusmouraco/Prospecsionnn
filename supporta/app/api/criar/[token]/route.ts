import { NextResponse } from "next/server";
import { getSiteByToken } from "@/lib/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Situação do site para a tela de espera e para o checkout (quem tem o token é o dono do pedido). */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{20,40}$/.test(token)) return NextResponse.json({ error: "Link inválido." }, { status: 404 });
  const site = await getSiteByToken(token);
  if (!site) return NextResponse.json({ error: "Site não encontrado." }, { status: 404 });
  return NextResponse.json(
    {
      status: site.status,
      empresa: site.empresa,
      slug: site.slug,
      plano: site.plano,
      previa: ["previa", "pago", "publicando", "no_ar", "ajuste_no_ar", "ajustando_no_ar"].includes(site.status) ? `/previa/${site.token}` : null,
      endereco: ["no_ar", "ajuste_no_ar", "ajustando_no_ar"].includes(site.status) ? (site.dominio ? `https://${site.dominio}` : `https://${site.slug}.supporta.com.br`) : null,
      contato: { nome: site.contato_nome, email: site.contato_email, whatsapp: site.contato_whatsapp },
      criadoEm: site.criado_em,
    },
    { headers: { "cache-control": "no-store", "x-robots-tag": "noindex" } },
  );
}
