import { describe, expect, it } from 'vitest';
import { measuredProblems } from '../src/analysis/checks.js';
import type { Captura, DomFacts } from '../src/analysis/facts.js';
import { parsePageSpeed, type PageSpeedResult } from '../src/analysis/pagespeed.js';

const facts = (over: Partial<DomFacts> = {}): DomFacts => ({
  url_final: 'https://loja.com.br/', dados_estruturados: [], tem_faq: false, controles_sem_nome: 0, texto_renderizado_chars: 2000, title: 'Loja', meta_description: 'Resumo', h1: ['Loja'], tem_viewport: true,
  lang: 'pt-BR', imagens: 4, imagens_sem_alt: 0, links_whatsapp: 1, links_telefone: 0, links_email: 0,
  contato_visivel_na_dobra: true, formularios: 0, anos_copyright: [2026], tem_favicon: true, og_title: 'Loja',
  og_image: null, rolagem_horizontal: false, fonte_corpo_px: 16, altura_pagina: 3000,
  marca: { logo_url: null, cores: [], variaveis_css: {}, fonte_titulo: null, fonte_corpo: null, titulos: [], paragrafos: [], telefone: null, endereco: null, fotos: [] },
  ...over,
});

const ok = (over: Partial<DomFacts> = {}, mobileOver: Partial<DomFacts> = {}): Captura => ({
  acesso: { status: 'ok', https: true, url_final: 'https://loja.com.br/' },
  desktop: facts(over),
  mobile: facts({ ...over, ...mobileOver }),
  prints: null,
});

const psi = (over: Partial<PageSpeedResult>): PageSpeedResult => ({
  strategy: 'mobile', performance: 90, seo: 95, acessibilidade: 90, boas_praticas: 90, lcp_ms: 1800, fcp_ms: 900,
  cls: 0.01, tbt_ms: 50, speed_index_ms: 1500, erro: null, ...over,
});

describe('measuredProblems', () => {
  it('returns nothing for a healthy site', () => {
    expect(measuredProblems(ok(), psi({}), psi({ strategy: 'desktop' }), 2026)).toEqual([]);
  });

  it('turns slow mobile LCP into a business-language problem with the measured number', () => {
    const [p] = measuredProblems(ok(), psi({ lcp_ms: 7240, performance: 22 }), null, 2026);
    expect(p).toMatchObject({ tipo: 'velocidade', gravidade: 4, origem: 'medido' });
    expect(p!.descricao_curta).toBe('Demora 7,2 segundos para mostrar o conteúdo principal no celular');
    expect(p!.evidencia).toContain('7,2 s');
  });

  it('flags HTML issues only when measured', () => {
    const probs = measuredProblems(
      ok(
        { title: null, meta_description: null, h1: [], tem_viewport: false, anos_copyright: [2019], tem_favicon: false,
          og_title: null, og_image: null, links_whatsapp: 0, imagens: 6, imagens_sem_alt: 5 },
        { rolagem_horizontal: true, fonte_corpo_px: 12 },
      ),
      null, null, 2026,
    );
    const textos = probs.map((p) => p.descricao_curta);
    expect(textos).toEqual(expect.arrayContaining([
      'O site não foi feito para celular',
      'No celular a página fica mais larga que a tela',
      'Não tem um jeito rápido de o cliente entrar em contato',
      'O site passa a impressão de abandonado',
      'A página não tem título para o Google',
    ]));
    expect(probs.find((p) => p.tipo === 'design')?.evidencia).toBe('O rodapé mostra © 2019');
    expect(probs.every((p) => p.evidencia.length > 0 && p.origem === 'medido')).toBe(true);
    expect(probs[0]!.gravidade).toBe(5); // sorted by severity
  });

  it('does not call a recent copyright year abandoned', () => {
    const probs = measuredProblems(ok({ anos_copyright: [2025] }), null, null, 2026);
    expect(probs.some((p) => p.tipo === 'design')).toBe(false);
  });

  it('reports access problems', () => {
    const fora = measuredProblems({ acesso: { status: 'fora_do_ar', detalhe: 'net::ERR_NAME_NOT_RESOLVED' }, desktop: null, mobile: null, prints: null }, null, null);
    expect(fora).toHaveLength(1);
    expect(fora[0]).toMatchObject({ descricao_curta: 'O site não abre', gravidade: 5 });

    const http = measuredProblems({ ...ok(), acesso: { status: 'ok', https: false, url_final: 'http://loja.com.br/' } }, null, null, 2026);
    expect(http[0]?.descricao_curta).toBe('O site não tem cadeado de segurança');

    const terceiro = measuredProblems({ ...ok(), acesso: { status: 'redireciona_terceiro', https: true, url_final: 'https://hostgator.com.br/' } }, null, null, 2026);
    expect(terceiro[0]?.evidencia).toContain('hostgator.com.br');
  });
});

describe('parsePageSpeed', () => {
  it('reads scores (0-100) and audits from a Lighthouse result', () => {
    const r = parsePageSpeed('mobile', {
      lighthouseResult: {
        categories: { performance: { score: 0.31 }, seo: { score: 0.83 }, accessibility: { score: 0.7 }, 'best-practices': { score: 0.96 } },
        audits: {
          'largest-contentful-paint': { numericValue: 6120.4 },
          'first-contentful-paint': { numericValue: 2100 },
          'cumulative-layout-shift': { numericValue: 0.31 },
          'total-blocking-time': { numericValue: 840 },
          'speed-index': { numericValue: 5400 },
        },
      },
    });
    expect(r).toMatchObject({ performance: 31, seo: 83, acessibilidade: 70, boas_praticas: 96, lcp_ms: 6120.4, cls: 0.31, erro: null });
  });

  it('keeps API errors without throwing', () => {
    expect(parsePageSpeed('desktop', { error: { message: 'Quota exceeded' } })).toMatchObject({ performance: null, erro: 'Quota exceeded' });
    expect(parsePageSpeed('desktop', null).performance).toBeNull();
  });
});
