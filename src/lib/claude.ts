import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import type { z } from 'zod';
import { requireEnv } from '../config/env.js';
import { incrementMetric } from '../db/control.js';
import { costUsd, isKnownModel } from './cost.js';
import { logger } from './logger.js';

const log = logger.child({ etapa: 'claude' });

let client: Anthropic | undefined;

export function getAnthropic(): Anthropic {
  client ??= new Anthropic({ apiKey: requireEnv('ANTHROPIC_API_KEY') });
  return client;
}

export class ClaudeRefusalError extends Error {
  constructor(readonly category: string | null) {
    super(`Claude recusou a solicitação (${category ?? 'sem categoria'})`);
    this.name = 'ClaudeRefusalError';
  }
}

export interface ParseJsonOptions<T extends z.ZodType> {
  model: string;
  system: string;
  content: Anthropic.ContentBlockParam[];
  schema: T;
  effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  maxTokens?: number;
  // Defaults to adding the cost to metricas_diarias.custo_api_usd.
  recordCost?: (usd: number) => Promise<void>;
  anthropic?: Anthropic;
}

export interface ParseJsonResult<T> {
  data: T;
  costUsd: number;
}

// One Claude call that must return JSON matching `schema`. If the output does not validate,
// retries once with the problem stated in the prompt (project convention).
export async function parseJson<T extends z.ZodType>(opts: ParseJsonOptions<T>): Promise<ParseJsonResult<z.infer<T>>> {
  const anthropic = opts.anthropic ?? getAnthropic();
  const record = opts.recordCost ?? ((usd: number) => incrementMetric('custo_api_usd', usd));
  if (!isKnownModel(opts.model)) log.warn('Modelo sem preço cadastrado; custo estimado pelo preço do Opus', { modelo: opts.model });

  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: opts.content }];
  let total = 0;

  for (let attempt = 1; attempt <= 2; attempt++) {
    const response = await anthropic.messages.parse({
      model: opts.model,
      max_tokens: opts.maxTokens ?? 16000,
      system: opts.system,
      messages,
      output_config: {
        format: zodOutputFormat(opts.schema),
        ...(opts.effort ? { effort: opts.effort } : {}),
      },
    });

    const usd = costUsd(opts.model, response.usage);
    total += usd;
    await record(usd);
    log.info('Chamada ao Claude', {
      modelo: opts.model,
      tentativa: attempt,
      tokens_entrada: response.usage.input_tokens,
      tokens_saida: response.usage.output_tokens,
      custo_usd: Number(usd.toFixed(5)),
    });

    if (response.stop_reason === 'refusal') {
      throw new ClaudeRefusalError(response.stop_details?.category ?? null);
    }
    if (response.parsed_output !== null && response.parsed_output !== undefined) {
      return { data: response.parsed_output as z.infer<T>, costUsd: total };
    }

    const reason =
      response.stop_reason === 'max_tokens'
        ? 'a resposta foi cortada por limite de tamanho; seja mais conciso'
        : 'a resposta não seguiu o formato JSON pedido';
    messages.push({ role: 'assistant', content: response.content });
    messages.push({ role: 'user', content: `Sua resposta anterior é inválida: ${reason}. Responda de novo seguindo exatamente o formato.` });
  }
  throw new Error('Claude não devolveu JSON válido após 2 tentativas');
}
