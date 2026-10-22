import { readFile } from 'node:fs/promises';
import type Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { getEnv } from '../config/env.js';
import { parseJson } from '../lib/claude.js';
import { loadPrompt } from '../lib/prompts.js';
import type { Problema } from './checks.js';
import type { Captura } from './facts.js';

// Range checks are applied after parsing (clamp) to keep the JSON schema simple for structured outputs.
export const VisionSchema = z.object({
  nota_site: z.number(),
  problemas_visuais: z.array(
    z.object({
      tipo: z.enum(['design', 'conversao', 'mobile']),
      descricao_curta: z.string(),
      evidencia: z.string(),
      gravidade: z.number(),
    }),
  ),
  nicho_detectado: z.string(),
  resumo: z.string(),
});

export interface VisionResult {
  nota_site: number;
  problemas: Problema[];
  nicho_detectado: string;
  resumo: string;
  custo_usd: number;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(n)));

async function image(path: string): Promise<Anthropic.ImageBlockParam> {
  const data = (await readFile(path)).toString('base64');
  return { type: 'image', source: { type: 'base64', media_type: 'image/png', data } };
}

const bullets = (items: string[]) => (items.length ? items.map((t) => `- ${t}`).join('\n') : '(nenhum)');

export interface VisionInput {
  dominio: string;
  empresa: string | null;
  lista: string | null;
  captura: Captura;
  medidos: Problema[];
}

export async function evaluateVisually(input: VisionInput, deps: { parse?: typeof parseJson } = {}): Promise<VisionResult> {
  const { captura } = input;
  if (!captura.prints || !captura.desktop) throw new Error('Sem prints para avaliar');
  const env = getEnv();

  const system = await loadPrompt('analise-visual', { marca: env.SENDER_BRAND });
  const dados = await loadPrompt('analise-visual-dados', {
    dominio: input.dominio,
    empresa: input.empresa ?? '(sem nome)',
    lista: input.lista ?? '(desconhecida)',
    medidos: bullets(input.medidos.map((p) => `${p.descricao_curta} (${p.evidencia})`)),
    titulos: bullets(captura.desktop.marca.titulos.slice(0, 12)),
    paragrafos: bullets(captura.desktop.marca.paragrafos.slice(0, 5)),
  });

  const content: Anthropic.ContentBlockParam[] = [
    await image(captura.prints.desktop_dobra),
    await image(captura.prints.mobile_dobra),
    await image(captura.prints.desktop_resumo),
    { type: 'text', text: dados },
  ];

  const { data, costUsd } = await (deps.parse ?? parseJson)({
    model: env.MODEL_FAST,
    system,
    content,
    schema: VisionSchema,
    effort: 'medium',
    maxTokens: 8000,
  });

  return {
    nota_site: clamp(data.nota_site, 0, 100),
    problemas: data.problemas_visuais
      .filter((p) => p.evidencia.trim() && p.descricao_curta.trim())
      .map((p) => ({ ...p, gravidade: clamp(p.gravidade, 1, 5), origem: 'visual' as const })),
    nicho_detectado: data.nicho_detectado.trim(),
    resumo: data.resumo.trim(),
    custo_usd: costUsd,
  };
}
