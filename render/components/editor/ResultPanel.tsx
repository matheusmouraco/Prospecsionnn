"use client";

import { ArrowLeft, Brush, ChevronDown, Code2, Copy, Download, Heart, LoaderCircle, MessageSquareText, Plus, RotateCcw, Sparkles, TriangleAlert, Zap } from "lucide-react";
import { useState } from "react";
import type { Output, Session } from "@/lib/store/local";
import { Button, cx } from "@/components/ui/kit";

const KIND_LABEL: Record<Output["kind"], string> = { render: "Render", variation: "Variação", edit: "Edição", upscale: "HD 2K" };

export function OutputThumb({ o, selected, onClick, onFavorite }: { o: Output; selected: boolean; onClick: () => void; onFavorite?: () => void }) {
  return (
    <div className={cx("group relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition", selected ? "border-accent" : "border-transparent ring-1 ring-line hover:ring-line-strong")}>
      <button type="button" onClick={onClick} className="absolute inset-0" aria-label={`Ver ${o.label}`}>
        {o.status === "done" && o.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={o.url} alt={o.label} className="size-full object-cover" />
        ) : o.status === "pending" ? (
          <span className="grid size-full place-items-center shimmer">
            <LoaderCircle className="size-5 animate-spin text-accent" />
          </span>
        ) : (
          <span className="grid size-full place-items-center bg-danger/10 text-danger">
            <TriangleAlert className="size-5" />
          </span>
        )}
      </button>
      <span className="pointer-events-none absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur">{o.label}</span>
      {onFavorite && o.status === "done" && (
        <button
          type="button"
          onClick={onFavorite}
          aria-label={o.favorite ? "Desfavoritar" : "Favoritar"}
          aria-pressed={o.favorite}
          className={cx("absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full backdrop-blur transition", o.favorite ? "bg-accent text-accent-ink" : "bg-black/50 text-white opacity-80 group-hover:opacity-100")}
        >
          <Heart className="size-3.5" fill={o.favorite ? "currentColor" : "none"} />
        </button>
      )}
    </div>
  );
}

export function ResultPanel({
  session,
  selected,
  busy,
  demo,
  onSelect,
  onFavorite,
  onDownload,
  onUpscale,
  onVariation,
  onEditText,
  onEditArea,
  onBackToWizard,
  onNew,
  onRetry,
}: {
  session: Session;
  selected: Output | undefined;
  busy: boolean;
  demo: boolean;
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
  onDownload: () => void;
  onUpscale: () => void;
  onVariation: () => void;
  onEditText: (text: string) => void;
  onEditArea: () => void;
  onBackToWizard: () => void;
  onNew: () => void;
  onRetry: (id: string) => void;
}) {
  const [edit, setEdit] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const ready = selected?.status === "done";

  // Version chain of the selected output (render > edit > upscale...)
  const chain: Output[] = [];
  let cur = selected;
  while (cur) {
    chain.unshift(cur);
    cur = cur.parentId ? session.outputs.find((o) => o.id === cur!.parentId) : undefined;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold tracking-wider text-accent uppercase">Resultado</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/85">{session.summary}.</p>
        {demo && (
          <p className="mt-2 rounded-xl border border-accent/30 bg-accent-soft px-3 py-2 text-xs text-accent">
            Modo demonstração: a imagem só recebe um ajuste de cor. Configure a GEMINI_API_KEY para gerar renders de verdade.
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {session.outputs.map((o) => (
          <OutputThumb key={o.id} o={o} selected={o.id === selected?.id} onClick={() => onSelect(o.id)} onFavorite={() => onFavorite(o.id)} />
        ))}
      </div>

      {selected?.status === "error" && (
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-3 text-sm">
          <p className="text-danger">{selected.error ?? "Não deu certo desta vez."}</p>
          <p className="mt-1 text-xs text-muted">O crédito desta imagem não é cobrado.</p>
          <Button size="sm" variant="soft" className="mt-2" onClick={() => onRetry(selected.id)}>
            <RotateCcw className="size-3.5" /> Tentar de novo
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="primary" disabled={!ready} onClick={onDownload} className="col-span-2">
          <Download className="size-4" /> Baixar imagem
        </Button>
        <Button variant="soft" disabled={!ready || busy || selected?.kind === "upscale"} onClick={onUpscale}>
          <Zap className="size-4" /> Upscale HD
        </Button>
        <Button variant="soft" disabled={!ready || busy} onClick={onVariation}>
          <Sparkles className="size-4" /> Variação desta
        </Button>
      </div>

      <section className="space-y-2.5">
        <h3 className="text-[13px] font-semibold tracking-wide text-ink/90 uppercase">Editar</h3>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (edit.trim().length < 3) return;
            onEditText(edit.trim());
            setEdit("");
          }}
        >
          <div className="relative min-w-0 flex-1">
            <MessageSquareText className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
            <input
              value={edit}
              onChange={(e) => setEdit(e.target.value)}
              disabled={!ready || busy}
              maxLength={300}
              placeholder="Troque o piso por madeira"
              className="h-11 w-full rounded-xl border border-line bg-panel-2 pr-3 pl-9 text-sm placeholder:text-faint focus:border-accent focus:outline-none disabled:opacity-50"
            />
          </div>
          <Button type="submit" variant="soft" disabled={!ready || busy || edit.trim().length < 3}>
            Aplicar
          </Button>
        </form>
        <Button variant="outline" className="w-full" disabled={!ready || busy} onClick={onEditArea}>
          <Brush className="size-4" /> Editar só uma área com pincel
        </Button>
      </section>

      {chain.length > 1 && (
        <section className="space-y-2.5">
          <h3 className="text-[13px] font-semibold tracking-wide text-ink/90 uppercase">Versões</h3>
          <ol className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-thin">
            {chain.map((o, i) => (
              <li key={o.id} className="flex shrink-0 items-center gap-1.5">
                {i > 0 && <span className="text-faint">›</span>}
                <button
                  type="button"
                  onClick={() => onSelect(o.id)}
                  className={cx("rounded-full border px-2.5 py-1 text-xs", o.id === selected?.id ? "border-accent text-accent" : "border-line text-muted hover:text-ink")}
                >
                  {KIND_LABEL[o.kind]}
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="ghost" onClick={onBackToWizard}>
          <ArrowLeft className="size-4" /> Ajustar escolhas
        </Button>
        <Button variant="ghost" onClick={onNew}>
          <Plus className="size-4" /> Novo render
        </Button>
      </div>

      {selected?.prompt && (
        <section className="rounded-2xl border border-line">
          <button type="button" onClick={() => setShowPrompt((v) => !v)} className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-muted hover:text-ink">
            <Code2 className="size-3.5" /> Prompt enviado à IA {selected.model ? `(${selected.model})` : ""}
            <ChevronDown className={cx("ml-auto size-3.5 transition", showPrompt && "rotate-180")} />
          </button>
          {showPrompt && (
            <div className="border-t border-line p-3">
              <pre className="max-h-64 overflow-auto font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-ink/70 scroll-thin">{selected.prompt}</pre>
              <Button
                size="sm"
                variant="soft"
                className="mt-2"
                onClick={() => {
                  navigator.clipboard?.writeText(selected.prompt ?? "");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                <Copy className="size-3.5" /> {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
