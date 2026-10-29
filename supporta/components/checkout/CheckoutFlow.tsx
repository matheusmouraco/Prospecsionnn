"use client";

import { ArrowLeft, ArrowRight, Check, LoaderCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { isCpfOrCnpj, onlyDigits } from "@/lib/documents";
import { annualFreeMonths, billing, parseCycle, priceFor, type Cycle, type Plan } from "@/lib/plans";
import { formatBRL, formatBRLCents } from "@/lib/site";

type Segment = { slug: string; tab: string };

const stepsLabels = ["Dados da empresa", "Briefing rápido", "Pagamento"];

const input = "mt-2 h-13 w-full rounded-2xl border border-line bg-white px-4 text-base focus:border-ink focus:outline-none aria-[invalid=true]:border-bad";
const textarea = "mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-base focus:border-ink focus:outline-none";

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-medium">
        {label}
      </label>
      {children}
      {hint && !error ? <p id={`${id}-hint`} className="mt-1.5 text-sm text-graphite">{hint}</p> : null}
      {error ? <p id={`${id}-erro`} className="mt-1.5 text-sm font-medium text-bad">{error}</p> : null}
    </div>
  );
}

function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

function maskDoc(v: string) {
  const d = onlyDigits(v).slice(0, 14);
  if (d.length <= 11) return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return d.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
}

export function CheckoutFlow({ plan, segments }: { plan: Plan; segments: Segment[] }) {
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState({ empresa: "", responsavel: "", documento: "", email: "", whatsapp: "" });
  const [briefing, setBriefing] = useState({ segmento: "", cidade: "", siteAtual: "", servicos: "", objetivo: "Receber mais contatos", temLogo: "sim", observacoes: "" });
  const [aceite, setAceite] = useState(false);
  const [cycle, setCycle] = useState<Cycle>("mensal");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [canceled, setCanceled] = useState(false);
  const [origem, setOrigem] = useState({ origem: "", site: "", modelo: "" });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modelo = params.get("modelo");
    if (modelo && segments.some((s) => s.slug === modelo)) setBriefing((b) => ({ ...b, segmento: modelo }));
    // Vindo do esboço da Matilab (ou de outro link pronto): já preenche empresa e site.
    const empresa = params.get("empresa")?.slice(0, 120);
    const siteAtual = params.get("site")?.slice(0, 200);
    if (empresa) setCompany((c) => ({ ...c, empresa }));
    if (siteAtual) setBriefing((b) => ({ ...b, siteAtual }));
    setOrigem({ origem: params.get("origem")?.slice(0, 60) ?? "", site: siteAtual ?? "", modelo: modelo ?? "" });
    setCanceled(params.get("cancelado") === "1");
    setCycle(parseCycle(params.get("ciclo")));
    if (!started.current) {
      started.current = true;
      track("begin_checkout", { plan: plan.id, value: plan.price, currency: "BRL" });
    }
  }, [plan, segments]);

  const go = (next: number) => {
    setStep(next);
    setErrors({});
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  };

  function validateCompany() {
    const e: Record<string, string> = {};
    if (company.empresa.trim().length < 2) e.empresa = "Informe o nome da empresa.";
    if (company.responsavel.trim().length < 2) e.responsavel = "Informe o seu nome.";
    if (!isCpfOrCnpj(company.documento)) e.documento = "CPF ou CNPJ inválido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(company.email)) e.email = "E-mail inválido.";
    const phone = onlyDigits(company.whatsapp);
    if (phone.length < 10 || phone.length > 11) e.whatsapp = "WhatsApp com DDD, só números.";
    return e;
  }

  function validateBriefing() {
    const e: Record<string, string> = {};
    if (!briefing.segmento) e.segmento = "Escolha o segmento.";
    if (briefing.cidade.trim().length < 2) e.cidade = "Informe a cidade ou região.";
    if (briefing.servicos.trim().length < 10) e.servicos = "Conte em poucas palavras o que a empresa oferece.";
    return e;
  }

  function onNext(e: FormEvent) {
    e.preventDefault();
    const found = step === 0 ? validateCompany() : validateBriefing();
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`c-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    go(step + 1);
  }

  async function onPay(e: FormEvent) {
    e.preventDefault();
    if (!aceite) {
      setErrors({ aceite: "Para continuar, aceite os Termos." });
      document.getElementById("c-aceite")?.focus();
      return;
    }
    setSending(true);
    setServerError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: plan.id, ciclo: cycle, company: { ...company, whatsapp: `55${onlyDigits(company.whatsapp)}` }, briefing, aceite, origem }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Não foi possível continuar.");
      window.location.assign(data.redirectUrl);
    } catch (err) {
      setServerError((err as Error).message);
      setSending(false);
    }
  }

  const aria = (key: string) => ({ "aria-invalid": Boolean(errors[key]) || undefined, "aria-describedby": errors[key] ? `c-${key}-erro` : undefined });

  return (
    <div>
      <ol aria-label="Etapas do checkout" className="grid grid-cols-3 gap-2">
        {stepsLabels.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} className="min-w-0">
            <span className={`block h-2 rounded-full ${i <= step ? "bg-ink" : "bg-line"}`} />
            <span className={`label-mono mt-2 block truncate ${i === step ? "text-ink" : "text-graphite"}`}>
              {String(i + 1).padStart(2, "0")} {label}
            </span>
          </li>
        ))}
      </ol>

      {canceled && step === 0 ? (
        <p role="status" className="mt-6 rounded-2xl bg-pink-light px-5 py-3">O pagamento não foi concluído. Você pode tentar de novo quando quiser.</p>
      ) : null}

      <h2 ref={headingRef} tabIndex={-1} className="mt-10 scroll-mt-24 text-3xl tracking-[-0.045em] focus:outline-none">
        {stepsLabels[step]}
      </h2>

      {step === 0 ? (
        <form onSubmit={onNext} noValidate className="mt-6 grid gap-5 md:grid-cols-2">
          <Field id="c-empresa" label="Nome da empresa" error={errors.empresa}>
            <input id="c-empresa" className={input} autoComplete="organization" value={company.empresa} onChange={(e) => setCompany({ ...company, empresa: e.target.value })} {...aria("empresa")} />
          </Field>
          <Field id="c-responsavel" label="Seu nome" error={errors.responsavel}>
            <input id="c-responsavel" className={input} autoComplete="name" value={company.responsavel} onChange={(e) => setCompany({ ...company, responsavel: e.target.value })} {...aria("responsavel")} />
          </Field>
          <Field id="c-documento" label="CPF ou CNPJ" hint="Não precisa ter CNPJ. A nota e o domínio saem neste documento." error={errors.documento}>
            <input id="c-documento" className={input} inputMode="numeric" value={company.documento} onChange={(e) => setCompany({ ...company, documento: maskDoc(e.target.value) })} {...aria("documento")} />
          </Field>
          <Field id="c-email" label="E-mail" error={errors.email}>
            <input id="c-email" type="email" className={input} autoComplete="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} {...aria("email")} />
          </Field>
          <Field id="c-whatsapp" label="WhatsApp" hint="Com DDD. É por aqui que a gente fala com você." error={errors.whatsapp}>
            <input id="c-whatsapp" type="tel" className={input} autoComplete="tel-national" inputMode="tel" value={company.whatsapp} onChange={(e) => setCompany({ ...company, whatsapp: maskPhone(e.target.value) })} {...aria("whatsapp")} />
          </Field>
          <div className="md:col-span-2">
            <button type="submit" className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
              Continuar <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
            </button>
          </div>
        </form>
      ) : null}

      {step === 1 ? (
        <form onSubmit={onNext} noValidate className="mt-6 grid gap-5 md:grid-cols-2">
          <Field id="c-segmento" label="Segmento" error={errors.segmento}>
            <select id="c-segmento" className={input} value={briefing.segmento} onChange={(e) => setBriefing({ ...briefing, segmento: e.target.value })} {...aria("segmento")}>
              <option value="">Escolha</option>
              {segments.map((s) => (
                <option key={s.slug} value={s.slug}>{s.tab}</option>
              ))}
              <option value="outro">Outro</option>
            </select>
          </Field>
          <Field id="c-cidade" label="Cidade ou região que atende" error={errors.cidade}>
            <input id="c-cidade" className={input} autoComplete="address-level2" value={briefing.cidade} onChange={(e) => setBriefing({ ...briefing, cidade: e.target.value })} {...aria("cidade")} />
          </Field>
          <div className="md:col-span-2">
            <Field id="c-servicos" label="O que a empresa oferece?" hint="Os principais serviços ou produtos. A gente escreve os textos a partir daqui." error={errors.servicos}>
              <textarea id="c-servicos" rows={3} className={textarea} value={briefing.servicos} onChange={(e) => setBriefing({ ...briefing, servicos: e.target.value })} {...aria("servicos")} />
            </Field>
          </div>
          <Field id="c-siteAtual" label="Site atual (se tiver)">
            <input id="c-siteAtual" className={input} inputMode="url" placeholder="seusite.com.br" value={briefing.siteAtual} onChange={(e) => setBriefing({ ...briefing, siteAtual: e.target.value })} />
          </Field>
          <Field id="c-objetivo" label="Principal objetivo do site">
            <select id="c-objetivo" className={input} value={briefing.objetivo} onChange={(e) => setBriefing({ ...briefing, objetivo: e.target.value })}>
              <option>Receber mais contatos</option>
              <option>Aparecer no Google e nas IAs</option>
              <option>Passar mais credibilidade</option>
              <option>Mostrar portfólio ou cardápio</option>
            </select>
          </Field>
          <fieldset className="md:col-span-2">
            <legend className="text-[15px] font-medium">Já tem logo?</legend>
            <div className="mt-2 flex gap-2">
              {[
                ["sim", "Sim"],
                ["nao", "Ainda não"],
              ].map(([value, label]) => (
                <label key={value} className={`inline-flex h-11 cursor-pointer items-center rounded-full border px-5 text-[15px] has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink ${briefing.temLogo === value ? "border-ink bg-ink text-paper" : "border-line bg-white"}`}>
                  <input type="radio" name="temLogo" value={value} checked={briefing.temLogo === value} onChange={() => setBriefing({ ...briefing, temLogo: value })} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="md:col-span-2">
            <Field id="c-observacoes" label="Algo mais que a gente precisa saber? (opcional)">
              <textarea id="c-observacoes" rows={2} className={textarea} value={briefing.observacoes} onChange={(e) => setBriefing({ ...briefing, observacoes: e.target.value })} />
            </Field>
          </div>
          <p className="text-sm text-graphite md:col-span-2">Logo, fotos e detalhes você manda depois pelo WhatsApp, no briefing completo de 10 minutos.</p>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
            <button type="submit" className={buttonClass("primary", "lg")}>
              Continuar <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go(0)} className={buttonClass("ghost", "lg")}>
              <ArrowLeft aria-hidden strokeWidth={1.75} className="h-4 w-4" /> Voltar
            </button>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        <form onSubmit={onPay} noValidate className="mt-6 space-y-6">
          <fieldset>
            <legend className="text-[15px] font-medium">Como você prefere pagar?</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(["mensal", "anual"] as Cycle[]).map((c) => {
                const on = cycle === c;
                return (
                  <label
                    key={c}
                    className={`relative flex cursor-pointer flex-col rounded-3xl border p-5 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink ${on ? "border-ink bg-white shadow-[0_0_0_1px_var(--ink)]" : "border-line bg-white"}`}
                  >
                    <input type="radio" name="ciclo" value={c} checked={on} onChange={() => setCycle(c)} className="sr-only" />
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{c === "mensal" ? "Mensal" : "Anual"}</span>
                      {c === "anual" ? <span className="rounded-full bg-pink px-2.5 py-0.5 text-xs font-semibold text-ink">{annualFreeMonths} meses grátis</span> : null}
                    </span>
                    <span className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                      {c === "mensal" ? `R$${plan.price}` : formatBRL(priceFor(plan, "anual"))}
                      <span className="text-base font-normal text-graphite">{c === "mensal" ? "/mês" : "/ano"}</span>
                    </span>
                    <span className="mt-1 text-sm text-graphite">
                      {c === "mensal" ? "Uma cobrança por mês no cartão" : `Uma cobrança por ano, equivale a ${formatBRLCents(priceFor(plan, "anual") / 12)}/mês`}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="rounded-3xl border border-line bg-white p-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-lg font-semibold tracking-[-0.03em]">Plano {plan.name} {cycle}</p>
              <p className="text-2xl font-semibold tracking-[-0.04em]">
                {cycle === "anual" ? formatBRL(priceFor(plan, "anual")) : `R$${plan.price}`}
                <span className="text-base font-normal text-graphite">{cycle === "anual" ? "/ano" : "/mês"}</span>
              </p>
            </div>
            <ul className="mt-4 space-y-1.5 text-[15px] text-graphite">
              <li className="flex gap-2"><Check aria-hidden strokeWidth={1.75} className="mt-1 h-4 w-4 shrink-0 text-ink" /> {cycle === "anual" ? "Cobrança no cartão de crédito, uma vez por ano" : "Cobrança recorrente no cartão de crédito, todo mês"}</li>
              <li className="flex gap-2"><Check aria-hidden strokeWidth={1.75} className="mt-1 h-4 w-4 shrink-0 text-ink" /> Sem custo de criação</li>
              <li className="flex gap-2"><Check aria-hidden strokeWidth={1.75} className="mt-1 h-4 w-4 shrink-0 text-ink" /> Assinatura: o site fica no ar enquanto ela estiver ativa. Mínimo de {billing.minMonths} meses, que é o que permite não cobrar a criação.</li>
              <li className="flex gap-2"><Check aria-hidden strokeWidth={1.75} className="mt-1 h-4 w-4 shrink-0 text-ink" /> Cancelar antes de {billing.minMonths} meses: multa de {billing.earlyCancelFeePct}% sobre o que falta. Depois, cancela quando quiser, sem multa.</li>
              <li className="flex gap-2"><Check aria-hidden strokeWidth={1.75} className="mt-1 h-4 w-4 shrink-0 text-ink" /> A partir do 13º mês, {billing.loyaltyDiscountPct}% de desconto para quem continua.</li>
            </ul>
            <p className="mt-4 text-sm text-graphite">
              Quer outro plano? <Link href="/planos" className="link text-ink">Ver os planos</Link>
            </p>
          </div>

          <div>
            <label htmlFor="c-aceite" className="flex cursor-pointer gap-3 rounded-2xl border border-line bg-white p-4">
              <input
                id="c-aceite"
                type="checkbox"
                required
                checked={aceite}
                onChange={(e) => setAceite(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[#0B0B0F]"
                {...aria("aceite")}
              />
              <span className="text-[15px] leading-relaxed">
                Li e aceito os{" "}
                <Link href="/termos" target="_blank" className="link font-medium">Termos</Link>
                 da assinatura, incluindo o prazo mínimo de {billing.minMonths} meses e a multa por cancelamento antecipado. Também li a{" "}
                <Link href="/privacidade" target="_blank" className="link">Política de Privacidade</Link>.
              </span>
            </label>
            {errors.aceite ? <p id="c-aceite-erro" className="mt-1.5 text-sm font-medium text-bad">{errors.aceite}</p> : null}
            <p className="mt-2 text-sm text-graphite">Registramos a data, a hora e o IP do seu aceite.</p>
          </div>

          {serverError ? <p role="alert" className="rounded-2xl bg-pink-light px-5 py-3">{serverError}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={sending} className={buttonClass("primary", "lg")}>
              {sending ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> : <Lock aria-hidden strokeWidth={1.75} className="h-4 w-4" />}
              {sending ? "Abrindo pagamento seguro" : "Ir para o pagamento seguro"}
            </button>
            <button type="button" onClick={() => go(1)} className={buttonClass("ghost", "lg")}>
              <ArrowLeft aria-hidden strokeWidth={1.75} className="h-4 w-4" /> Voltar
            </button>
          </div>
          <p className="text-sm text-graphite">Os dados do cartão são digitados direto na página do nosso parceiro de pagamento. A Supporta não vê nem guarda o número do seu cartão.</p>
        </form>
      ) : null}
    </div>
  );
}
