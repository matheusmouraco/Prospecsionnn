import { mkdir, writeFile } from 'node:fs/promises';
import { getEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { snovClientFromEnv } from '../snov/index.js';
import { parseProspect } from '../snov/parse.js';

// Saves the first raw prospects of a list to out/ so the real field names can be checked
// against parseProspect(). Usage: npm run snov:inspect -- <listId>
async function main(): Promise<void> {
  const listId = process.argv[2] ?? getEnv().SNOV_SOURCE_LIST_IDS[0];
  if (!listId) throw new Error('Informe o id da lista: npm run snov:inspect -- <listId>');

  const { prospects } = await snovClientFromEnv().getProspectsPage(listId, 1, 5);
  const sample = prospects.map((raw) => ({ raw, interpretado: parseProspect(raw) }));

  await mkdir('out', { recursive: true });
  await writeFile('out/snov-amostra.json', JSON.stringify(sample, null, 2));

  const keys = [...new Set(prospects.flatMap((p) => Object.keys(p)))].sort();
  logger.info('Amostra salva em out/snov-amostra.json', {
    lista: listId,
    prospects: prospects.length,
    campos: keys,
    com_site: sample.filter((s) => s.interpretado?.website).length,
  });
}

main().catch((err: unknown) => {
  logger.error('snov:inspect falhou', { err });
  process.exitCode = 1;
});
