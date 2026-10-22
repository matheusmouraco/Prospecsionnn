import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { acaoPara, applyThreshold, CATEGORIAS, classifyReply, stripQuoted } from '../src/replies/classify.js';

describe('reply classification', () => {
  it('keeps only what the person wrote', () => {
    const texto = 'Manda aí.\n\nEm qua., 22 de out. de 2026 às 09:12, Matheus Moura escreveu:\n> Oi Bruna, vi que o site...';
    expect(stripQuoted(texto)).toBe('Manda aí.');
    expect(stripQuoted('Sim\n> citado\nobrigado')).toBe('Sim\nobrigado');
  });

  it('treats low confidence as outro', () => {
    expect(applyThreshold('quer_ver', 0.79)).toBe('outro');
    expect(applyThreshold('quer_ver', 0.8)).toBe('quer_ver');
  });

  it('maps each category to the action in CLAUDE.md', () => {
    expect(CATEGORIAS.map(acaoPara)).toEqual(['gerar_esboco', 'notificar_moura', 'bloquear', 'bloquear', 'nenhuma', 'notificar_moura']);
  });

  it('sends only the reply to the model and applies the threshold', async () => {
    let sent = '';
    const parse = (async (o: { content: { text: string }[] }) => {
      sent = o.content[0]!.text;
      return { data: { categoria: 'interesse', confianca: 0.6, resumo: 'Quer saber o preço' }, costUsd: 0.001 };
    }) as never;
    const c = await classifyReply('claude-sonnet-5-5', 'Matilab', { empresa: 'Cirod', texto: 'Quanto custa?\n> email antigo' }, { parse });
    expect(sent).toContain('Quanto custa?');
    expect(sent).not.toContain('email antigo');
    expect(c).toMatchObject({ categoria: 'outro', categoria_modelo: 'interesse', confianca: 0.6 });
  });

  it('has 20 sample replies covering every category', () => {
    const ex = JSON.parse(readFileSync('test/fixtures/respostas.json', 'utf8')) as { esperado: string }[];
    expect(ex).toHaveLength(20);
    expect(new Set(ex.map((e) => e.esperado))).toEqual(new Set(CATEGORIAS));
  });
});
