import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Problema } from '../analysis/checks.js';
import type { Marca } from '../analysis/facts.js';
import { generateText } from '../lib/claude.js';
import { loadPrompt } from '../lib/prompts.js';

const TEMPLATES_DIR = join(import.meta.dirname, '..', '..', 'templates');

export async function loadTemplates(dir = TEMPLATES_DIR): Promise<string> {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.html')).sort();
  const parts = await Promise.all(files.map(async (f) => `### ${f.replace('.html', '')}\n\n\`\`\`html\n${await readFile(join(dir, f), 'utf8')}\n\`\`\``));
  return parts.join('\n\n');
}

export interface BriefEsboco {
  empresa: string;
  url: string;
  nicho: string | null;
  marca: Marca;
  problemas: Problema[];
}

const lista = (items: string[]) => (items.length ? items.map((t) => `- ${t}`).join('\n') : '(nenhum)');

export async function buildBrief(b: BriefEsboco, feedback: string[]): Promise<string> {
  return loadPrompt('esboco-dados', {
    empresa: b.empresa,
    url: b.url,
    nicho: b.nicho ?? '(não detectado)',
    logo: b.marca.logo_url ?? '(não encontrado; use o nome da empresa em texto)',
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
    feedback: feedback.length
      ? `\nA versão anterior foi recusada. Corrija tudo isto:\n${lista(feedback)}`
      : '',
  });
}

// One full HTML page from MODEL_DESIGN. The instructions and the templates are a stable prefix,
// cached across companies and attempts; only the brief changes.
export async function generateDraftHtml(model: string, agencia: string, brief: string, deps: { generate?: typeof generateText } = {}) {
  const system = await loadPrompt('esboco-gerar', { marca: agencia, templates: await loadTemplates() });
  return (deps.generate ?? generateText)({
    model,
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    content: [{ type: 'text', text: brief }],
    effort: 'high',
    maxTokens: 64000,
  });
}
