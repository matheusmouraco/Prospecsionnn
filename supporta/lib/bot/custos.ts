import { AsyncLocalStorage } from "node:async_hooks";
import { tryDb } from "@/lib/db";

// Custo de API por cliente: cada chamada paga (Claude, transcrição, Instagram, Google) grava uma linha em supporta.custos
// com o telefone da conversa que está sendo atendida. O relatório diário soma por cliente.

// USD por milhão de tokens (mesma tabela do Prospector, src/lib/cost.ts).
const CLAUDE: Record<string, { input: number; output: number }> = {
  "claude-opus-5-5": { input: 4, output: 20 },
  "claude-sonnet-5-5": { input: 2, output: 10 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5 },
};

/** Estimativas por uso de serviço sem retorno de custo na resposta. */
export const PRECO = {
  transcricaoPorMinuto: 0.003, // OpenAI gpt-4o-mini-transcribe
  instagramPerfil: 0.0026, // Apify instagram-profile-scraper (US$2,60 por mil perfis)
  googleBusca: 0.032, // Places API (New) Text Search
};

const contexto = new AsyncLocalStorage<{ telefone: string }>();

/** Tudo que roda dentro de `fn` (inclusive o que vai para segundo plano) conta para este telefone. */
export function comCliente<T>(telefone: string, fn: () => Promise<T>) {
  return contexto.run({ telefone }, fn);
}

export function custoClaude(modelo: string, uso: { input_tokens?: number; output_tokens?: number }) {
  const p = CLAUDE[modelo] ?? CLAUDE["claude-opus-5-5"];
  return ((uso.input_tokens ?? 0) * p.input + (uso.output_tokens ?? 0) * p.output) / 1_000_000;
}

export async function registrarCusto(fornecedor: string, operacao: string, usd: number, telefone = contexto.getStore()?.telefone) {
  if (!(usd > 0)) return;
  await tryDb("registrarCusto", (sql) => sql`
    insert into custos (telefone, site_id, fornecedor, operacao, usd)
    values (${telefone ?? null}, (select site_id from conversas where telefone = ${telefone ?? ""}), ${fornecedor}, ${operacao}, ${usd})`);
}
