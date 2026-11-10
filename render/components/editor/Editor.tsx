"use client";

import { ArrowLeft, ArrowRight, Bookmark, Brush, Check, History, ImagePlus, MessageSquareText, RefreshCw, Sparkles, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FORMATS, GOALS, INPUT_TYPES, PALETTES, QUALITIES, ROOMS, STYLES, TIMES, FURNITURE_MODES, ANGLES, surfacesForRoom } from "@/config/options";
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
import { ProductLockup } from "@/components/ui/brand";
import { Button, cx, Icon, Segmented } from "@/components/ui/kit";
import { BeforeAfter } from "./BeforeAfter";
import { AccessGate, AssistantDialog, HistoryDrawer, PresetsDrawer } from "./Dialogs";
import { Generating } from "./Generating";
import { MaskPainter, type MaskResult } from "./MaskPainter";
import { OutputThumb, ResultPanel } from "./ResultPanel";
import { StepCamera, StepFurniture, StepGoal, StepLighting, StepMaterials, StepPalette, StepRoom, StepStyle } from "./steps/choices-steps";
import { SAMPLES, StepRefine, StepSummary, StepUpload, type Sample } from "./steps/media-steps";

type StepId = "upload" | "objetivo" | "ambiente" | "estilo" | "materiais" | "paleta" | "luz" | "mobiliario" | "camera" | "ajustes" | "resumo";

const STEP_META: Record<StepId, { title: string; subtitle: string; short: string; icon: string }> = {
  upload: { title: "Envie sua imagem", subtitle: "Print do SketchUp, Promob, Revit ou Lumion, foto do ambiente, croqui ou fachada.", short: "Imagem", icon: "ImagePlus" },
  objetivo: { title: "O que você quer fazer?", subtitle: "Isso define o quanto a IA pode mudar na cena.", short: "Objetivo", icon: "Target" },
  ambiente: { title: "Qual é o ambiente?", subtitle: "Ajuda a IA a escolher móveis e materiais coerentes.", short: "Ambiente", icon: "Home" },
  estilo: { title: "Escolha o estilo", subtitle: "Ou deixe a IA escolher o que combina com o espaço.", short: "Estilo", icon: "Sparkles" },
  materiais: { title: "Materiais por superfície", subtitle: "Escolha só o que importa. O resto a IA decide ou mantém.", short: "Materiais", icon: "Layers" },
  paleta: { title: "Paleta de cores", subtitle: "Uma paleta pronta ou até 4 cores suas.", short: "Paleta", icon: "Palette" },
  luz: { title: "Iluminação e clima", subtitle: "A luz é o que mais faz o render parecer foto.", short: "Luz", icon: "Sun" },
  mobiliario: { title: "Mobiliário e elementos", subtitle: "O que entra e o que não pode aparecer de jeito nenhum.", short: "Mobiliário", icon: "Armchair" },
  camera: { title: "Câmera e formato", subtitle: "Manter o ângulo original garante a geometria exata.", short: "Câmera", icon: "Camera" },
  ajustes: { title: "Referências e ajuste fino", subtitle: "Moodboard, pincel e detalhes em texto. Tudo opcional.", short: "Ajuste fino", icon: "SlidersHorizontal" },
  resumo: { title: "Confira e gere", subtitle: "Revise tudo antes de gastar créditos.", short: "Resumo", icon: "ClipboardCheck" },
};

const FULL: StepId[] = ["upload", "objetivo", "ambiente", "estilo", "materiais", "paleta", "luz", "mobiliario", "camera", "ajustes", "resumo"];
const QUICK: StepId[] = ["upload", "ambiente", "estilo", "resumo"];

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

const lbl = (list: { id: string; label: string }[], id: string | null | undefined) => (id ? list.find((o) => o.id === id)?.label : undefined);

export function Editor() {
  const [mode, setMode] = useState<"rapido" | "completo">("completo");
  const [stepIdx, setStepIdx] = useState(0);
  const [choices, setChoices] = useState<Choices>(DEFAULT_CHOICES);
  const [title, setTitle] = useState("");
  const [input, setInput] = useState<Img | null>(null);
  const [refs, setRefs] = useState<Img[]>([]);
  const [mask, setMask] = useState<MaskResult | null>(null);
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
  const fileRef = useRef<HTMLInputElement>(null);

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
    async (file: File | Blob, hint?: { type: string; room: string }) => {
      try {
        const img = await compressImage(file, 2048);
        setInput(img);
        setMask(null);
        setPhase("wizard");
        update((d) => {
          d.inputType = hint?.type ?? null;
          if (hint) {
            d.room = hint.room;
            d.goal = suggestedGoal(hint.type, hint.room === "sala-estar");
          }
        });
        if (hint) return;
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

  const loadSample = useCallback(
    async (s: Sample) => {
      const blob = await (await fetch(s.src)).blob();
      if (!title) setTitle(s.title);
      await handleFile(blob, { type: s.type, room: s.room });
    },
    [handleFile, title],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) void handleFile(f);
  };

  // Paste an image from the clipboard (common when copying a SketchUp viewport).
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
    setPhase("wizard");
    setStepIdx(Math.max(0, Math.min(steps.length - 1, i)));
  };
  const goStep = (id: string) => {
    if (mode === "rapido" && !QUICK.includes(id as StepId)) {
      setMode("completo");
      setPhase("wizard");
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

  /** Short value shown under each step in the rail: the brief being built, live. */
  const stepValue = (s: StepId): string | null => {
    const c = choices;
    switch (s) {
      case "upload":
        return input ? (lbl(INPUT_TYPES, c.inputType) ?? (detecting ? "Analisando..." : "Escolha o tipo")) : null;
      case "objetivo":
        return lbl(GOALS, c.goal) ?? null;
      case "ambiente":
        return lbl(ROOMS, c.room) ?? null;
      case "estilo":
        return c.style === "auto" ? "IA decide" : (lbl(STYLES, c.style) ?? null);
      case "materiais": {
        const n = surfacesForRoom(c.room).filter((k) => c.materials[k] !== "auto").length;
        return n ? `${n} superfície${n > 1 ? "s" : ""} definida${n > 1 ? "s" : ""}` : "IA decide";
      }
      case "paleta":
        return c.palette.mode === "preset" ? (lbl(PALETTES, c.palette.preset) ?? null) : c.palette.mode === "custom" ? `${c.palette.colors.length} cores suas` : "IA decide";
      case "luz": {
        const t = c.lighting.time === "auto" ? null : lbl(TIMES, c.lighting.time);
        const a = c.lighting.artificial.length;
        return [t, a ? `${a} luz${a > 1 ? "es" : ""}` : null].filter(Boolean).join(" · ") || "IA decide";
      }
      case "mobiliario": {
        const m = c.furniture.mode === "auto" ? null : lbl(FURNITURE_MODES, c.furniture.mode);
        const n = c.furniture.items.length;
        return [m, n ? `${n} ite${n > 1 ? "ns" : "m"}` : null].filter(Boolean).join(" · ") || "IA decide";
      }
      case "camera":
        return [c.camera.angle === "original" ? "Ângulo original" : lbl(ANGLES, c.camera.angle), c.camera.format !== "original" ? FORMATS.find((f) => f.id === c.camera.format)?.label : null].filter(Boolean).join(" · ");
      case "ajustes": {
        const parts = [refs.length ? `${refs.length} ref.` : null, mask ? "pincel" : null, c.refine.notes.trim() ? "texto" : null].filter(Boolean);
        return parts.length ? parts.join(" · ") : null;
      }
      case "resumo": {
        const t = creditsFor(c.quality, c.variations);
        return `${c.variations}× ${c.quality.toUpperCase()} · ${t} crédito${t > 1 ? "s" : ""}`;
      }
    }
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

  const renderBody = (c: Choices, base: Img) => ({
    mode: "render",
    choices: c,
    quality: c.quality,
    image: base.url,
    mask: mask?.bw,
    refs: refs.map((r) => r.url),
  });

  const generate = () => {
    if (!input) return;
    const c = cloneChoices(choices);
    if (!c.goal) c.goal = suggestedGoal(c.inputType, emptySpace);
    const now = Date.now();
    const outputs: Output[] = Array.from({ length: c.variations }, (_, i) => ({ id: uid(), kind: "render" as const, status: "pending" as const, label: `Opção ${i + 1}`, createdAt: now }));
    const s: Session = { id: uid(), title: title.trim() || undefined, createdAt: now, updatedAt: now, input, choices: c, summary: summarySentence(c), outputs };
    setSession(s);
    setSelectedId(outputs[0]!.id);
    setPhase("result");
    const composite = mask && maskLock && c.camera.format === "original" ? { base: input.url, alpha: mask.alpha } : undefined;
    runJobs(outputs.map((o) => ({ output: o, body: renderBody(c, input), composite })));
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
  const slug = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const actions = {
    download: () => {
      if (!selected?.url || !session) return;
      const name = session.title || lbl(ROOMS, session.choices.room) || "render";
      downloadDataUrl(selected.url, `${slug(APP_NAME)}-${slug(name)}-${slug(selected.label)}.jpg`);
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
      if (!selected?.url || !session) return;
      const n = session.outputs.filter((o) => o.kind === "edit").length + 1;
      addChild("edit", `Edição ${n}`, selected, { mode: "edit", quality: session.choices.quality, image: await prepared(selected), instruction: text });
    },
    editArea: async (m: MaskResult, text: string) => {
      if (!selected?.url || !session) return;
      const base = await prepared(selected);
      const n = session.outputs.filter((o) => o.kind === "edit").length + 1;
      addChild("edit", `Edição ${n}`, selected, { mode: "edit", quality: session.choices.quality, image: base, mask: m.bw, instruction: text }, { base: selected.url, alpha: m.alpha });
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
      runJobs([{ output: o, body: renderBody(session.choices, session.input) }]);
    },
  };

  const openSession = (s: Session) => {
    setSession(s);
    setInput(s.input);
    setChoices(s.choices);
    setTitle(s.title ?? "");
    setSelectedId(s.outputs.find((o) => o.favorite)?.id ?? s.outputs[0]?.id ?? null);
    setPhase("result");
    setDialog(null);
  };

  const reset = () => {
    setSession(null);
    setInput(null);
    setRefs([]);
    setMask(null);
    setTitle("");
    setChoices((c) => ({ ...cloneChoices(DEFAULT_CHOICES), quality: c.quality, variations: c.variations }));
    setStepIdx(0);
    setPhase("wizard");
  };

  /* ---------- canvas (center) ---------- */

  const doneCount = session?.outputs.filter((o) => o.status === "done").length ?? 0;
  const parentOf = (o: Output) => (o.parentId ? session?.outputs.find((x) => x.id === o.parentId) : undefined);

  const canvas = (() => {
    if (!input) {
      return (
        <div className="flex size-full flex-col items-center justify-center gap-6 p-2 sm:p-6">
          <div className="hidden text-center lg:block">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase font-wide">Render fotorrealista com IA</p>
            <h2 className="mt-3 text-[34px] leading-[1.08] font-semibold font-display">
              Do print do SketchUp ao render
              <br />
              <span className="text-muted">mantendo cada linha do projeto.</span>
            </h2>
          </div>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cx(
              "group relative flex w-full max-w-2xl flex-1 cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-dashed p-8 text-center transition lg:max-h-[380px] lg:flex-none lg:py-16",
              dragOver ? "border-accent bg-accent-soft" : "border-line-strong bg-panel/40 hover:border-white/30 hover:bg-panel/70",
            )}
          >
            <div className="slats slats-fade pointer-events-none absolute inset-x-0 bottom-0 h-1/2 text-white/[.03]" />
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <span className="grid size-14 place-items-center rounded-2xl border border-line-strong bg-panel-3 text-ink transition group-hover:-translate-y-0.5">
              <ImagePlus className="size-6" strokeWidth={1.5} />
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
          <div className="hidden w-full max-w-2xl lg:block">
            <p className="mb-2.5 text-center text-xs text-faint">Ou teste com um exemplo</p>
            <div className="grid grid-cols-3 gap-3">
              {SAMPLES.map((s) => (
                <button key={s.src} type="button" onClick={() => loadSample(s)} className="group overflow-hidden rounded-2xl border border-line bg-panel text-left transition hover:border-line-strong">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt="" className="aspect-[16/10] w-full object-cover opacity-80 transition group-hover:opacity-100" />
                  <span className="block px-3 py-2 text-xs text-ink/80">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (phase === "result" && session && selected) {
      const before = parentOf(selected)?.url ?? session.input.url;
      const w = selected.width ?? session.input.width;
      const h = selected.height ?? session.input.height;
      return (
        <div className="flex size-full items-center justify-center">
          <div className="relative max-h-full max-w-full overflow-hidden rounded-2xl ring-1 ring-line shadow-lift" style={{ aspectRatio: `${w} / ${h}` }}>
            {selected.status === "pending" ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={before} alt="" className="block max-h-full max-w-full opacity-0" />
                <Generating
                  image={before}
                  startedAt={selected.createdAt}
                  expectedSeconds={expectedSeconds(selected.kind, session.choices.quality)}
                  label={selected.kind === "upscale" ? "Aumentando para HD 2K" : selected.kind === "edit" ? "Aplicando sua edição" : selected.kind === "variation" ? "Criando a variação" : "Gerando seu render"}
                  done={doneCount}
                  total={selected.kind === "render" ? session.outputs.filter((o) => o.kind === "render").length : undefined}
                />
              </>
            ) : selected.status === "done" && selected.url ? (
              <BeforeAfter key={selected.id} before={before} after={selected.url} width={w} height={h} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={before} alt="" className="block max-h-full max-w-full opacity-30" />
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex size-full items-center justify-center" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
        <div className="group relative max-h-full max-w-full overflow-hidden rounded-2xl ring-1 ring-line shadow-lift" style={{ aspectRatio: `${input.width} / ${input.height}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={input.url} alt="Imagem enviada" className="block max-h-full max-w-full object-contain" />
          {mask && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mask.alpha} alt="" className="pointer-events-none absolute inset-0 size-full opacity-40" style={{ filter: "sepia(1) saturate(3) hue-rotate(175deg)" }} />
          )}
          {detecting && <div className="absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-transparent via-white/25 to-transparent animate-scan" />}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="glass rounded-full px-2.5 py-1 text-[11px] font-medium">{detecting ? "Analisando a imagem..." : (lbl(INPUT_TYPES, choices.inputType) ?? "Escolha o tipo")}</span>
            <span className="glass hidden rounded-full px-2.5 py-1 font-mono text-[10.5px] text-ink/70 sm:inline">
              {input.width}×{input.height}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">
            <button type="button" onClick={() => setPainter({ target: "input" })} className="glass flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] hover:bg-panel-3">
              <Brush className="size-3.5" /> Pincel
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} className="glass flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] hover:bg-panel-3">
              <RefreshCw className="size-3.5" /> Trocar
            </button>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>
    );
  })();

  /* ---------- panel (right) ---------- */

  const stepBody = (() => {
    const p = { c: choices, update };
    switch (step) {
      case "upload":
        return <StepUpload {...p} input={input} detecting={detecting} onFile={handleFile} onSample={loadSample} />;
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
  const progress = ((stepIdx + 1) / steps.length) * 100;

  /* ---------- step rail (left, xl+) ---------- */

  const rail = (
    <nav className="hidden min-h-0 flex-col border-r border-line bg-panel xl:flex" aria-label="Etapas">
      <div className="px-5 pt-5 pb-3">
        <p className="text-[10.5px] font-semibold tracking-[0.16em] text-faint uppercase font-wide">{mode === "rapido" ? "Modo rápido" : "Briefing do render"}</p>
      </div>
      <ol className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4 scroll-thin">
        {steps.map((s, i) => {
          const locked = firstBlocked !== -1 && i > firstBlocked;
          const current = phase === "wizard" && s === step;
          const done = !current && (i < stepIdx || phase === "result") && canAdvance(s);
          const value = stepValue(s);
          return (
            <li key={s}>
              <button
                type="button"
                disabled={locked}
                onClick={() => goStep(s)}
                aria-current={current ? "step" : undefined}
                className={cx(
                  "group flex w-full items-start gap-3 rounded-xl px-2.5 py-2 text-left transition",
                  current ? "bg-panel-3" : "hover:bg-panel-2",
                  locked && "pointer-events-none opacity-35",
                )}
              >
                <span
                  className={cx(
                    "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-[11px] tabular-nums transition",
                    current ? "border-ink bg-ink text-bg" : done ? "border-line-strong bg-panel-3 text-ink" : "border-line-strong text-faint",
                  )}
                >
                  {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className={cx("block text-[13px] leading-tight", current ? "font-medium text-ink" : "text-ink/80")}>{STEP_META[s].short}</span>
                  {value && <span className="mt-0.5 block truncate text-[11.5px] text-faint">{value}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {input && (
        <div className="border-t border-line p-4">
          <p className="line-clamp-3 text-[11.5px] leading-relaxed text-muted">{summarySentence(choices)}.</p>
        </div>
      )}
    </nav>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-bg/80 px-3 backdrop-blur sm:gap-3 sm:px-4">
        <button type="button" onClick={reset} className="shrink-0 rounded-lg py-1 pr-1" aria-label="Novo render">
          <span className="hidden sm:block">
            <ProductLockup />
          </span>
          <span className="sm:hidden">
            <ProductLockup compact />
          </span>
        </button>
        <span className="hidden h-5 w-px bg-line-strong md:block" />
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSession((s) => (s ? { ...s, title: e.target.value.trim() || undefined } : s));
          }}
          placeholder="Projeto sem nome"
          maxLength={60}
          aria-label="Nome do projeto"
          className="hidden h-8 w-52 min-w-0 rounded-lg bg-transparent px-2 text-sm text-ink placeholder:text-faint hover:bg-panel-2 focus:bg-panel-2 focus:outline-none md:block"
        />
        {phase === "wizard" && (
          <div className="ml-auto w-[138px] sm:w-48 md:ml-2">
            <Segmented
              compact
              value={mode}
              onChange={switchMode}
              options={[
                { id: "rapido", label: "Rápido" },
                { id: "completo", label: "Completo" },
              ]}
            />
          </div>
        )}
        <div className={cx("flex items-center gap-0.5", phase === "wizard" ? "" : "ml-auto")}>
          {demo && <span className="mr-2 hidden rounded-full border border-line-strong px-2.5 py-1 text-[11px] text-muted lg:inline">Modo demonstração</span>}
          <Button size="sm" variant="ghost" onClick={() => setDialog("assistant")} aria-label="Assistente">
            <MessageSquareText className="size-4" />
            <span className="hidden xl:inline">Assistente</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDialog("presets")} aria-label="Presets">
            <Bookmark className="size-4" />
            <span className="hidden xl:inline">Presets</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDialog("history")} aria-label="Histórico">
            <History className="size-4" />
            <span className="hidden xl:inline">Histórico</span>
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[236px_minmax(0,1fr)_440px]">
        {rail}

        {/* Canvas */}
        <main className="canvas-grid relative flex h-[40dvh] shrink-0 flex-col sm:h-[46dvh] lg:h-auto">
          <div className="relative min-h-0 flex-1 p-3 lg:p-8">{canvas}</div>
          {phase === "result" && session && session.outputs.length > 1 && (
            <div className="hidden shrink-0 justify-center px-8 pb-6 lg:flex">
              <div className="glass flex max-w-full gap-2 overflow-x-auto rounded-2xl border border-line p-2 no-scrollbar">
                {session.outputs.map((o) => (
                  <div key={o.id} className="w-28 shrink-0">
                    <OutputThumb
                      o={o}
                      selected={o.id === selected?.id}
                      onClick={() => setSelectedId(o.id)}
                      onFavorite={() => patchOutput(o.id, { favorite: !o.favorite })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Panel */}
        <aside className="flex min-h-0 flex-1 flex-col border-t border-line bg-panel lg:border-t-0 lg:border-l">
          {phase === "wizard" ? (
            <>
              <div className="shrink-0 px-5 pt-4 lg:px-6 lg:pt-6">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase tabular-nums font-wide">
                    Etapa {stepIdx + 1} de {steps.length}
                  </span>
                  <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-panel-3">
                    <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <nav className="-mx-1 mt-3 flex gap-1 overflow-x-auto px-1 pb-1 no-scrollbar xl:hidden" aria-label="Etapas">
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
                          s === step ? "bg-ink text-bg" : i < stepIdx ? "text-ink/70 hover:text-ink" : "text-faint",
                          locked && "opacity-40",
                        )}
                      >
                        {STEP_META[s].short}
                      </button>
                    );
                  })}
                </nav>
                <div className="mt-3 pb-4 lg:mt-5 lg:pb-5" key={step}>
                  <h1 className="text-[22px] leading-tight font-semibold font-display animate-fade-in">{meta.title}</h1>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                    {meta.subtitle}
                    {optional && <span className="ml-1 text-faint">Opcional.</span>}
                  </p>
                </div>
              </div>
              <div ref={panelRef} className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 scroll-thin lg:px-6">
                <div key={step} className="animate-fade-in">
                  {stepBody}
                </div>
              </div>
              <footer className="flex shrink-0 items-center gap-2 border-t border-line bg-panel px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:px-5">
                <Button variant="ghost" onClick={() => go(stepIdx - 1)} disabled={stepIdx === 0} aria-label="Voltar">
                  <ArrowLeft className="size-4" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
                {optional && (
                  <Button variant="ghost" className="text-muted" onClick={() => go(steps.indexOf("resumo"))}>
                    <Sparkles className="size-3.5" /> IA decide o resto
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
            <div ref={panelRef} className="min-h-0 flex-1 overflow-y-auto p-5 scroll-thin lg:p-6">
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
            flash("Briefing preenchido. Confira e ajuste o que quiser.");
            setStepIdx(input && choices.inputType ? FULL.indexOf("resumo") : 0);
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {needAccess && <AccessGate onOk={() => setNeedAccess(false)} />}

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-8">
          <div className="flex items-center gap-2 rounded-full border border-line-strong bg-panel-3 px-4 py-2.5 text-sm shadow-lift animate-pop">
            <Icon name="Check" className="size-4 text-ok" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
