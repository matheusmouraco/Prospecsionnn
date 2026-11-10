"use client";

import { Brush, Eraser, FlipHorizontal2, Trash2, Undo2, Wand2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Img } from "@/lib/image/client";
import { Button, cx } from "@/components/ui/kit";

export type MaskResult = { bw: string; alpha: string; preview: string };

const PAINT = "rgb(232, 181, 109)";
const MAX_SIDE = 1536;

/**
 * Full-screen brush tool. Painted area = what the AI may change.
 * Produces a black/white mask for the model and an alpha mask for compositing.
 */
export function MaskPainter({
  image,
  initial,
  title = "Pinte as áreas que podem mudar",
  instruction,
  onCancel,
  onDone,
}: {
  image: Img;
  initial?: string | null;
  title?: string;
  /** when set, the painter also asks for a text instruction (edit an area) */
  instruction?: { placeholder: string; submit: string };
  onCancel: () => void;
  onDone: (mask: MaskResult, text?: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<"paint" | "erase">("paint");
  const [size, setSize] = useState(48);
  const [text, setText] = useState("");
  const [empty, setEmpty] = useState(!initial);
  const history = useRef<ImageData[]>([]);
  const drawing = useRef<{ x: number; y: number } | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
  const W = Math.round(image.width * scale);
  const H = Math.round(image.height * scale);

  useEffect(() => {
    const cv = canvasRef.current!;
    cv.width = W;
    cv.height = H;
    if (initial) {
      const img = new Image();
      img.onload = () => {
        const ctx = cv.getContext("2d")!;
        ctx.drawImage(img, 0, 0, W, H);
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = PAINT;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
      };
      img.src = initial;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if ((e.metaKey || e.ctrlKey) && e.key === "z") undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ratio = () => W / canvasRef.current!.getBoundingClientRect().width;
  const toCanvas = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) * ratio(), y: (e.clientY - r.top) * ratio() };
  };

  const stroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.globalCompositeOperation = tool === "paint" ? "source-over" : "destination-out";
    ctx.strokeStyle = PAINT;
    ctx.fillStyle = PAINT;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = size * ratio();
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  };

  const snapshot = () => {
    const ctx = canvasRef.current!.getContext("2d")!;
    history.current.push(ctx.getImageData(0, 0, W, H));
    if (history.current.length > 25) history.current.shift();
  };

  const undo = () => {
    const last = history.current.pop();
    if (!last) return;
    canvasRef.current!.getContext("2d")!.putImageData(last, 0, 0);
  };

  const clear = () => {
    snapshot();
    canvasRef.current!.getContext("2d")!.clearRect(0, 0, W, H);
    setEmpty(true);
  };

  const invert = () => {
    snapshot();
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d")!;
    const tmp = document.createElement("canvas");
    tmp.width = W;
    tmp.height = H;
    const t = tmp.getContext("2d")!;
    t.fillStyle = PAINT;
    t.fillRect(0, 0, W, H);
    t.globalCompositeOperation = "destination-out";
    t.drawImage(cv, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(tmp, 0, 0);
    setEmpty(false);
  };

  const finish = () => {
    const cv = canvasRef.current!;
    const alpha = document.createElement("canvas");
    alpha.width = W;
    alpha.height = H;
    const a = alpha.getContext("2d")!;
    a.drawImage(cv, 0, 0);
    a.globalCompositeOperation = "source-in";
    a.fillStyle = "#fff";
    a.fillRect(0, 0, W, H);

    const bw = document.createElement("canvas");
    bw.width = W;
    bw.height = H;
    const b = bw.getContext("2d")!;
    b.fillStyle = "#000";
    b.fillRect(0, 0, W, H);
    b.drawImage(alpha, 0, 0);

    const pw = 360;
    const ph = Math.round((H / W) * pw);
    const prev = document.createElement("canvas");
    prev.width = pw;
    prev.height = ph;
    const p = prev.getContext("2d")!;
    const base = new Image();
    base.onload = () => {
      p.drawImage(base, 0, 0, pw, ph);
      p.globalAlpha = 0.6;
      p.drawImage(cv, 0, 0, pw, ph);
      onDone({ bw: bw.toDataURL("image/png"), alpha: alpha.toDataURL("image/png"), preview: prev.toDataURL("image/jpeg", 0.8) }, text.trim() || undefined);
    };
    base.src = image.url;
  };

  const canSubmit = !empty && (!instruction || text.trim().length > 2);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 animate-fade-in" role="dialog" aria-modal aria-label={title}>
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Button size="sm" variant="ghost" onClick={onCancel} aria-label="Fechar">
          <X className="size-5" />
        </Button>
        <h2 className="text-sm font-medium">{title}</h2>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={undo} aria-label="Desfazer">
            <Undo2 className="size-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={invert} aria-label="Inverter">
            <FlipHorizontal2 className="size-4" />
            <span className="hidden sm:inline">Inverter</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={clear} aria-label="Limpar">
            <Trash2 className="size-4" />
          </Button>
        </div>
      </header>

      <div ref={wrapRef} className="relative flex min-h-0 flex-1 items-center justify-center p-4 checker">
        <div className="relative max-h-full max-w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt="" className="block max-h-[calc(100dvh-240px)] max-w-full select-none" draggable={false} />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 size-full cursor-none touch-none opacity-60"
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              snapshot();
              const p = toCanvas(e);
              drawing.current = p;
              stroke(p, p);
              if (tool === "paint") setEmpty(false);
            }}
            onPointerMove={(e) => {
              const r = canvasRef.current!.getBoundingClientRect();
              setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
              if (!drawing.current) return;
              const p = toCanvas(e);
              stroke(drawing.current, p);
              drawing.current = p;
            }}
            onPointerUp={() => (drawing.current = null)}
            onPointerLeave={() => {
              drawing.current = null;
              setCursor(null);
            }}
          />
          {cursor && (
            <span
              className={cx("pointer-events-none absolute rounded-full border-2", tool === "paint" ? "border-accent" : "border-white")}
              style={{ width: size, height: size, left: cursor.x - size / 2, top: cursor.y - size / 2 }}
            />
          )}
        </div>
      </div>

      <footer className="space-y-3 border-t border-line bg-panel px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-line p-0.5">
            <button type="button" onClick={() => setTool("paint")} aria-pressed={tool === "paint"} className={cx("flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm", tool === "paint" ? "bg-accent text-accent-ink" : "text-muted")}>
              <Brush className="size-4" /> Pincel
            </button>
            <button type="button" onClick={() => setTool("erase")} aria-pressed={tool === "erase"} className={cx("flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm", tool === "erase" ? "bg-accent text-accent-ink" : "text-muted")}>
              <Eraser className="size-4" /> Borracha
            </button>
          </div>
          <label className="flex min-w-40 flex-1 items-center gap-3 text-xs text-muted">
            Tamanho
            <input type="range" min={8} max={160} value={size} onChange={(e) => setSize(Number(e.target.value))} className="flex-1" />
          </label>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {instruction && (
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={instruction.placeholder}
              maxLength={300}
              className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-panel-2 px-4 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
            />
          )}
          <Button variant="primary" size="lg" disabled={!canSubmit} onClick={finish} className={cx(!instruction && "sm:ml-auto")}>
            <Wand2 className="size-4" /> {instruction ? instruction.submit : "Usar esta máscara"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
