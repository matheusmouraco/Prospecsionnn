import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdjustmentForm } from "@/components/cliente/AdjustmentForm";
import { CancelFlow } from "@/components/cliente/CancelFlow";
import { PreviewReview } from "@/components/cliente/PreviewReview";
import { ProjectProgress } from "@/components/cliente/ProjectProgress";
import { buttonClass } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getPaymentProvider, type Invoice } from "@/lib/payments";
import { contractState } from "@/lib/autoatendimento";
import { alteracaoGratis, pricing } from "@/lib/plans";
import { countAdjustmentsThisMonth, getSubscriptionById, listAdjustments, listRequests } from "@/lib/repo";
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

  const [assinatura, ajustes, pedidos] = await Promise.all([getSubscriptionById(client.assinatura_id), listAdjustments(client.id), listRequests(client.id, 5)]);

  // Preço único: alterações sem custo até 30 dias depois da entrega; renovação anual do endereço a partir do 2º ano.
  const contract = assinatura ? await contractState(assinatura) : null;
  const gratis = alteracaoGratis(client.publicado_em);
  const fimGratis = client.publicado_em ? new Date(new Date(client.publicado_em).getTime() + pricing.diasAlteracaoGratis * 86_400_000) : null;
  const brDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  const canceled = Boolean(assinatura?.cancelamento_pedido_em);
  const cancelPending = canceled ? false : (pedidos ?? []).some((r) => r.tipo === "cancelar" && r.status === "aberto");
  const cancelSummary = [
    "Sem multa e sem novas cobranças.",
    contract ? `O site fica no ar até ${brDate(contract.paidUntil)}, fim do período já pago. Depois disso ele sai do ar.` : "O site fica no ar até o fim do período já pago.",
    "Quer mudar de ideia depois? É só falar com a gente antes dessa data.",
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
              Site profissional{contract ? `, renova por ${formatBRLCents(contract.renovacao)}/ano` : ""}{client.site_url ? <> · <a href={client.site_url} className="link" target="_blank" rel="noopener">{client.site_url.replace(/^https?:\/\//, "")}</a></> : null}
            </p>
          </div>
          <form action="/api/cliente/sair" method="post">
            <button type="submit" className={buttonClass("outline", "md")}>Sair</button>
          </form>
        </div>

        <div className="mt-8 space-y-4">
          <ProjectProgress etapa={client.etapa} briefingSent={Boolean(assinatura?.briefing_enviado_em)} prazo={pricing.prazoHoras} />
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
          <Panel title="Alterações">
            <p className="text-[15px] text-graphite">
              {gratis
                ? fimGratis
                  ? `Alterações sem custo até ${fimGratis.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })} (${pricing.diasAlteracaoGratis} dias depois da entrega).`
                  : `Alterações sem custo até ${pricing.diasAlteracaoGratis} dias depois da entrega do site.`
                : `Cada alteração custa ${formatBRLCents(pricing.alteracao)}, cobrada quando você pede.`}
            </p>
            <div className="mt-5">
              <AdjustmentForm valor={gratis ? 0 : pricing.alteracao} />
            </div>
            {ajustes?.length ? (
              <ul className="mt-8 divide-y divide-line border-t border-line">
                {ajustes.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-4 py-4">
                    <div>
                      <p className="text-[15px]">{a.descricao}</p>
                      <p className="mt-1 text-sm text-graphite">
                        Pedido em {date(a.pedido_em)}{a.concluido_em ? ` · feito em ${date(a.concluido_em)}` : ""}
                        {Number(a.valor) > 0 ? ` · ${formatBRLCents(Number(a.valor))}${a.pago ? " pago" : ""}` : ""}
                      </p>
                      {Number(a.valor) > 0 && !a.pago && a.cobranca_url ? <a href={a.cobranca_url} target="_blank" rel="noopener" className="link mt-1 inline-block text-sm">Pagar a alteração</a> : null}
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
                <a href={whatsappUrl(`Oi! Sou cliente (${client.nome}) e quero trocar o cartão da renovação.`)} target="_blank" rel="noopener" className={buttonClass("outline", "md", "mt-5")} data-track="whatsapp_click" data-track-origin="cliente-cartao">
                  Trocar cartão pelo WhatsApp
                </a>
              )}
            </Panel>

            <Panel title="Renovação">
              <ul className="divide-y divide-line text-[15px]">
                <li className="flex justify-between gap-4 py-3">
                  <span className="text-graphite">Site</span>
                  <span>Pago, {formatBRLCents(pricing.site)} uma vez</span>
                </li>
                <li className="flex justify-between gap-4 py-3">
                  <span className="text-graphite">Domínio próprio</span>
                  <span className="text-right">{contract?.dominio ? "Contratado" : <a href={whatsappUrl(`Oi! Sou cliente (${client.nome}) e quero um domínio próprio .com.br.`)} target="_blank" rel="noopener" className="link">Quero um ({formatBRLCents(pricing.dominio)}/ano)</a>}</span>
                </li>
                <li className="flex justify-between gap-4 py-3">
                  <span className="text-graphite">{canceled ? "No ar até" : "Próxima renovação"}</span>
                  <span className="text-right">
                    {canceled && assinatura?.cancelar_em
                      ? new Date(assinatura.cancelar_em).toLocaleDateString("pt-BR", { timeZone: "UTC" })
                      : contract
                        ? `${brDate(contract.paidUntil)}, ${formatBRLCents(contract.renovacao)}`
                        : "Daqui a 1 ano"}
                  </span>
                </li>
              </ul>
              {cancelPending ? <p className="mt-4 rounded-2xl bg-pink-light px-4 py-3 text-sm">Cancelamento pedido. A gente confirma por e-mail em até 1 dia útil.</p> : null}
              {!canceled && !cancelPending && assinatura?.status === "ativa" ? (
                <div className="mt-5 space-y-3">
                  <CancelFlow summary={cancelSummary} />
                </div>
              ) : null}
              <p className="mt-3 text-sm text-graphite">
                Regras completas nos <a href="/termos" className="link">Termos</a>.
              </p>
            </Panel>

          </div>
        </div>
      </div>
    </section>
  );
}
