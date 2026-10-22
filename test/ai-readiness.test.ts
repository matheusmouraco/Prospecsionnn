import { describe, expect, it } from 'vitest';
import { blockedBots, checkAiReadiness, htmlTextLength, parseRobots, type ProntidaoIA } from '../src/analysis/ai-readiness.js';
import { aiProblems } from '../src/analysis/checks.js';

describe('robots.txt', () => {
  it('finds AI bots blocked by their own group or by "*"', () => {
    const robots = `
User-agent: GPTBot
User-agent: ClaudeBot
Disallow: /

User-agent: Googlebot
Allow: /

User-agent: *
Disallow: /admin
Sitemap: https://loja.com.br/sitemap.xml`;
    expect(blockedBots(robots)).toEqual(['GPTBot', 'ClaudeBot']);
    expect(parseRobots(robots).sitemaps).toEqual(['https://loja.com.br/sitemap.xml']);
  });

  it('applies a site-wide block to bots without their own group, unless re-allowed', () => {
    expect(blockedBots('User-agent: *\nDisallow: /', ['GPTBot', 'PerplexityBot'])).toEqual(['GPTBot', 'PerplexityBot']);
    expect(blockedBots('User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nAllow: /', ['GPTBot', 'CCBot'])).toEqual(['CCBot']);
    expect(blockedBots('User-agent: *\nDisallow:', ['GPTBot'])).toEqual([]);
  });
});

describe('htmlTextLength', () => {
  it('counts only visible text, ignoring scripts, styles and tags', () => {
    expect(htmlTextLength('<html><head><style>a{}</style><script>var x = "muito texto"</script></head><body><div id="root"></div><p>Olá  mundo</p></body></html>')).toBe('Olá mundo'.length);
  });
});

const base: ProntidaoIA = {
  robots_txt: true, bots_bloqueados: [], sitemap: true, llms_txt: true, texto_html_chars: 3000,
  texto_renderizado_chars: 3200, dados_estruturados: ['Dentist'], tem_faq: true, controles_sem_nome: 0,
};

describe('aiProblems', () => {
  it('returns nothing for an AI-ready site', () => {
    expect(aiProblems(base, null, true)).toEqual([]);
  });

  it('reports each measured gap with its evidence', () => {
    const probs = aiProblems(
      { ...base, bots_bloqueados: ['GPTBot'], texto_html_chars: 120, texto_renderizado_chars: 2400, dados_estruturados: ['WebSite'],
        tem_faq: false, controles_sem_nome: 5, sitemap: false, llms_txt: false },
      { strategy: 'mobile', performance: 50, seo: 90, acessibilidade: 55, boas_praticas: 90, lcp_ms: 2000, fcp_ms: 1000, cls: 0, tbt_ms: 0, speed_index_ms: 0, erro: null },
      false,
    );
    expect(probs.every((p) => p.tipo === 'ia' && p.origem === 'medido')).toBe(true);
    expect(probs.map((p) => p.descricao_curta)).toEqual([
      'O site impede que ChatGPT e outras IAs leiam o conteúdo',
      'Para as IAs a página aparece quase vazia',
      'Google e IAs não recebem de forma organizada o que a empresa faz, onde fica e como contatar',
      'O site não responde as dúvidas que os clientes perguntam para a IA',
      'Uma IA que lê o site não encontra telefone nem endereço',
      'Assistentes de IA que navegam sozinhos não entendem parte dos botões',
      'O site é difícil de usar por leitores de tela e agentes de IA',
      'O Google não recebe a lista de páginas do site',
      'Não tem um resumo próprio para assistentes de IA (llms.txt)',
    ]);
    expect(probs[0]!.evidencia).toBe('O robots.txt bloqueia: GPTBot');
    expect(probs[1]!.evidencia).toContain('120 caracteres');
    expect(probs[2]!.evidencia).toContain('WebSite');
  });

  it('does not call a small page empty', () => {
    expect(aiProblems({ ...base, texto_html_chars: 50, texto_renderizado_chars: 300 }, null, true)).toEqual([]);
  });
});

describe('checkAiReadiness', () => {
  it('fetches robots, llms.txt, sitemap and raw HTML, ignoring soft-404 HTML pages', async () => {
    const pages: Record<string, { status: number; body: string; type: string }> = {
      'https://loja.com.br/robots.txt': { status: 200, body: 'User-agent: PerplexityBot\nDisallow: /', type: 'text/plain' },
      'https://loja.com.br/llms.txt': { status: 200, body: '<!doctype html><html>página não encontrada</html>', type: 'text/html' },
      'https://loja.com.br/sitemap.xml': { status: 404, body: '', type: 'text/html' },
      'https://loja.com.br/': { status: 200, body: '<body><div id="app"></div><script>render()</script></body>', type: 'text/html' },
    };
    const fetch = async (url: string) => {
      const p = pages[url] ?? { status: 404, body: '', type: 'text/plain' };
      return new Response(p.body, { status: p.status, headers: { 'content-type': p.type } });
    };
    const ia = await checkAiReadiness('https://loja.com.br/', { dados_estruturados: [], tem_faq: false, controles_sem_nome: 1, texto_renderizado_chars: 1800 }, fetch);
    expect(ia).toMatchObject({
      robots_txt: true, bots_bloqueados: ['PerplexityBot'], llms_txt: false, sitemap: false,
      texto_html_chars: 0, texto_renderizado_chars: 1800, controles_sem_nome: 1,
    });
  });

  it('survives network errors', async () => {
    const ia = await checkAiReadiness('https://x.com.br/', null, async () => { throw new Error('offline'); });
    expect(ia).toMatchObject({ robots_txt: false, sitemap: false, llms_txt: false, texto_html_chars: null });
  });
});
