import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isCpfOrCnpj, onlyDigits } from "@/lib/documents";
import { isEmail, sendToWebhook } from "@/lib/leads";
import { getPaymentProvider } from "@/lib/payments";
import { getPlan } from "@/lib/plans";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createSubscription, setProviderIds } from "@/lib/repo";
import { briefingSignature } from "@/lib/tokens";
import { absoluteUrl, site, termsAcceptanceText } from "@/lib/site";

export const runtime = "nodejs";

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  if (!rateLimit(`checkout:${ip}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um pouco ou fale com a gente no WhatsApp." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const plan = getPlan(str(body?.plan, 20));
  if (!plan) return NextResponse.json({ error: "Plano inválido." }, { status: 400 });

  const customer = {
    company: str(body?.company?.empresa, 120),
    name: str(body?.company?.responsavel, 120),
    email: str(body?.company?.email, 200),
    phone: onlyDigits(str(body?.company?.whatsapp, 30)),
    cpfCnpj: onlyDigits(str(body?.company?.documento, 30)),
  };
  const errors: string[] = [];
  if (customer.company.length < 2) errors.push("nome da empresa");
  if (customer.name.length < 2) errors.push("nome do responsável");
  if (!isEmail(customer.email)) errors.push("e-mail");
  if (customer.phone.length < 10 || customer.phone.length > 13) errors.push("WhatsApp");
  if (!isCpfOrCnpj(customer.cpfCnpj)) errors.push("CPF ou CNPJ");
  if (body?.aceite !== true) errors.push("aceite dos Termos");
  if (errors.length) return NextResponse.json({ error: `Confira: ${errors.join(", ")}.` }, { status: 400 });

  const briefing = {
    segmento: str(body?.briefing?.segmento, 60),
    cidade: str(body?.briefing?.cidade, 120),
    siteAtual: str(body?.briefing?.siteAtual, 200),
    servicos: str(body?.briefing?.servicos, 1500),
    objetivo: str(body?.briefing?.objetivo, 60),
    temLogo: str(body?.briefing?.temLogo, 10),
    observacoes: str(body?.briefing?.observacoes, 1500),
  };

  // Registro do aceite: data, hora, IP e versão dos Termos. Vai para o CRM e para os metadados do provedor.
  const acceptance = {
    text: termsAcceptanceText,
    termsVersion: site.termsVersion,
    termsUrl: absoluteUrl("/termos"),
    acceptedAt: new Date().toISOString(),
    ip,
    userAgent: str(request.headers.get("user-agent"), 300),
  };

  const origem = {
    origem: str(body?.origem?.origem, 60),
    site: str(body?.origem?.site, 120),
    modelo: str(body?.origem?.modelo, 40),
  };

  const reference = `sup_${randomUUID()}`;
  const thanks = `/obrigado?plano=${plan.id}&ref=${reference}&t=${briefingSignature(reference)}`;
  const successUrl = absoluteUrl(thanks);
  const cancelUrl = absoluteUrl(`/assinar/${plan.id}?cancelado=1`);

  const provider = getPaymentProvider();
  const record = { reference, plan: plan.id, price: plan.price, customer, briefing, acceptance, origem, provider: provider?.name ?? "teste" };
  const testMode = !provider && process.env.VERCEL_ENV !== "production";
  await createSubscription({
    referencia: reference,
    plano: plan.id,
    valor: plan.price,
    status: testMode ? "teste" : "aguardando_pagamento",
    provedor: provider?.name ?? "teste",
    customer,
    briefing,
    origem,
    aceite: acceptance,
  });

  if (!provider) {
    if (process.env.VERCEL_ENV === "production") {
      console.error("[checkout] nenhum provedor de pagamento configurado em produção.");
      await sendToWebhook("assinatura_sem_pagamento", record);
      return NextResponse.json({ error: "O pagamento está indisponível agora. Recebemos seus dados e vamos chamar você no WhatsApp." }, { status: 503 });
    }
    await sendToWebhook("assinatura_teste", record);
    return NextResponse.json({ redirectUrl: `${thanks}&teste=1` });
  }

  try {
    const result = await provider.createSubscriptionCheckout({
      plan,
      customer,
      reference,
      successUrl,
      cancelUrl,
      remoteIp: ip,
      metadata: { aceite_em: acceptance.acceptedAt, aceite_ip: ip, termos_versao: acceptance.termsVersion },
    });
    await setProviderIds(reference, { customerId: result.providerCustomerId, subscriptionId: result.providerSubscriptionId });
    await sendToWebhook("assinatura_iniciada", { ...record, providerCustomerId: result.providerCustomerId, providerSubscriptionId: result.providerSubscriptionId });
    return NextResponse.json({ redirectUrl: result.redirectUrl });
  } catch (err) {
    console.error("[checkout]", (err as Error).message);
    await sendToWebhook("assinatura_erro", { ...record, error: (err as Error).message });
    return NextResponse.json({ error: "Não conseguimos abrir o pagamento agora. Tente de novo em instantes ou fale com a gente no WhatsApp." }, { status: 502 });
  }
}
