"use client";

import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";

/** Prévia do site para o cliente aprovar ou pedir revisão. Só publicamos depois da aprovação. */
export function PreviewReview({ url }: { url: string | null }) {
  const [mode, setMode] = useState<"idle" | "revisao">("idle");
  const [descricao, setDescricao] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const router = useRouter();

  async function send(acao: "aprovar" | "revisao") {
    setSending(true);
    setMessage(null);
    const res = await fetch("/api/cliente/previa", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ acao, descricao }) });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    setMessage({ ok: res.ok, text: res.ok ? data.message : (data.error ?? "Não foi possível enviar.") });
    if (res.ok) router.refresh();
  }

  return (
    <section aria-labelledby="previa-title" className="rounded-[2rem] bg-ink p-6 text-paper md:p-8">
      <h2 id="previa-title" className="text-2xl tracking-[-0.04em]">Sua prévia está pronta</h2>
      <p className="mt-2 max-w-2xl text-mist">Abra no computador e no celular. Se estiver tudo certo, aprove e a gente publica. Se quiser mudar algo, descreva tudo de uma vez que fica mais rápido.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {url ? (
          <a href={url} target="_blank" rel="noopener" className={buttonClass("paper", "lg")}>
            Abrir a prévia <ArrowUpRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
          </a>
        ) : null}
        <button type="button" disabled={sending} onClick={() => send("aprovar")} className={buttonClass("neon", "lg")}>
          {sending && mode === "idle" ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> : <Check aria-hidden strokeWidth={2} className="h-4 w-4" />}
          Aprovar e publicar
        </button>
        <button type="button" onClick={() => setMode(mode === "revisao" ? "idle" : "revisao")} aria-expanded={mode === "revisao"} className={buttonClass("outline-dark", "lg")}>
          Pedir mudanças
        </button>
      </div>
      {mode === "revisao" ? (
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            send("revisao");
          }}
        >
          <label htmlFor="p-desc" className="text-[15px] font-medium">O que você quer mudar?</label>
          <textarea
            id="p-desc"
            rows={5}
            required
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder={"Ex.: trocar a foto do topo pela da fachada\nNo celular, o telefone ficou pequeno"}
            className="mt-2 w-full rounded-2xl border border-line-dark bg-card-dark px-4 py-3 text-paper placeholder:text-mist focus:border-paper focus:outline-none"
          />
          <button type="submit" disabled={sending} className={buttonClass("paper", "md", "mt-3")}>
            {sending ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> : null}
            Enviar pedido de mudanças
          </button>
        </form>
      ) : null}
      {message ? <p role={message.ok ? "status" : "alert"} className={`mt-4 text-[15px] font-medium ${message.ok ? "text-paper" : "text-pink"}`}>{message.text}</p> : null}
    </section>
  );
}
