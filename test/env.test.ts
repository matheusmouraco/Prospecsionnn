import { describe, expect, it } from 'vitest';
import { parseEnv, requireEnv, secretValues } from '../src/config/env.js';

describe('parseEnv', () => {
  it('applies defaults and keeps DRY_RUN on when unset', () => {
    const env = parseEnv({});
    expect(env.DRY_RUN).toBe(true);
    expect(env.BATCH_SIZE).toBe(20);
    expect(env.MAX_NEW_PER_DAY).toBe(60);
    expect(env.MODEL_FAST).toBe('claude-sonnet-5-5');
    expect(env.MODEL_DESIGN).toBe('claude-opus-5-5');
    expect(env.SNOV_SOURCE_LIST_IDS).toEqual([]);
  });

  it('only disables DRY_RUN for the literal "false"', () => {
    expect(parseEnv({ DRY_RUN: 'false' }).DRY_RUN).toBe(false);
    expect(parseEnv({ DRY_RUN: ' FALSE ' }).DRY_RUN).toBe(false);
    expect(parseEnv({ DRY_RUN: 'no' }).DRY_RUN).toBe(true);
    expect(parseEnv({ DRY_RUN: '0' }).DRY_RUN).toBe(true);
    expect(parseEnv({ DRY_RUN: 'flase' }).DRY_RUN).toBe(true);
  });

  it('parses list ids and numbers', () => {
    const env = parseEnv({ SNOV_SOURCE_LIST_IDS: '12, 34,,56 ', BATCH_SIZE: '5', MIN_SITE_SCORE_TO_SKIP: '' });
    expect(env.SNOV_SOURCE_LIST_IDS).toEqual(['12', '34', '56']);
    expect(env.BATCH_SIZE).toBe(5);
    expect(env.MIN_SITE_SCORE_TO_SKIP).toBe(75);
  });

  it('rejects invalid values without echoing them', () => {
    expect(() => parseEnv({ BATCH_SIZE: '-3' })).toThrow(/BATCH_SIZE/);
    try {
      parseEnv({ DRAFT_BASE_URL: 'segredo-nao-url' });
    } catch (err) {
      expect((err as Error).message).not.toContain('segredo-nao-url');
    }
  });
});

describe('requireEnv', () => {
  it('throws a clear message when a stage dependency is missing', () => {
    const env = parseEnv({});
    expect(() => requireEnv('ANTHROPIC_API_KEY', env)).toThrow('ANTHROPIC_API_KEY');
  });

  it('returns the value when set', () => {
    const env = parseEnv({ SUPABASE_URL: 'https://x.supabase.co' });
    expect(requireEnv('SUPABASE_URL', env)).toBe('https://x.supabase.co');
  });
});

describe('secretValues', () => {
  it('collects only secret keys', () => {
    const values = secretValues({ ANTHROPIC_API_KEY: 'sk-ant-abcdef', SENDER_NAME: 'Moura' });
    expect(values).toEqual(['sk-ant-abcdef']);
  });
});
