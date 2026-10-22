import { logger } from '../lib/logger.js';
import { snovClientFromEnv } from '../snov/index.js';

// Lists the account's prospect lists so the ids can go into SNOV_SOURCE_LIST_IDS.
async function main(): Promise<void> {
  const lists = await snovClientFromEnv().getUserLists();
  for (const l of lists.filter((x) => !x.isDeleted)) {
    logger.info('Lista', { id: l.id, nome: l.name, contatos: l.contacts });
  }
}

main().catch((err: unknown) => {
  logger.error('snov:lists falhou', { err });
  process.exitCode = 1;
});
