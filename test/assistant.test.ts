import { describe, expect, it } from 'vitest';
import type { parseJson } from '../src/lib/claude.js';
import { interpretar } from '../src/telegram/assistant.js';
import { buildSite } from '../src/publish/site.js';
import { renderPainel } from '../src/panel/render.js';

describe('telegram assistant', () => {
  it('sends the situation and the recent conversation, and returns an allowed action', async () => {
    let enviado = '';
    const parse = (async (o: { content: Array<{ text?: string }>; system: string }) => {
      enviado = o.content[0]!.text!;
      expect(o.system).toContain('`pausar`');
      return { data: { acao: 'pausar', motivo: 'viagem', resposta: 'Pausei.' }, costUsd: 0 };
    }) as unknown as typeof parseJson;
    const r = await interpretar('pausa tudo que vou viajar', 'Enviados: 3', [{ de: 'moura', texto: 'oi' }], { parse });
    expect(r).toEqual({ acao: 'pausar', motivo: 'viagem', resposta: 'Pausei.' });
    expect(enviado).toContain('Enviados: 3');
    expect(enviado).toContain('Ele: oi');
  });
});

describe('panel', () => {
  it('renders private, escaped and noindex', () => {
    const html = renderPainel({
      geradoEm: new Date().toISOString(), pausado: false, motivo: '', status: { email_pronto: 21 },
      dias: [{ dia: '2026-10-23', enviados: 4, respostas: 1, positivas: 1, esbocos_gerados: 0, custo_api_usd: 0.5 }],
      respostas: [{ recebida_em: null, categoria: 'interesse', resumo: 'quer preço', texto: '<b>quanto?</b>', email: 'a@b.com', empresa: 'Dentelli', dominio: 'dentelli.com.br' }],
      esbocos: [],
    });
    expect(html).toContain('noindex');
    expect(html).toContain('&lt;b&gt;quanto?');
    expect(html).toContain('<b>21</b>');
    expect(buildSite([]).length).toBe(3);
  });
});
