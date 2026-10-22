import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const PROMPTS_DIR = join(import.meta.dirname, '..', '..', 'prompts');

// Fills {{name}} placeholders. Throws on any placeholder left without a value.
export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  const out = template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
  const missing = out.match(/\{\{\s*\w+\s*\}\}/g);
  if (missing) throw new Error(`Prompt com variáveis sem valor: ${missing.join(', ')}`);
  return out;
}

// Prompts live in /prompts/<name>.md, never inline in code.
export async function loadPrompt(name: string, vars: Record<string, string | number> = {}): Promise<string> {
  const raw = await readFile(join(PROMPTS_DIR, `${name}.md`), 'utf8');
  return fillTemplate(raw, vars);
}
