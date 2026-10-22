import { mkdir, writeFile } from 'node:fs/promises';
import { getEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { InsertSkipped, supabaseImportStore } from '../snov/store.js';
import { snovClientFromEnv } from '../snov/index.js';
import { runImport, type ImportStats } from '../snov/importer.js';

// Phase 2 criterion. `npm run snov:import -- --preview` reads and dedupes without writing.
// Lists can be passed as arguments; otherwise SNOV_SOURCE_LIST_IDS is used.
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const preview = args.includes('--preview');
  const listIds = args.filter((a) => !a.startsWith('--'));
  const env = getEnv();
  const lists = listIds.length ? listIds : env.SNOV_SOURCE_LIST_IDS;
  if (!lists.length) throw new Error('Nenhuma lista: preencha SNOV_SOURCE_LIST_IDS ou passe ids como argumento');

  const log = logger.child({ etapa: 'importacao' });
  log.info('Lendo listas. Cada prospect gera 1 consulta de detalhes (limite do Snov: ~60 por minuto)', { listas: lists });
  const { stats, novos } = await runImport({
    source: snovClientFromEnv(),
    store: supabaseImportStore(),
    listIds: lists,
    write: !preview,
    isSkip: (err) => err instanceof InsertSkipped,
    onInsertError: (c, err) => log.error('Falha ao inserir prospect', { dominio: c.domain, err }),
    onEnrichError: (id, err) => log.warn('Falha ao buscar detalhes do prospect', { snov_id: id, err }),
  });

  await mkdir('out', { recursive: true });
  await writeFile('out/importacao.md', report(lists, stats, novos.map((n) => n.domain), preview));
  log.info(preview ? 'Prévia concluída (nada gravado)' : 'Importação concluída', { listas: lists, ...stats });
  if (stats.falhas_insercao > 0) process.exitCode = 1;
}

function report(lists: string[], s: ImportStats, domains: string[], preview: boolean): string {
  const rows: [string, number][] = [
    ['Prospects lidos', s.lidos],
    ['Inválidos (sem id ou email)', s.invalidos],
    ['Email repetido entre listas', s.email_duplicado_na_lista],
    ['Detalhes buscados no Snov', s.enriquecidos],
    ['Sem site e com email genérico (descartados)', s.sem_site],
    ['Domínio tirado do email corporativo (sem site no Snov)', s.site_pelo_email],
    ['Domínio ignorado (rede social, marketplace, email genérico)', s.dominio_ignorado],
    ['Contatos extras da mesma empresa', s.contatos_extras_mesma_empresa],
    ['**Empresas únicas com site**', s.empresas_unicas_com_site],
    ['Já estavam no banco', s.ja_no_banco],
    ['Bloqueados', s.bloqueados],
    ['**Novas para analisar**', s.novos],
    ['Inseridas', s.inseridos],
    ['Falhas ao inserir', s.falhas_insercao],
  ];
  return [
    `# Importação Snov ${preview ? '(prévia, nada gravado)' : ''}`,
    '',
    `Data: ${new Date().toISOString()}  `,
    `Listas: ${lists.join(', ')}`,
    '',
    '| Etapa | Quantidade |',
    '| --- | ---: |',
    ...rows.map(([k, v]) => `| ${k} | ${v} |`),
    '',
    '## Domínios novos',
    '',
    ...domains.map((d) => `- ${d}`),
    '',
  ].join('\n');
}

main().catch((err: unknown) => {
  logger.error('snov:import falhou', { err });
  process.exitCode = 1;
});
