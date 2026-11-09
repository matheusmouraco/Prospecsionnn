import { randomUUID } from "node:crypto";
import { ramos } from "@/lib/criador";
import { getPaymentProvider } from "@/lib/payments";
import { chargesFor, getPlan } from "@/lib/plans";
import { createSubscription, setProviderIds, setSitePlan, setSubscriptionStatus, type Site } from "@/lib/repo";
import { absoluteUrl, site as supporta, termsAcceptanceText } from "@/lib/site";
import { briefingSignature } from "@/lib/tokens";

/** Abre o pagamento do site pelo WhatsApp (mesma assinatura do checkout do site) e devolve o link para mandar ao cliente. */
export async function linkPagamento(input: { site: Site; nome: string; email: string; documento: string; telefone: string; dominio: boolean }) {
  const plan = getPlan("pro")!;
  const { hoje, anual } = chargesFor(input.dominio);
  const r = input.site.respostas as Record<string, unknown>;
  const customer = { company: input.site.empresa, name: input.nome, email: input.email, phone: input.telefone.replace(/^55/, ""), cpfCnpj: input.documento };
  const briefing = {
    segmento: ramos.find((x) => x.slug === r.ramo)?.segmento ?? "outro",
    cidade: String(r.cidade ?? ""),
    siteAtual: String(r.siteAtual ?? ""),
    servicos: (Array.isArray(r.servicos) ? r.servicos : []).join(", "),
    objetivo: String(r.objetivo ?? ""),
    temLogo: r.logo ? "sim" : "nao",
    observacoes: `Site criado pelo WhatsApp (${input.site.slug}.supporta.com.br)`,
  };
  // O aceite vale pela mensagem: o robô manda os Termos junto com o link e o pagamento confirma.
  const acceptance = {
    text: `${termsAcceptanceText} (enviado no WhatsApp junto com o link de pagamento)`,
    termsVersion: supporta.termsVersion,
    termsUrl: absoluteUrl("/termos"),
    acceptedAt: new Date().toISOString(),
    ip: "whatsapp",
    userAgent: `whatsapp:${input.telefone}`,
  };
  const reference = `sup_${randomUUID()}`;
  const thanks = `/obrigado?plano=${plan.id}&ref=${reference}&t=${briefingSignature(reference)}`;
  const provider = getPaymentProvider();
  const testMode = !provider && process.env.VERCEL_ENV !== "production";
  if (!provider && !testMode) throw new Error("Nenhum provedor de pagamento configurado.");

  const id = await createSubscription({
    referencia: reference,
    plano: plan.id,
    ciclo: "anual",
    valor: hoje,
    status: testMode ? "teste" : "aguardando_pagamento",
    provedor: provider?.name ?? "teste",
    customer,
    briefing,
    origem: { origem: "whatsapp", site: input.site.slug, modelo: "" },
    modelo: null,
    siteId: input.site.id,
    dominioProprio: input.dominio,
    valorAnual: anual,
    aceite: acceptance,
  });
  if (!id) throw new Error("Banco indisponível.");
  await setSitePlan(input.site.id, plan.id);
  if (!provider) return { url: absoluteUrl(`${thanks}&teste=1`), hoje, anual };

  // Se o provedor recusar, a assinatura criada aqui não fica "aguardando pagamento" para sempre.
  const result = await provider.createSubscriptionCheckout({
    plan,
    dominio: input.dominio,
    hoje,
    anual,
    customer,
    reference,
    successUrl: absoluteUrl(thanks),
    cancelUrl: absoluteUrl(`/planos?cancelado=1`),
    remoteIp: "",
    metadata: { aceite_em: acceptance.acceptedAt, aceite_canal: "whatsapp", termos_versao: acceptance.termsVersion },
  }).catch(async (err) => {
    await setSubscriptionStatus(id, "cancelada");
    throw err;
  });
  await setProviderIds(reference, { customerId: result.providerCustomerId, subscriptionId: result.providerSubscriptionId });
  return { url: result.redirectUrl, hoje, anual };
}
