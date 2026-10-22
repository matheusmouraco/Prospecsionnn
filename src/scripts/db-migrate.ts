import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import pg from 'pg';
import { requireEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';

const MIGRATIONS_DIR = join(import.meta.dirname, '..', '..', 'supabase', 'migrations');

// Applies supabase/migrations/*.sql in name order, each in its own transaction, once.
export async function migrate(connectionString: string, dir = MIGRATIONS_DIR): Promise<string[]> {
  const client = new pg.Client({ connectionString });
  await client.connect();
  const applied: string[] = [];
  try {
    await client.query(`
      create schema if not exists prospector;
      create table if not exists prospector._migrations (
        nome text primary key,
        aplicada_em timestamptz default now()
      );
      alter table prospector._migrations enable row level security;
    `);
    const done = new Set(
      (await client.query<{ nome: string }>('select nome from prospector._migrations')).rows.map((r) => r.nome),
    );
    const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort();

    for (const file of files) {
      if (done.has(file)) continue;
      const sql = await readFile(join(dir, file), 'utf8');
      await client.query('begin');
      try {
        await client.query(sql);
        await client.query('insert into prospector._migrations (nome) values ($1)', [file]);
        await client.query('commit');
        applied.push(file);
        logger.info('Migration aplicada', { arquivo: file });
      } catch (err) {
        await client.query('rollback');
        throw new Error(`Migration ${file} falhou: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  } finally {
    await client.end();
  }
  return applied;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrate(requireEnv('SUPABASE_DB_URL'))
    .then((applied) => {
      logger.info(applied.length ? 'Migrations concluídas' : 'Nenhuma migration pendente', {
        aplicadas: applied.length,
      });
    })
    .catch((err: unknown) => {
      logger.error('Falha nas migrations', { err });
      process.exitCode = 1;
    });
}
