import { describe, expect, it } from 'vitest';
import { createLogger, type LogLevel } from '../src/lib/logger.js';

function capture(secrets: string[] = [], level: LogLevel = 'debug') {
  const lines: string[] = [];
  const log = createLogger({ level, secrets, write: (l) => lines.push(l) });
  return { log, lines, all: () => lines.join('\n') };
}

describe('logger', () => {
  it('scrubs configured secret values anywhere in the entry', () => {
    const secret = 'super-secret-value-123';
    const { log, all } = capture([secret]);
    log.info(`token is ${secret}`, { nested: { deep: [`x ${secret} y`] }, err: new Error(`boom ${secret}`) });
    expect(all()).not.toContain(secret);
    expect(all()).toContain('[REDACTED]');
  });

  it('drops sensitive keys by name', () => {
    const { log, lines } = capture();
    log.info('cfg', { apiKey: 'abc', SUPABASE_SERVICE_ROLE_KEY: 'def', Authorization: 'Bearer x', dominio: 'loja.com.br' });
    const entry = JSON.parse(lines[0]!);
    expect(entry.apiKey).toBe('[REDACTED]');
    expect(entry.SUPABASE_SERVICE_ROLE_KEY).toBe('[REDACTED]');
    expect(entry.Authorization).toBe('[REDACTED]');
    expect(entry.dominio).toBe('loja.com.br');
  });

  it('scrubs secret shapes it was not told about', () => {
    const { log, all } = capture();
    log.error('falhou', {
      url: 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=x&key=AIzaSyA1234567890abcdefghijklmnopqrstu',
      db: 'postgresql://postgres:minhaSenha@db.abc.supabase.co:5432/postgres',
      header: 'Bearer abc.def.ghi',
      jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.abcdefghijklmnop',
      tg: 'bot123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw',
    });
    const out = all();
    expect(out).not.toContain('AIzaSyA1234567890');
    expect(out).not.toContain('minhaSenha');
    expect(out).not.toContain('abc.def.ghi');
    expect(out).not.toContain('eyJhbGciOiJIUzI1NiJ9');
    expect(out).not.toContain('AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw');
    expect(out).toContain('url=x&key=[REDACTED]');
    expect(out).toContain('postgresql://postgres:[REDACTED]@db.abc.supabase.co');
  });

  it('respects level and handles circular refs', () => {
    const { log, lines } = capture([], 'warn');
    const a: Record<string, unknown> = { nome: 'a' };
    a.self = a;
    log.info('ignorado');
    log.warn('ciclo', { a });
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0]!).a.self).toBe('[Circular]');
  });

  it('child loggers carry bindings', () => {
    const { log, lines } = capture();
    log.child({ etapa: 'snov' }).info('ok', { n: 1 });
    expect(JSON.parse(lines[0]!)).toMatchObject({ etapa: 'snov', n: 1, msg: 'ok', level: 'info' });
  });
});
