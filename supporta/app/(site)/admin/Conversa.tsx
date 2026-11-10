const hora = (d: Date) => new Date(d).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" });
const linkify = (t: string) => t.split(/(https?:\/\/\S+)/g).map((p, i) => (/^https?:\/\//.test(p) ? <a key={i} className="link break-all" href={p} target="_blank" rel="noopener">{p}</a> : p));

/** Histórico da conversa no formato do WhatsApp: cliente à esquerda, robô à direita. */
export function Conversa({ mensagens }: { mensagens: { direcao: "in" | "out"; tipo: string | null; corpo: string; criado_em: Date }[] }) {
  if (!mensagens.length) return <p className="text-sm text-graphite">Sem mensagens registradas.</p>;
  return (
    <ol className="max-h-[70vh] space-y-2 overflow-y-auto rounded-2xl border border-line bg-[#efeae2] p-4">
      {mensagens.map((m, i) => (
        <li key={i} className={`flex ${m.direcao === "out" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[14px] shadow-sm ${m.direcao === "out" ? "bg-[#d9fdd3]" : "bg-white"}`}>
            {m.tipo === "transcricao" ? <span className="mb-1 block text-xs text-graphite">Áudio transcrito</span> : null}
            {linkify(m.corpo)}
            <span className="mt-1 block text-right text-[11px] text-graphite">{hora(m.criado_em)}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
