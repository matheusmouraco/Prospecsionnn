import { describe, expect, it } from 'vitest';
import type { Ficha } from '../src/references/capture.js';
import { parseLista, slugFor } from '../src/references/list.js';
import { chooseReferences, relevance, type FichaRef } from '../src/references/select.js';

describe('lista de referências', () => {
  it('reads urls, favorites and comments, drops tracking and duplicates', () => {
    const refs = parseLista(`# comentário
https://www.nexoleum.com.br/
https://jordanwindowfilm.vercel.app/arquitetura
https://alice.com.br/?utm_medium=cpc&gclid=abc *
https://nexoleum.com.br
não é url`);
    expect(refs).toEqual([
      { url: 'https://www.nexoleum.com.br/', slug: 'nexoleum-com-br', favorito: false },
      { url: 'https://jordanwindowfilm.vercel.app/arquitetura', slug: 'jordanwindowfilm-vercel-app-arquitetura', favorito: false },
      { url: 'https://alice.com.br/', slug: 'alice-com-br', favorito: true },
    ]);
    expect(slugFor('https://conradoceravolo.vercel.app/v2/site/index.html')).toBe('conradoceravolo-vercel-app-v2-site');
  });
});

const ficha = (slug: string, segmentos: string[], nivel: number, favorito = false): FichaRef => ({
  slug, url: `https://${slug}.com`, segmentos, nivel, favorito,
  estilo: '', tipografia: '', paleta: '', padroes: [], destaques: [], fontes: [], cores: [], movimento: 'estático', bibliotecas: [],
} as Ficha & { slug: string });

const fichas = [
  ficha('arqui', ['arquitetura'], 88),
  ficha('voy', ['saúde', 'clínica'], 80),
  ficha('haya', ['saúde', 'odontologia'], 75),
  ficha('superlogica', ['software', 'finanças'], 95, true),
  ficha('alice', ['saúde', 'planos de saúde'], 93, true),
];

describe('chooseReferences', () => {
  it('picks the closest reference plus a different favorite as the quality bar', () => {
    expect(chooseReferences('clínica de radiologia odontológica', fichas).map((f) => f.slug)).toEqual(['voy', 'alice']);
    expect(chooseReferences('escritório de arquitetura', fichas).map((f) => f.slug)).toEqual(['arqui', 'superlogica']);
  });

  it('a niche match beats a better but unrelated site', () => {
    expect(relevance('clínica odontológica', fichas[2]!)).toBeGreaterThan(relevance('clínica odontológica', fichas[3]!));
  });

  it('falls back to the best sites when nothing matches, and handles no references', () => {
    expect(chooseReferences('fábrica de móveis', fichas.slice(0, 2)).map((f) => f.slug)).toEqual(['arqui', 'voy']);
    expect(chooseReferences('qualquer', [])).toEqual([]);
  });
});
