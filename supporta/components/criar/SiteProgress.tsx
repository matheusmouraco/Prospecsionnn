"use client";

import { ArrowRight, Check, LoaderCircle, Monitor, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { chargesFor, customProject, pricing, priceLabel, type PlanId } from "@/lib/plans";
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
const MINUTOS = 15;

class NaoEncontrado extends Error {}

const LARGURA_COMPUTADOR = 1280;

/** A versão de computador abre sempre em 1280px e é reduzida para caber na tela, inclusive no celular. */
function PreviaComputador({ src, titulo }: { src: string; titulo: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(LARGURA_COMPUTADOR);
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = () => setLargura(el.clientWidth || LARGURA_COMPUTADOR);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const escala = Math.min(1, largura / LARGURA_COMPUTADOR);
  // Mantém a proporção de uma tela de computador, com altura fixa e sem barra sobrando na lateral.
  const alturaInterna = Math.round(Math.max(620, 800 * Math.max(escala, 0.6)) / escala);
  return (
    <div ref={caixa} className="w-full overflow-hidden" style={{ height: Math.round(alturaInterna * escala) }}>
      <iframe
        title={titulo}
        src={src}
        className="block origin-top-left border-0"
        style={{ width: escala < 1 ? LARGURA_COMPUTADOR : "100%", height: alturaInterna, transform: `scale(${escala})` }}
      />
    </div>
  );
}

/** Espera com progresso enquanto a IA monta, depois a prévia com o preço e o botão de publicar. */
export function SiteProgress({ token }: { token: string }) {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [erro, setErro] = useState("");
  const [agora, setAgora] = useState(() => Date.now());
  const [tela, setTela] = useState<"desktop" | "mobile">("desktop");
  const [dominio, setDominio] = useState(false);

  useEffect(() => {
    let parar = false;
    let timer: ReturnType<typeof setTimeout>;
    async function buscar() {
      try {
        const res = await fetch(`/api/criar/${token}`, { cache: "no-store" });
        const data = await res.json();
        if (res.status === 404) throw new NaoEncontrado(data.error ?? "Não encontramos este site.");
        if (!res.ok) throw new Error(data.error ?? "Falha ao consultar.");
        if (parar) return;
        setEstado(data);
        if (data.status === "previa") track("criar_previa", { plan: data.plano });
        if (["na_fila", "gerando", "pago", "publicando"].includes(data.status)) timer = setTimeout(buscar, 5000);
      } catch (err) {
        // Queda de internet ou do servidor não encerra a espera: só um pedido que não existe mostra erro.
        if (err instanceof NaoEncontrado) setErro(err.message);
        else if (!parar) timer = setTimeout(buscar, 10000);
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
        <p className="mt-4 text-lg text-graphite">Leva até {MINUTOS} minutos. Pode fechar esta página: o link chega no seu e-mail quando ficar pronto.</p>
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
              "A IA está criando as outras páginas do site. Você recebe o link no e-mail assim que ele entrar no ar."
            ) : (
              "Veja no computador e no celular. Se gostar, publique logo abaixo. Ajustes você pede depois, pela área do cliente."
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
            {tela === "mobile" ? (
              <iframe title={`Prévia do site da ${estado.empresa}`} src={estado.previa} className="block h-[760px] w-full" />
            ) : (
              <PreviaComputador src={estado.previa} titulo={`Prévia do site da ${estado.empresa}`} />
            )}
          </div>
        </div>
      ) : null}

      {!publicado && !publicando ? (
        <section aria-labelledby="publicar" className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-line bg-white p-6 md:p-8">
          <h2 id="publicar" className="text-3xl tracking-[-0.045em]">Gostou? Publique por {priceLabel(pricing.site)}.</h2>
          <p className="mt-2 text-[15px] text-graphite">Pago uma vez, no ar em até {pricing.prazoHoras}h em <span className="font-medium text-ink">{estado.slug}.supporta.com.br</span>. Alterações sem custo nos primeiros {pricing.diasAlteracaoGratis} dias.</p>
          <label className={`mt-5 flex cursor-pointer gap-3 rounded-2xl border p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink ${dominio ? "border-ink" : "border-line"}`}>
            <input type="checkbox" checked={dominio} onChange={(e) => setDominio(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#0B0B0F]" />
            <span className="text-[15px]">
              <span className="font-medium">Quero domínio próprio .com.br</span> (+{priceLabel(pricing.dominio)}/ano)
              <span className="block text-sm text-graphite">Opcional. Ex.: suaempresa.com.br.</span>
            </span>
          </label>
          <dl className="mt-5 divide-y divide-line text-[15px]">
            <div className="flex justify-between gap-4 py-2.5"><dt>Hoje</dt><dd className="font-semibold">{priceLabel(chargesFor(dominio).hoje)}</dd></div>
            <div className="flex justify-between gap-4 py-2.5"><dt className="text-graphite">A partir do 2º ano (endereço{dominio ? " e domínio" : ""})</dt><dd className="text-graphite">{priceLabel(chargesFor(dominio).anual)}/ano</dd></div>
          </dl>
          <a href={`/assinar/pro?site=${token}${dominio ? "&dominio=1" : ""}`} className={buttonClass("neon", "lg", "mt-6 w-full")} data-track="plan_click" data-track-plan="pro" data-track-origin="criar-previa">
            Publicar meu site <ArrowRight aria-hidden strokeWidth={1.75} className="h-5 w-5" />
          </a>
          <p className="mt-3 text-center text-sm text-graphite">Sem mensalidade e sem fidelidade. Arrependimento em até 7 dias.</p>
          <p className="mt-4 text-center">
            <a href={whatsappUrl(customProject.message)} target="_blank" rel="noopener" className="link text-[15px]">
              {customProject.label} {customProject.cta}
            </a>
          </p>
        </section>
      ) : null}
    </div>
  );
}
