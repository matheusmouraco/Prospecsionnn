"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";

/** Pedido de alteração. Com `valor` acima de zero (depois de 30 dias da entrega), avisa o preço antes e mostra o link de pagamento. */
export function AdjustmentForm({ valor }: { valor: number }) {
  const [descricao, setDescricao] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string; url?: string | null } | null>(null);
  const [aceite, setAceite] = useState(false);
  const preco = valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setMessage(null);
    const res = await fetch("/api/cliente/ajustes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ descricao }) });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      setMessage({ ok: false, text: data.error ?? "Não foi possível enviar." });
      return;
    }
    setDescricao("");
    setAceite(false);
    setMessage({
      ok: true,
      text: data.valor > 0 && !data.pago ? "Pedido recebido. A gente começa assim que o pagamento cair." : "Pedido recebido. Você recebe um e-mail quando estiver no ar.",
      url: data.valor > 0 && !data.pago ? data.cobrancaUrl : null,
    });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="a-desc" className="text-[15px] font-medium">O que você quer mudar?</label>
      <textarea
        id="a-desc"
        rows={3}
        required
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Ex.: trocar o horário de sábado para 8h às 12h"
        className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 focus:border-ink focus:outline-none disabled:bg-paper"
      />
      {valor > 0 ? (
        <label className="mt-3 flex cursor-pointer gap-3 text-[15px]">
          <input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#0B0B0F]" />
          Entendi: esta alteração custa {preco}, cobrada agora.
        </label>
      ) : null}
      <button type="submit" disabled={sending || (valor > 0 && !aceite)} className={buttonClass("primary", "md", "mt-3")}>
        {sending ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> : null}
        {valor > 0 ? `Pedir alteração (${preco})` : "Pedir alteração"}
      </button>
      {message ? <p role={message.ok ? "status" : "alert"} className={`mt-3 text-sm font-medium ${message.ok ? "text-ok" : "text-bad"}`}>{message.text}</p> : null}
      {message?.url ? <a href={message.url} target="_blank" rel="noopener" className={buttonClass("primary", "md", "mt-3")}>Pagar a alteração</a> : null}
    </form>
  );
}
