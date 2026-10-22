import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Ficha } from './capture.js';
import { hasPrints } from './capture.js';
import { REFERENCIAS_DIR } from './list.js';

export interface FichaRef extends Ficha {
  slug: string;
}

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Word stems that mean the same business area, so "clínica odontológica" matches "odontologia" and "saúde".
const SINONIMOS: string[][] = [
  ['odonto', 'dent', 'sorriso', 'ortodont', 'radiolog', 'saude', 'clinic', 'medic', 'estetic', 'harmoniza', 'fisio', 'psico', 'nutri', 'hospital', 'convenio', 'plano de saude'],
  ['arquitet', 'interior', 'paisag', 'design de interiores', 'decorac'],
  ['engenh', 'constru', 'obra', 'reforma', 'concreto', 'piso', 'epoxi', 'industria', 'fabrica', 'incorpora', 'imobil', 'pelicula', 'janela', 'locac', 'equipament'],
  ['advoca', 'juridic', 'direito', 'contab', 'financ', 'investiment', 'credito', 'seguro', 'consultor'],
  ['software', 'tecnolog', 'saas', 'sistema', 'app', 'plataforma', 'digital', 'inteligencia artificial'],
  ['escola', 'educa', 'ensino', 'curso', 'faculdade', 'universidade'],
  ['hotel', 'turismo', 'pousada', 'resort', 'viagem'],
  ['loja', 'varejo', 'comercio', 'outlet', 'moda', 'produto'],
  ['marketing', 'agencia', 'publicidade', 'marca pessoal', 'pessoal', 'portfolio', 'politic', 'mandato'],
];

function grupos(texto: string): Set<number> {
  const t = fold(texto);
  const out = new Set<number>();
  SINONIMOS.forEach((stems, i) => {
    if (stems.some((s) => t.includes(s))) out.add(i);
  });
  return out;
}

export async function loadFichas(dir = REFERENCIAS_DIR): Promise<FichaRef[]> {
  if (!existsSync(dir)) return [];
  const out: FichaRef[] = [];
  for (const slug of await readdir(dir)) {
    const file = join(dir, slug, 'ficha.json');
    if (!existsSync(file) || !hasPrints(slug, dir)) continue;
    out.push({ ...(JSON.parse(await readFile(file, 'utf8')) as Ficha), slug });
  }
  return out;
}

export function relevance(nicho: string | null, f: Ficha): number {
  const alvo = grupos(nicho ?? '');
  const ref = grupos(f.segmentos.join(' '));
  const match = [...alvo].some((g) => ref.has(g));
  const direct = f.segmentos.some((s) => fold(nicho ?? '').includes(fold(s)));
  return (direct ? 60 : match ? 40 : 0) + f.nivel / 5;
}

// The closest reference to the business plus a favorite as the quality bar (two different sites).
export function chooseReferences(nicho: string | null, fichas: FichaRef[], max = 2): FichaRef[] {
  const ranked = [...fichas].sort((a, b) => relevance(nicho, b) - relevance(nicho, a));
  const picked: FichaRef[] = [];
  if (ranked[0]) picked.push(ranked[0]);
  const favorita = ranked.find((f) => f.favorito && !picked.includes(f));
  if (favorita && picked.length < max) picked.push(favorita);
  for (const f of ranked) {
    if (picked.length >= max) break;
    if (!picked.includes(f)) picked.push(f);
  }
  return picked;
}
