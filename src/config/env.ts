import 'dotenv/config';
import { z } from 'zod';

// Empty strings in .env mean "not set".
const optionalString = z
  .string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .optional();

const csvList = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );

const positiveInt = (fallback: number) => z.coerce.number().int().positive().default(fallback);

// Only the literal "false" disables dry run. Typos or missing values keep the system safe.
const dryRun = z
  .string()
  .optional()
  .transform((v) => (v ?? '').trim().toLowerCase() !== 'false');

const envSchema = z.object({
  SNOV_CLIENT_ID: optionalString,
  SNOV_CLIENT_SECRET: optionalString,
  SNOV_SOURCE_LIST_IDS: csvList,
  SNOV_OUTREACH_LIST_ID: optionalString,
  SNOV_DRAFT_LIST_ID: optionalString,
  SNOV_CAMPAIGN_ID: optionalString,
  SNOV_EXCLUDE_LIST_IDS: csvList, // with SNOV_SOURCE_LIST_IDS=todas, lists never read (clients, tests)
  IMPORT_MAX_PER_RUN: positiveInt(300),

  SENDER_BRAND: z.string().trim().min(1).default('Matilab'),
  SENDER_NAME: z.string().trim().min(1).default('Matheus Moura'),
  SENDER_RAZAO_SOCIAL: z.string().trim().min(1).default('Matilab Tecnologias'),
  SENDER_CNPJ: z.string().trim().min(1).default('40.283.248/0001-21'),
  SENDER_WHATSAPP_URL: optionalString,
  DRAFT_BASE_URL: z.string().trim().url().default('https://analise.matilab.com.br'),

  ANTHROPIC_API_KEY: optionalString,
  MODEL_FAST: z.string().trim().min(1).default('claude-sonnet-5-5'),
  MODEL_DESIGN: z.string().trim().min(1).default('claude-opus-5-5'),

  PAGESPEED_API_KEY: optionalString,

  SUPABASE_URL: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  SUPABASE_DB_URL: optionalString,

  CLOUDFLARE_ACCOUNT_ID: optionalString,
  CLOUDFLARE_API_TOKEN: optionalString,
  CLOUDFLARE_R2_BUCKET: optionalString,

  TELEGRAM_BOT_TOKEN: optionalString,
  TELEGRAM_CHAT_ID: optionalString,

  DRY_RUN: dryRun,
  BATCH_SIZE: positiveInt(20),
  MAX_NEW_PER_DAY: positiveInt(60),
  MIN_SITE_SCORE_TO_SKIP: z.coerce.number().int().min(0).max(100).default(75),
  JUDGE_MIN_SCORE: z.coerce.number().int().min(0).max(100).default(80),
  DRAFT_TTL_DAYS: positiveInt(30),
  MAX_DAILY_API_COST_USD: z.coerce.number().positive().default(10),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

// Values of these keys are scrubbed from every log line.
export const SECRET_KEYS = [
  'SNOV_CLIENT_ID',
  'SNOV_CLIENT_SECRET',
  'ANTHROPIC_API_KEY',
  'PAGESPEED_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_DB_URL',
  'CLOUDFLARE_API_TOKEN',
  'TELEGRAM_BOT_TOKEN',
] as const satisfies readonly (keyof Env)[];

export function parseEnv(source: Record<string, string | undefined>): Env {
  // Treat blank numeric/enum vars as unset so defaults apply.
  const cleaned = Object.fromEntries(
    Object.entries(source).filter(([, v]) => v !== undefined && v.trim() !== ''),
  );
  const result = envSchema.safeParse(cleaned);
  if (!result.success) {
    // Only report which keys are invalid, never their values.
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Configuração inválida no .env: ${issues}`);
  }
  return result.data;
}

let cached: Env | undefined;

export function getEnv(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}

type OptionalKey = Extract<
  { [K in keyof Env]-?: undefined extends Env[K] ? K : never }[keyof Env],
  keyof Env
>;

// For stages that cannot run without a given variable.
export function requireEnv<K extends OptionalKey>(key: K, env: Env = getEnv()): NonNullable<Env[K]> {
  const value = env[key];
  if (value === undefined || value === null) {
    throw new Error(`Variável ${key} não configurada no .env`);
  }
  return value as NonNullable<Env[K]>;
}

// Raw secret values for log scrubbing. Reads process.env without validation so
// the logger keeps working even when the rest of the config is broken.
export function secretValues(source: Record<string, string | undefined> = process.env): string[] {
  return SECRET_KEYS.map((k) => source[k]?.trim()).filter((v): v is string => !!v && v.length >= 6);
}

export function configuredLogLevel(source: Record<string, string | undefined> = process.env): string | undefined {
  return source.LOG_LEVEL?.trim() || undefined;
}
