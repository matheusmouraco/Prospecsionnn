"use client";

import { Bookmark, History, KeyRound, LoaderCircle, MessageSquareText, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Preset, Session } from "@/lib/store/local";
import type { Choices } from "@/lib/wizard/types";
import { Button, cx } from "@/components/ui/kit";

function Sheet({ title, icon, onClose, children, side = "right" }: { title: string; icon: React.ReactNode; onClose: () => void; children: React.ReactNode; side?: "right" | "center" }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 flex bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} role="dialog" aria-modal aria-label={title}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={cx(
          "flex flex-col border-line bg-panel shadow-2xl",
          side === "right" ? "ml-auto h-full w-full max-w-md border-l" : "m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-lg rounded-3xl border animate-pop",
        )}
      >
        <header className="flex items-center gap-2 border-b border-line px-5 py-4">
          <span className="text-accent">{icon}</span>
          <h2 className="font-medium">{title}</h2>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={onClose} aria-label="Fechar">
            <X className="size-5" />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 scroll-thin">{children}</div>
      </div>
    </div>
  );
}

export function HistoryDrawer({ sessions, onOpen, onDelete, onClose }: { sessions: Session[]; onOpen: (s: Session) => void; onDelete: (id: string) => void; onClose: () => void }) {
  return (
    <Sheet title="Histórico" icon={<History className="size-5" />} onClose={onClose}>
      {sessions.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Seus renders aparecem aqui. Ficam salvos neste aparelho.</p>
      ) : (
        <ul className="space-y-3">
          {sessions.map((s) => {
            const cover = s.outputs.find((o) => o.favorite) ?? s.outputs[0];
            return (
              <li key={s.id} className="group flex gap-3 rounded-2xl border border-line bg-panel-2 p-2.5 transition hover:border-line-strong">
                <button type="button" onClick={() => onOpen(s)} className="flex min-w-0 flex-1 gap-3 text-left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover?.url} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-[13px] leading-snug">{s.summary}</span>
                    <span className="mt-1 block text-[11px] text-faint">
                      {new Date(s.updatedAt).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} · {s.outputs.length} imagem{s.outputs.length > 1 ? "s" : ""}
                    </span>
                  </span>
                </button>
                <Button size="sm" variant="ghost" aria-label="Apagar" onClick={() => onDelete(s.id)} className="opacity-60 group-hover:opacity-100">
                  <Trash2 className="size-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </Sheet>
  );
}

export function PresetsDrawer({ presets, onApply, onDelete, onClose }: { presets: Preset[]; onApply: (p: Preset) => void; onDelete: (id: string) => void; onClose: () => void }) {
  return (
    <Sheet title="Meus presets" icon={<Bookmark className="size-5" />} onClose={onClose}>
      {presets.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Na tela de resumo, salve suas escolhas como preset para reaplicar em um clique.</p>
      ) : (
        <ul className="space-y-2">
          {presets.map((p) => (
            <li key={p.id} className="flex items-center gap-2 rounded-2xl border border-line bg-panel-2 p-2 pl-4">
              <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
              <Button size="sm" variant="primary" onClick={() => onApply(p)}>
                Aplicar
              </Button>
              <Button size="sm" variant="ghost" aria-label="Apagar preset" onClick={() => onDelete(p.id)}>
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}

const EXAMPLES = [
  "Cozinha japandi com marcenaria freijó, bancada de quartzo branco, 3 pendentes pretos e luz de fim de tarde",
  "Sala moderna para apresentar ao cliente, piso de porcelanato areia, sem televisão, com plantas",
  "Fachada contemporânea à noite com iluminação de LED e jardim",
];

export function AssistantDialog({ onApply, onClose }: { onApply: (patch: Partial<Choices>) => void; onClose: () => void }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assistant", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
      const j = (await res.json()) as { patch?: Partial<Choices>; error?: string };
      if (!res.ok || !j.patch) throw new Error(j.error ?? "Não consegui entender.");
      onApply(j.patch);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet title="Assistente" icon={<MessageSquareText className="size-5" />} onClose={onClose} side="center">
      <p className="text-sm text-muted">Descreva o que seu cliente quer, do seu jeito. Eu preencho o wizard e você só confere.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={1500}
        autoFocus
        placeholder="Ex.: cozinha moderna, marcenaria branca com nogueira, bancada preta, sem pessoas..."
        className="mt-4 w-full resize-none rounded-2xl border border-line bg-panel-2 px-4 py-3 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {EXAMPLES.map((e) => (
          <button key={e} type="button" onClick={() => setText(e)} className="rounded-full border border-line px-3 py-1 text-left text-[11.5px] text-muted hover:border-line-strong hover:text-ink">
            {e}
          </button>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      <Button variant="primary" size="lg" className="mt-5 w-full" disabled={loading || text.trim().length < 8} onClick={submit}>
        {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Preencher o wizard
      </Button>
    </Sheet>
  );
}

export function AccessGate({ onOk }: { onOk: () => void }) {
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur">
      <form
        className="w-full max-w-sm rounded-3xl border border-line bg-panel p-6 animate-pop"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          const res = await fetch("/api/acesso", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ senha }) });
          setLoading(false);
          if (res.ok) onOk();
          else setError("Senha incorreta.");
        }}
      >
        <KeyRound className="size-6 text-accent" />
        <h2 className="mt-3 text-lg font-medium">Acesso ao editor</h2>
        <p className="mt-1 text-sm text-muted">Digite a senha de acesso para gerar renders.</p>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoFocus
          className="mt-4 h-12 w-full rounded-xl border border-line bg-panel-2 px-4 text-sm focus:border-accent focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="mt-4 w-full" disabled={loading || !senha}>
          Entrar
        </Button>
      </form>
    </div>
  );
}
