import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { adminOverview } from "@/lib/admin";
import { plans } from "@/lib/plans";
import { vitrine } from "@/lib/vitrine";
import { finishRequestAction, runCitationsNow, saveClient, setAdjustment, setStageAction } from "./actions";

export const dynamic = "force-dynamic";
export const maxDuration = 300;
export const metadata: Metadata = { title: "Painel | Supporta", robots: { index: false, follow: false } };

const date = (d: Date) => new Date(d).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" });
const statusColor: Record<string, string> = { ativa: "bg-ok text-white", teste: "bg-line", aguardando_pagamento: "bg-pink-light", pagamento_recusado: "bg-bad text-white", cancelada: "bg-ink text-paper" };
const field = "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm";
const etapaLabel: Record<string, string> = { briefing: "Aguardando briefing", producao: "Em criação", previa: "Prévia com o cliente", revisao: "Revisão pedida", aprovado: "Aprovado, publicar", publicado: "No ar" };
const pedidoLabel: Record<string, string> = { revisao_previa: "Revisão da prévia", mudar_plano: "Troca de plano", cancelar: "Cancelamento" };

export default async function AdminPage() {
  const data = await adminOverview();
  if (!data) {
    return (
      <section className="container-site py-16">
        <h1 className="text-4xl tracking-[-0.05em]">Painel</h1>
        <p className="mt-4 text-graphite">Banco não configurado. Defina SUPABASE_DB_URL e rode npm run db:migrate.</p>
      </section>
    );
  }
  const ativas = data.assinaturas.filter((a) => a.status === "ativa");
  const mrr = ativas.reduce((sum, a) => sum + Number(a.valor), 0);

  return (
    <section className="container-site space-y-10 py-12">
      <div>
        <p className="label-mono text-graphite">Painel interno</p>
        <h1 className="mt-2 text-4xl tracking-[-0.05em]">Supporta</h1>
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Assinaturas ativas", String(ativas.length)],
            ["Receita mensal", mrr.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })],
            ["Ajustes na fila", String(data.ajustes.length)],
            ["Diagnósticos (14 dias)", String(data.leads.reduce((s, l) => s + l.n, 0))],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-line bg-white p-4">
              <dt className="text-sm text-graphite">{k}</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-graphite">Por plano: {plans.map((p) => `${p.name} ${ativas.filter((a) => a.plano === p.id).length}`).join(" · ")}</p>
      </div>

      <div>
        <h2 className="text-2xl tracking-[-0.04em]">Pedidos dos clientes</h2>
        {data.pedidos.length ? (
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
            {data.pedidos.map((s) => (
              <li key={s.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{pedidoLabel[s.tipo]}: {s.cliente_nome} <span className="text-sm text-graphite">({s.plano}) · {date(s.criado_em)} · {s.whatsapp}</span></p>
                  {s.descricao ? <p className="mt-1 whitespace-pre-line text-[15px]">{s.descricao}</p> : null}
                  {Object.keys(s.dados).length ? <p className="mt-1 text-sm text-graphite">{Object.entries(s.dados).filter(([, v]) => v !== null && v !== "").map(([k, v]) => `${k}: ${v}`).join(" · ")}</p> : null}
                </div>
                <form action={finishRequestAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className={buttonClass("primary", "md")}>Resolvido</button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-graphite">Nenhum pedido aberto.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl tracking-[-0.04em]">Ajustes na fila</h2>
        {data.ajustes.length ? (
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
            {data.ajustes.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{a.cliente_nome} <span className="text-sm text-graphite">({a.plano}) · {date(a.pedido_em)}</span></p>
                  <p className="mt-1 text-[15px]">{a.descricao}</p>
                </div>
                <form action={setAdjustment} className="flex gap-2">
                  <input type="hidden" name="id" value={a.id} />
                  {a.status === "aberto" ? <button name="status" value="em_andamento" className={buttonClass("outline", "md")}>Começar</button> : null}
                  <button name="status" value="feito" className={buttonClass("primary", "md")}>Feito (avisa o cliente)</button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-graphite">Nenhum ajuste pendente.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl tracking-[-0.04em]">Assinaturas</h2>
        <div className="relative mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-paper text-graphite">
              <tr>{["Data", "Empresa", "Contato", "Plano", "Modelo", "Status", "Briefing", "Origem"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.assinaturas.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3">{date(a.criado_em)}</td>
                  <td className="px-4 py-3 font-medium">{a.empresa}</td>
                  <td className="px-4 py-3">{a.email}<br />{a.whatsapp}</td>
                  <td className="px-4 py-3">{a.plano}{a.cancelar_em ? <span className="block text-bad">cancela {new Date(a.cancelar_em).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</span> : null}</td>
                  <td className="px-4 py-3">{a.modelo ? <a href={`/vitrine/${a.modelo}/index.html`} target="_blank" rel="noopener" className="link">{vitrine.find((v) => v.slug === a.modelo)?.name ?? a.modelo}</a> : "sugerir"}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 ${statusColor[a.status] ?? ""}`}>{a.status.replace(/_/g, " ")}</span></td>
                  <td className="px-4 py-3">{a.briefing_id ? <Link href={`/admin/briefing/${a.briefing_id}`} className="link">ver</Link> : "pendente"}</td>
                  <td className="px-4 py-3 text-graphite">{a.origem?.origem || "site"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl tracking-[-0.04em]">Clientes: relatórios e monitoramento</h2>
        <p className="mt-1 text-sm text-graphite">Nomes de busca contam como citação. Perguntas: até 5, uma por linha (só Premium). Plausible: domínio cadastrado no Plausible (Pro e Premium).</p>
        <div className="mt-4 space-y-3">
          {data.clientes.map((c) => (
            <details key={c.id} className="rounded-2xl border border-line bg-white">
              <summary className="flex items-center justify-between px-4 py-3">
                <span className="font-medium">{c.nome} <span className="text-sm text-graphite">· {c.plano} · {etapaLabel[c.etapa] ?? c.etapa}{c.ativo ? "" : " · inativo"}</span></span>
                <span className="text-sm text-graphite">{c.email}</span>
              </summary>
              <form action={setStageAction} className="grid gap-3 border-t border-line p-4 md:grid-cols-3">
                <input type="hidden" name="id" value={c.id} />
                <label className="text-sm">Etapa do site
                  <select name="etapa" defaultValue={c.etapa} className={field}>
                    {Object.entries(etapaLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </label>
                <label className="text-sm">Link da prévia<input name="previa" defaultValue={c.previa_url ?? ""} placeholder="https://..." className={field} /></label>
                <label className="text-sm">Site publicado<input name="site" defaultValue={c.site_url ?? ""} placeholder="https://..." className={field} /></label>
                <p className="text-sm text-graphite md:col-span-2">Prévia com o cliente e No ar mandam e-mail para o cliente. Na prévia, ele aprova ou pede revisão pela área do cliente.</p>
                <div><button className={buttonClass("primary", "md")}>Salvar etapa</button></div>
              </form>
              <form action={saveClient} className="grid gap-3 border-t border-line p-4 md:grid-cols-2">
                <input type="hidden" name="id" value={c.id} />
                <label className="text-sm">Site<input name="site" defaultValue={c.site_url ?? ""} className={field} /></label>
                <label className="text-sm">Plausible site_id<input name="plausible" defaultValue={c.plausible_site_id ?? ""} className={field} /></label>
                <label className="text-sm">Nomes de busca (vírgula)<input name="nomes" defaultValue={c.nomes_busca.join(", ")} className={field} /></label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="ativo" defaultChecked={c.ativo} /> Ativo</label>
                <label className="text-sm md:col-span-2">Perguntas para as IAs<textarea name="perguntas" rows={4} defaultValue={c.perguntas_ia.join("\n")} className={field} /></label>
                <div className="flex gap-2 md:col-span-2">
                  <button className={buttonClass("primary", "md")}>Salvar</button>
                  {c.plano === "premium" ? <button formAction={runCitationsNow} className={buttonClass("outline", "md")}>Rodar citações agora</button> : null}
                </div>
              </form>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
