import { configuredLogLevel, secretValues } from '../config/env.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogContext = Record<string, unknown>;

const LEVELS: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const REDACTED = '[REDACTED]';

// Any field whose name looks sensitive is dropped regardless of value.
const SENSITIVE_KEY = /(secret|token|password|passwd|api[_-]?key|apikey|authorization|cookie|service[_-]?role|db[_-]?url|private[_-]?key|access[_-]?key)/i;

// Shapes of secrets that may leak through error messages or URLs.
const SENSITIVE_PATTERNS: RegExp[] = [
  /Bearer\s+[A-Za-z0-9._~+/=-]+/gi,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, // JWT
  /\bsk-ant-[A-Za-z0-9_-]{10,}\b/g, // Anthropic key
  /\bAIza[0-9A-Za-z_-]{30,}\b/g, // Google API key
  /(?<!\d)\d{6,12}:[A-Za-z0-9_-]{30,}/g, // Telegram bot token (also inside /bot<token>/ URLs)
  /([?&](?:key|api_key|apikey|access_token|token|client_secret)=)[^&\s"']+/gi,
  /(\b[a-z][a-z0-9+.-]*:\/\/[^:/\s"']+:)[^@\s"']+(@)/gi, // user:password@ in URLs
];

export function scrubString(input: string, secrets: readonly string[]): string {
  let out = input;
  for (const s of secrets) {
    if (s) out = out.split(s).join(REDACTED);
  }
  for (const re of SENSITIVE_PATTERNS) {
    out = out.replace(re, (match, prefix?: string, suffix?: string) => {
      if (typeof prefix === 'string' && typeof suffix === 'string') return `${prefix}${REDACTED}${suffix}`;
      if (typeof prefix === 'string') return `${prefix}${REDACTED}`;
      return REDACTED;
    });
  }
  return out;
}

export function redact(value: unknown, secrets: readonly string[], seen = new WeakSet<object>()): unknown {
  if (typeof value === 'string') return scrubString(value, secrets);
  if (value === null || typeof value !== 'object') {
    return typeof value === 'bigint' ? value.toString() : value;
  }
  if (seen.has(value)) return '[Circular]';
  seen.add(value);

  if (value instanceof Error) {
    const out: Record<string, unknown> = {
      name: value.name,
      message: scrubString(value.message, secrets),
    };
    if (value.stack) out.stack = scrubString(value.stack, secrets);
    if (value.cause !== undefined) out.cause = redact(value.cause, secrets, seen);
    return out;
  }
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((v) => redact(v, secrets, seen));

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = SENSITIVE_KEY.test(k) ? REDACTED : redact(v, secrets, seen);
  }
  return out;
}

export interface Logger {
  debug(msg: string, ctx?: LogContext): void;
  info(msg: string, ctx?: LogContext): void;
  warn(msg: string, ctx?: LogContext): void;
  error(msg: string, ctx?: LogContext): void;
  child(bindings: LogContext): Logger;
}

export interface LoggerOptions {
  level?: LogLevel;
  secrets?: readonly string[];
  bindings?: LogContext;
  write?: (line: string, level: LogLevel) => void;
}

function isLevel(v: unknown): v is LogLevel {
  return typeof v === 'string' && v in LEVELS;
}

const defaultWrite = (line: string, level: LogLevel) => {
  (level === 'error' || level === 'warn' ? process.stderr : process.stdout).write(line + '\n');
};

export function createLogger(opts: LoggerOptions = {}): Logger {
  const envLevel = configuredLogLevel();
  const level: LogLevel = opts.level ?? (isLevel(envLevel) ? envLevel : 'info');
  const secrets = opts.secrets ?? secretValues();
  const bindings = opts.bindings ?? {};
  const write = opts.write ?? defaultWrite;

  const log = (lvl: LogLevel, msg: string, ctx?: LogContext) => {
    if (LEVELS[lvl] < LEVELS[level]) return;
    const entry = redact({ ...bindings, ...ctx }, secrets) as LogContext;
    write(
      JSON.stringify({ ts: new Date().toISOString(), level: lvl, msg: scrubString(msg, secrets), ...entry }),
      lvl,
    );
  };

  return {
    debug: (m, c) => log('debug', m, c),
    info: (m, c) => log('info', m, c),
    warn: (m, c) => log('warn', m, c),
    error: (m, c) => log('error', m, c),
    child: (extra) => createLogger({ level, secrets, write, bindings: { ...bindings, ...extra } }),
  };
}

export const logger = createLogger();
