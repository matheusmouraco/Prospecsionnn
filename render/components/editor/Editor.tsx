"use client";

import { ArrowLeft, ArrowRight, Bookmark, History, ImagePlus, MessageSquareText, Wand2, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { INPUT_TYPES, QUALITIES } from "@/config/options";
import { APP_NAME } from "@/lib/brand";
import { summarySentence } from "@/lib/ai/summary";
import { compositeWithMask, compressDataUrl, compressImage, downloadDataUrl, type Img } from "@/lib/image/client";
import {
  deletePreset,
  deleteSession,
  listPresets,
  listSessions,
  saveSession,
  savePreset,
  uid,
  type Output,
  type OutputKind,
  type Preset,
  type Session,
} from "@/lib/store/local";
import { cloneChoices, creditsFor, DEFAULT_CHOICES, mergeChoices, type Choices } from "@/lib/wizard/types";
import { Button, cx, Segmented } from "@/components/ui/kit";
import { BeforeAfter } from "./BeforeAfter";
import { AccessGate, AssistantDialog, HistoryDrawer, PresetsDrawer } from "./Dialogs";
import { Generating } from "./Generating";
import { MaskPainter, type MaskResult } from "./MaskPainter";
import { ResultPanel } from "./ResultPanel";
import { StepCamera, StepFurniture, StepGoal, StepLighting, StepMaterials, StepPalette, StepRoom, StepStyle } from "./steps/choices-steps";
import { StepRefine, StepSummary, StepUpload } from "./steps/media-steps";

type StepId = "upload" | "objetivo" | "ambiente" | "estilo" | "materiais" | "paleta" | "luz" | "mobiliario" | "camera" | "ajustes" | "resumo";

const STEP_META: Record<StepId, { title: string; subtitle: string; short: string }> = {
  upload: { title: "Envie sua imagem", subtitle: "Print do SketchUp, Promob, Revit, foto do ambiente, croqui ou fachada.", short: "Imagem" },
  objetivo: { title: "O que você quer fazer?", subtitle: "Isso define o quanto a IA pode mudar.", short: "Objetivo" },
  ambiente: { title: "Qual é o ambiente?", subtitle: "Ajuda a IA a escolher móveis e materiais coerentes.", short: "Ambiente" },
  estilo: { title: "Escolha o estilo", subtitle: "Ou deixe a IA escolher o que combina com o espaço.", short: "Estilo" },
  materiais: { title: "Materiais por superfície", subtitle: "Escolha só o que importa. O resto a IA decide ou mantém.", short: "Materiais" },
  paleta: { title: "Paleta de cores", subtitle: "Uma paleta pronta ou até 4 cores suas.", short: "Paleta" },
  luz: { title: "Iluminação e clima", subtitle: "A luz é o que mais faz o render parecer foto.", short: "Luz" },
  mobiliario: { title: "Mobiliário e elementos", subtitle: "O que entra e o que não pode aparecer de jeito nenhum.", short: "Móveis" },
  camera: { title: "Câmera e formato", subtitle: "Manter o ângulo original garante a geometria exata.", short: "Câmera" },
  ajustes: { title: "Referências e ajuste fino", subtitle: "Moodboard, pincel e detalhes em texto. Tudo opcional.", short: "Ajustes" },
  resumo: { title: "Confira e gere", subtitle: "Revise tudo antes de gastar créditos.", short: "Resumo" },
};

const FULL: StepId[] = ["upload", "objetivo", "ambiente", "estilo", "materiais", "paleta", "luz", "mobiliario", "camera", "ajustes", "resumo"];
const QUICK: StepId[] = ["upload", "ambiente", "estilo", "resumo"];

type Mask = MaskResult;
type RenderResponse = { image: string; width: number; height: number; model: string; costUsd: number; prompt: string; demo: boolean; error?: string; code?: string };

function suggestedGoal(type: string | null, empty: boolean): string {
  if (type === "fachada") return "fachada";
  if (empty) return "mobiliar";
  if (type === "foto") return "redecorar";
  return "realista";
}

function expectedSeconds(kind: OutputKind, quality: string): number {
  if (kind === "upscale") return 40;
  return QUALITIES.find((q) => q.id === quality)?.seconds ?? 20;
}

export function Editor() {
  const [mode, setMode] = useState<"rapido" | "completo">("completo");
  const [stepIdx, setStepIdx] = useState(0);
  const [choices, setChoices] = useState<Choices>(DEFAULT_CHOICES);
  const [input, setInput] = useState<Img | null>(null);
  const [refs, setRefs] = useState<Img[]>([]);
  const [mask, setMask] = useState<Mask | null>(null);
  const [maskLock, setMaskLock] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [emptySpace, setEmptySpace] = useState(false);
  const [phase, setPhase] = useState<"wizard" | "result">("wizard");
  const [session, setSession] = useState<Session | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [painter, setPainter] = useState<null | { target: "input" } | { target: "edit"; output: Output }>(null);
  const [dialog, setDialog] = useState<null | "history" | "presets" | "assistant">(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [needAccess, setNeedAccess] = useState(false);
  const [demo, setDemo] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const steps = mode === "rapido" ? QUICK : FULL;
  const step = steps[Math.min(stepIdx, steps.length - 1)]!;

  useEffect(() => {
    setPresets(listPresets());
    void listSessions().then(setSessions);
    fetch("/api/acesso")
      .then((r) => r.json())
      .then((j: { required: boolean; ok: boolean; demo: boolean }) => {
        setDemo(j.demo);
        if (j.required && !j.ok) setNeedAccess(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [step, phase]);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const update = useCallback((fn: (d: Choices) => void) => {
    setChoices((prev) => {
      const d = cloneChoices(prev);
      fn(d);
      return d;
    });
  }, []);

  /* ---------- upload + detection ---------- */

  const handleFile = useCallback(
    async (file: File) => {
      try {
        const img = await compressImage(file, 2048);
        setInput(img);
        setMask(null);
        setPhase("wizard");
        update((d) => void (d.inputType = null));
        setDetecting(true);
        const small = await compressDataUrl(img.url, 768, 400_000);
        const res = await fetch("/api/detect", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ image: small.url }) });
        if (res.status === 401) setNeedAccess(true);
        const j = (await res.json().catch(() => ({}))) as { tipo?: string | null; ambiente?: string | null; vazio?: boolean };
        setEmptySpace(Boolean(j.vazio));
        update((d) => {
          d.inputType = j.tipo ?? d.inputType ?? null;
          if (j.ambiente && !d.room) d.room = j.ambiente;
          if (!d.goal && j.tipo) d.goal = suggestedGoal(j.tipo, Boolean(j.vazio));
        });
      } catch (e) {
        flash(e instanceof Error ? e.message : "Não consegui abrir a imagem.");
      } finally {
        setDetecting(false);
      }
    },
    [flash, update],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) void handleFile(f);
  };

  // Paste an image from the clipboard (common when copying a SketchUp viewport)
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const f = Array.from(e.clipboardData?.files ?? []).find((x) => x.type.startsWith("image/"));
      if (f) void handleFile(f);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile]);

  /* ---------- navigation ---------- */

  const canAdvance = (s: StepId) => {
    if (s === "upload") return Boolean(input && choices.inputType && !detecting);
    if (s === "objetivo") return Boolean(choices.goal);
    if (s === "ambiente") return Boolean(choices.room);
    return true;
  };
  const firstBlocked = steps.findIndex((s) => !canAdvance(s));
  const go = (i: number) => {
    if (firstBlocked !== -1 && i > firstBlocked) return;
    setStepIdx(Math.max(0, Math.min(steps.length - 1, i)));
  };
  const goStep = (id: string) => {
    if (mode === "rapido" && !QUICK.includes(id as StepId)) {
      setMode("completo");
      setStepIdx(FULL.indexOf(id as StepId));
      return;
    }
    go(steps.indexOf(id as StepId));
  };
  const switchMode = (m: "rapido" | "completo") => {
    const current = step;
    setMode(m);
    const list = m === "rapido" ? QUICK : FULL;
    setStepIdx(Math.max(0, list.indexOf(current) === -1 ? list.length - 1 : list.indexOf(current)));
  };

  /* ---------- generation ---------- */

  const callRender = async (body: Record<string, unknown>): Promise<RenderResponse> => {
    const res = await fetch("/api/render", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const j = (await res.json().catch(() => ({ error: "Resposta inválida do servidor." }))) as RenderResponse;
    if (res.status === 401 && j.code === "acesso") setNeedAccess(true);
    if (!res.ok) throw new Error(j.error ?? "Não deu certo desta vez.");
    if (j.demo) setDemo(true);
    return j;
  };

  const patchOutput = (id: string, patch: Partial<Output>) =>
    setSession((s) => (s ? { ...s, updatedAt: Date.now(), outputs: s.outputs.map((o) => (o.id === id ? { ...o, ...patch } : o)) } : s));

  type Job = { output: Output; body: Record<string, unknown>; composite?: { base: string; alpha: string } };

  const runJobs = (jobs: Job[]) => {
    for (const job of jobs) {
      void (async () => {
        try {
          const r = await callRender(job.body);
          let url = r.image;
          if (job.composite) url = await compositeWithMask(job.composite.base, r.image, job.composite.alpha);
          patchOutput(job.output.id, { status: "done", url, width: r.width, height: r.height, prompt: r.prompt, model: r.model, costUsd: r.costUsd });
        } catch (e) {
          patchOutput(job.output.id, { status: "error", error: e instanceof Error ? e.message : "Erro" });
        }
      })();
    }
  };

  // Persist each session once nothing is pending.
  useEffect(() => {
    if (!session || session.outputs.some((o) => o.status === "pending")) return;
    void saveSession(session).then(() => listSessions().then(setSessions));
  }, [session]);

  const renderBody = (c: Choices) => ({
    mode: "render",
    choices: c,
    quality: c.quality,
    image: input!.url,
    mask: mask?.bw,
    refs: refs.map((r) => r.url),
  });

  const generate = () => {
    if (!input) return;
    const c = cloneChoices(choices);
    if (!c.goal) c.goal = suggestedGoal(c.inputType, emptySpace);
    const now = Date.now();
    const outputs: Output[] = Array.from({ length: c.variations }, (_, i) => ({
      id: uid(),
      kind: "render" as const,
      status: "pending" as const,
      label: `Opção ${i + 1}`,
      createdAt: now,
    }));
    const s: Session = { id: uid(), createdAt: now, updatedAt: now, input, choices: c, summary: summarySentence(c), outputs };
    setSession(s);
    setSelectedId(outputs[0]!.id);
    setPhase("result");
    const composite = mask && maskLock && c.camera.format === "original" ? { base: input.url, alpha: mask.alpha } : undefined;
    runJobs(outputs.map((o) => ({ output: o, body: renderBody(c), composite })));
  };

  const selected = session?.outputs.find((o) => o.id === selectedId) ?? session?.outputs[0];
  const busy = Boolean(session?.outputs.some((o) => o.status === "pending"));

  const addChild = (kind: OutputKind, label: string, parent: Output, body: Record<string, unknown>, composite?: Job["composite"]) => {
    const o: Output = { id: uid(), kind, status: "pending", label, parentId: parent.id, createdAt: Date.now() };
    setSession((s) => (s ? { ...s, updatedAt: Date.now(), outputs: [...s.outputs, o] } : s));
    setSelectedId(o.id);
    runJobs([{ output: o, body, composite }]);
  };

  const prepared = async (o: Output) => (await compressDataUrl(o.url!, 2048, 2_600_000)).url;

  const actions = {
    download: () => {
      if (!selected?.url || !session) return;
      const room = session.choices.room ?? "render";
      downloadDataUrl(selected.url, `${APP_NAME.toLowerCase()}-${room}-${selected.label.toLowerCase().replace(/\s+/g, "-")}.jpg`);
    },
    upscale: async () => {
      if (!selected?.url) return;
      addChild("upscale", "HD 2K", selected, { mode: "upscale", quality: "2k", image: await prepared(selected) });
    },
    variation: async () => {
      if (!selected?.url || !session) return;
      const n = session.outputs.filter((o) => o.kind === "variation").length + 1;
      addChild("variation", `Variação ${n}`, selected, {
        mode: "variation",
        choices: session.choices,
        quality: session.choices.quality,
        image: session.input.url,
        chosen: await prepared(selected),
        refs: refs.map((r) => r.url),
      });
    },
    editText: async (text: string) => {
      if (!selected?.url) return;
      const n = session!.outputs.filter((o) => o.kind === "edit").length + 1;
      addChild("edit", `Edição ${n}`, selected, { mode: "edit", quality: session!.choices.quality, image: await prepared(selected), instruction: text });
    },
    editArea: async (m: Mask, text: string) => {
      if (!selected?.url) return;
      const base = await prepared(selected);
      const n = session!.outputs.filter((o) => o.kind === "edit").length + 1;
      addChild("edit", `Edição ${n}`, selected, { mode: "edit", quality: session!.choices.quality, image: base, mask: m.bw, instruction: text }, { base: selected.url, alpha: m.alpha });
    },
    retry: (id: string) => {
      if (!session) return;
      const o = session.outputs.find((x) => x.id === id);
      if (!o) return;
      if (o.kind !== "render") {
        flash("Refaça a ação a partir da imagem de origem.");
        return;
      }
      patchOutput(id, { status: "pending", error: undefined, createdAt: Date.now() });
      runJobs([{ output: o, body: { ...renderBody(session.choices), image: session.input.url } }]);
    },
  };

  const openSession = (s: Session) => {
    setSession(s);
    setInput(s.input);
    setChoices(s.choices);
    setSelectedId(s.outputs.find((o) => o.favorite)?.id ?? s.outputs[0]?.id ?? null);
    setPhase("result");
    setDialog(null);
  };

  const reset = () => {
    setSession(null);
    setInput(null);
    setRefs([]);
    setMask(null);
    setChoices((c) => ({ ...cloneChoices(DEFAULT_CHOICES), quality: c.quality, variations: c.variations }));
    setStepIdx(0);
    setPhase("wizard");
  };

  /* ---------- stage (left) ---------- */

  const pendingCount = session?.outputs.filter((o) => o.status === "pending").length ?? 0;
  const doneCount = session?.outputs.filter((o) => o.status === "done").length ?? 0;
  const parentOf = (o: Output) => (o.parentId ? session?.outputs.find((x) => x.id === o.parentId) : undefined);

  const stage = (() => {
    if (!input) {
      return (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cx(
            "group relative flex size-full cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-8 text-center transition",
            dragOver ? "border-accent bg-accent-soft" : "border-line-strong hover:border-accent/60",
          )}
        >
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <span className="grid size-16 place-items-center rounded-2xl bg-panel-3 text-accent transition group-hover:scale-105">
            <ImagePlus className="size-7" strokeWidth={1.5} />
          </span>
          <span>
            <span className="block text-lg font-medium">Arraste sua imagem aqui</span>
            <span className="mt-1 block text-sm text-muted">ou clique para escolher. Também dá para colar com Ctrl+V.</span>
          </span>
          <span className="flex flex-wrap justify-center gap-1.5">
            {["SketchUp", "Promob", "Revit", "Lumion", "Foto", "Croqui", "Fachada"].map((t) => (
              <span key={t} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                {t}
              </span>
            ))}
          </span>
        </label>
      );
    }

    if (phase === "result" && session && selected) {
      const before = parentOf(selected)?.url ?? session.input.url;
      if (selected.status === "pending") {
        return (
          <div className="relative size-full">
            <Generating
              image={before}
              startedAt={selected.createdAt}
              expectedSeconds={expectedSeconds(selected.kind, session.choices.quality)}
              label={selected.kind === "upscale" ? "Aumentando para HD 2K" : selected.kind === "edit" ? "Aplicando sua edição" : "Gerando seu render"}
              done={doneCount}
              total={selected.kind === "render" ? session.outputs.filter((o) => o.kind === "render").length : undefined}
            />
          </div>
        );
      }
      if (selected.status === "done" && selected.url) {
        return (
          <div className="flex size-full items-center justify-center">
            <BeforeAfter key={selected.id} before={before} after={selected.url} width={selected.width ?? session.input.width} height={selected.height ?? session.input.height} />
          </div>
        );
      }
      return (
        <div className="flex size-full items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={before} alt="" className="max-h-full max-w-full rounded-2xl opacity-40" />
        </div>
      );
    }

    const typeLabel = INPUT_TYPES.find((t) => t.id === choices.inputType)?.label;
    return (
      <div className="flex size-full items-center justify-center" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
        <div className="relative max-h-full max-w-full" style={{ aspectRatio: `${input.width} / ${input.height}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={input.url} alt="Imagem enviada" className="block max-h-full max-w-full rounded-2xl object-contain" />
          {mask && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mask.alpha} alt="" className="pointer-events-none absolute inset-0 size-full rounded-2xl opacity-45 mix-blend-screen" style={{ filter: "sepia(1) saturate(4) hue-rotate(-10deg)" }} />
          )}
          {detecting && <div className="absolute inset-x-0 top-0 h-[10%] bg-gradient-to-b from-transparent via-accent/40 to-transparent animate-scan" />}
          <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
            {detecting ? "Analisando a imagem..." : (typeLabel ?? "Escolha o tipo")}
          </span>
        </div>
      </div>
    );
  })();

  /* ---------- panel (right) ---------- */

  const stepBody = (() => {
    const p = { c: choices, update };
    switch (step) {
      case "upload":
        return <StepUpload {...p} input={input} detecting={detecting} onFile={handleFile} />;
      case "objetivo":
        return <StepGoal {...p} />;
      case "ambiente":
        return <StepRoom {...p} />;
      case "estilo":
        return <StepStyle {...p} />;
      case "materiais":
        return <StepMaterials {...p} />;
      case "paleta":
        return <StepPalette {...p} />;
      case "luz":
        return <StepLighting {...p} />;
      case "mobiliario":
        return <StepFurniture {...p} />;
      case "camera":
        return <StepCamera {...p} />;
      case "ajustes":
        return (
          <StepRefine
            {...p}
            refs={refs}
            onAddRef={async (f) => {
              try {
                const r = await compressImage(f, 1024, 450_000);
                setRefs((list) => [...list, r].slice(0, 3));
              } catch (e) {
                flash(e instanceof Error ? e.message : "Erro na referência");
              }
            }}
            onRemoveRef={(i) => setRefs((l) => l.filter((_, j) => j !== i))}
            maskPreview={mask?.preview ?? null}
            onOpenMask={() => setPainter({ target: "input" })}
            onClearMask={() => setMask(null)}
            maskLock={maskLock}
            setMaskLock={setMaskLock}
          />
        );
      case "resumo":
        return (
          <StepSummary
            {...p}
            onEdit={goStep}
            refsCount={refs.length}
            hasMask={Boolean(mask)}
            onSavePreset={(name) => {
              setPresets(savePreset(name, choices));
              flash(`Preset "${name}" salvo`);
            }}
          />
        );
    }
  })();

  const total = creditsFor(choices.quality, choices.variations);
  const isLast = step === "resumo";
  const meta = STEP_META[step];
  const optional = !["upload", "objetivo", "ambiente", "resumo"].includes(step);
  const progress = useMemo(() => ((stepIdx + 1) / steps.length) * 100, [stepIdx, steps.length]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 sm:px-4">
        <button type="button" onClick={reset} className="flex items-center gap-2 pr-2">
          <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-ink">
            <Wand2 className="size-4" strokeWidth={2} />
          </span>
          <span className="hidden font-semibold tracking-tight sm:inline">{APP_NAME}</span>
        </button>
        {phase === "wizard" && (
          <div className="ml-1 w-44 sm:w-56">
            <Segmented
              value={mode}
              onChange={switchMode}
              options={[
                { id: "rapido", label: "Rápido" },
                { id: "completo", label: "Completo" },
              ]}
            />
          </div>
        )}
        {demo && <span className="hidden rounded-full border border-accent/40 px-2.5 py-1 text-[11px] text-accent md:inline">Modo demonstração</span>}
        <div className="ml-auto flex items-center gap-0.5">
          <Button size="sm" variant="ghost" onClick={() => setDialog("assistant")} aria-label="Assistente">
            <MessageSquareText className="size-4" />
            <span className="hidden lg:inline">Assistente</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDialog("presets")} aria-label="Presets">
            <Bookmark className="size-4" />
            <span className="hidden lg:inline">Presets</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDialog("history")} aria-label="Histórico">
            <History className="size-4" />
            <span className="hidden lg:inline">Histórico</span>
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_460px]">
        {/* Stage */}
        <main className="relative h-[38dvh] shrink-0 p-3 sm:h-[44dvh] lg:h-auto lg:p-6">
          <div className="relative size-full">{stage}</div>
        </main>

        {/* Panel */}
        <aside className="flex min-h-0 flex-1 flex-col border-t border-line bg-panel lg:border-t-0 lg:border-l">
          {phase === "wizard" ? (
            <>
              <div className="shrink-0 px-5 pt-4">
                <div className="h-1 overflow-hidden rounded-full bg-panel-3">
                  <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <nav className="-mx-1 mt-3 flex gap-1 overflow-x-auto px-1 pb-1 scroll-thin" aria-label="Etapas">
                  {steps.map((s, i) => {
                    const locked = firstBlocked !== -1 && i > firstBlocked;
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={locked}
                        onClick={() => go(i)}
                        aria-current={s === step ? "step" : undefined}
                        className={cx(
                          "shrink-0 rounded-full px-2.5 py-1 text-[11.5px] transition",
                          s === step ? "bg-accent-soft text-accent" : i < stepIdx ? "text-ink/70 hover:text-ink" : "text-faint",
                          locked && "opacity-40",
                        )}
                      >
                        {i + 1}. {STEP_META[s].short}
                      </button>
                    );
                  })}
                </nav>
                <div className="mt-3 pb-4" key={step}>
                  <h1 className="text-xl font-semibold tracking-tight animate-fade-in">{meta.title}</h1>
                  <p className="mt-1 text-sm text-muted">
                    {meta.subtitle}
                    {optional && <span className="ml-1 text-faint">Opcional.</span>}
                  </p>
                </div>
              </div>
              <div ref={panelRef} className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 scroll-thin">
                <div key={step} className="animate-fade-in">
                  {stepBody}
                </div>
              </div>
              <footer className="flex shrink-0 items-center gap-2 border-t border-line bg-panel px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
                <Button variant="ghost" onClick={() => go(stepIdx - 1)} disabled={stepIdx === 0} aria-label="Voltar">
                  <ArrowLeft className="size-4" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
                {optional && (
                  <Button variant="ghost" className="text-muted" onClick={() => go(steps.indexOf("resumo"))}>
                    Pular para o resumo
                  </Button>
                )}
                {isLast ? (
                  <Button variant="primary" size="lg" className="ml-auto" onClick={generate} disabled={!input}>
                    <Zap className="size-4" /> Gerar render · {total} crédito{total > 1 ? "s" : ""}
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" className="ml-auto" disabled={!canAdvance(step)} onClick={() => go(stepIdx + 1)}>
                    Próximo <ArrowRight className="size-4" />
                  </Button>
                )}
              </footer>
            </>
          ) : session ? (
            <div ref={panelRef} className="min-h-0 flex-1 overflow-y-auto p-5 scroll-thin">
              <ResultPanel
                session={session}
                selected={selected}
                busy={busy}
                demo={demo}
                onSelect={setSelectedId}
                onFavorite={(id) => patchOutput(id, { favorite: !session.outputs.find((o) => o.id === id)?.favorite })}
                onDownload={actions.download}
                onUpscale={actions.upscale}
                onVariation={actions.variation}
                onEditText={actions.editText}
                onEditArea={() => selected && selected.status === "done" && setPainter({ target: "edit", output: selected })}
                onBackToWizard={() => {
                  setChoices(session.choices);
                  setInput(session.input);
                  setPhase("wizard");
                  setStepIdx(steps.indexOf("resumo"));
                }}
                onNew={reset}
                onRetry={actions.retry}
              />
              {pendingCount > 0 && <p className="mt-4 text-center text-xs text-muted">Gerando {pendingCount} imagem{pendingCount > 1 ? "s" : ""}... pode continuar mexendo.</p>}
            </div>
          ) : null}
        </aside>
      </div>

      {painter?.target === "input" && input && (
        <MaskPainter
          image={input}
          initial={mask?.alpha}
          onCancel={() => setPainter(null)}
          onDone={(m) => {
            setMask(m);
            setPainter(null);
          }}
        />
      )}
      {painter?.target === "edit" && painter.output.url && (
        <MaskPainter
          image={{ url: painter.output.url, width: painter.output.width ?? 1024, height: painter.output.height ?? 768 }}
          title="Pinte a área que vai mudar"
          instruction={{ placeholder: "O que fazer nessa área? Ex.: trocar por um sofá de linho bege", submit: "Aplicar edição" }}
          onCancel={() => setPainter(null)}
          onDone={(m, text) => {
            setPainter(null);
            if (text) void actions.editArea(m, text);
          }}
        />
      )}

      {dialog === "history" && (
        <HistoryDrawer
          sessions={sessions}
          onOpen={openSession}
          onDelete={async (id) => {
            await deleteSession(id);
            setSessions(await listSessions());
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === "presets" && (
        <PresetsDrawer
          presets={presets}
          onApply={(p) => {
            setChoices((c) => mergeChoices(c, p.choices));
            setDialog(null);
            flash(`Preset "${p.name}" aplicado`);
            if (phase === "wizard" && input && choices.inputType) setStepIdx(steps.indexOf("resumo"));
          }}
          onDelete={(id) => setPresets(deletePreset(id))}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === "assistant" && (
        <AssistantDialog
          onApply={(patch) => {
            setChoices((c) => mergeChoices(c, patch));
            setDialog(null);
            setPhase("wizard");
            setMode("completo");
            flash("Wizard preenchido. Confira e ajuste o que quiser.");
            setStepIdx(input && choices.inputType ? FULL.indexOf("resumo") : 0);
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {needAccess && <AccessGate onOk={() => setNeedAccess(false)} />}

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-8">
          <div className="rounded-full border border-line-strong bg-panel-3 px-4 py-2.5 text-sm shadow-2xl animate-pop">{toast}</div>
        </div>
      )}
    </div>
  );
}
