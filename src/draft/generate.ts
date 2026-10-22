import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import type { Problema } from '../analysis/checks.js';
import type { Marca } from '../analysis/facts.js';
import { generateText } from '../lib/claude.js';
import { loadPrompt } from '../lib/prompts.js';
import { PRINTS } from '../references/capture.js';
import { REFERENCIAS_DIR } from '../references/list.js';
import type { FichaRef } from '../references/select.js';

export interface BriefEsboco {
  empresa: string;
  url: string;
  nicho: string | null;
  marca: Marca;
  problemas: Problema[];
  referencias: FichaRef[];
}

const lista = (items: string[]) => (items.length ? items.map((t) => `- ${t}`).join('\n') : '(nenhum)');

export function describeReferencias(refs: FichaRef[]): string {
  if (!refs.length) return '(nenhuma referência capturada; siga só a direção de arte)';
  return refs
    .map((r, i) => [
      `Referência ${i + 1}: ${r.url}${r.favorito ? ' (régua de qualidade da agência)' : ''}`,
      `- Estilo: ${r.estilo}`,
      `- Tipografia: ${r.tipografia}`,
      `- Paleta: ${r.paleta}`,
      `- Padrões: ${r.padroes.join('; ')}`,
      `- Destaques: ${r.destaques.join('; ')}`,
      `- Movimento: ${r.movimento ?? '-'}${r.bibliotecas?.length ? ` (usa ${r.bibliotecas.join(', ')})` : ''}`,
    ].join('\n'))
    .join('\n\n');
}

export async function buildBrief(b: BriefEsboco, feedback: string[]): Promise<string> {
  return loadPrompt('esboco-dados', {
    empresa: b.empresa,
    url: b.url,
    nicho: b.nicho ?? '(não detectado)',
    logo: b.marca.logo_url ?? '(não encontrado; use o nome da empresa com tratamento tipográfico)',
    cores: b.marca.cores.join(', ') || '(nenhuma)',
    variaveis_css: Object.entries(b.marca.variaveis_css ?? {}).map(([k, v]) => `${k}: ${v}`).join('; ') || '(nenhuma)',
    fonte_titulo: b.marca.fonte_titulo ?? '-',
    fonte_corpo: b.marca.fonte_corpo ?? '-',
    telefone: b.marca.telefone ?? '(não encontrado)',
    endereco: b.marca.endereco ?? '(não encontrado)',
    fotos: lista(b.marca.fotos),
    titulos: lista(b.marca.titulos),
    paragrafos: lista(b.marca.paragrafos),
    problemas: lista(b.problemas.map((p) => `${p.descricao_curta} (${p.evidencia})`)),
    referencias: describeReferencias(b.referencias),
    feedback: feedback.length ? `\nA versão anterior foi recusada. Corrija tudo isto:\n${lista(feedback)}` : '',
  });
}

async function image(path: string): Promise<Anthropic.Beta.BetaImageBlockParam> {
  return { type: 'image', source: { type: 'base64', media_type: 'image/png', data: (await readFile(path)).toString('base64') } };
}

// Reference prints (quality bar) and the current site's first screen (brand), in that order.
export async function visualContext(refs: FichaRef[], printOriginal: string | null, dir = REFERENCIAS_DIR): Promise<Anthropic.Beta.BetaContentBlockParam[]> {
  const out: Anthropic.Beta.BetaContentBlockParam[] = [];
  for (const [i, r] of refs.entries()) {
    out.push(
      { type: 'text', text: `Referência ${i + 1} (${r.url}), primeira tela e página longa:` },
      await image(join(dir, r.slug, PRINTS.desktop)),
      await image(join(dir, r.slug, PRINTS.longa)),
    );
  }
  if (printOriginal) out.push({ type: 'text', text: 'Site atual da empresa (primeira tela no computador):' }, await image(printOriginal));
  return out;
}

// One custom HTML page from MODEL_DESIGN at high effort (max spent the whole output budget thinking). The art direction is a stable,
// cached prefix; references, brand and content change per company.
export async function generateDraftHtml(
  model: string,
  agencia: string,
  brief: string,
  visual: Anthropic.Beta.BetaContentBlockParam[],
  deps: { generate?: typeof generateText } = {},
) {
  const system = await loadPrompt('esboco-gerar', { marca: agencia });
  return (deps.generate ?? generateText)({
    model,
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    content: [...visual, { type: 'text', text: brief }],
    effort: 'high',
    maxTokens: 128000,
  });
}
