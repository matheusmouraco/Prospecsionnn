"use client";

import { Check, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { DiagnosticReport, diagnosticSteps as steps, type Report } from "./DiagnosticReport";

export function DiagnosticTool() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("url");
    if (fromQuery) {
      setUrl(fromQuery.slice(0, 300));
    }
  }, []);

  useEffect(() => {
    if (state !== "loading") return;
    setStep(0);
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 4500);
    return () => window.clearInterval(id);
  }, [state]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const honeypot = (new FormData(e.currentTarget).get("website") as string) || "";
    setState("loading");
    setError("");
    track("diagnostic_submit", { site: url });
    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, email, website: honeypot }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Algo deu errado. Tente de novo.");
      setReport(data);
      setState("done");
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="rounded-[2rem] border border-line bg-white p-5 md:p-8" noValidate={false}>
        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_auto] md:items-end">
          <div>
            <label htmlFor="d-url" className="label-mono text-graphite">Endereço do site</label>
            <input
              id="d-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="seusite.com.br"
              className="mt-2 h-14 w-full rounded-full border border-line bg-paper px-6 focus:border-ink focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="d-email" className="label-mono text-graphite">Seu e-mail (opcional)</label>
            <input
              id="d-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com.br"
              className="mt-2 h-14 w-full rounded-full border border-line bg-paper px-6 focus:border-ink focus:outline-none"
            />
          </div>
          <div aria-hidden className="hidden">
            <label htmlFor="d-website">Não preencha</label>
            <input id="d-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <button type="submit" disabled={state === "loading"} className={buttonClass("primary", "lg", "h-14")}>
            {state === "loading" ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-5 w-5 animate-spin" /> : null}
            {state === "loading" ? "Analisando" : "Testar meu site"}
          </button>
        </div>
        <p className="mt-4 text-sm text-graphite">
          Grátis e sem cadastro. O relatório aparece aqui mesmo. Se informar o e-mail, também mandamos uma cópia e podemos falar sobre o resultado, como explica a{" "}
          <Link href="/privacidade" className="link">Política de Privacidade</Link>.
        </p>
      </form>

      <div aria-live="polite" className="mt-6">
        {state === "loading" ? (
          <div className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
            <p className="font-medium">Isso leva de 20 a 40 segundos.</p>
            <ol className="mt-4 space-y-2">
              {steps.map((s, i) => (
                <li key={s} className={`flex items-center gap-3 text-[15px] ${i <= step ? "text-ink" : "text-graphite/60"}`}>
                  {i < step ? <Check aria-hidden strokeWidth={1.75} className="h-4 w-4 text-ok" /> : i === step ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> : <span className="h-4 w-4" />}
                  {s}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        {state === "error" ? <p role="alert" className="rounded-3xl bg-pink-light px-6 py-4 text-ink">{error}</p> : null}
      </div>

      {state === "done" && report ? <DiagnosticReport report={report} email={email} resultRef={resultRef} /> : null}
    </div>
  );
}
