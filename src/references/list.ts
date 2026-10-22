import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const REFERENCIAS_DIR = join(import.meta.dirname, '..', '..', 'referencias');

export interface Referencia {
  url: string;
  slug: string;
  favorito: boolean; // quality bar: always considered when choosing references
}

// "https://www.nexoleum.com.br/" -> "nexoleum-com-br"; paths are kept ("jordanwindowfilm-vercel-app-arquitetura").
export function slugFor(url: string): string {
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, '');
  const path = u.pathname.replace(/\/(index\.html?)?$/, '');
  return `${host}${path}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Lines: URL, optional " *" for favorites; "#" starts a comment. Query strings (tracking) are dropped.
export function parseLista(text: string): Referencia[] {
  const out: Referencia[] = [];
  const seen = new Set<string>();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) continue;
    const favorito = /\s\*$/.test(line);
    const value = line.replace(/\s\*$/, '').trim();
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      continue;
    }
    url.search = '';
    url.hash = '';
    const slug = slugFor(url.href);
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push({ url: url.href, slug, favorito });
  }
  return out;
}

export async function loadLista(dir = REFERENCIAS_DIR): Promise<Referencia[]> {
  return parseLista(await readFile(join(dir, 'lista.txt'), 'utf8'));
}
