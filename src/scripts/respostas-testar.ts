import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { getEnv, requireEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { acoesPara, CATEGORIAS, classifyReply, type Categoria, type Classificacao } from '../replies/classify.js';

const log = logger.child({ etapa: 'respostas' });
const FIXTURE = 'test/fixtures/respostas.json';

interface Exemplo { empresa: string; esperado: Categoria; texto: string }

// Phase 6 criterion: classifies the 20 sample replies and writes the hit table to out/classificacao.md.
async function main(): Promise<void> {
  const env = getEnv();
  requireEnv('ANTHROPIC_API_KEY');
  const exemplos = JSON.parse(await readFile(FIXTURE, 'utf8')) as Exemplo[];
  const linhas: (Exemplo & Classificacao)[] = [];
  for (const ex of exemplos) {
    const c = await classifyReply(env.MODEL_FAST, env.SENDER_BRAND, ex);
    linhas.push({ ...ex, ...c });
    log.info('Resposta classificada', { empresa: ex.empresa, esperado: ex.esperado, obtido: c.categoria, confianca: c.confianca, acerto: c.categoria === ex.esperado });
  }
  await mkdir('out', { recursive: true });
  await writeFile('out/classificacao.md', report(linhas));
  const acertos = linhas.filter((l) => l.categoria === l.esperado).length;
  log.info('Relatório salvo em out/classificacao.md', { acertos, total: linhas.length, custo_usd: Number(linhas.reduce((s, l) => s + l.custo_usd, 0).toFixed(4)) });
}

function report(linhas: (Exemplo & Classificacao)[]): string {
  const acertos = linhas.filter((l) => l.categoria === l.esperado).length;
  const cel = (s: string) => s.replace(/\s+/g, ' ').replace(/\|/g, '/').slice(0, 90);
  return [
    '# Classificação de respostas', '',
    `Acerto: **${acertos} de ${linhas.length}** (${Math.round((acertos / linhas.length) * 100)}%). Confiança abaixo de 0,8 vira "outro". Custo: US$ ${linhas.reduce((s, l) => s + l.custo_usd, 0).toFixed(3)}.`, '',
    '## Por categoria', '',
    '| Categoria | Acertos | Ação do sistema |', '| --- | ---: | --- |',
    ...CATEGORIAS.map((c) => {
      const grupo = linhas.filter((l) => l.esperado === c);
      return `| ${c} | ${grupo.filter((l) => l.categoria === c).length} de ${grupo.length} | ${acoesPara({ categoria: c, pediu_esboco: false }).join(' + ')} |`;
    }),
    '', '## Respostas', '',
    '| | Resposta | Esperado | Obtido | Confiança | Ações | Resumo |', '| --- | --- | --- | --- | ---: | --- | --- |',
    ...linhas.map((l) => `| ${l.categoria === l.esperado ? 'ok' : 'ERRO'} | ${cel(l.texto)} | ${l.esperado} | ${l.categoria}${l.categoria !== l.categoria_modelo ? ` (modelo: ${l.categoria_modelo})` : ''} | ${l.confianca.toFixed(2)} | ${acoesPara(l).join(' + ')} | ${cel(l.resumo)} |`),
    '',
  ].join('\n');
}

main().catch((err: unknown) => {
  log.error('respostas:testar falhou', { err });
  process.exitCode = 1;
});
