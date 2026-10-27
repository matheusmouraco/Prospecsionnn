import { NextResponse } from "next/server";
import { notifyTeam, sendEmail } from "@/lib/email/send";
import { briefingReceivedEmail } from "@/lib/email/templates";
import { sendToWebhook } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { findSubscription, saveBriefing, updateClientFromBriefing } from "@/lib/repo";
import { segments } from "@/lib/segments";
import { site } from "@/lib/site";
import { isBriefingSignature } from "@/lib/tokens";

export const runtime = "nodejs";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown, maxItems: number, maxLen: number) => (Array.isArray(v) ? v.map((x) => str(x, maxLen)).filter(Boolean).slice(0, maxItems) : []);

/** Perguntas iniciais para o monitoramento de citações: o que um cliente perguntaria a uma IA. */
function defaultQuestions(segmento: string, cidade: string, servicos: string[]) {
  const seg = segments.find((s) => s.slug === segmento);
  const onde = cidade ? ` em ${cidade}` : "";
  const prof = seg?.professional ?? "empresa";
  const qs = [`Qual ${prof} você indica${onde}?`, ...servicos.slice(0, 3).map((s) => `Onde encontrar ${s.toLowerCase()}${onde}?`)];
  return qs.slice(0, 5);
}

export async function POST(request: Request) {
  if (!rateLimit(`briefing:${clientIp(request.headers)}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Muitos envios. Tente mais tarde." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const ref = String(body?.ref ?? "");
  if (!/^sup_[0-9a-f-]{36}$/.test(ref) || !isBriefingSignature(ref, String(body?.t ?? ""))) {
    return NextResponse.json({ error: "Link do briefing inválido." }, { status: 403 });
  }

  const r = body?.respostas ?? {};
  const respostas = {
    nomeFantasia: str(r.nomeFantasia, 120),
    slogan: str(r.slogan, 160),
    historia: str(r.historia, 2000),
    diferenciais: list(r.diferenciais, 6, 200),
    servicos: (Array.isArray(r.servicos) ? r.servicos : []).slice(0, 10).map((s: { nome?: unknown; descricao?: unknown }) => ({ nome: str(s?.nome, 100), descricao: str(s?.descricao, 400) })).filter((s: { nome: string }) => s.nome),
    publico: str(r.publico, 600),
    tom: str(r.tom, 40),
    perguntas: list(r.perguntas, 8, 300),
    endereco: str(r.endereco, 300),
    cidade: str(r.cidade, 120),
    horario: str(r.horario, 300),
    telefone: str(r.telefone, 40),
    whatsapp: str(r.whatsapp, 40),
    instagram: str(r.instagram, 200),
    mapa: str(r.mapa, 400),
    dominio: str(r.dominio, 120),
    temDominio: str(r.temDominio, 10),
    cores: str(r.cores, 200),
    referencias: str(r.referencias, 600),
    observacoes: str(r.observacoes, 2000),
  };
  if (!respostas.nomeFantasia || respostas.servicos.length === 0) {
    return NextResponse.json({ error: "Preencha pelo menos o nome da empresa e um serviço." }, { status: 400 });
  }
  const arquivos = (Array.isArray(body?.arquivos) ? body.arquivos : [])
    .slice(0, 20)
    .map((a: { path?: unknown; nome?: unknown; kind?: unknown }) => ({ path: str(a?.path, 200), nome: str(a?.nome, 200), kind: a?.kind === "logo" ? "logo" : "foto" }))
    .filter((a: { path: string }) => a.path.startsWith(`${ref}/`));

  const assinatura = await findSubscription({ referencia: ref });
  if (assinatura) {
    await saveBriefing(assinatura.id, respostas, arquivos);
    const segmento = String(assinatura.briefing_inicial.segmento ?? "");
    const dominio = respostas.dominio.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    await updateClientFromBriefing(assinatura.id, {
      siteUrl: dominio ? `https://${dominio}` : undefined,
      cidade: respostas.cidade || undefined,
      nomes: [respostas.nomeFantasia, dominio].filter(Boolean),
      perguntas: defaultQuestions(segmento, respostas.cidade || String(assinatura.briefing_inicial.cidade ?? ""), respostas.servicos.map((s: { nome: string }) => s.nome)),
    });
    await sendEmail({ to: assinatura.email, ...briefingReceivedEmail(assinatura.responsavel.split(" ")[0], site.deliveryDays[assinatura.plano]) });
    await notifyTeam(`Briefing recebido: ${respostas.nomeFantasia}`, [
      `Assinatura ${ref} · plano ${assinatura.plano}`,
      `${respostas.servicos.length} serviços, ${arquivos.length} arquivos`,
      "Veja no painel: /admin",
    ]);
  }
  await sendToWebhook("briefing", { referencia: ref, respostas, arquivos });
  return NextResponse.json({ ok: true });
}
