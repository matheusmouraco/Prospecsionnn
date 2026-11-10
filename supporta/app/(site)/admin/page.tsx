import type { Metadata } from "next";
import Link from "next/link";
import { painelVendas } from "@/lib/admin-vendas";
import { apagarInvestimento, salvarInvestimento } from "./actions";
import { BotaoRobo } from "./BotaoRobo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Vendas | Supporta", robots: { index: false, follow: false } };

const CAMBIO = Number(process.env.ADMIN_CAMBIO_USD ?? 5.5);
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const data = (d: Date | string | null) => (d ? new Date(d).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" }) : "-");
const fone = (n: string | null) => {
  const d = (n ?? "").replace(/\D/g, "").replace(/^55/, "");
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d || "-";
};
const nomeMes = (m: string) => new Date(`${m}-15T12:00:00Z`).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });

const STATUS: Record<string, [string, string]> = {
  na_fila: ["Na fila", "bg-line"],
  gerando: ["Gerando prévia", "bg-line"],
  previa: ["Prévia enviada", "bg-pink-light"],
  ajuste: ["Ajuste na fila", "bg-pink-light"],
  ajustando: ["Ajustando prévia", "bg-pink-light"],
  erro: ["Erro", "bg-bad text-white"],
  pago: ["Pago, publicando", "bg-ok text-white"],
  publicando: ["Publicando", "bg-ok text-white"],
  no_ar: ["No ar", "bg-ink text-paper"],
  ajuste_no_ar: ["No ar, ajuste na fila", "bg-ink text-paper"],
  ajustando_no_ar: ["No ar, ajustando", "bg-ink text-paper"],
};
const ETAPA: Record<string, string> = {
  inicio: "Começou", prospeccao: "Prospecção, sem resposta", encerrada: "Encerrada", negocio: "Nome do negócio", servicos: "Serviços", fotos: "Fotos", confirmacao: "Resumo",
  gerando: "Gerando", previa: "Com a prévia", dados: "Dados do pagamento", pagamento: "Link de pagamento", pago: "Cliente", humano: "Esperando você",
};

export default async function AdminVendas() {
  const p = await painelVendas();
  if (!p) return <section className="container-site py-16"><h1 className="text-4xl tracking-[-0.05em]">Painel</h1><p className="mt-4 text-graphite">Banco indisponível.</p></section>;

  const pagos = p.sites.filter((s) => s.pago);
  const faturado = p.sites.reduce((t, s) => t + s.recebido, 0);
  const custoTotal = p.meses.reduce((t, m) => t + m.custo, 0);
  const trafegoTotal = p.meses.reduce((t, m) => t + m.trafego, 0);
  const leads = p.sites.length + p.conversas.length;
  const lucro = faturado - custoTotal * CAMBIO - trafegoTotal;
  const humano = [...p.sites.filter((s) => s.etapa === "humano"), ...p.conversas.filter((c) => c.etapa === "humano")];
  const mesAtual = new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 7);

  return (
    <section className="container-site space-y-12 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-mono text-graphite">Painel interno</p>
          <h1 className="mt-2 text-4xl tracking-[-0.05em]">Vendas pelo WhatsApp</h1>
        </div>
        <Link href="/admin/assinaturas" className="link text-sm">Painel antigo (assinaturas e briefings)</Link>
      </div>

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Sites vendidos", String(pagos.length), `${leads ? Math.round((pagos.length / leads) * 100) : 0}% dos ${leads} contatos`],
          ["Faturado (total)", brl(faturado), `Ticket médio ${brl(pagos.length ? faturado / pagos.length : 0)}`],
          ["Custo de API (6 meses)", brl(custoTotal * CAMBIO), `US$ ${custoTotal.toFixed(2)} a R$ ${CAMBIO.toFixed(2)}`],
          ["Tráfego (6 meses)", brl(trafegoTotal), `Custo por venda ${brl(pagos.length ? trafegoTotal / pagos.length : 0)}`],
          ["Resultado", brl(lucro), "Faturado menos API e tráfego"],
          ["Retorno do tráfego", trafegoTotal ? `${(faturado / trafegoTotal).toFixed(1)}x` : "-", "Faturado dividido pelo tráfego"],
          ["Com prévia, sem pagar", String(p.sites.filter((s) => ["previa", "ajuste", "ajustando"].includes(s.status)).length), "Ainda podem fechar"],
          ["Esperando você", String(humano.length), humano.length ? "Veja abaixo" : "Nenhuma conversa parada"],
        ].map(([k, v, d]) => (
          <div key={k} className="rounded-2xl border border-line bg-white p-4">
            <dt className="text-sm text-graphite">{k}</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{v}</dd>
            <p className="mt-1 text-xs text-graphite">{d}</p>
          </div>
        ))}
      </dl>

      {humano.length ? (
        <div className="rounded-2xl border border-bad/40 bg-white p-5">
          <h2 className="text-xl tracking-[-0.03em]">Conversas esperando você</h2>
          <p className="mt-1 text-sm text-graphite">O robô parou nelas. Responda pelo WhatsApp e, quando quiser, devolva ao robô com um clique.</p>
          <ul className="mt-3 space-y-2 text-[15px]">
            {humano.map((h) => (
              <li key={h.telefone} className="flex flex-wrap items-center gap-3"><span><Link className="link" href={`/admin/conversa/${h.telefone}`}>{("empresa" in h ? h.empresa : h.negocio) || h.telefone}</Link> · {fone(h.telefone)}</span><BotaoRobo telefone={h.telefone} etapa="humano" /></li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <h2 className="text-2xl tracking-[-0.04em]">Mês a mês</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[760px] text-left text-[15px]">
            <thead className="border-b border-line text-sm text-graphite">
              <tr>{["Mês", "Contatos", "Vendas", "Conversão", "Faturado", "Custo de API", "Tráfego", "Resultado", "Retorno"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {p.meses.map((m) => {
                const res = m.faturado - m.custo * CAMBIO - m.trafego;
                return (
                  <tr key={m.mes}>
                    <td className="px-4 py-3 font-medium">{nomeMes(m.mes)}</td>
                    <td className="px-4 py-3">{m.leads}</td>
                    <td className="px-4 py-3">{m.vendas}</td>
                    <td className="px-4 py-3">{m.leads ? `${Math.round((m.vendas / m.leads) * 100)}%` : "-"}</td>
                    <td className="px-4 py-3">{brl(m.faturado)}</td>
                    <td className="px-4 py-3">{brl(m.custo * CAMBIO)}</td>
                    <td className="px-4 py-3">{brl(m.trafego)}</td>
                    <td className={`px-4 py-3 font-medium ${res < 0 ? "text-bad" : ""}`}>{brl(res)}</td>
                    <td className="px-4 py-3">{m.trafego ? `${(m.faturado / m.trafego).toFixed(1)}x` : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form action={salvarInvestimento} className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-xl tracking-[-0.03em]">Lançar investimento em tráfego</h2>
          <p className="mt-1 text-sm text-graphite">Quanto você investiu no mês (Meta Ads, Google Ads...). Entra no resultado e no retorno.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">Mês<input name="mes" type="month" defaultValue={mesAtual} required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
            <label className="text-sm">Valor (R$)<input name="valor" inputMode="decimal" placeholder="500,00" required className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
            <label className="text-sm">Canal<input name="canal" placeholder="Meta Ads" className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
            <label className="text-sm">Observação<input name="obs" placeholder="Campanha dentistas" className="mt-1 w-full rounded-xl border border-line px-3 py-2" /></label>
          </div>
          <button className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">Salvar</button>
        </form>
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-xl tracking-[-0.03em]">Investimentos lançados</h2>
          {p.investimentos.length ? (
            <ul className="mt-3 divide-y divide-line text-[15px]">
              {p.investimentos.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-2">
                  <span>{nomeMes(new Date(i.mes).toISOString().slice(0, 7))} · {i.canal}{i.obs ? ` · ${i.obs}` : ""}</span>
                  <span className="flex items-center gap-3"><strong>{brl(i.valor)}</strong>
                    <form action={apagarInvestimento}><input type="hidden" name="id" value={i.id} /><button className="text-sm text-bad">apagar</button></form>
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-graphite">Nenhum ainda.</p>}
        </div>
      </div>

      <div>
        <h2 className="text-2xl tracking-[-0.04em]">Sites ({p.sites.length})</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[980px] text-left text-[14px]">
            <thead className="border-b border-line text-sm text-graphite">
              <tr>{["Empresa", "Situação", "Robô", "Cliente", "WhatsApp", "Criado", "Pago em", "Recebido", "Custo API", "Alterações", "Links"].map((h) => <th key={h} className="px-3 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {p.sites.map((s) => {
                const [label, cor] = STATUS[s.status] ?? [s.status, "bg-line"];
                return (
                  <tr key={s.id} className="align-top">
                    <td className="px-3 py-3 font-medium"><Link className="link" href={`/admin/site/${s.id}`}>{s.empresa}</Link></td>
                    <td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs ${cor}`}>{label}</span>{s.etapa === "humano" ? <span className="ml-1 rounded-full bg-bad px-2 py-0.5 text-xs text-white">você</span> : null}</td>
                    <td className="px-3 py-3"><BotaoRobo telefone={s.telefone} etapa={s.etapa} /></td>
                    <td className="px-3 py-3">{s.contato_nome}<br /><span className="text-graphite">{s.contato_email || ""}</span></td>
                    <td className="whitespace-nowrap px-3 py-3">{fone(s.telefone ?? s.contato_whatsapp)}</td>
                    <td className="whitespace-nowrap px-3 py-3">{data(s.criado_em)}</td>
                    <td className="whitespace-nowrap px-3 py-3">{data(s.pago_em)}</td>
                    <td className="px-3 py-3">{s.recebido ? brl(s.recebido) : "-"}</td>
                    <td className="px-3 py-3">{brl(s.custo * CAMBIO)}</td>
                    <td className="px-3 py-3">{s.alteracoes}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <a className="link" href={`https://analise.supporta.com.br/${s.slug}`} target="_blank" rel="noopener">prévia</a>
                      {s.publicado_em ? <> · <a className="link" href={s.dominio ? `https://${s.dominio}` : `https://${s.slug}.supporta.com.br`} target="_blank" rel="noopener">site</a></> : null}
                      {s.telefone ? <> · <Link className="link" href={`/admin/conversa/${s.telefone}`}>conversa</Link></> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl tracking-[-0.04em]">Conversas que ainda não viraram site ({p.conversas.length})</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-[14px]">
            <thead className="border-b border-line text-sm text-graphite">
              <tr>{["Contato", "Negócio", "Onde parou", "Robô", "Começou", "Última mensagem", "Custo API"].map((h) => <th key={h} className="px-3 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {p.conversas.map((c) => (
                <tr key={c.telefone}>
                  <td className="px-3 py-3"><Link className="link" href={`/admin/conversa/${c.telefone}`}>{c.nome || fone(c.telefone)}</Link><br /><span className="text-graphite">{fone(c.telefone)}</span></td>
                  <td className="px-3 py-3">{c.negocio || "-"}</td>
                  <td className="px-3 py-3">{ETAPA[c.etapa] ?? c.etapa}</td>
                  <td className="px-3 py-3"><BotaoRobo telefone={c.telefone} etapa={c.etapa} /></td>
                  <td className="whitespace-nowrap px-3 py-3">{data(c.criado_em)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{data(c.ultima)}</td>
                  <td className="px-3 py-3">{brl(c.custo * CAMBIO)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
