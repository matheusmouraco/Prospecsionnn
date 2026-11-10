"use client";

import { Bookmark, Brush, Camera, ImagePlus, LoaderCircle, Lock, Minus, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { INPUT_TYPES, QUALITIES } from "@/config/options";
import { summaryItems, summarySentence } from "@/lib/ai/summary";
import type { Img } from "@/lib/image/client";
import { creditsFor } from "@/lib/wizard/types";
import { Button, cx, Icon, Section } from "@/components/ui/kit";
import type { StepProps } from "./choices-steps";

export function FilePickers({ onFile, compact }: { onFile: (f: File) => void; compact?: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.target.value = "";
  };
  return (
    <div className={cx("grid gap-2", compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
      <Button variant={compact ? "soft" : "primary"} size={compact ? "md" : "lg"} onClick={() => fileRef.current?.click()}>
        <Upload className="size-4" /> {compact ? "Trocar imagem" : "Escolher imagem"}
      </Button>
      <Button variant="outline" size={compact ? "md" : "lg"} onClick={() => camRef.current?.click()}>
        <Camera className="size-4" /> Tirar foto
      </Button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={pick} />
    </div>
  );
}

export function StepUpload({
  c,
  update,
  input,
  detecting,
  onFile,
}: StepProps & { input: Img | null; detecting: boolean; onFile: (f: File) => void }) {
  if (!input) {
    return (
      <div className="space-y-5">
        <FilePickers onFile={onFile} />
        <ul className="grid grid-cols-2 gap-2 text-[12.5px] text-muted">
          {INPUT_TYPES.map((t) => (
            <li key={t.id} className="flex items-center gap-2 rounded-xl border border-line bg-panel-2 px-3 py-2.5">
              <Icon name={t.icon} className="size-4 text-accent" />
              <span>
                <span className="block text-ink">{t.label}</span>
                {t.hint}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-faint">JPG, PNG ou WebP. A imagem é comprimida no seu aparelho antes de enviar.</p>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <Section
        title="Que tipo de imagem é essa?"
        hint={detecting ? undefined : c.inputType ? "Detectamos automaticamente. Confira e corrija se precisar." : "Escolha o tipo para a IA tratar do jeito certo."}
        action={detecting ? <LoaderCircle className="size-4 animate-spin text-accent" /> : undefined}
      >
        <div className="grid grid-cols-2 gap-2">
          {INPUT_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => update((d) => void (d.inputType = t.id))}
              aria-pressed={c.inputType === t.id}
              className={cx(
                "flex flex-col gap-2 rounded-2xl border p-3 text-left transition",
                c.inputType === t.id ? "border-accent bg-accent-soft" : "border-line bg-panel-2 hover:border-line-strong",
                detecting && "animate-pulse",
              )}
            >
              <Icon name={t.icon} className={cx("size-5", c.inputType === t.id ? "text-accent" : "text-ink/70")} />
              <span>
                <span className="block text-[13px] font-medium">{t.label}</span>
                <span className="text-[11.5px] text-muted">{t.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </Section>
      <FilePickers onFile={onFile} compact />
    </div>
  );
}

export function StepRefine({
  c,
  update,
  refs,
  onAddRef,
  onRemoveRef,
  maskPreview,
  onOpenMask,
  onClearMask,
  maskLock,
  setMaskLock,
}: StepProps & {
  refs: Img[];
  onAddRef: (f: File) => void;
  onRemoveRef: (i: number) => void;
  maskPreview: string | null;
  onOpenMask: () => void;
  onClearMask: () => void;
  maskLock: boolean;
  setMaskLock: (v: boolean) => void;
}) {
  const refInput = useRef<HTMLInputElement>(null);
  const f = c.refine.fidelity;
  return (
    <div className="space-y-7">
      <Section title="Referências" hint="Até 3 imagens de moodboard. A IA segue o estilo e as cores, nunca o layout.">
        <div className="grid grid-cols-3 gap-2">
          {refs.map((r, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-2xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.url} alt={`Referência ${i + 1}`} className="size-full object-cover" />
              <button
                type="button"
                aria-label="Remover referência"
                onClick={() => onRemoveRef(i)}
                className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-black/70 text-white backdrop-blur"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {refs.length < 3 && (
            <button
              type="button"
              onClick={() => refInput.current?.click()}
              className="grid aspect-square place-items-center rounded-2xl border border-dashed border-line-strong text-muted transition hover:border-accent hover:text-accent"
            >
              <span className="flex flex-col items-center gap-1 text-xs">
                <ImagePlus className="size-5" /> Adicionar
              </span>
            </button>
          )}
        </div>
        <input
          ref={refInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            Array.from(e.target.files ?? [])
              .slice(0, 3 - refs.length)
              .forEach(onAddRef);
            e.target.value = "";
          }}
        />
      </Section>

      <Section title="Áreas que podem mudar" hint="Pinte o que a IA pode alterar. O resto fica travado.">
        {maskPreview ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel-2 p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={maskPreview} alt="Máscara" className="h-16 w-24 rounded-lg object-cover" />
              <div className="flex-1 text-xs text-muted">Máscara aplicada</div>
              <Button size="sm" variant="soft" onClick={onOpenMask}>
                <Pencil className="size-3.5" /> Editar
              </Button>
              <Button size="sm" variant="ghost" onClick={onClearMask} aria-label="Remover máscara">
                <Trash2 className="size-4" />
              </Button>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-panel-2 p-3">
              <input type="checkbox" checked={maskLock} onChange={(e) => setMaskLock(e.target.checked)} className="mt-0.5 size-4 accent-[var(--color-accent)]" />
              <span className="text-[13px]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock className="size-3.5 text-accent" /> Travar 100% fora da máscara
                </span>
                <span className="text-xs text-muted">Depois de gerar, recolamos os pixels originais fora da área pintada. Só vale no formato original.</span>
              </span>
            </label>
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={onOpenMask}>
            <Brush className="size-4" /> Marcar com pincel
          </Button>
        )}
      </Section>

      <Section title="Detalhes em texto livre" hint="Opcional. Escreva como falaria com o renderista.">
        <textarea
          value={c.refine.notes}
          maxLength={400}
          rows={3}
          onChange={(e) => update((d) => void (d.refine.notes = e.target.value))}
          placeholder="Ex.: ilha central com cooktop e 3 pendentes pretos"
          className="w-full resize-none rounded-2xl border border-line bg-panel-2 px-4 py-3 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
        />
      </Section>

      <Section title="Fidelidade">
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={f}
          aria-label="Fidelidade à imagem original"
          onChange={(e) => update((d) => void (d.refine.fidelity = Number(e.target.value)))}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] text-muted">
          <span className={cx(f <= 45 && "text-accent")}>Fiel à minha imagem</span>
          <span className={cx(f > 70 && "text-accent")}>Mais criativo</span>
        </div>
      </Section>
    </div>
  );
}

export function StepSummary({
  c,
  update,
  onEdit,
  onSavePreset,
  refsCount,
  hasMask,
}: StepProps & { onEdit: (step: string) => void; onSavePreset: (name: string) => void; refsCount: number; hasMask: boolean }) {
  const [presetName, setPresetName] = useState("");
  const [saved, setSaved] = useState(false);
  const items = summaryItems(c);
  const total = creditsFor(c.quality, c.variations);
  return (
    <div className="space-y-7">
      <div className="rounded-2xl border border-line bg-gradient-to-br from-panel-3 to-panel-2 p-4">
        <p className="text-[11px] font-semibold tracking-wider text-accent uppercase">Seu render</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{summarySentence(c)}.</p>
        {(refsCount > 0 || hasMask) && (
          <p className="mt-2 text-xs text-muted">
            {[refsCount ? `${refsCount} referência${refsCount > 1 ? "s" : ""}` : null, hasMask ? "área marcada com pincel" : null].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      {items.length > 0 && (
        <Section title="Editar escolhas">
          <div className="flex flex-wrap gap-1.5">
            {items.map((it, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onEdit(it.step)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-panel-2 px-3 py-1.5 text-xs text-ink/85 transition hover:border-accent hover:text-ink"
              >
                {it.text}
                <Pencil className="size-3 text-faint group-hover:text-accent" />
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section title="Qualidade">
        <div className="grid grid-cols-2 gap-2.5">
          {QUALITIES.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => update((d) => void (d.quality = q.id))}
              aria-pressed={c.quality === q.id}
              className={cx(
                "rounded-2xl border p-3.5 text-left transition",
                c.quality === q.id ? "border-accent bg-accent-soft" : "border-line bg-panel-2 hover:border-line-strong",
              )}
            >
              <span className="flex items-center justify-between">
                <span className="text-sm font-semibold">{q.label}</span>
                <span className="rounded-full bg-black/30 px-2 py-0.5 text-[11px] text-accent">
                  {q.credits} crédito{q.credits > 1 ? "s" : ""}
                </span>
              </span>
              <span className="mt-1 block text-xs text-muted">{q.hint}</span>
              <span className="mt-1 block text-[11px] text-faint">~{q.seconds}s por imagem</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Variações">
        <div className="flex items-center justify-between rounded-2xl border border-line bg-panel-2 p-2">
          <Button size="sm" variant="soft" aria-label="Menos variações" disabled={c.variations <= 1} onClick={() => update((d) => void (d.variations = Math.max(1, d.variations - 1)))}>
            <Minus className="size-4" />
          </Button>
          <div className="text-center">
            <span className="text-2xl font-semibold tabular-nums">{c.variations}</span>
            <span className="block text-[11px] text-muted">imagem{c.variations > 1 ? "s" : ""}</span>
          </div>
          <Button size="sm" variant="soft" aria-label="Mais variações" disabled={c.variations >= 4} onClick={() => update((d) => void (d.variations = Math.min(4, d.variations + 1)))}>
            <Plus className="size-4" />
          </Button>
        </div>
        <p className="text-center text-sm">
          Total: <span className="font-semibold text-accent">{total} crédito{total > 1 ? "s" : ""}</span>
        </p>
      </Section>

      <Section title="Salvar como preset" hint="Reaplique todas estas escolhas em um clique nos próximos projetos.">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSavePreset(presetName.trim() || "Meu padrão");
            setSaved(true);
            setPresetName("");
            setTimeout(() => setSaved(false), 2200);
          }}
        >
          <input
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Meu padrão"
            maxLength={40}
            className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-panel-2 px-3 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
          />
          <Button type="submit" variant="soft">
            <Bookmark className="size-4" /> {saved ? "Salvo" : "Salvar"}
          </Button>
        </form>
      </Section>
    </div>
  );
}
