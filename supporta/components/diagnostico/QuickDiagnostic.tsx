"use client";

import { ArrowRight, Check, Globe, LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { DiagnosticReport, diagnosticSteps as steps, type Report } from "./DiagnosticReport";

/**
 * Formulário da home: com JavaScript, roda o diagnóstico ali mesmo e mostra o relatório num popup, sem pedir e-mail
 * e sem sair da página. Sem JavaScript, o form (GET) leva para /diagnostico.
 */
export function QuickDiagnostic() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state !== "loading") return;
    setStep(0);
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 4500);
    return () => window.clearInterval(id);
  }, [state]);

  async function run() {
    setState("loading");
    setError("");
    setReport(null);
    track("diagnostic_submit", { site: url, origin: "home" });
    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, origem: "home-popup" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Algo deu errado. Tente de novo.");
      setReport(data);
      setState("done");
      requestAnimationFrame(() => titleRef.current?.focus());
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim()) return;
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
    run();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <form action="/diagnostico" method="get" onSubmit={onSubmit} className="neon-ring mx-auto mt-10 flex max-w-2xl flex-col gap-2 rounded-[1.75rem] bg-card-dark p-2 sm:flex-row sm:rounded-full">
        <label htmlFor="diag-url" className="sr-only">Endereço do seu site</label>
        <div className="flex flex-1 items-center gap-3 px-4">
          <Globe aria-hidden strokeWidth={1.75} className="h-5 w-5 shrink-0 text-mist" />
          <input
            id="diag-url"
            name="url"
            type="text"
            inputMode="url"
            autoComplete="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="seusite.com.br"
            className="h-14 w-full bg-transparent text-lg text-paper placeholder:text-mist focus:outline-none"
          />
        </div>
        <button type="submit" disabled={state === "loading"} className={buttonClass("neon", "lg", "h-14")}>
          Testar agora <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-4 text-sm text-mist">Grátis, sem cadastro e sem sair desta página.</p>

      <dialog
        ref={dialogRef}
        aria-labelledby="diag-modal-title"
        onClose={() => {
          document.body.style.overflow = "";
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto max-h-[92dvh] w-[min(960px,calc(100vw-24px))] overflow-y-auto rounded-[2rem] bg-paper p-0 text-left text-ink backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-paper/95 px-5 py-4 backdrop-blur md:px-8">
          <h2 id="diag-modal-title" ref={titleRef} tabIndex={-1} className="truncate text-lg tracking-[-0.03em] focus:outline-none">
            Diagnóstico de <span className="font-mono text-base">{url.replace(/^https?:\/\//, "").replace(/\/$/, "") || "seu site"}</span>
          </h2>
          <button type="button" onClick={close} aria-label="Fechar relatório" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white hover:border-ink">
            <X aria-hidden strokeWidth={1.75} className="h-5 w-5" />
          </button>
        </div>

        <div aria-live="polite" className="p-5 md:p-8">
          {state === "loading" ? (
            <div className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
              <p className="font-medium">Analisando. Isso leva de 20 a 40 segundos.</p>
              <ol className="mt-4 space-y-2">
                {steps.map((s, i) => (
                  <li key={s} className={`flex items-center gap-3 text-[15px] ${i <= step ? "text-ink" : "text-graphite/60"}`}>
                    {i < step ? (
                      <Check aria-hidden strokeWidth={1.75} className="h-4 w-4 text-ok" />
                    ) : i === step ? (
                      <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin text-pink" />
                    ) : (
                      <span className="h-4 w-4" />
                    )}
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {state === "error" ? (
            <div className="space-y-4">
              <p role="alert" className="rounded-3xl bg-pink-light px-6 py-4">{error}</p>
              <div className="flex gap-3">
                <button type="button" onClick={run} className={buttonClass("primary", "md")}>Tentar de novo</button>
                <button type="button" onClick={close} className={buttonClass("outline", "md")}>Corrigir o endereço</button>
              </div>
            </div>
          ) : null}

          {state === "done" && report ? <DiagnosticReport report={report} onNavigate={close} /> : null}
        </div>
      </dialog>
    </>
  );
}
