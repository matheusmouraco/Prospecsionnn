"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";

const motivos = ["O preço ficou alto", "Não preciso mais do site", "Vou fechar ou mudar o negócio", "Não gostei do resultado", "Vou para outra empresa", "Outro motivo"];

/** Cancelamento pela área do cliente, com a multa e a data de saída do ar mostradas antes de confirmar. */
export function CancelFlow({ summary }: { summary: string[] }) {
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string; feeUrl?: string | null } | null>(null);
  const router = useRouter();

  async function submit() {
    setSending(true);
    setResult(null);
    const res = await fetch("/api/cliente/cancelar", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ confirmar: true, motivo }) });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    setResult({ ok: res.ok, text: res.ok ? data.message : (data.error ?? "Não foi possível cancelar agora."), feeUrl: data.feeUrl });
    if (res.ok) router.refresh();
  }

  if (result?.ok) {
    return (
      <div role="status" className="rounded-2xl bg-paper p-4 text-[15px]">
        <p className="font-medium">{result.text}</p>
        {result.feeUrl ? <a href={result.feeUrl} target="_blank" rel="noopener" className={buttonClass("primary", "md", "mt-3")}>Pagar a multa</a> : null}
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className={buttonClass("ghost", "md")}>
        Cancelar assinatura
      </button>
      {open ? (
        <div className="mt-4 rounded-2xl border border-line p-4">
          <p className="text-[15px] font-medium">Antes de confirmar</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-graphite">
            {summary.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <label htmlFor="cx-motivo" className="mt-4 block text-[15px] font-medium">Por que você quer cancelar? (opcional)</label>
          <select id="cx-motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-line bg-white px-3 text-[15px]">
            <option value="">Prefiro não dizer</option>
            {motivos.map((m) => <option key={m}>{m}</option>)}
          </select>
          <label className="mt-4 flex cursor-pointer gap-3 text-[15px]">
            <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#0B0B0F]" />
            Entendi as condições acima e quero cancelar a assinatura.
          </label>
          <button type="button" disabled={!confirm || sending} onClick={submit} className={buttonClass("primary", "md", "mt-4")}>
            {sending ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> : null}
            Confirmar cancelamento
          </button>
          {result && !result.ok ? <p role="alert" className="mt-3 text-sm font-medium text-bad">{result.text}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
