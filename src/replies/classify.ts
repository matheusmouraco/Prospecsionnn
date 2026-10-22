import { z } from 'zod';
import { parseJson } from '../lib/claude.js';
import { loadPrompt } from '../lib/prompts.js';

export const CATEGORIAS = ['quer_ver', 'interesse', 'nao', 'descadastro', 'ausente', 'outro'] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const MIN_CONFIANCA = 0.8;

const ClassificacaoSchema = z.object({
  categoria: z.enum(CATEGORIAS),
  confianca: z.number(),
  resumo: z.string(),
  pediu_esboco: z.boolean(),
});

export interface Classificacao {
  categoria: Categoria; // after the confidence rule
  categoria_modelo: Categoria; // what the model said
  confianca: number;
  resumo: string;
  pediu_esboco: boolean; // accepted the draft, even when the category is interesse
  custo_usd: number;
}

// Keeps only what the person wrote: drops the quoted original email and common reply headers.
export function stripQuoted(texto: string): string {
  const lines = texto.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  for (const line of lines) {
    if (/^\s*(Em .{4,120}escreveu:|On .{4,120}wrote:|-{2,}\s*(Mensagem original|Original Message)|De:\s|From:\s)/i.test(line)) break;
    if (/^\s*>/.test(line)) continue;
    out.push(line);
  }
  return out.join('\n').trim();
}

// Rule from CLAUDE.md: below 0.8 confidence the reply is treated as `outro` (Moura reads it).
export function applyThreshold(categoria: Categoria, confianca: number): Categoria {
  return confianca < MIN_CONFIANCA ? 'outro' : categoria;
}

export type Acao = 'gerar_esboco' | 'notificar_moura' | 'bloquear' | 'nenhuma';

// Moura's rule: any interest (price, deadline, call) also gets a draft, so he talks price with it ready.
// `outro` gets a draft only when the person clearly asked for it.
export function acoesPara(c: Pick<Classificacao, 'categoria' | 'pediu_esboco'>): Acao[] {
  if (c.categoria === 'interesse' || (c.categoria === 'outro' && c.pediu_esboco)) return ['gerar_esboco', 'notificar_moura'];
  return [acaoPara(c.categoria)];
}

export function acaoPara(categoria: Categoria): Acao {
  switch (categoria) {
    case 'quer_ver': return 'gerar_esboco';
    case 'interesse':
    case 'outro': return 'notificar_moura';
    case 'nao':
    case 'descadastro': return 'bloquear';
    case 'ausente': return 'nenhuma';
  }
}

export async function classifyReply(
  model: string,
  agencia: string,
  input: { empresa: string; texto: string },
  deps: { parse?: typeof parseJson } = {},
): Promise<Classificacao> {
  const resposta = stripQuoted(input.texto) || input.texto.trim();
  const { data, costUsd } = await (deps.parse ?? parseJson)({
    model,
    system: await loadPrompt('resposta-classificar', { marca: agencia }),
    content: [{ type: 'text', text: await loadPrompt('resposta-dados', { empresa: input.empresa, resposta }) }],
    schema: ClassificacaoSchema,
    effort: 'low',
    maxTokens: 2000,
  });
  const confianca = Math.min(1, Math.max(0, data.confianca));
  return {
    categoria: applyThreshold(data.categoria, confianca),
    categoria_modelo: data.categoria,
    confianca,
    resumo: data.resumo,
    pediu_esboco: data.pediu_esboco || data.categoria === 'quer_ver',
    custo_usd: costUsd,
  };
}
