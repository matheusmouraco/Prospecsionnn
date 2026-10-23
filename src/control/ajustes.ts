import { reloadEnv } from '../config/env.js';
import { getSupabase, type Db } from '../db/client.js';

// Settings Moura changes from Telegram. They live in `controle` (chave `ajuste:<NOME>`), so the bot
// and the scheduler see the same values and a deploy never resets them. Each one overrides the .env
// value of the same name in every script started through runNpm.
export interface Ajuste {
  nome: string;           // env var it overrides (or scheduler-only setting)
  comando: string;        // Telegram command that sets it
  descricao: string;
  min: number;
  max: number;
  padrao: number;
}

export const AJUSTES: Ajuste[] = [
  { nome: 'MAX_NEW_PER_DAY', comando: 'limite', descricao: 'empresas novas enviadas por dia', min: 1, max: 200, padrao: 60 },
  { nome: 'MAX_DAILY_API_COST_USD', comando: 'custo', descricao: 'teto de gasto de API por dia (US$)', min: 1, max: 500, padrao: 50 },
  { nome: 'MIN_SITE_SCORE_TO_SKIP', comando: 'nota', descricao: 'nota a partir da qual o site é bom e é descartado', min: 0, max: 100, padrao: 75 },
  { nome: 'AUTO_LOTE', comando: 'lote', descricao: 'empresas analisadas e escritas por dia no automático', min: 1, max: 300, padrao: 20 },
  { nome: 'AUTO_FILA_MAX', comando: 'estoque', descricao: 'emails prontos guardados antes de parar de analisar', min: 1, max: 1000, padrao: 60 },
];

export const PREFIXO = 'ajuste:';
export const CHAVE_MODO = 'DRY_RUN';
export const CHAVE_DESLIGADOS = 'AUTO_DESLIGADOS';

export type Ajustes = Record<string, string>;

export async function lerAjustes(db: Db = getSupabase()): Promise<Ajustes> {
  const { data, error } = await db.from('controle').select('chave, valor').like('chave', `${PREFIXO}%`);
  if (error) throw new Error(`Falha ao ler ajustes: ${error.message}`);
  const out: Ajustes = {};
  for (const r of (data ?? []) as { chave: string; valor: string | null }[]) {
    if (r.valor !== null && r.valor !== '') out[r.chave.slice(PREFIXO.length)] = r.valor;
  }
  return out;
}

export async function salvarAjuste(nome: string, valor: string | null, db: Db = getSupabase()): Promise<void> {
  const { error } = await db.from('controle').upsert({ chave: `${PREFIXO}${nome}`, valor: valor ?? '' });
  if (error) throw new Error(`Falha ao salvar ajuste ${nome}: ${error.message}`);
}

// Validates a number typed on Telegram against the setting's range.
export function validarNumero(a: Ajuste, texto: string | undefined): number | string {
  const n = Number(String(texto ?? '').replace(',', '.'));
  if (!Number.isFinite(n)) return `Me manda um número: /${a.comando} ${a.padrao}`;
  if (n < a.min || n > a.max) return `Para ${a.descricao}, use de ${a.min} a ${a.max}.`;
  return a.nome === 'MAX_DAILY_API_COST_USD' ? Math.round(n * 100) / 100 : Math.round(n);
}

export const desligados = (a: Ajustes): Set<string> => new Set((a[CHAVE_DESLIGADOS] ?? '').split(',').map((s) => s.trim()).filter(Boolean));

// Env vars handed to child scripts. If the settings cannot be read, DRY_RUN is forced on:
// a database hiccup must never turn real sending on or keep it on by accident.
export async function envDosAjustes(ler: () => Promise<Ajustes> = () => lerAjustes()): Promise<Record<string, string>> {
  try {
    const a = await ler();
    const out: Record<string, string> = {};
    for (const aj of AJUSTES) if (a[aj.nome]) out[aj.nome] = a[aj.nome]!;
    if (a[CHAVE_MODO]) out.DRY_RUN = a[CHAVE_MODO] === 'false' ? 'false' : 'true';
    return out;
  } catch {
    return { DRY_RUN: 'true' };
  }
}

// For code that runs inside the bot itself (approving a draft, the DRY_RUN prefix on notifications):
// rebuilds process.env from the original .env plus the current settings.
const base = { ...process.env };
export async function aplicarAjustesNoProcesso(): Promise<void> {
  const extra = await envDosAjustes();
  for (const k of [...AJUSTES.map((a) => a.nome), 'DRY_RUN']) {
    if (extra[k] !== undefined) process.env[k] = extra[k];
    else if (base[k] !== undefined) process.env[k] = base[k];
    else delete process.env[k];
  }
  reloadEnv();
}
