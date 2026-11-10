"use client";

import { Plus, X } from "lucide-react";
import {
  ANGLES,
  ARTIFICIAL,
  FORMATS,
  FURNITURE_MODES,
  GOALS,
  ITEMS,
  LENSES,
  PALETTES,
  ROOMS,
  SKIES,
  STYLES,
  SURFACES,
  TEMPERATURES,
  TIMES,
  surfacesForRoom,
} from "@/config/options";
import type { Choices } from "@/lib/wizard/types";
import { AutoToggle, Chip, cx, Icon, OptionCard, OptionRow, Palette, Section, Segmented, Swatch } from "@/components/ui/kit";

export type StepProps = { c: Choices; update: (fn: (d: Choices) => void) => void };

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

export function StepGoal({ c, update }: StepProps) {
  return (
    <div className="space-y-2.5">
      {GOALS.map((g) => (
        <OptionRow key={g.id} icon={g.icon} label={g.label} hint={g.hint} selected={c.goal === g.id} onClick={() => update((d) => void (d.goal = g.id))} />
      ))}
    </div>
  );
}

export function StepRoom({ c, update }: StepProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {ROOMS.map((r) => (
        <OptionCard
          key={r.id}
          compact
          label={r.label}
          selected={c.room === r.id}
          onClick={() => update((d) => void (d.room = r.id))}
          thumb={
            <div className={cx("grid h-full place-items-center transition", c.room === r.id ? "text-accent" : "text-ink/70 group-hover:text-ink")}>
              <Icon name={r.icon} className="size-6" />
            </div>
          }
        />
      ))}
    </div>
  );
}

export function StepStyle({ c, update }: StepProps) {
  return (
    <div className="space-y-4">
      <AutoToggle active={c.style === "auto"} onClick={() => update((d) => void (d.style = "auto"))} />
      <div className="grid grid-cols-2 gap-2.5">
        {STYLES.map((s) => (
          <OptionCard
            key={s.id}
            label={s.label}
            hint={s.hint}
            selected={c.style === s.id}
            onClick={() => update((d) => void (d.style = d.style === s.id ? "auto" : s.id))}
            thumb={<Palette colors={s.colors!} />}
          />
        ))}
      </div>
    </div>
  );
}

export function StepMaterials({ c, update }: StepProps) {
  const keys = surfacesForRoom(c.room);
  return (
    <div className="space-y-7">
      {SURFACES.filter((s) => keys.includes(s.key)).map((s) => {
        const value = c.materials[s.key];
        const set = (v: string) => update((d) => void (d.materials[s.key] = v));
        return (
          <Section key={s.key} title={s.label}>
            <div className="flex flex-wrap gap-2">
              <Chip selected={value === "auto"} onClick={() => set("auto")}>
                IA decide
              </Chip>
              <Chip selected={value === "manter"} onClick={() => set("manter")}>
                Manter como está
              </Chip>
            </div>
            <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 scroll-thin">
              {s.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => set(value === o.id ? "auto" : o.id)}
                  aria-pressed={value === o.id}
                  className="group w-[92px] shrink-0 snap-start text-left"
                >
                  <div
                    className={cx(
                      "relative aspect-square overflow-hidden rounded-xl border-2 transition",
                      value === o.id ? "border-accent" : "border-transparent ring-1 ring-line group-hover:ring-line-strong",
                    )}
                  >
                    <Swatch bg={o.swatch} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                  </div>
                  <span className={cx("mt-1.5 block text-[11.5px] leading-tight", value === o.id ? "text-ink" : "text-muted")}>{o.label}</span>
                </button>
              ))}
            </div>
          </Section>
        );
      })}
    </div>
  );
}

export function StepPalette({ c, update }: StepProps) {
  const { palette } = c;
  return (
    <div className="space-y-6">
      <AutoToggle active={palette.mode === "auto"} onClick={() => update((d) => void (d.palette = { mode: "auto", preset: null, colors: [] }))} />
      <Section title="Paletas prontas">
        <div className="grid grid-cols-2 gap-2.5">
          {PALETTES.map((p) => (
            <OptionCard
              key={p.id}
              compact
              label={p.label}
              selected={palette.mode === "preset" && palette.preset === p.id}
              onClick={() => update((d) => void (d.palette = { mode: "preset", preset: p.id, colors: [] }))}
              thumb={<Palette colors={p.colors!} />}
            />
          ))}
        </div>
      </Section>
      <Section title="Minhas cores" hint="Escolha até 4 cores">
        <div className="flex flex-wrap items-center gap-3">
          {(palette.mode === "custom" ? palette.colors : []).map((col, i) => (
            <div key={i} className="relative">
              <label className="block size-14 cursor-pointer overflow-hidden rounded-2xl border border-line-strong" style={{ background: col }}>
                <input
                  type="color"
                  value={col}
                  className="sr-only"
                  aria-label={`Cor ${i + 1}`}
                  onChange={(e) => update((d) => void (d.palette.colors[i] = e.target.value))}
                />
              </label>
              <button
                type="button"
                aria-label="Remover cor"
                onClick={() =>
                  update((d) => {
                    d.palette.colors.splice(i, 1);
                    if (!d.palette.colors.length) d.palette.mode = "auto";
                  })
                }
                className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-panel-3 text-ink ring-1 ring-line-strong"
              >
                <X className="size-3" />
              </button>
              <span className="mt-1 block text-center font-mono text-[10px] text-muted uppercase">{col}</span>
            </div>
          ))}
          {(palette.mode !== "custom" || palette.colors.length < 4) && (
            <button
              type="button"
              onClick={() =>
                update((d) => {
                  if (d.palette.mode !== "custom") d.palette = { mode: "custom", preset: null, colors: [] };
                  d.palette.colors.push(["#d9c7ae", "#6b7f5e", "#2f2a24", "#c98b5f"][d.palette.colors.length] ?? "#cccccc");
                })
              }
              className="grid size-14 place-items-center rounded-2xl border border-dashed border-line-strong text-muted hover:border-accent hover:text-accent"
              aria-label="Adicionar cor"
            >
              <Plus className="size-5" />
            </button>
          )}
        </div>
      </Section>
    </div>
  );
}

export function StepLighting({ c, update }: StepProps) {
  const l = c.lighting;
  return (
    <div className="space-y-7">
      <Section title="Hora do dia" action={<AutoToggle active={l.time === "auto"} onClick={() => update((d) => void (d.lighting.time = "auto"))} label="IA decide" />}>
        <div className="grid grid-cols-2 gap-2.5">
          {TIMES.map((t) => (
            <OptionCard
              key={t.id}
              compact
              label={t.label}
              selected={l.time === t.id}
              onClick={() => update((d) => void (d.lighting.time = d.lighting.time === t.id ? "auto" : t.id))}
              thumb={
                <>
                  <Swatch bg={t.swatch} />
                  <Icon name={t.icon} className="absolute right-3 bottom-2.5 size-5 text-white/90 drop-shadow" />
                </>
              }
            />
          ))}
        </div>
      </Section>
      <Section title="Luz artificial" hint="Marque as que devem aparecer acesas">
        <div className="flex flex-wrap gap-2">
          {ARTIFICIAL.map((a) => (
            <Chip key={a.id} selected={l.artificial.includes(a.id)} onClick={() => update((d) => void (d.lighting.artificial = toggle(d.lighting.artificial, a.id)))}>
              {a.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TEMPERATURES.map((t) => (
            <Chip
              key={t.id}
              swatch={t.swatch}
              selected={l.temperature === t.id}
              onClick={() => update((d) => void (d.lighting.temperature = d.lighting.temperature === t.id ? "auto" : t.id))}
            >
              {t.label}
            </Chip>
          ))}
        </div>
      </Section>
      <Section title="Céu" hint="Na área externa ou pelas janelas">
        <div className="flex flex-wrap gap-2">
          {SKIES.map((s) => (
            <Chip key={s.id} swatch={s.swatch} selected={l.sky === s.id} onClick={() => update((d) => void (d.lighting.sky = d.lighting.sky === s.id ? "auto" : s.id))}>
              {s.label}
            </Chip>
          ))}
        </div>
      </Section>
      <Section
        title="Luz natural"
        action={<AutoToggle active={l.natural === null} onClick={() => update((d) => void (d.lighting.natural = d.lighting.natural === null ? 60 : null))} label="IA decide" />}
      >
        <div className={cx("transition", l.natural === null && "opacity-40")}>
          <input
            type="range"
            min={0}
            max={100}
            value={l.natural ?? 60}
            aria-label="Intensidade da luz natural"
            onChange={(e) => update((d) => void (d.lighting.natural = Number(e.target.value)))}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>Pouca</span>
            <span>Muita</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

export function StepFurniture({ c, update }: StepProps) {
  const f = c.furniture;
  return (
    <div className="space-y-7">
      <Section title="Móveis" action={<AutoToggle active={f.mode === "auto"} onClick={() => update((d) => void (d.furniture.mode = "auto"))} label="IA decide" />}>
        <div className="space-y-2.5">
          {FURNITURE_MODES.map((m) => (
            <OptionRow
              key={m.id}
              icon={m.icon}
              label={m.label}
              selected={f.mode === m.id}
              onClick={() => update((d) => void (d.furniture.mode = d.furniture.mode === m.id ? "auto" : m.id))}
            />
          ))}
        </div>
      </Section>
      <Section title="Incluir na cena">
        <div className="flex flex-wrap gap-2">
          {ITEMS.map((i) => (
            <Chip key={i.id} selected={f.items.includes(i.id)} onClick={() => update((d) => void (d.furniture.items = toggle(d.furniture.items, i.id)))}>
              {i.label}
            </Chip>
          ))}
        </div>
      </Section>
      <Section title="O que NÃO pode aparecer" hint="Vira uma restrição forte para a IA">
        <textarea
          value={f.avoid}
          maxLength={200}
          onChange={(e) => update((d) => void (d.furniture.avoid = e.target.value))}
          placeholder="Ex.: televisão, cortina, objetos vermelhos"
          rows={2}
          className="w-full resize-none rounded-2xl border border-line bg-panel-2 px-4 py-3 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
        />
      </Section>
    </div>
  );
}

function RatioIcon({ ratio }: { ratio: string | null }) {
  const [w, h] = ratio ? ratio.split(":").map(Number) : [4, 3];
  const scale = 18 / Math.max(w!, h!);
  return <span className="block rounded-[3px] border-[1.5px] border-current" style={{ width: w! * scale, height: h! * scale }} />;
}

export function StepCamera({ c, update }: StepProps) {
  const cam = c.camera;
  return (
    <div className="space-y-7">
      <Section title="Ângulo">
        <div className="space-y-2.5">
          {ANGLES.map((a) => (
            <OptionRow
              key={a.id}
              icon={a.icon}
              label={a.label}
              hint={a.id === "original" ? "Recomendado: mantém a geometria exata" : undefined}
              selected={cam.angle === a.id}
              onClick={() => update((d) => void (d.camera.angle = a.id))}
            />
          ))}
        </div>
      </Section>
      <Section title="Formato" hint={cam.format !== "original" ? "Formatos diferentes do original fazem a IA completar ou cortar as bordas." : undefined}>
        <div className="grid grid-cols-5 gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => update((d) => void (d.camera.format = f.id))}
              aria-pressed={cam.format === f.id}
              className={cx(
                "flex flex-col items-center gap-1.5 rounded-2xl border px-1 py-3 transition",
                cam.format === f.id ? "border-accent bg-accent-soft text-accent" : "border-line bg-panel-2 text-muted hover:text-ink",
              )}
            >
              <span className="grid h-5 place-items-center">
                <RatioIcon ratio={f.ratio} />
              </span>
              <span className="text-[12px] font-medium text-ink">{f.label}</span>
              <span className="text-[10px] leading-none">{f.hint}</span>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Lente">
        <Segmented
          value={cam.lens}
          onChange={(v) => update((d) => void (d.camera.lens = v))}
          options={[{ id: "auto", label: "IA decide" }, ...LENSES.map((l) => ({ id: l.id, label: l.label }))]}
        />
      </Section>
    </div>
  );
}
