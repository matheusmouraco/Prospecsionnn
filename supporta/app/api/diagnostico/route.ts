import { NextResponse } from "next/server";
import { runChecks, type Check } from "@/lib/diagnostico/checks";
import { runPageSpeed, type PsiResult } from "@/lib/diagnostico/psi";
import { recommendations } from "@/lib/diagnostico/recommendations";
import { normalizeUrl } from "@/lib/diagnostico/safe-fetch";
import { isEmail, sendToWebhook } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`diag:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Você já fez vários diagnósticos na última hora. Tente de novo mais tarde ou fale com a gente no WhatsApp." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);
  const url = normalizeUrl(String(body?.url ?? ""));
  const email = body?.email;
  if (!url) return NextResponse.json({ error: "Digite um endereço de site válido, como seusite.com.br." }, { status: 400 });
  if (!isEmail(email)) return NextResponse.json({ error: "Digite um e-mail válido para receber o relatório." }, { status: 400 });
  if (body?.website) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 }); // honeypot

  const [psiResult, checksResult] = await Promise.allSettled([runPageSpeed(url.toString()), runChecks(url)]);
  const psi: PsiResult | null = psiResult.status === "fulfilled" ? psiResult.value : null;
  if (psiResult.status === "rejected") console.error("[diagnostico] PageSpeed:", (psiResult.reason as Error).message);
  if (checksResult.status === "rejected") {
    console.error("[diagnostico] checagens:", (checksResult.reason as Error).message);
  }
  const checks: Check[] = checksResult.status === "fulfilled" ? checksResult.value.checks : [];

  if (!psi && !checks.length) {
    return NextResponse.json({ error: "Não conseguimos acessar esse site. Confira o endereço e tente de novo." }, { status: 422 });
  }

  const report = {
    url: checksResult.status === "fulfilled" ? checksResult.value.finalUrl : url.toString(),
    scores: psi?.scores ?? null,
    lcpSeconds: psi?.lcpSeconds ?? null,
    checks,
    recommendations: recommendations(psi, checks),
  };

  await sendToWebhook("diagnostico", { email, ip, report });

  return NextResponse.json(report);
}
