// USD per million tokens. Source: Anthropic pricing (claude-api reference, Oct 2026).
// Cache writes cost 1.25x input; cache reads have their own rate.
interface Price {
  input: number;
  output: number;
  cacheRead: number;
}

const PRICES: Record<string, Price> = {
  'claude-opus-5-5': { input: 4, output: 20, cacheRead: 0.2 },
  'claude-sonnet-5-5': { input: 2, output: 10, cacheRead: 0.2 },
  'claude-haiku-5-5': { input: 0.1, output: 0.5, cacheRead: 0.01 },
};

// Unknown models are priced like Opus so the daily cost lock errs on the safe side.
const FALLBACK = PRICES['claude-opus-5-5']!;

export interface UsageLike {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
}

export function isKnownModel(model: string): boolean {
  return model in PRICES;
}

export function costUsd(model: string, usage: UsageLike): number {
  const p = PRICES[model] ?? FALLBACK;
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  return (
    (usage.input_tokens * p.input +
      cacheWrite * p.input * 1.25 +
      cacheRead * p.cacheRead +
      usage.output_tokens * p.output) /
    1_000_000
  );
}
