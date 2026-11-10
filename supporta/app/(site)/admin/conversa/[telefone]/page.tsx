import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { conversaPorTelefone, mensagensDe } from "@/lib/admin-vendas";
import { devolverConversa } from "../../actions";
import { Conversa } from "../../Conversa";
import { BotaoRobo } from "../../BotaoRobo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Conversa | Supporta", robots: { index: false, follow: false } };

export default async function ConversaPage({ params }: { params: Promise<{ telefone: string }> }) {
  const { telefone } = await params;
  if (!/^\d{10,15}$/.test(telefone)) notFound();
  const [conv, mensagens] = await Promise.all([conversaPorTelefone(telefone), mensagensDe(telefone)]);
  if (!conv) notFound();
  const b = conv.briefing as Record<string, string | undefined>;
  return (
    <section className="container-site space-y-6 py-12">
      <Link href="/admin" className="link text-sm">Voltar ao painel</Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-[-0.05em]">{b.negocio || conv.nome || telefone}</h1>
          <p className="mt-1 text-graphite">{conv.nome} · +{telefone} · etapa: {conv.etapa}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white" href={`https://wa.me/${telefone}`} target="_blank" rel="noopener">Abrir no WhatsApp</a>
          <BotaoRobo telefone={telefone} etapa={conv.etapa} grande />
          {conv.site_id ? <Link className="rounded-full border border-line px-4 py-2 text-sm" href={`/admin/site/${conv.site_id}`}>Ver o site</Link> : null}
        </div>
      </div>
      {conv.etapa === "humano" ? (
        <form action={devolverConversa} className="flex flex-wrap items-center gap-3 rounded-2xl border border-bad/40 bg-white p-4 text-sm">
          <input type="hidden" name="telefone" value={telefone} />
          <span>O robô está parado nesta conversa (você está atendendo). Devolver ao robô na etapa:</span>
          <select name="etapa" defaultValue={(conv.briefing as { etapaAntesHumano?: string } | null)?.etapaAntesHumano ?? (conv.site_id ? "previa" : "inicio")} className="rounded-xl border border-line px-3 py-2">
            {["inicio", "prospeccao", "negocio", "servicos", "fotos", "confirmacao", "previa", "dados", "pagamento", "pago"].map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <button className="rounded-full bg-ink px-4 py-2 font-medium text-paper">Devolver</button>
        </form>
      ) : null}
      <Conversa mensagens={mensagens ?? []} />
    </section>
  );
}
