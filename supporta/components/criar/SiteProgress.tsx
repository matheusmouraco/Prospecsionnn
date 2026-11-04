"use client";

import { ArrowRight, Check, LoaderCircle, Monitor, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { customProject, plans, priceLabel, type PlanId } from "@/lib/plans";
import { whatsappUrl } from "@/lib/site";

type Estado = {
  status: "na_fila" | "gerando" | "previa" | "erro" | "pago" | "publicando" | "no_ar" | "cancelado";
  empresa: string;
  slug: string;
  plano: PlanId;
  previa: string | null;
  endereco: string | null;
  criadoEm: string;
};

// O que a tela conta enquanto a IA trabalha (as etapas avançam pelo tempo; a de verdade vem do servidor).
const etapas = [
  "Lendo as suas respostas",
  "Escolhendo a tipografia e as cores",
  "Desenhando a primeira tela",
  "Escrevendo os textos com a sua voz",
  "Organizando os serviços e as perguntas",
  "Ajustando para o celular",
  "Revisando tudo antes de mostrar",
];
const MINUTOS = 6;

/** Espera com progresso enquanto a IA monta, depois a prévia com a escolha do plano. */
export function SiteProgress({ token }: { token: string }) {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [erro, setErro] = useState("");
  const [agora, setAgora] = useState(() => Date.now());
  const [tela, setTela] = useState<"desktop" | "mobile">("desktop");
  const [plano, setPlano] = useState<PlanId>("start");

  useEffect(() => {
    let parar = false;
    let timer: ReturnType<typeof setTimeout>;
    async function buscar() {
      try {
        const res = await fetch(`/api/criar/${token}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Não encontramos este site.");
        if (parar) return;
        setEstado(data);
        setPlano((p) => (p === "start" ? data.plano : p));
        if (data.status === "previa") track("criar_previa", { plan: data.plano });
        if (["na_fila", "gerando", "pago", "publicando"].includes(data.status)) timer = setTimeout(buscar, 5000);
      } catch (err) {
        setErro((err as Error).message);
      }
    }
    buscar();
    const relogio = setInterval(() => setAgora(Date.now()), 1000);
    return () => {
      parar = true;
      clearTimeout(timer);
      clearInterval(relogio);
    };
  }, [token]);

  if (erro) return <p role="alert" className="rounded-3xl bg-pink-light px-6 py-5 text-lg">{erro}</p>;
  if (!estado) {
    return (
      <p role="status" className="flex items-center gap-3 text-lg">
        <LoaderCircle aria-hidden strokeWidth={1.75} className="h-5 w-5 animate-spin" /> Carregando...
      </p>
    );
  }

  if (estado.status === "na_fila" || estado.status === "gerando") {
    const passou = Math.max(0, (agora - new Date(estado.criadoEm).getTime()) / 1000);
    const pct = Math.min(96, Math.round((passou / (MINUTOS * 60)) * 100));
    const atual = Math.min(etapas.length - 1, Math.floor((pct / 100) * etapas.length));
    return (
      <div className="mx-auto max-w-2xl">
        <p className="label-mono text-pink">A IA está trabalhando</p>
        <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1] tracking-[-0.055em]">Montando o site da {estado.empresa}.</h1>
        <p className="mt-4 text-lg text-graphite">Leva uns {MINUTOS} minutos. Pode fechar esta página: o link chega no seu e-mail quando ficar pronto.</p>
        <div className="mt-8 h-3 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Progresso da criação">
          <div className="neon-bar h-full rounded-full transition-[width] duration-1000" style={{ width: `${Math.max(4, pct)}%` }} />
        </div>
        <ol className="mt-8 space-y-3" aria-live="polite">
          {etapas.map((e, i) => (
            <li key={e} className={`flex items-center gap-3 text-[17px] ${i > atual ? "text-graphite/60" : ""}`}>
              <span aria-hidden className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${i < atual ? "bg-ink text-paper" : i === atual ? "bg-pink text-ink" : "border border-line"}`}>
                {i < atual ? <Check strokeWidth={2.5} className="h-4 w-4" /> : i === atual ? <LoaderCircle strokeWidth={2} className="h-4 w-4 animate-spin" /> : null}
              </span>
              {e}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (estado.status === "erro" || estado.status === "cancelado") {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-[clamp(2.25rem,6vw,4rem)] leading-[1] tracking-[-0.055em]">A IA travou nesse site.</h1>
        <p className="mt-4 text-lg text-graphite">Já avisamos a equipe. Chama a gente no WhatsApp que a gente resolve com você.</p>
        <a href={whatsappUrl(`Oi! O criador da Supporta travou no site da ${estado.empresa}.`)} target="_blank" rel="noopener" className={buttonClass("primary", "lg", "mt-6")}>Falar no WhatsApp</a>
      </div>
    );
  }

  const publicado = estado.status === "no_ar";
  const publicando = estado.status === "pago" || estado.status === "publicando";
  return (
    <div>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="label-mono text-pink">{publicado ? "No ar" : publicando ? "Pagamento confirmado" : "Ficou pronto"}</p>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1] tracking-[-0.055em]">
            {publicado ? "Seu site está no ar." : publicando ? "Publicando o seu site." : `O site da ${estado.empresa}.`}
          </h1>
          <p className="mt-3 text-lg text-graphite">
            {publicado ? (
              <a href={estado.endereco ?? "#"} className="link" target="_blank" rel="noopener">{estado.endereco?.replace("https://", "")}</a>
            ) : publicando ? (
              "A IA está criando as outras páginas do seu plano. Você recebe o link no e-mail em poucos minutos."
            ) : (
              "Gostou? Escolha o plano e ele vai ao ar em minutos. Ajustes você pede depois, pela área do cliente."
            )}
          </p>
        </div>
        <div role="group" aria-label="Ver no computador ou no celular" className="inline-flex shrink-0 rounded-full border border-line bg-white p-1">
          {(["desktop", "mobile"] as const).map((t) => (
            <button key={t} type="button" aria-pressed={tela === t} onClick={() => setTela(t)} className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[15px] font-medium ${tela === t ? "bg-ink text-paper" : ""}`}>
              {t === "desktop" ? <Monitor aria-hidden strokeWidth={1.75} className="h-4 w-4" /> : <Smartphone aria-hidden strokeWidth={1.75} className="h-4 w-4" />}
              {t === "desktop" ? "Computador" : "Celular"}
            </button>
          ))}
        </div>
      </div>

      {estado.previa ? (
        <div className="mt-8 flex justify-center">
          <div className={`overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_30px_80px_-30px_rgb(11_11_15/0.4)] ${tela === "mobile" ? "w-[390px] max-w-full" : "w-full"}`}>
            <iframe title={`Prévia do site da ${estado.empresa}`} src={estado.previa} className={`block w-full ${tela === "mobile" ? "h-[760px]" : "h-[78vh]"}`} />
          </div>
        </div>
      ) : null}

      {!publicado && !publicando ? (
        <section aria-labelledby="escolha-plano" className="mt-12">
          <h2 id="escolha-plano" className="text-center text-3xl tracking-[-0.045em]">Escolha o plano para publicar</h2>
          <div className="mx-auto mt-8 grid max-w-4xl gap-3 md:grid-cols-3">
            {plans.map((p) => (
              <label key={p.id} className={`cursor-pointer rounded-[1.5rem] border bg-white p-5 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink ${plano === p.id ? "border-ink shadow-[0_0_0_1px_var(--ink)]" : "border-line"}`}>
                <input type="radio" name="plano" value={p.id} checked={plano === p.id} onChange={() => setPlano(p.id)} className="sr-only" />
                <span className="flex items-center justify-between gap-2">
                  <span className="text-lg font-semibold">{p.name}</span>
                  {p.highlight ? <span className="rounded-full bg-pink px-2.5 py-0.5 text-xs font-semibold">Mais escolhido</span> : null}
                </span>
                <span className="mt-1 block text-2xl font-semibold tracking-[-0.04em]">{priceLabel(p.price)}<span className="text-base font-normal text-graphite">/mês</span></span>
                <span className="mt-2 block text-sm text-graphite">{p.pitch}</span>
              </label>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <a href={`/assinar/${plano}?site=${token}`} className={buttonClass("neon", "lg")} data-track="plan_click" data-track-plan={plano} data-track-origin="criar-previa">
              Publicar meu site <ArrowRight aria-hidden strokeWidth={1.75} className="h-5 w-5" />
            </a>
            <p className="text-sm text-graphite">Sem custo de criação. Mínimo de 12 meses, no cartão.</p>
            <a href={whatsappUrl(customProject.message)} target="_blank" rel="noopener" className="link mt-2 text-[15px]">
              {customProject.label} {customProject.cta}
            </a>
          </div>
        </section>
      ) : null}
    </div>
  );
}
