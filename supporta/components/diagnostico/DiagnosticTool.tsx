"use client";

import { ArrowRight, Check, LoaderCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/site";
import { Gauge } from "./Gauge";

type Report = {
  url: string;
  scores: { performance: number; accessibility: number; bestPractices: number; seo: number } | null;
  lcpSeconds: number | null;
  checks: { id: string; label: string; ok: boolean; detail: string }[];
  recommendations: { title: string; text: string }[];
  emailSent?: boolean;
};

const steps = ["Abrindo o seu site", "Medindo a velocidade no celular", "Conferindo título, descrição e dados estruturados", "Procurando llms.txt e robots.txt", "Montando o relatório"];

export function DiagnosticTool() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("url");
    if (fromQuery) {
      setUrl(fromQuery.slice(0, 300));
      emailRef.current?.focus();
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
            <label htmlFor="d-email" className="label-mono text-graphite">Seu e-mail</label>
            <input
              ref={emailRef}
              id="d-email"
              type="email"
              autoComplete="email"
              required
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
          Grátis. Usamos o seu e-mail para enviar o relatório e falar sobre o resultado, como explica a{" "}
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

      {state === "done" && report ? (
        <div ref={resultRef} tabIndex={-1} className="mt-2 space-y-4 focus:outline-none">
          <div className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
            <p className="label-mono text-graphite">Relatório · celular</p>
            {report.emailSent ? <p className="mt-2 text-sm text-graphite">Também enviamos este relatório para {email}.</p> : null}
            <h2 className="mt-3 break-words text-2xl tracking-[-0.04em] md:text-3xl">{report.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</h2>
            {report.scores ? (
              <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                <Gauge value={report.scores.performance} label="Desempenho" />
                <Gauge value={report.scores.accessibility} label="Acessibilidade" />
                <Gauge value={report.scores.bestPractices} label="Boas práticas" />
                <Gauge value={report.scores.seo} label="SEO" />
              </div>
            ) : (
              <p className="mt-6 text-graphite">O PageSpeed do Google não respondeu agora. As checagens abaixo foram feitas normalmente.</p>
            )}
          </div>

          {report.checks.length ? (
            <div className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
              <h3 className="text-xl tracking-[-0.03em]">Pronto pro Google e pras IAs?</h3>
              <ul className="mt-5 divide-y divide-line">
                {report.checks.map((c) => (
                  <li key={c.id} className="flex gap-4 py-4">
                    <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${c.ok ? "bg-ok text-white" : "bg-bad text-white"}`}>
                      {c.ok ? <Check aria-hidden strokeWidth={2.25} className="h-3.5 w-3.5" /> : <X aria-hidden strokeWidth={2.25} className="h-3.5 w-3.5" />}
                    </span>
                    <div>
                      <p className="font-medium">
                        {c.label} <span className="sr-only">{c.ok ? "(ok)" : "(precisa de atenção)"}</span>
                      </p>
                      <p className="mt-1 break-words text-[15px] text-graphite">{c.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-[2rem] bg-ink p-6 text-paper md:p-8">
            <h3 className="text-xl tracking-[-0.03em]">3 recomendações para o seu site</h3>
            <ol className="mt-6 space-y-5">
              {report.recommendations.map((r, i) => (
                <li key={r.title} className="grid grid-cols-[40px_1fr] gap-3">
                  <span className="font-mono text-mist">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-mist">{r.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#planos" className={buttonClass("paper", "lg")} data-track="plan_click" data-track-origin="diagnostico">
                Resolver com a Supporta <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl(`Oi! Fiz o diagnóstico do ${report.url} e quero ajuda.`)}
                target="_blank"
                rel="noopener"
                className={buttonClass("outline-dark", "lg")}
                data-track="whatsapp_click"
                data-track-origin="diagnostico-resultado"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
