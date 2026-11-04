"use client";

import { ArrowLeft, ArrowRight, Check, ImagePlus, LoaderCircle, Plus, Sparkles, Wand2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BrowserFrame } from "@/components/mockups/Frames";
import { SiteMock } from "@/components/mockups/SiteMock";
import { buttonClass } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { direcoes, objetivos, personalidades, ramos, respostasVazias, type Contato, type Respostas } from "@/lib/criador";
import { onlyDigits } from "@/lib/documents";
import { plans, priceLabel, type PlanId } from "@/lib/plans";
import { whatsappUrl } from "@/lib/site";
import { coresDoLogo } from "./logoColors";

const DRAFT_KEY = "supporta-criar-v2";
const input = "mt-2 h-14 w-full rounded-2xl border border-line bg-white px-5 text-lg focus:border-ink focus:outline-none";
const textarea = "mt-2 w-full rounded-2xl border border-line bg-white px-5 py-4 text-lg focus:border-ink focus:outline-none";

const fases = [
  { id: "nome", nome: "Nome", elogio: "Bom nome." },
  { id: "logo", nome: "Logo e cores", elogio: "Sua marca manda aqui." },
  { id: "ramo", nome: "Ramo", elogio: "Anotado." },
  { id: "faz", nome: "O que faz", elogio: "Ficou claro." },
  { id: "historia", nome: "Sua história", elogio: "É isso que diferencia." },
  { id: "estilo", nome: "Direção", elogio: "Ótimo gosto." },
  { id: "sensacao", nome: "Sensação", elogio: "Combina." },
  { id: "servicos", nome: "Serviços", elogio: "Isso vende." },
  { id: "onde", nome: "Onde atende", elogio: "Perfeito." },
  { id: "fotos", nome: "Fotos", elogio: "Quase lá." },
  { id: "dados", nome: "Seus dados", elogio: "" },
] as const;

function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

function Chip({ on, onClick, children, disabled }: { on: boolean; onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2 text-[15px] font-medium transition-[background-color,border-color,transform] active:scale-95 disabled:opacity-40 ${on ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink"}`}
    >
      {on ? <Check aria-hidden strokeWidth={2.5} className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

/** O jogo: uma pergunta por vez, com o site tomando forma ao lado. No fim, a IA monta a versão de verdade. */
export function SiteBuilder({ initialPlan }: { initialPlan: PlanId }) {
  const [fase, setFase] = useState(0);
  const [rodada, setRodada] = useState(0);
  const [logoMono, setLogoMono] = useState(false);
  const [r, setR] = useState<Respostas>(respostasVazias);
  const [contato, setContato] = useState<Contato>({ nome: "", email: "", whatsapp: "" });
  const [plano, setPlano] = useState<PlanId>(initialPlan);
  const [novoServico, setNovoServico] = useState("");
  const [lote, setLote] = useState("");
  const [uploading, setUploading] = useState(0);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [elogio, setElogio] = useState("");
  // Sem banco ou gerador disponível, o jogo não se perde: as respostas vão prontas para o WhatsApp.
  const [plantao, setPlantao] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
      if (saved?.r) setR({ ...respostasVazias, ...saved.r });
      if (saved?.contato) setContato(saved.contato);
      if (typeof saved?.fase === "number") setFase(Math.min(saved.fase, fases.length - 1));
      if (saved?.lote) setLote(saved.lote);
    } catch {}
    loaded.current = true;
    track("criar_inicio", {});
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ r, contato, fase, lote }));
    } catch {}
  }, [r, contato, fase, lote]);

  const etapa = fases[fase].id;
  const ramo = ramos.find((x) => x.slug === r.ramo);
  const set = <K extends keyof Respostas>(k: K, v: Respostas[K]) => setR((prev) => ({ ...prev, [k]: v }));

  const mock = useMemo(() => {
    const accent = r.cores.modo === "propria" ? r.cores.primaria : "#FF3D71";
    const escuro = r.direcao.fundo === "escuro";
    const text = escuro ? "#FFFFFF" : "#0B0B0F";
    const surface = escuro ? "#0F0F12" : "#FFFFFF";
    const servicos = (r.servicos.length ? r.servicos : (ramo?.servicos ?? ["Serviço 1", "Serviço 2", "Serviço 3"])).slice(0, 3);
    return {
      business: r.empresa || "Seu negócio",
      kicker: r.ramo === "outro" ? r.ramoOutro || "Seu ramo" : (ramo?.nome ?? "Seu ramo"),
      headline: r.frase ? r.frase.split(/[.!?]/)[0].replace(/^(.{0,58}\S)\s.*$/, "$1") : r.empresa || "O seu site começa aqui",
      cta: "Falar no WhatsApp",
      services: servicos,
      about: r.cidade ? `Atendimento em ${r.cidade}.` : "Conte o que você faz e a gente escreve o resto.",
      accent,
      surface,
      text,
      serif: r.direcao.letra === "classica",
    };
  }, [r, ramo]);

  function podeAvancar(): string {
    if (etapa === "nome" && r.empresa.trim().length < 2) return "Escreva o nome do negócio.";
    if (etapa === "logo" && !r.coresOrigem) return logoMono ? "Seu logo é preto e branco: escolha as cores da marca ou deixe a IA escolher." : "Escolha as cores da marca ou deixe a IA escolher.";
    if (etapa === "ramo" && !r.ramo) return "Escolha o ramo.";
    if (etapa === "ramo" && r.ramo === "outro" && r.ramoOutro.trim().length < 3) return "Conte qual é o ramo.";
    if (etapa === "faz" && r.frase.trim().length < 8) return "Escreva em uma frase o que você faz.";
    if (etapa === "servicos" && !r.servicos.length) return "Escolha ou escreva pelo menos um serviço.";
    if (etapa === "onde" && r.cidade.trim().length < 2) return "Diga a cidade ou região que você atende.";
    if (etapa === "dados") {
      if (contato.nome.trim().length < 2) return "Escreva o seu nome.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contato.email)) return "E-mail inválido.";
      const d = onlyDigits(contato.whatsapp);
      if (d.length < 10 || d.length > 11) return "WhatsApp com DDD.";
    }
    if (uploading > 0) return "Espere terminar o envio das imagens.";
    return "";
  }

  function ir(next: number) {
    setErro("");
    if (next > fase) setElogio(fases[fase].elogio);
    setFase(next);
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }

  function avancar() {
    const problema = podeAvancar();
    if (problema) {
      setErro(problema);
      return;
    }
    if (fase === fases.length - 1) return montar();
    ir(fase + 1);
  }

  function responderDirecao(opcao: string | null) {
    const atual = direcoes[rodada];
    const direcao = { ...r.direcao };
    if (opcao) direcao[atual.id] = opcao;
    else delete direcao[atual.id];
    set("direcao", direcao);
    if (rodada < direcoes.length - 1) setRodada(rodada + 1);
    else ir(fase + 1);
  }

  function toggleServico(s: string) {
    set("servicos", r.servicos.includes(s) ? r.servicos.filter((x) => x !== s) : [...r.servicos, s].slice(0, 8));
  }

  function addServico() {
    const s = novoServico.trim().replace(/\s*[—–]\s*/g, ", ");
    if (s && !r.servicos.includes(s)) set("servicos", [...r.servicos, s].slice(0, 8));
    setNovoServico("");
  }

  async function upload(files: FileList | null, kind: "logo" | "foto") {
    if (!files?.length) return;
    setErro("");
    for (const file of Array.from(files).slice(0, kind === "logo" ? 1 : 8 - r.fotos.length)) {
      setUploading((n) => n + 1);
      try {
        const res = await fetch("/api/criar/upload", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type: file.type, size: file.size, kind, lote }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Falha no envio.");
        if (data.lote) setLote(data.lote);
        const put = await fetch(data.uploadUrl, { method: "PUT", headers: { "content-type": file.type }, body: file });
        if (!put.ok) throw new Error("Falha ao enviar o arquivo.");
        if (kind === "logo") {
          const cores = await coresDoLogo(file);
          setLogoMono(!cores.length);
          setR((prev) => ({
            ...prev,
            logo: data.url,
            ...(cores.length
              ? { cores: { modo: "propria" as const, primaria: cores[0], secundaria: cores[1] ?? cores[0] }, coresOrigem: "logo" as const }
              : prev.coresOrigem === "logo"
                ? { cores: { modo: "ia" as const }, coresOrigem: "" as const }
                : {}),
          }));
        }
        else setR((prev) => ({ ...prev, fotos: [...prev.fotos, data.url].slice(0, 8) }));
      } catch (err) {
        setErro(`${file.name}: ${(err as Error).message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  async function montar() {
    setEnviando(true);
    setErro("");
    try {
      const res = await fetch("/api/criar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ respostas: { ...r, whatsappSite: r.whatsappSite || contato.whatsapp }, contato: { ...contato, whatsapp: onlyDigits(contato.whatsapp) }, plano }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503 || res.status === 409) setPlantao(true);
      if (!res.ok) throw new Error(data.error ?? "Não foi possível continuar.");
      track("criar_enviado", { plan: plano });
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      window.location.assign(`/criar/${data.token}`);
    } catch (err) {
      setErro((err as Error).message);
      setEnviando(false);
    }
  }

  const pct = Math.round((fase / (fases.length - 1)) * 100);
  const direcaoAtual = direcoes[rodada];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="label-mono text-graphite">Fase {fase + 1} de {fases.length} · {fases[fase].nome}</span>
          <span aria-live="polite" className="font-medium text-pink">{elogio}</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Progresso do seu site">
          <div className="neon-bar h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.max(6, pct)}%` }} />
        </div>

        <form
          className="mt-10"
          onSubmit={(e) => {
            e.preventDefault();
            if (etapa !== "estilo") avancar();
          }}
        >
          {etapa === "nome" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">Como se chama o seu negócio?</h2>
              <p className="mt-3 text-lg text-graphite">É o nome que vai aparecer no topo do site.</p>
              <label htmlFor="q-empresa" className="sr-only">Nome do negócio</label>
              <input id="q-empresa" autoFocus className={input} autoComplete="organization" placeholder="Ex.: Clínica Sorriso Leve" value={r.empresa} onChange={(e) => set("empresa", e.target.value)} />
            </div>
          ) : null}

          {etapa === "ramo" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">Qual é o seu ramo?</h2>
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
                {ramos.map((x) => (
                  <button
                    key={x.slug}
                    type="button"
                    aria-pressed={r.ramo === x.slug}
                    onClick={() => {
                      set("ramo", x.slug);
                      if (x.slug !== "outro") setTimeout(() => ir(fase + 1), 180);
                    }}
                    className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left text-[15px] font-medium transition-[border-color,transform] active:scale-95 ${r.ramo === x.slug ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink"}`}
                  >
                    <span aria-hidden className="text-2xl">{x.emoji}</span>
                    {x.nome}
                  </button>
                ))}
              </div>
              {r.ramo === "outro" ? (
                <div className="mt-5">
                  <label htmlFor="q-ramo" className="text-[15px] font-medium">Qual é o ramo?</label>
                  <input id="q-ramo" autoFocus className={input} value={r.ramoOutro} onChange={(e) => set("ramoOutro", e.target.value)} placeholder="Ex.: fotografia de casamento" />
                </div>
              ) : null}
            </div>
          ) : null}

          {etapa === "faz" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">Em uma frase, o que você faz?</h2>
              <p className="mt-3 text-lg text-graphite">Do seu jeito. A IA lapida o texto, sem inventar nada.</p>
              <label htmlFor="q-frase" className="sr-only">O que você faz</label>
              <textarea id="q-frase" autoFocus rows={3} className={textarea} value={r.frase} onChange={(e) => set("frase", e.target.value)} placeholder="Ex.: Cuido do sorriso de famílias inteiras, com atendimento calmo e sem pressa." />
              <label htmlFor="q-publico" className="mt-5 block text-[15px] font-medium">Quem é o seu cliente? (opcional)</label>
              <input id="q-publico" className={input} value={r.publico} onChange={(e) => set("publico", e.target.value)} placeholder="Ex.: famílias com crianças do bairro" />
            </div>
          ) : null}

          {etapa === "estilo" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">{direcaoAtual.pergunta}</h2>
              <p className="mt-3 text-lg text-graphite">Pergunta {rodada + 1} de {direcoes.length}. {direcaoAtual.ajuda}</p>
              <div className={`mt-6 grid gap-3 ${direcaoAtual.opcoes.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                {direcaoAtual.opcoes.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={r.direcao[direcaoAtual.id] === o.id}
                    onClick={() => responderDirecao(o.id)}
                    className={`group flex flex-col justify-start overflow-hidden rounded-[1.5rem] border bg-white text-left transition-[border-color,box-shadow,transform] hover:border-pink active:scale-[0.98] ${r.direcao[direcaoAtual.id] === o.id ? "border-ink" : "border-line"}`}
                  >
                    <span aria-hidden className="flex h-32 items-center justify-center text-6xl" style={{ background: o.demo.bg, color: o.demo.fg, fontFamily: o.demo.font, fontWeight: o.demo.peso }}>
                      {o.demo.texto}
                    </span>
                    <span className="block p-4">
                      <span className="block text-[17px] font-semibold">{o.nome}</span>
                      <span className="mt-1 block text-sm text-graphite">{o.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-[15px]">
                {rodada > 0 ? (
                  <button type="button" onClick={() => setRodada(rodada - 1)} className="text-graphite underline underline-offset-4">Voltar</button>
                ) : (
                  <button type="button" onClick={() => ir(fase - 1)} className="text-graphite underline underline-offset-4">Voltar</button>
                )}
                <button type="button" onClick={() => responderDirecao(null)} className="text-graphite underline underline-offset-4">Tanto faz, a IA decide</button>
              </div>
            </div>
          ) : null}

          {etapa === "sensacao" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">Como você quer que o cliente te sinta?</h2>
              <p className="mt-3 text-lg text-graphite">Escolha até 2.</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {personalidades.map((p) => {
                  const on = r.personalidade.includes(p);
                  return (
                    <Chip key={p} on={on} disabled={!on && r.personalidade.length >= 2} onClick={() => set("personalidade", on ? r.personalidade.filter((x) => x !== p) : [...r.personalidade, p])}>
                      {p}
                    </Chip>
                  );
                })}
              </div>
              <label htmlFor="q-admira" className="mt-7 block text-[15px] font-medium">Uma marca ou site que você admira, e por quê? (opcional)</label>
              <input id="q-admira" className={input} value={r.admira} onChange={(e) => set("admira", e.target.value)} placeholder="Ex.: a Apple, pela simplicidade" />
              <label htmlFor="q-evitar" className="mt-5 block text-[15px] font-medium">O que você não quer de jeito nenhum? (opcional)</label>
              <input id="q-evitar" className={input} value={r.evitar} onChange={(e) => set("evitar", e.target.value)} placeholder="Ex.: nada muito colorido, sem cara de banco" />
            </div>
          ) : null}

          {etapa === "logo" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">Tem logo?</h2>
              <p className="mt-3 text-lg text-graphite">Ele define as cores do site inteiro. Se não tiver, a gente segue sem.</p>
              <div className="mt-6 rounded-2xl border border-line bg-white p-5">
                {r.logo ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.logo} alt="Seu logo" className="h-16 max-w-[200px] object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoMono(false);
                        setR((prev) => ({ ...prev, logo: "", ...(prev.coresOrigem === "logo" ? { cores: { modo: "ia" as const }, coresOrigem: "" as const } : {}) }));
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line"
                      aria-label="Remover logo"
                    >
                      <X aria-hidden strokeWidth={1.75} className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className={buttonClass("outline", "md", "cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink")}>
                    <ImagePlus aria-hidden strokeWidth={1.75} className="h-4 w-4" /> Enviar logo
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => upload(e.target.files, "logo")} />
                  </label>
                )}
                {uploading > 0 ? (
                  <p role="status" className="mt-3 flex items-center gap-2 text-sm">
                    <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> Enviando e lendo as cores...
                  </p>
                ) : null}
              </div>

              <p className="mt-6 text-[15px] font-medium">
                {r.coresOrigem === "logo" ? "Pegamos estas cores do seu logo. Ajuste se quiser:" : logoMono ? "Seu logo é preto e branco. Quais são as cores da sua marca?" : "Quais são as cores da sua marca?"}
              </p>
              {r.coresOrigem !== "logo" ? (
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <Chip on={r.coresOrigem === "cliente"} onClick={() => setR((prev) => ({ ...prev, coresOrigem: "cliente", cores: prev.cores.modo === "propria" ? prev.cores : { modo: "propria", primaria: "#1E3A8A", secundaria: "#F97316" } }))}>
                    Escolher minhas cores
                  </Chip>
                  <Chip on={r.coresOrigem === "ia"} onClick={() => setR((prev) => ({ ...prev, coresOrigem: "ia", cores: { modo: "ia" } }))}>
                    <Wand2 aria-hidden strokeWidth={1.75} className="h-4 w-4" /> Deixar a IA escolher
                  </Chip>
                </div>
              ) : null}
              {r.cores.modo === "propria" ? (
                <div className="mt-4 flex flex-wrap gap-6">
                  {(["primaria", "secundaria"] as const).map((k) => (
                    <label key={k} className="flex items-center gap-3 text-[15px] font-medium">
                      <input
                        type="color"
                        value={r.cores.modo === "propria" ? r.cores[k].toLowerCase() : "#000000"}
                        onChange={(e) => r.cores.modo === "propria" && set("cores", { ...r.cores, [k]: e.target.value.toUpperCase() })}
                        className="h-12 w-16 cursor-pointer rounded-xl border border-line bg-white p-1"
                      />
                      {k === "primaria" ? "Cor principal" : "Cor de apoio"}
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {etapa === "historia" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">Conta um pouco da sua história.</h2>
              <p className="mt-3 text-lg text-graphite">É daqui que sai um site que só você poderia ter. Escreva do seu jeito, a IA organiza. Tudo opcional.</p>
              <label htmlFor="q-hist" className="mt-6 block text-[15px] font-medium">Como começou? Por que você faz isso?</label>
              <textarea id="q-hist" autoFocus rows={3} className={textarea} value={r.historia} onChange={(e) => set("historia", e.target.value)} placeholder="Ex.: Comecei atendendo em casa porque..." />
              <label htmlFor="q-dif" className="mt-5 block text-[15px] font-medium">Por que os clientes escolhem você?</label>
              <textarea id="q-dif" rows={2} className={textarea} value={r.diferenciais} onChange={(e) => set("diferenciais", e.target.value)} placeholder="Só o que for verdade. Ex.: atendo no mesmo dia" />
              <label htmlFor="q-duv" className="mt-5 block text-[15px] font-medium">O que os clientes mais perguntam antes de fechar?</label>
              <textarea id="q-duv" rows={2} className={textarea} value={r.duvidas} onChange={(e) => set("duvidas", e.target.value)} placeholder="Ex.: Atende convênio? Quanto tempo leva?" />
            </div>
          ) : null}

          {etapa === "servicos" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">O que você oferece?</h2>
              <p className="mt-3 text-lg text-graphite">Toque para escolher e escreva o que faltar. Até 8.</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {[...new Set([...(ramo?.servicos ?? []), ...r.servicos])].map((s) => (
                  <Chip key={s} on={r.servicos.includes(s)} onClick={() => toggleServico(s)}>{s}</Chip>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <label htmlFor="q-servico" className="sr-only">Outro serviço</label>
                <input
                  id="q-servico"
                  className={`${input} mt-0`}
                  placeholder="Outro serviço"
                  value={novoServico}
                  onChange={(e) => setNovoServico(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addServico();
                    }
                  }}
                />
                <button type="button" onClick={addServico} className={buttonClass("outline", "lg", "h-14 shrink-0")} aria-label="Adicionar serviço">
                  <Plus aria-hidden strokeWidth={1.75} className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-6 text-[15px] font-medium">O principal objetivo do site</p>
              <div className="mt-2 flex flex-wrap gap-2.5">
                {objetivos.map((o) => <Chip key={o} on={r.objetivo === o} onClick={() => set("objetivo", o)}>{o}</Chip>)}
              </div>
            </div>
          ) : null}

          {etapa === "onde" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">Onde e quando você atende?</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="q-cidade" className="text-[15px] font-medium">Cidade ou região</label>
                  <input id="q-cidade" autoFocus className={input} autoComplete="address-level2" value={r.cidade} onChange={(e) => set("cidade", e.target.value)} placeholder="Ex.: Moema, São Paulo" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="q-end" className="text-[15px] font-medium">Endereço (se atende no local)</label>
                  <input id="q-end" className={input} autoComplete="street-address" value={r.endereco} onChange={(e) => set("endereco", e.target.value)} />
                </div>
                <div>
                  <label htmlFor="q-hor" className="text-[15px] font-medium">Horário</label>
                  <input id="q-hor" className={input} value={r.horario} onChange={(e) => set("horario", e.target.value)} placeholder="Seg a sex, 9h às 18h" />
                </div>
                <div>
                  <label htmlFor="q-insta" className="text-[15px] font-medium">Instagram (opcional)</label>
                  <input id="q-insta" className={input} value={r.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@seunegocio" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="q-site" className="text-[15px] font-medium">Já tem site? (opcional)</label>
                  <input id="q-site" className={input} inputMode="url" value={r.siteAtual} onChange={(e) => set("siteAtual", e.target.value)} placeholder="seusite.com.br" />
                </div>
              </div>
            </div>
          ) : null}

          {etapa === "fotos" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">Tem fotos do seu trabalho?</h2>
              <p className="mt-3 text-lg text-graphite">Fotos reais deixam o site muito melhor. Se não tiver agora, pode pular: a IA monta com tipografia e cor.</p>
              <div className="mt-6">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <p className="font-medium">Fotos (até 8)</p>
                  {r.fotos.length < 8 ? (
                    <label className={buttonClass("outline", "md", "mt-3 cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink")}>
                      <ImagePlus aria-hidden strokeWidth={1.75} className="h-4 w-4" /> Enviar fotos
                      <input type="file" multiple accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => upload(e.target.files, "foto")} />
                    </label>
                  ) : null}
                </div>
              </div>
              {r.fotos.length ? (
                <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {r.fotos.map((f) => (
                    <li key={f} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f} alt="" className="aspect-square w-full rounded-xl object-cover" />
                      <button type="button" onClick={() => set("fotos", r.fotos.filter((x) => x !== f))} className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-paper" aria-label="Remover foto">
                        <X aria-hidden strokeWidth={2} className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              {uploading > 0 ? (
                <p role="status" className="mt-4 flex items-center gap-2 text-sm">
                  <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> Enviando {uploading} arquivo(s)...
                </p>
              ) : null}
            </div>
          ) : null}

          {etapa === "dados" ? (
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.05em] focus:outline-none">Pra quem a gente manda o site?</h2>
              <p className="mt-3 text-lg text-graphite">A IA leva até 10 minutos. Pode fechar a página: o link chega no seu e-mail. Cada pessoa cria uma prévia, então capriche.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="q-nome" className="text-[15px] font-medium">Seu nome</label>
                  <input id="q-nome" autoFocus className={input} autoComplete="name" value={contato.nome} onChange={(e) => setContato({ ...contato, nome: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="q-email" className="text-[15px] font-medium">E-mail</label>
                  <input id="q-email" type="email" className={input} autoComplete="email" value={contato.email} onChange={(e) => setContato({ ...contato, email: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="q-whats" className="text-[15px] font-medium">WhatsApp</label>
                  <input id="q-whats" type="tel" inputMode="tel" className={input} autoComplete="tel-national" value={contato.whatsapp} onChange={(e) => setContato({ ...contato, whatsapp: maskPhone(e.target.value) })} />
                </div>
              </div>
              <fieldset className="mt-7">
                <legend className="text-[15px] font-medium">Qual plano você está pensando? (dá pra trocar depois de ver)</legend>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                  {plans.map((p) => (
                    <label key={p.id} className={`cursor-pointer rounded-2xl border bg-white p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink ${plano === p.id ? "border-ink shadow-[0_0_0_1px_var(--ink)]" : "border-line"}`}>
                      <input type="radio" name="plano" value={p.id} checked={plano === p.id} onChange={() => setPlano(p.id)} className="sr-only" />
                      <span className="block font-semibold">{p.name}</span>
                      <span className="mt-1 block text-sm text-graphite">{priceLabel(p.price)}/mês</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          ) : null}

          {erro ? <p role="alert" className="mt-5 rounded-2xl bg-pink-light px-5 py-3 text-[15px]">{erro}</p> : null}
          {plantao ? (
            <a
              href={whatsappUrl(
                [
                  `Oi! Quero criar o site da ${r.empresa} pela Supporta.`,
                  `Ramo: ${r.ramo === "outro" ? r.ramoOutro : (ramo?.nome ?? r.ramo)}`,
                  `O que faço: ${r.frase}`,
                  `Serviços: ${r.servicos.join(", ")}`,
                  `Cidade: ${r.cidade}`,
                  `Plano: ${plans.find((p) => p.id === plano)?.name}`,
                  `Meu nome: ${contato.nome} · ${contato.email}`,
                ].join("\n"),
              )}
              target="_blank"
              rel="noopener"
              className={buttonClass("primary", "lg", "mt-4")}
              data-track="whatsapp_click"
              data-track-origin="criar-plantao"
            >
              Mandar minhas respostas no WhatsApp
            </a>
          ) : null}

          {etapa !== "estilo" ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="submit" disabled={enviando} className={buttonClass(fase === fases.length - 1 ? "neon" : "primary", "lg")}>
                {enviando ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-5 w-5 animate-spin" /> : fase === fases.length - 1 ? <Sparkles aria-hidden strokeWidth={1.75} className="h-5 w-5" /> : null}
                {fase === fases.length - 1 ? (enviando ? "Enviando para a IA" : "Montar meu site com IA") : etapa === "fotos" && !r.fotos.length ? "Pular por agora" : "Continuar"}
                {fase < fases.length - 1 ? <ArrowRight aria-hidden strokeWidth={1.75} className="h-5 w-5" /> : null}
              </button>
              {fase > 0 ? (
                <button type="button" onClick={() => ir(fase - 1)} className={buttonClass("ghost", "lg")}>
                  <ArrowLeft aria-hidden strokeWidth={1.75} className="h-5 w-5" /> Voltar
                </button>
              ) : null}
              {fase < fases.length - 1 ? <span className="hidden text-sm text-graphite sm:inline">ou aperte Enter</span> : null}
            </div>
          ) : null}
        </form>
      </div>

      <aside aria-label="Prévia ilustrativa do seu site" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <p className="label-mono flex items-center gap-2 text-graphite">
          <span className="h-2 w-2 animate-pulse rounded-full bg-pink" /> Seu site tomando forma
        </p>
        <div className="mt-4 transition-transform duration-500">
          <BrowserFrame url={`${(r.empresa ? r.empresa : "seunegocio").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "")}.supporta.com.br`} ratio="880 / 605" className="shadow-[0_30px_60px_-24px_rgb(11_11_15/0.35)]">
            <div className="h-full overflow-hidden">
              <SiteMock mock={mock} variant="desktop" />
            </div>
          </BrowserFrame>
        </div>
        <p className="mt-4 text-sm text-graphite">Este é só um rascunho. No fim, a IA cria um site só seu, sem modelo pronto, com as suas cores, os seus textos e as suas fotos.</p>
      </aside>
    </div>
  );
}
