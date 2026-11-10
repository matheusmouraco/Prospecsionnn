import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { detalheSite, mensagensDe } from "@/lib/admin-vendas";
import { Conversa } from "../../Conversa";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Site | Supporta", robots: { index: false, follow: false } };

const CAMBIO = Number(process.env.ADMIN_CAMBIO_USD ?? 5.5);
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const data = (d: Date | string | null) => (d ? new Date(d).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" }) : "-");
const doc = (d: string) => (d.length === 11 ? `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}` : d.length === 14 ? `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}` : d);

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-line bg-white p-5"><h2 className="text-xl tracking-[-0.03em]">{titulo}</h2><div className="mt-3 text-[15px]">{children}</div></div>;
}

export default async function SitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const d = await detalheSite(id);
  if (!d) notFound();
  const { site, conversa, assinaturas, pagamentos, custos, paginas } = d;
  const r = site.respostas as Record<string, any>;
  const mensagens = conversa ? ((await mensagensDe(conversa.telefone)) ?? []) : [];
  const custoTotal = custos.reduce((t, c) => t + c.usd, 0);
  const recebido = pagamentos.filter((p) => p.tipo === "payment_approved").reduce((t, p) => t + (p.valor ?? 0), 0);
  const endereco = site.dominio ? `https://${site.dominio}` : `https://${site.slug}.supporta.com.br`;
  const alteracoes: { texto: string; em: string }[] = r.ajustesNoAr ?? [];

  return (
    <section className="container-site space-y-6 py-12">
      <Link href="/admin" className="link text-sm">Voltar ao painel</Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-[-0.05em]">{site.empresa}</h1>
          <p className="mt-1 text-graphite">Situação: {site.status} · criado {data(site.criado_em)}{site.publicado_em ? ` · no ar desde ${data(site.publicado_em)}` : ""}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <a className="rounded-full border border-line px-4 py-2" href={`https://analise.supporta.com.br/${site.slug}`} target="_blank" rel="noopener">Prévia</a>
          {site.publicado_em ? <a className="rounded-full bg-ink px-4 py-2 text-paper" href={endereco} target="_blank" rel="noopener">Site no ar</a> : null}
          {conversa ? <a className="rounded-full bg-[#25D366] px-4 py-2 text-white" href={`https://wa.me/${conversa.telefone}`} target="_blank" rel="noopener">WhatsApp do cliente</a> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[["Recebido", brl(recebido)], ["Custo de API", `${brl(custoTotal * CAMBIO)} (US$ ${custoTotal.toFixed(2)})`], ["Resultado", brl(recebido - custoTotal * CAMBIO)]].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-white p-4"><p className="text-sm text-graphite">{k}</p><p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{v}</p></div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Bloco titulo="Cliente">
          {assinaturas[0] ? (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              <dt className="text-graphite">Responsável</dt><dd>{assinaturas[0].responsavel}</dd>
              <dt className="text-graphite">E-mail</dt><dd>{assinaturas[0].email}</dd>
              <dt className="text-graphite">CPF/CNPJ</dt><dd>{doc(assinaturas[0].documento)}</dd>
              <dt className="text-graphite">WhatsApp</dt><dd>{assinaturas[0].whatsapp}</dd>
              <dt className="text-graphite">Domínio próprio</dt><dd>{assinaturas[0].dominio_proprio ? `sim${conversa?.briefing?.dominioEscolhido ? ` (${conversa.briefing.dominioEscolhido})` : ""}` : conversa?.briefing?.jaTemDominio ? `já tem: ${conversa.briefing.jaTemDominio}` : "não"}</dd>
              <dt className="text-graphite">Renovação</dt><dd>{assinaturas[0].valor_anual ? `${brl(assinaturas[0].valor_anual)}/ano` : "-"}</dd>
            </dl>
          ) : <p className="text-graphite">Ainda não passou os dados de pagamento. Contato: {site.contato_nome} · {site.contato_whatsapp}</p>}
        </Bloco>
        <Bloco titulo="O que ele contou">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="text-graphite">Ramo</dt><dd>{r.ramo === "outro" ? r.ramoOutro : r.ramo}</dd>
            <dt className="text-graphite">O que faz</dt><dd>{r.frase || "-"}</dd>
            <dt className="text-graphite">Serviços</dt><dd>{(r.servicos ?? []).join(", ") || "-"}</dd>
            <dt className="text-graphite">Cidade</dt><dd>{r.cidade || "-"}</dd>
            <dt className="text-graphite">Instagram</dt><dd>{r.instagram ? `@${r.instagram}` : "-"}</dd>
            <dt className="text-graphite">Site atual</dt><dd>{r.siteAtual || "-"}</dd>
            <dt className="text-graphite">WhatsApp do site</dt><dd>{r.whatsappSite || "-"}</dd>
          </dl>
          {conversa?.midias?.length ? <div className="mt-3 flex flex-wrap gap-2">{conversa.midias.map((m) => <a key={m.url} href={m.url} target="_blank" rel="noopener"><img src={m.url} alt={m.alt} className="h-16 w-16 rounded-lg object-cover" /></a>)}</div> : null}
        </Bloco>
        <Bloco titulo="Pagamentos">
          {pagamentos.length ? <ul className="space-y-1">{pagamentos.map((p, i) => <li key={i}>{data(p.recebido_em)} · {p.evento}{p.valor ? ` · ${brl(p.valor)}` : ""}</li>)}</ul> : <p className="text-graphite">Nenhum pagamento ainda.</p>}
          {assinaturas.length ? <p className="mt-2 text-sm text-graphite">Links de pagamento gerados: {assinaturas.length} ({assinaturas.map((a) => a.status).join(", ")})</p> : null}
        </Bloco>
        <Bloco titulo={`Alterações (${(r.ajustesFeitos ?? []).length} na prévia, ${alteracoes.length} no ar)`}>
          {[...(r.ajustesFeitos ?? []).map((t: string) => ({ texto: t, em: "" })), ...alteracoes].length ? (
            <ul className="space-y-1">
              {(r.ajustesFeitos ?? []).map((t: string, i: number) => <li key={`p${i}`}><span className="text-graphite">prévia:</span> {t}</li>)}
              {alteracoes.map((a, i) => <li key={`n${i}`}><span className="text-graphite">{data(a.em)}:</span> {a.texto}</li>)}
            </ul>
          ) : <p className="text-graphite">Nenhuma.</p>}
        </Bloco>
        <Bloco titulo="Custo de API por dia">
          {custos.length ? <ul className="space-y-1">{custos.map((c, i) => <li key={i}>{new Date(c.dia).toLocaleDateString("pt-BR", { timeZone: "UTC" })} · {c.fornecedor} · {c.operacao} · US$ {c.usd.toFixed(3)}</li>)}</ul> : <p className="text-graphite">Nada registrado.</p>}
        </Bloco>
        <Bloco titulo="Páginas">
          <ul className="space-y-1">{paginas.map((p) => <li key={p.caminho}><a className="link" href={site.publicado_em ? `${endereco}${p.caminho}` : `https://analise.supporta.com.br/${site.slug}`} target="_blank" rel="noopener">{p.caminho}</a> · atualizada {data(p.atualizado_em)}</li>)}</ul>
        </Bloco>
      </div>

      <div>
        <h2 className="text-2xl tracking-[-0.04em]">Conversa no WhatsApp</h2>
        <div className="mt-4"><Conversa mensagens={mensagens} /></div>
      </div>
    </section>
  );
}
