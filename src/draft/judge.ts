import { readFile } from 'node:fs/promises';
import type Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { parseJson } from '../lib/claude.js';
import { loadPrompt } from '../lib/prompts.js';

export const JuizSchema = z.object({
  nivel_referencia: z.number(),
  originalidade: z.number(),
  fidelidade_marca: z.number(),
  legibilidade_celular: z.number(),
  conteudo: z.number(),
  nota: z.number(),
  feedback: z.array(z.string()),
  resumo: z.string(),
});

export type Juizo = z.infer<typeof JuizSchema> & { custo_usd: number };

const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

async function image(path: string): Promise<Anthropic.ImageBlockParam> {
  return { type: 'image', source: { type: 'base64', media_type: 'image/png', data: (await readFile(path)).toString('base64') } };
}

export interface JudgeInput {
  model: string;
  referencias: { url: string; print: string }[]; // desktop first screen of each reference (quality bar)
  original: string | null; // desktop fold of the current site, when available
  desktop: string;
  mobile: string;
  desktopLonga: string;
  checagens: string[];
}

export async function judgeDraft(i: JudgeInput, deps: { parse?: typeof parseJson } = {}): Promise<Juizo> {
  const content: Anthropic.ContentBlockParam[] = [];
  for (const r of i.referencias) content.push({ type: 'text', text: `Referência (${r.url}):` }, await image(r.print));
  if (i.original) content.push({ type: 'text', text: 'Site atual (computador):' }, await image(i.original));
  content.push(
    { type: 'text', text: 'Proposta, computador, primeira tela:' },
    await image(i.desktop),
    { type: 'text', text: 'Proposta, celular, primeira tela:' },
    await image(i.mobile),
    { type: 'text', text: 'Proposta, computador, página longa:' },
    await image(i.desktopLonga),
    { type: 'text', text: `Checagens automáticas:\n${i.checagens.map((c) => `- ${c}`).join('\n')}` },
  );
  const { data, costUsd } = await (deps.parse ?? parseJson)({
    model: i.model,
    system: await loadPrompt('esboco-juiz'),
    content,
    schema: JuizSchema,
    effort: 'high',
    maxTokens: 16000,
  });
  return {
    ...data,
    nivel_referencia: clamp(data.nivel_referencia),
    originalidade: clamp(data.originalidade),
    fidelidade_marca: clamp(data.fidelidade_marca),
    legibilidade_celular: clamp(data.legibilidade_celular),
    conteudo: clamp(data.conteudo),
    nota: clamp(data.nota),
    custo_usd: costUsd,
  };
}
