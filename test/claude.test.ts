import type Anthropic from '@anthropic-ai/sdk';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ClaudeRefusalError, parseJson } from '../src/lib/claude.js';
import { costUsd } from '../src/lib/cost.js';
import { fillTemplate, loadPrompt } from '../src/lib/prompts.js';

const usage = { input_tokens: 10_000, output_tokens: 1_000, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };

function fake(responses: Array<Record<string, unknown>>) {
  const calls: Array<{ messages: unknown[] }> = [];
  const anthropic = {
    messages: {
      parse: async (params: { messages: unknown[] }) => {
        calls.push({ messages: [...params.messages] });
        return { usage, content: [], stop_details: null, ...responses[calls.length - 1] };
      },
    },
  } as unknown as Anthropic;
  return { anthropic, calls };
}

const schema = z.object({ nota: z.number() });

describe('parseJson', () => {
  it('returns parsed output and records the cost', async () => {
    const { anthropic } = fake([{ stop_reason: 'end_turn', parsed_output: { nota: 7 } }]);
    const costs: number[] = [];
    const r = await parseJson({ model: 'claude-sonnet-5-5', system: 's', content: [{ type: 'text', text: 'x' }], schema, anthropic, recordCost: async (u) => { costs.push(u); } });
    expect(r.data).toEqual({ nota: 7 });
    expect(costs).toEqual([0.03]); // 10k in * $2/M + 1k out * $10/M
  });

  it('retries once telling the model what went wrong', async () => {
    const { anthropic, calls } = fake([
      { stop_reason: 'max_tokens', parsed_output: null },
      { stop_reason: 'end_turn', parsed_output: { nota: 3 } },
    ]);
    const r = await parseJson({ model: 'claude-sonnet-5-5', system: 's', content: [{ type: 'text', text: 'x' }], schema, anthropic, recordCost: async () => {} });
    expect(r.data).toEqual({ nota: 3 });
    expect(r.costUsd).toBeCloseTo(0.06);
    expect(JSON.stringify(calls[1]!.messages.at(-1))).toContain('cortada por limite');
  });

  it('gives up after two invalid answers and surfaces refusals', async () => {
    const bad = fake([{ stop_reason: 'end_turn', parsed_output: null }, { stop_reason: 'end_turn', parsed_output: null }]);
    await expect(parseJson({ model: 'claude-sonnet-5-5', system: 's', content: [], schema, anthropic: bad.anthropic, recordCost: async () => {} })).rejects.toThrow('2 tentativas');

    const refused = fake([{ stop_reason: 'refusal', parsed_output: null, stop_details: { category: 'cyber' } }]);
    await expect(parseJson({ model: 'claude-sonnet-5-5', system: 's', content: [], schema, anthropic: refused.anthropic, recordCost: async () => {} })).rejects.toBeInstanceOf(ClaudeRefusalError);
  });
});

describe('costUsd', () => {
  it('prices cache writes at 1.25x input and unknown models like Opus', () => {
    expect(costUsd('claude-opus-5-5', { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 1_000_000 })).toBe(5);
    expect(costUsd('modelo-novo', { input_tokens: 1_000_000, output_tokens: 0 })).toBe(4);
  });
});

describe('prompts', () => {
  it('fills placeholders and refuses leftovers', () => {
    expect(fillTemplate('Oi {{nome}}, {{ n }}!', { nome: 'Ana', n: 2 })).toBe('Oi Ana, 2!');
    expect(() => fillTemplate('Oi {{nome}}', {})).toThrow('nome');
  });

  it('loads the analysis prompts with every variable filled', async () => {
    const system = await loadPrompt('analise-visual', { marca: 'Matilab' });
    expect(system).toContain('Matilab');
    expect(system).not.toContain('—');
    await expect(loadPrompt('analise-visual-dados', {})).rejects.toThrow('dominio');
  });
});
