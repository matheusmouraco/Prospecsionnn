"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import type { PlanId } from "@/lib/plans";

type Option = { id: PlanId; name: string; price: string; pitch: string; rule: "igual" | "subir" | "descer" | "descer_bloqueado" };

/** Troca de plano pela área do cliente. Subir vale já; descer só depois do prazo mínimo. */
export function PlanChange({ options, minMonths }: { options: Option[]; minMonths: number }) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<PlanId | "">("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const router = useRouter();
  const blocked = options.some((o) => o.rule === "descer_bloqueado");

  async function submit() {
    if (!choice) return;
    setSending(true);
    setMessage(null);
    const res = await fetch("/api/cliente/plano", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ plano: choice }) });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    setMessage({ ok: res.ok, text: res.ok ? data.message : (data.error ?? "Não foi possível trocar agora.") });
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className={buttonClass("outline", "md")}>
        Mudar de plano
      </button>
      {open ? (
        <fieldset className="mt-4 rounded-2xl border border-line p-4">
          <legend className="px-1 text-[15px] font-medium">Escolha o novo plano</legend>
          <div className="space-y-2">
            {options.map((o) => {
              const disabled = o.rule === "igual" || o.rule === "descer_bloqueado";
              return (
                <label key={o.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink ${choice === o.id ? "border-ink" : "border-line"} ${disabled ? "cursor-not-allowed opacity-55" : ""}`}>
                  <input type="radio" name="plano" value={o.id} disabled={disabled} checked={choice === o.id} onChange={() => setChoice(o.id)} className="mt-1 accent-[#0B0B0F]" />
                  <span className="text-[15px]">
                    <span className="font-medium">{o.name}</span> · {o.price}
                    {o.rule === "igual" ? <span className="text-graphite"> (plano atual)</span> : null}
                    <span className="block text-sm text-graphite">{o.pitch}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-graphite">
            O novo valor entra na próxima cobrança, sem cobrança proporcional.{blocked ? ` Para descer de plano, espere o fim do prazo mínimo de ${minMonths} meses ou fale com a gente.` : ""}
          </p>
          <button type="button" disabled={!choice || sending} onClick={submit} className={buttonClass("primary", "md", "mt-4")}>
            {sending ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> : null}
            Confirmar troca
          </button>
        </fieldset>
      ) : null}
      {message ? <p role={message.ok ? "status" : "alert"} className={`mt-3 text-sm font-medium ${message.ok ? "text-ok" : "text-bad"}`}>{message.text}</p> : null}
    </div>
  );
}
