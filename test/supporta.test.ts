import { describe, expect, it } from 'vitest';
import type { SiteRow } from '../src/supporta/db.js';
import { homeMultipagina, menuDe, paginasDoPlano } from '../src/supporta/pages.js';
import { applySiteRules, injectCredito, validateSite } from '../src/supporta/rules.js';

const WA = 'https://wa.me/5511999998888?text=Oi';
const page = (body: string, head = '<meta name="viewport" content="width=device-width"><title>Padaria Teste</title><meta name="description" content="x">') =>
  `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;

const site = (plano: SiteRow['plano']): SiteRow => ({
  id: '1', token: 't', slug: 'padaria-teste', status: 'pago', plano, empresa: 'Padaria Teste', contato_nome: 'Ana', contato_email: 'a@b.com',
  contato_whatsapp: '11999998888', dominio: null, custo_usd: 0, tentativas: 1,
  respostas: { empresa: 'Padaria Teste', ramo: 'restaurante', ramoOutro: '', frase: 'Pães desde cedo', estilos: [], personalidade: [], cores: { modo: 'ia' },
    servicos: ['Pão francês', 'Bolos'], diferenciais: '', publico: '', objetivo: '', cidade: 'São Paulo', endereco: '', horario: '', whatsappSite: '', instagram: '', siteAtual: '', logo: '', fotos: [] },
});

describe('supporta site rules', () => {
  it('fills WhatsApp, drops robots meta and foreign scripts', () => {
    const out = applySiteRules(page('<a href="%%WHATSAPP%%">Fale</a><script src="https://evil.com/x.js"></script>', '<meta name="robots" content="noindex">'), WA);
    expect(out).toContain(`href="${WA.replace(/&/g, '&amp;')}"`);
    expect(out).not.toContain('robots');
    expect(out).not.toContain('evil.com');
  });

  it('rejects forms, invented numbers and foreign images', () => {
    const html = applySiteRules(page('<h1>Padaria</h1><a href="%%WHATSAPP%%">Fale</a><form></form><p>Há 25 anos no bairro</p><img src="https://images.unsplash.com/x.jpg" alt="">'), WA);
    const issues = validateSite(html, { whatsapp: WA, imagens: [], fonteNumeros: 'Padaria Teste' });
    expect(issues.join(' ')).toMatch(/form/);
    expect(issues.join(' ')).toMatch(/25/);
    expect(issues.join(' ')).toMatch(/imagens do dono e do banco/);
  });

  it('accepts a clean page', () => {
    const html = applySiteRules(page('<h1>Padaria Teste</h1><a href="%%WHATSAPP%%">Fale no WhatsApp</a>'), WA);
    expect(validateSite(html, { whatsapp: WA, imagens: [], fonteNumeros: 'Padaria Teste' })).toEqual([]);
    expect(injectCredito(html)).not.toContain('Site feito com');
  });
});

describe('supporta plan pages', () => {
  it('gives each plan its pages', () => {
    expect(paginasDoPlano(site('start'))).toEqual([]);
    expect(paginasDoPlano(site('pro')).map((p) => p.caminho)).toEqual(['/sobre', '/servicos', '/perguntas', '/contato']);
    const premium = paginasDoPlano(site('premium')).map((p) => p.caminho);
    expect(premium).toContain('/blog');
    expect(premium.filter((c) => c.startsWith('/blog/'))).toHaveLength(2);
    expect(menuDe(site('premium'))).toContain('Blog = "/blog"');
  });

  it('points the home menu to the pages and adds Blog only in menus', () => {
    const home = '<header><nav><a class="m" href="#sobre">Sobre</a><a class="m" href="#perguntas">Perguntas</a></nav></header><main><a href="#perguntas">Ver dúvidas</a></main>';
    const out = homeMultipagina(home, site('premium'));
    expect(out).toContain('href="/sobre"');
    expect(out.match(/href="\/blog"/g)).toHaveLength(1);
    expect(out).toContain('<a class="m" href="/blog">Blog</a>');
  });
});

describe('banco de imagens da Supporta', () => {
  it('traz fotos do ramo, repetíveis para o mesmo site e aceitas pelas regras', async () => {
    const { fotosDoBanco } = await import('../src/supporta/stock.js');
    const a = fotosDoBanco({ ramo: 'saude' }, 'site-1');
    expect(a.length).toBeGreaterThan(5);
    expect(fotosDoBanco({ ramo: 'saude' }, 'site-1')).toEqual(a);
    expect(a.map((f) => f.url)).not.toEqual(fotosDoBanco({ ramo: 'saude' }, 'site-2').map((f) => f.url));
    expect(fotosDoBanco({ ramo: 'ramo-que-nao-existe' }, 'x').length).toBeGreaterThan(5);
    expect(new Set(a.map((f) => f.url)).size).toBe(a.length);
  });
});

import { paginasAfetadas } from '../src/supporta/cycle.js';

describe('supporta live-site adjustments', () => {
  const paginas = ['/', '/sobre', '/servicos', '/perguntas', '/contato'];
  it('touches only the page named, or the home when none is named', () => {
    expect(paginasAfetadas(['troca o texto da página sobre'], paginas)).toEqual(['/sobre']);
    expect(paginasAfetadas(['muda a foto de fundo'], paginas)).toEqual(['/']);
  });
  it('touches every page for site-wide changes', () => {
    expect(paginasAfetadas(['troca a cor do botão para azul'], paginas)).toEqual(paginas);
    expect(paginasAfetadas(['muda o número do whatsapp'], paginas)).toEqual(paginas);
  });
});
