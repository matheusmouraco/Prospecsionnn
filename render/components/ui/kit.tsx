"use client";

import {
  Box,
  Camera,
  PenTool,
  Building2,
  Sparkles,
  Armchair,
  Hammer,
  Sofa,
  Trees,
  ChefHat,
  UtensilsCrossed,
  BedDouble,
  Baby,
  Bath,
  Droplets,
  Flame,
  Sun,
  Shirt,
  Laptop,
  Briefcase,
  Store,
  Waves,
  Sunrise,
  Sunset,
  Moon,
  Minus,
  Lamp,
  Lightbulb,
  CloudSun,
  Lock,
  RotateCcw,
  Plus,
  Square,
  Ratio,
  Grid2x2,
  Maximize2,
  Circle,
  Check,
  type LucideIcon,
} from "lucide-react";

// Explicit map (not `import *`) so only the icons in use are bundled.
const ICONS: Record<string, LucideIcon> = { Box, Camera, PenTool, Building2, Sparkles, Armchair, Hammer, Sofa, Trees, ChefHat, UtensilsCrossed, BedDouble, Baby, Bath, Droplets, Flame, Sun, Shirt, Laptop, Briefcase, Store, Waves, Sunrise, Sunset, Moon, Minus, Lamp, Lightbulb, CloudSun, Lock, RotateCcw, Plus, Square, Ratio, Grid2x2, Maximize2, Circle };
import type { ComponentProps, ReactNode } from "react";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Icon({ name, className = "size-5" }: { name?: string; className?: string }) {
  const C = (name && ICONS[name]) || Circle;
  return <C className={className} strokeWidth={1.6} aria-hidden />;
}

export function Button({
  variant = "ghost",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "ghost" | "outline" | "soft"; size?: "sm" | "md" | "lg" }) {
  return (
    <button
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "lg" && "h-13 px-6 text-[15px]",
        variant === "primary" && "bg-accent text-accent-ink shadow-[0_8px_30px_-8px_rgb(232_181_109/0.6)] hover:brightness-105",
        variant === "ghost" && "text-ink/80 hover:bg-white/5 hover:text-ink",
        variant === "outline" && "border border-line-strong text-ink hover:border-white/30 hover:bg-white/5",
        variant === "soft" && "bg-panel-3 text-ink hover:bg-white/10",
        className,
      )}
    />
  );
}

/** Selectable visual card used by every wizard step. */
export function OptionCard({
  selected,
  onClick,
  label,
  hint,
  thumb,
  compact,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
  thumb?: ReactNode;
  compact?: boolean;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cx(
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border text-left transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        selected ? "border-accent bg-accent-soft" : "border-line bg-panel-2 hover:border-line-strong hover:bg-panel-3",
      )}
    >
      {thumb && <div className={cx("relative w-full overflow-hidden", compact ? "h-16" : "aspect-[4/3]")}>{thumb}</div>}
      <div className={cx("flex flex-1 flex-col gap-0.5", compact ? "px-3 py-2" : "px-3 py-2.5")}>
        <span className="text-[13px] leading-tight font-medium text-ink">{label}</span>
        {hint && <span className="text-[11.5px] leading-snug text-muted">{hint}</span>}
      </div>
      {badge && <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium tracking-wide text-ink uppercase backdrop-blur">{badge}</span>}
      <span
        className={cx(
          "absolute top-2 right-2 grid size-5 place-items-center rounded-full transition",
          selected ? "scale-100 bg-accent text-accent-ink" : "scale-75 opacity-0",
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
    </button>
  );
}

/** Row-style option (icon + text), better for long labels and on mobile. */
export function OptionRow({ selected, onClick, label, hint, icon }: { selected: boolean; onClick: () => void; label: string; hint?: string; icon?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cx(
        "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        selected ? "border-accent bg-accent-soft" : "border-line bg-panel-2 hover:border-line-strong hover:bg-panel-3",
      )}
    >
      <span className={cx("grid size-10 shrink-0 place-items-center rounded-xl", selected ? "bg-accent text-accent-ink" : "bg-panel-3 text-ink/80")}>
        <Icon name={icon} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </span>
      <span className={cx("ml-auto grid size-5 shrink-0 place-items-center rounded-full border", selected ? "border-accent bg-accent text-accent-ink" : "border-line-strong")}>
        {selected && <Check className="size-3" strokeWidth={3} />}
      </span>
    </button>
  );
}

export function Chip({ selected, onClick, children, swatch }: { selected: boolean; onClick: () => void; children: ReactNode; swatch?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cx(
        "inline-flex h-9 items-center gap-2 rounded-full border pr-3.5 text-[13px] transition",
        swatch ? "pl-1.5" : "pl-3.5",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        selected ? "border-accent bg-accent-soft text-ink" : "border-line bg-panel-2 text-ink/85 hover:border-line-strong",
      )}
    >
      {swatch && <span className="size-6 rounded-full border border-white/10" style={{ background: swatch }} />}
      {children}
      {selected && <Check className="size-3.5 text-accent" strokeWidth={3} />}
    </button>
  );
}

export function Section({ title, hint, children, action }: { title: string; hint?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold tracking-wide text-ink/90 uppercase">{title}</h3>
          {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Swatch({ bg, className }: { bg?: string; className?: string }) {
  return <div className={cx("absolute inset-0", className)} style={{ background: bg }} />;
}

export function Palette({ colors, className }: { colors: string[]; className?: string }) {
  return (
    <div className={cx("absolute inset-0 grid grid-cols-[2fr_1fr] grid-rows-2", className)}>
      <div className="row-span-2" style={{ background: colors[0] }} />
      <div style={{ background: colors[1] }} />
      <div className="grid grid-cols-2">
        <div style={{ background: colors[2] }} />
        <div style={{ background: colors[3] }} />
      </div>
    </div>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { id: T; label: string; hint?: string }[] }) {
  return (
    <div className="grid gap-1 rounded-2xl border border-line bg-panel-2 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={cx(
            "flex flex-col items-center rounded-xl px-2 py-2 text-[13px] transition",
            value === o.id ? "bg-panel-3 text-ink shadow-[inset_0_0_0_1px_rgb(232_181_109/0.6)]" : "text-muted hover:text-ink",
          )}
        >
          <span className="font-medium">{o.label}</span>
          {o.hint && <span className="text-[10.5px] text-faint">{o.hint}</span>}
        </button>
      ))}
    </div>
  );
}

export function AutoToggle({ active, onClick, label = "Deixar a IA decidir" }: { active: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition",
        active ? "border-accent/70 bg-accent-soft text-accent" : "border-line text-muted hover:border-line-strong hover:text-ink",
      )}
    >
      <Sparkles className="size-3.5" strokeWidth={1.8} />
      {label}
    </button>
  );
}
