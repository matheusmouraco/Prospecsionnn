import { DB_SCHEMA, getSupabase, TABLES } from '../db/client.js';
import { isPaused } from '../db/control.js';
import { getEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';

// Phase 1 acceptance check: connection works and every table exists.
async function main(): Promise<void> {
  const env = getEnv();
  const db = getSupabase();
  const missing: string[] = [];

  for (const table of TABLES) {
    const { count, error } = await db.from(table).select('*', { count: 'exact', head: true });
    if (error?.code === 'PGRST106') {
      logger.error(
        `O schema "${DB_SCHEMA}" não está liberado na API. No Supabase: Project Settings > Data API > Exposed schemas, adicione "${DB_SCHEMA}" e salve.`,
      );
      process.exitCode = 1;
      return;
    }
    if (error) {
      missing.push(table);
      logger.error('Tabela inacessível', { tabela: table, motivo: error.message });
    } else {
      logger.info('Tabela ok', { tabela: table, registros: count ?? 0 });
    }
  }

  const { error: rpcError } = await db.rpc('claim_prospects', { p_status: '__check__', p_limit: 0 });
  if (rpcError) {
    missing.push('claim_prospects()');
    logger.error('Função claim_prospects inacessível', { motivo: rpcError.message });
  }

  if (missing.length) {
    logger.error('Banco incompleto. Rode npm run db:migrate', { faltando: missing });
    process.exitCode = 1;
    return;
  }

  logger.info('Conexão com o Supabase ok', {
    tabelas: TABLES.length,
    pausado: await isPaused(db),
    dry_run: env.DRY_RUN,
  });
}

main().catch((err: unknown) => {
  logger.error('db:check falhou', { err });
  process.exitCode = 1;
});
