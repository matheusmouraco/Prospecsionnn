import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdjustmentForm } from "@/components/cliente/AdjustmentForm";
import { CancelFlow } from "@/components/cliente/CancelFlow";
import { PlanChange } from "@/components/cliente/PlanChange";
import { PreviewReview } from "@/components/cliente/PreviewReview";
import { ProjectProgress } from "@/components/cliente/ProjectProgress";
import { buttonClass } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getPaymentProvider, type Invoice } from "@/lib/payments";
import { contractState, planChangeRule } from "@/lib/autoatendimento";
import { adjustmentsPerMonth, billing, getPlan, loyaltyPriceFor, plans, priceFor } from "@/lib/plans";
import { countAdjustmentsThisMonth, getSubscriptionById, latestCitations, latestVisitReports, listAdjustments, listRequests } from "@/lib/repo";
import { pageMetadata } from "@/lib/seo";
import { currentClient } from "@/lib/session";
import { absoluteUrl, formatBRLCents, site, whatsappUrl } from "@/lib/site";
import { briefingUrl } from "@/lib/subscriptions";
import { vitrine, vitrineThumb, vitrineUrl } from "@/lib/vitrine";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Área do cliente | Supporta",
  description: "Sua assinatura Supporta: ajustes, faturas e relatórios do site.",
  path: "/cliente",
  noindex: true,
});

const statusLabel: Record<string, string> = { aberto: "Na fila", em_andamento: "Em andamento", feito: "Feito" };
const invoiceLabel: Record<string, string> = {
  PENDING: "Em aberto", RECEIVED: "Paga", CONFIRMED: "Paga", OVERDUE: "Vencida", REFUNDED: "Estornada",
  paid: "Paga", open: "Em aberto", void: "Cancelada", uncollectible: "Não paga", draft: "Rascunho",
};
const date = (d: Date | string) => new Date(d).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
const month = (d: Date) => new Date(d).toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[2rem] border border-line bg-white p-6 md:p-8 ${className}`}>
      <h2 className="text-xl tracking-[-0.03em]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function ClientePage() {
  const client = await currentClient();
  if (!client) redirect("/cliente/entrar");

  const plan = getPlan(client.plano)!;
  const [assinatura, used, ajustes, visitas, citacoes, pedidos] = await Promise.all([
    getSubscriptionById(client.assinatura_id),
    countAdjustmentsThisMonth(client.id),
    listAdjustments(client.id),
    latestVisitReports(client.id),
    latestCitations(client.id),
    listRequests(client.id, 5),
  ]);
  const limit = adjustmentsPerMonth[client.plano];
  const remaining = limit === null ? null : Math.max(0, limit - (used ?? 0));

  // Situação do contrato: meses cobertos, multa se cancelar hoje, até quando está pago e desconto de quem continua.
  const contract = assinatura ? await contractState(assinatura, plan) : null;
  const cycle = assinatura?.ciclo ?? "mensal";
  const monthsCovered = contract?.monthsCovered ?? 0;
  const inMinimum = contract?.inMinimum ?? true;
  const feeToday = contract?.fee ?? 0;
  const chargeValue = assinatura ? Number(assinatura.valor) : plan.price;
  const per = cycle === "anual" ? "ano" : "mês";
  const brDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  const canceled = Boolean(assinatura?.cancelamento_pedido_em);
  const cancelPending = canceled ? false : (pedidos ?? []).some((r) => r.tipo === "cancelar" && r.status === "aberto");
  const planPending = (pedidos ?? []).find((r) => r.tipo === "mudar_plano" && r.status === "aberto");

  const planOptions = plans.map((p) => ({
    id: p.id,
    name: p.name,
    price: `${formatBRLCents(assinatura?.desconto_fidelidade_em ? loyaltyPriceFor(p, cycle) : priceFor(p, cycle))}/${per}`,
    pitch: p.pitch,
    rule: planChangeRule(client.plano, p.id, inMinimum),
  }));
  const cancelSummary = [
    !inMinimum
      ? "Sem multa: o prazo mínimo já foi cumprido."
      : cycle === "mensal"
        ? `Multa de ${formatBRLCents(feeToday)}: ${billing.earlyCancelFeePct}% das ${billing.minMonths - monthsCovered} mensalidades que faltam para os ${billing.minMonths} meses. Cobrada junto com o cancelamento.`
        : `Plano anual dentro do prazo mínimo: a gente calcula a devolução proporcional, menos ${billing.earlyCancelFeePct}%, e confirma por e-mail em até 1 dia útil.`,
    "Não haverá novas cobranças depois do cancelamento.",
    contract ? `O site fica no ar até ${brDate(contract.paidUntil)}, fim do período já pago. Depois disso ele sai do ar.` : "O site fica no ar até o fim do período já pago.",
  ];
  const chosenModel = assinatura?.modelo ? vitrine.find((v) => v.slug === assinatura.modelo) : undefined;

  const provider = getPaymentProvider();
  let invoices: Invoice[] = [];
  let manage: string | null = null;
  if (provider && assinatura?.provedor_cliente_id) {
    invoices = await provider.listInvoices(assinatura.provedor_cliente_id).catch(() => []);
    manage = (await provider.manageUrl?.(assinatura.provedor_cliente_id, absoluteUrl("/cliente")).catch(() => null)) ?? null;
  }

  return (
    <section aria-labelledby="page-title" className="pb-24 pt-10 md:pt-14">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionLabel>Área do cliente</SectionLabel>
            <h1 id="page-title" className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1] tracking-[-0.055em]">{client.nome}</h1>
            <p className="mt-3 text-graphite">
              Plano {plan.name} {cycle}, {formatBRLCents(chargeValue)}/{cycle === "anual" ? "ano" : "mês"}{client.site_url ? <> · <a href={client.site_url} className="link" target="_blank" rel="noopener">{client.site_url.replace(/^https?:\/\//, "")}</a></> : null}
            </p>
          </div>
          <form action="/api/cliente/sair" method="post">
            <button type="submit" className={buttonClass("outline", "md")}>Sair</button>
          </form>
        </div>

        <div className="mt-8 space-y-4">
          <ProjectProgress etapa={client.etapa} briefingSent={Boolean(assinatura?.briefing_enviado_em)} prazo={site.deliveryDays[client.plano]} />
          {assinatura && !assinatura.briefing_enviado_em ? (
            <div className="flex flex-col gap-4 rounded-[2rem] bg-ink p-6 text-paper md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <p className="text-xl font-semibold tracking-[-0.03em]">Falta o briefing</p>
                <p className="mt-1 text-mist">Leva uns 10 minutos e é o que libera a criação do seu site.</p>
              </div>
              <a href={briefingUrl(assinatura.referencia)} className={buttonClass("paper", "lg")}>Preencher agora</a>
            </div>
          ) : null}
          {client.etapa === "previa" ? <PreviewReview url={client.previa_url} /> : null}
          {client.etapa === "revisao" && client.previa_url ? (
            <p className="rounded-2xl bg-pink-light px-5 py-3 text-[15px]">
              Estamos fazendo as mudanças que você pediu. Enquanto isso, a versão anterior continua em <a href={client.previa_url} target="_blank" rel="noopener" className="link">sua prévia</a>.
            </p>
          ) : null}
          {chosenModel && client.etapa !== "publicado" ? (
            <a href={vitrineUrl(chosenModel.slug)} target="_blank" rel="noopener" className="flex items-center gap-4 rounded-[2rem] border border-line bg-white p-4 hover:border-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={vitrineThumb(chosenModel.slug)} alt="" width={132} height={90} className="h-[90px] w-[132px] shrink-0 rounded-xl border border-line object-cover object-top" />
              <span className="text-[15px]">
                <span className="label-mono block text-graphite">Modelo escolhido</span>
                <span className="mt-1 block font-medium">{chosenModel.name}</span>
                <span className="link text-graphite">Ver o modelo</span>
              </span>
            </a>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Panel title="Ajustes">
            <p className="text-[15px] text-graphite">
              {remaining === null ? "Ajustes ilimitados, com prazo de até 48h." : `Você tem ${remaining} de ${limit} ajuste${limit === 1 ? "" : "s"} disponível${limit === 1 ? "" : "is"} neste mês.`}
            </p>
            <div className="mt-5">
              <AdjustmentForm disabled={remaining === 0} />
            </div>
            {ajustes?.length ? (
              <ul className="mt-8 divide-y divide-line border-t border-line">
                {ajustes.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-4 py-4">
                    <div>
                      <p className="text-[15px]">{a.descricao}</p>
                      <p className="mt-1 text-sm text-graphite">Pedido em {date(a.pedido_em)}{a.concluido_em ? ` · feito em ${date(a.concluido_em)}` : ""}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${a.status === "feito" ? "bg-ok text-white" : "bg-pink-light"}`}>{statusLabel[a.status]}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Panel>

          <div className="space-y-4">
            <Panel title="Faturas e cartão">
              {invoices.length ? (
                <ul className="divide-y divide-line">
                  {invoices.map((i) => (
                    <li key={i.id} className="flex items-center justify-between gap-4 py-3 text-[15px]">
                      <span>{date(`${i.dueDate}T12:00:00Z`)} · {formatBRLCents(i.value)}</span>
                      <span className="flex items-center gap-3">
                        <span className="text-graphite">{invoiceLabel[i.status] ?? i.status}</span>
                        {i.url ? <a href={i.url} target="_blank" rel="noopener" className="link inline-flex items-center gap-1">Abrir <ExternalLink aria-hidden strokeWidth={1.75} className="h-3.5 w-3.5" /></a> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[15px] text-graphite">As faturas aparecem aqui depois da primeira cobrança.</p>
              )}
              {manage ? (
                <a href={manage} className={buttonClass("outline", "md", "mt-5")}>Trocar cartão e ver tudo</a>
              ) : (
                <a href={whatsappUrl(`Oi! Sou cliente (${client.nome}) e quero trocar o cartão da assinatura.`)} target="_blank" rel="noopener" className={buttonClass("outline", "md", "mt-5")} data-track="whatsapp_click" data-track-origin="cliente-cartao">
                  Trocar cartão pelo WhatsApp
                </a>
              )}
            </Panel>

            <Panel title="Contrato">
              <ul className="divide-y divide-line text-[15px]">
                <li className="flex justify-between gap-4 py-3">
                  <span className="text-graphite">Pagamento</span>
                  <span>{cycle === "anual" ? "Anual, 1 vez por ano" : "Mensal, todo mês"}</span>
                </li>
                <li className="flex justify-between gap-4 py-3">
                  <span className="text-graphite">Meses pagos</span>
                  <span>{monthsCovered} {inMinimum ? `de ${billing.minMonths} do prazo mínimo` : "(prazo mínimo cumprido)"}</span>
                </li>
                <li className="flex justify-between gap-4 py-3">
                  <span className="text-graphite">Desconto de {billing.loyaltyDiscountPct}%</span>
                  <span>{assinatura?.desconto_fidelidade_em ? "Ativo" : "A partir do 13º mês"}</span>
                </li>
                <li className="flex justify-between gap-4 py-3">
                  <span className="text-graphite">{canceled ? "Cancelamento" : "Se cancelar hoje"}</span>
                  <span className="text-right">
                    {canceled && assinatura?.cancelar_em
                      ? `Pedido. No ar até ${new Date(assinatura.cancelar_em).toLocaleDateString("pt-BR", { timeZone: "UTC" })}`
                      : !inMinimum
                        ? "Sem multa"
                        : cycle === "mensal"
                          ? `Multa de ${formatBRLCents(feeToday)}`
                          : `Devolução proporcional, menos ${billing.earlyCancelFeePct}%`}
                  </span>
                </li>
              </ul>
              {planPending ? <p className="mt-4 rounded-2xl bg-pink-light px-4 py-3 text-sm">Troca de plano pedida: {planPending.descricao}. A gente confirma por e-mail.</p> : null}
              {cancelPending ? <p className="mt-4 rounded-2xl bg-pink-light px-4 py-3 text-sm">Cancelamento pedido. A gente confirma por e-mail em até 1 dia útil.</p> : null}
              {!canceled && !cancelPending && assinatura?.status === "ativa" ? (
                <div className="mt-5 space-y-3">
                  {!planPending ? <PlanChange options={planOptions} minMonths={billing.minMonths} /> : null}
                  <CancelFlow summary={cancelSummary} />
                </div>
              ) : null}
              <p className="mt-3 text-sm text-graphite">
                Regras completas nos <a href="/termos" className="link">Termos</a>.
              </p>
            </Panel>

            {client.plano !== "start" ? (
              <Panel title="Visitas do site">
                {visitas?.length ? (
                  <ul className="divide-y divide-line">
                    {visitas.map((v) => (
                      <li key={String(v.mes)} className="flex justify-between gap-4 py-3 text-[15px]">
                        <span className="capitalize">{month(v.mes)}</span>
                        <span>{Number(v.dados.visitantes ?? 0).toLocaleString("pt-BR")} pessoas</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[15px] text-graphite">O primeiro relatório chega no início do mês seguinte à publicação do site.</p>
                )}
              </Panel>
            ) : null}

            {client.plano === "premium" ? (
              <Panel title="Citações nas IAs">
                {citacoes?.length ? (
                  <>
                    <p className="text-[15px] text-graphite">
                      {month(citacoes[0].mes)}: citada em {citacoes.filter((c) => c.citado).length} de {citacoes.filter((c) => !c.erro).length} respostas.
                    </p>
                    <ul className="mt-4 divide-y divide-line">
                      {citacoes.map((c) => (
                        <li key={`${c.motor}-${c.pergunta}`} className="flex items-start justify-between gap-4 py-3 text-[15px]">
                          <span>
                            {c.pergunta}
                            <span className="block text-sm text-graphite">{c.motor}</span>
                          </span>
                          <span className={`shrink-0 font-medium ${c.erro ? "text-graphite" : c.citado ? "text-ok" : "text-bad"}`}>{c.erro ? "não rodou" : c.citado ? "citou" : "não citou"}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-[15px] text-graphite">O primeiro monitoramento roda no início do mês seguinte à publicação do site.</p>
                )}
              </Panel>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
