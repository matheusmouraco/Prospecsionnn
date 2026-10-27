"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("erro") === "link") setError("Esse link expirou ou já não vale. Peça um novo abaixo.");
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    const res = await fetch("/api/cliente/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Não foi possível enviar agora.");
      setState("idle");
      return;
    }
    setState("sent");
  }

  if (state === "sent") {
    return (
      <p role="status" className="rounded-3xl bg-pink-light px-6 py-5">
        Se <strong>{email}</strong> for o e-mail de uma assinatura ativa, o link de acesso chega em instantes. Ele vale por 20 minutos.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
      <label htmlFor="l-email" className="label-mono text-graphite">E-mail da assinatura</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input id="l-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 flex-1 rounded-full border border-line bg-paper px-6 focus:border-ink focus:outline-none" />
        <button type="submit" disabled={state === "sending"} className={buttonClass("primary", "lg", "h-14")}>
          {state === "sending" ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> : null}
          Receber link de acesso
        </button>
      </div>
      {error ? <p role="alert" className="mt-3 text-sm font-medium text-bad">{error}</p> : null}
      <p className="mt-4 text-sm text-graphite">Sem senha: mandamos um link de acesso para o seu e-mail.</p>
    </form>
  );
}
