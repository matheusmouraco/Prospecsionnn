"use client";

import type { Img } from "@/lib/image/client";
import type { Choices } from "@/lib/wizard/types";

/**
 * Browser-only storage for stage 2 (history in IndexedDB, presets in
 * localStorage). Stage 3/4 moves both to Supabase per user and project.
 */

export type OutputKind = "render" | "variation" | "edit" | "upscale";

export type Output = {
  id: string;
  kind: OutputKind;
  status: "pending" | "done" | "error";
  url?: string;
  width?: number;
  height?: number;
  favorite?: boolean;
  parentId?: string;
  label: string;
  prompt?: string;
  model?: string;
  costUsd?: number;
  error?: string;
  createdAt: number;
};

export type Session = {
  id: string;
  createdAt: number;
  updatedAt: number;
  input: Img;
  choices: Choices;
  summary: string;
  outputs: Output[];
};

export type Preset = { id: string; name: string; choices: Partial<Choices>; createdAt: number };

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const DB = "render-ia";
const STORE = "sessions";
const MAX_SESSIONS = 40;

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const r = fn(t.objectStore(STORE));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

export async function saveSession(s: Session): Promise<void> {
  try {
    // Pending placeholders are never persisted.
    const clean: Session = { ...s, outputs: s.outputs.filter((o) => o.status === "done") };
    if (!clean.outputs.length) return;
    await tx("readwrite", (st) => st.put(clean));
    const all = await listSessions();
    for (const old of all.slice(MAX_SESSIONS)) await tx("readwrite", (st) => st.delete(old.id));
  } catch (err) {
    console.warn("history save failed", err);
  }
}

export async function listSessions(): Promise<Session[]> {
  try {
    const all = await tx<Session[]>("readonly", (st) => st.getAll() as IDBRequest<Session[]>);
    return all.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export async function deleteSession(id: string): Promise<void> {
  try {
    await tx("readwrite", (st) => st.delete(id));
  } catch {
    /* ignore */
  }
}

const PRESETS_KEY = "render-ia:presets";

export function listPresets(): Preset[] {
  try {
    return JSON.parse(localStorage.getItem(PRESETS_KEY) ?? "[]") as Preset[];
  } catch {
    return [];
  }
}

export function savePreset(name: string, choices: Choices): Preset[] {
  // Input-specific choices are not part of a preset.
  const { inputType: _i, room: _r, ...rest } = choices;
  const list = [{ id: uid(), name, choices: rest, createdAt: Date.now() }, ...listPresets()].slice(0, 20);
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(list));
  } catch {
    /* storage blocked */
  }
  return list;
}

export function deletePreset(id: string): Preset[] {
  const list = listPresets().filter((p) => p.id !== id);
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(list));
  } catch {
    /* storage blocked */
  }
  return list;
}
