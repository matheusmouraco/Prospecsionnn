"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";

export function AdjustmentForm({ disabled }: { disabled: boolean }) {
  const [descricao, setDescricao] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
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
    setMessage({ ok: true, text: "Pedido recebido. Você recebe um e-mail quando estiver no ar." });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="a-desc" className="text-[15px] font-medium">O que você quer mudar?</label>
      <textarea
        id="a-desc"
        rows={3}
        required
        disabled={disabled}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Ex.: trocar o horário de sábado para 8h às 12h"
        className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 focus:border-ink focus:outline-none disabled:bg-paper"
      />
      <button type="submit" disabled={sending || disabled} className={buttonClass("primary", "md", "mt-3")}>
        {sending ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> : null}
        Pedir ajuste
      </button>
      {message ? <p role={message.ok ? "status" : "alert"} className={`mt-3 text-sm font-medium ${message.ok ? "text-ok" : "text-bad"}`}>{message.text}</p> : null}
    </form>
  );
}
