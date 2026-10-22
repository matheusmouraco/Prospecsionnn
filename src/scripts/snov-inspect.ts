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

  const client = snovClientFromEnv();
  const { prospects } = await client.getProspectsPage(listId, 1, 5);
  const sample = prospects.map((raw) => ({ raw, interpretado: parseProspect(raw) }));

  // List rows lack company/site, so also fetch the full record of the first two.
  const detalhes: { id: unknown; raw: Record<string, unknown> | null; interpretado: unknown }[] = [];
  for (const raw of prospects.slice(0, 2)) {
    const detail = await client.getProspectById(String(raw.id));
    const merged = detail ? { ...detail, ...raw, emails: raw.emails ?? detail.emails } : null;
    detalhes.push({ id: raw.id, raw: detail, interpretado: merged && parseProspect(merged) });
  }

  await mkdir('out', { recursive: true });
  await writeFile('out/snov-amostra.json', JSON.stringify({ lista: sample, detalhes }, null, 2));

  const keys = [...new Set(prospects.flatMap((p) => Object.keys(p)))].sort();
  logger.info('Amostra salva em out/snov-amostra.json', {
    lista: listId,
    prospects: prospects.length,
    campos: keys,
    com_site: sample.filter((s) => s.interpretado?.website).length,
  });
  logger.info('Detalhes (get-prospect-by-id)', {
    encontrados: detalhes.filter((d) => d.raw).length,
    campos: [...new Set(detalhes.flatMap((d) => (d.raw ? Object.keys(d.raw) : [])))].sort(),
    com_site: detalhes.filter((d) => (d.interpretado as { website?: string } | null)?.website).length,
  });
}

main().catch((err: unknown) => {
  logger.error('snov:inspect falhou', { err });
  process.exitCode = 1;
});
