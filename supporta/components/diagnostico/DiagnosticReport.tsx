"use client";

import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import type { Ref } from "react";
import { buttonClass } from "@/components/ui/Button";
import { whatsappUrl } from "@/lib/site";
import { Gauge } from "./Gauge";

export type Report = {
  url: string;
  scores: { performance: number; accessibility: number; bestPractices: number; seo: number } | null;
  lcpSeconds: number | null;
  checks: { id: string; label: string; ok: boolean; detail: string }[];
  recommendations: { title: string; text: string }[];
  emailSent?: boolean;
};

export const diagnosticSteps = ["Abrindo o seu site", "Medindo a velocidade no celular", "Conferindo título, descrição e dados estruturados", "Procurando llms.txt e robots.txt", "Montando o relatório"];

/** Relatório do diagnóstico: notas do PageSpeed, checagens para Google e IAs e recomendações. Usado na página e no popup da home. */
export function DiagnosticReport({ report, email, resultRef, onNavigate }: { report: Report; email?: string; resultRef?: Ref<HTMLDivElement>; onNavigate?: () => void }) {
  return (
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
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#planos" className={buttonClass("paper", "lg")} data-track="plan_click" data-track-origin="diagnostico" onClick={onNavigate}>
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
  );
}
