import { readFileSync } from 'node:fs';
import { mkdtemp, stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, type Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { analyzeSite } from '../src/analysis/analyze.js';
import { isSameSite } from '../src/analysis/browser.js';
import type { PageSpeedResult } from '../src/analysis/pagespeed.js';
import type { VisionResult } from '../src/analysis/vision.js';

const html = readFileSync(new URL('./fixtures/site-ruim.html', import.meta.url), 'utf8');
let server: Server;
let browser: Browser;

beforeAll(async () => {
  server = createServer((req, res) => {
    if (req.url === '/' || req.url?.startsWith('/?')) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html);
    } else {
      res.writeHead(404).end();
    }
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address() as AddressInfo;
  // Fake domain -> local server (plain http). The https attempt fails, either as a TLS error or,
  // behind an intercepting proxy, as a tunnel error; both are valid outcomes below.
  browser = await chromium.launch({ args: [`--host-resolver-rules=MAP clinicasorriso.test 127.0.0.1:${port}`] });
}, 30_000);

afterAll(async () => {
  await browser?.close();
  server?.close();
});

describe('isSameSite', () => {
  it('accepts the domain and its subdomains only', () => {
    expect(isSameSite('loja.com.br', 'https://www.loja.com.br/x')).toBe(true);
    expect(isSameSite('loja.com.br', 'https://blog.loja.com.br')).toBe(true);
    expect(isSameSite('loja.com.br', 'https://hostgator.com.br/')).toBe(false);
  });
});

describe('analyzeSite with a real browser', () => {
  it('captures prints, extracts facts and brand, and merges measured + visual problems', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'analise-'));
    const psiCalls: string[] = [];
    const pagespeed = async (url: string, strategy: 'mobile' | 'desktop'): Promise<PageSpeedResult> => {
      psiCalls.push(`${strategy} ${url}`);
      return { strategy, performance: 28, seo: 62, acessibilidade: 70, boas_praticas: 80, lcp_ms: strategy === 'mobile' ? 6800 : 2100, fcp_ms: 1500, cls: 0.02, tbt_ms: 300, speed_index_ms: 4000, erro: null };
    };
    let visionInput: unknown;
    const vision = async (input: unknown): Promise<VisionResult> => {
      visionInput = input;
      return {
        nota_site: 41,
        problemas: [{ tipo: 'design', descricao_curta: 'Visual antigo', evidencia: 'No print do computador, faixa amarela sem conteúdo no topo', gravidade: 3, origem: 'visual' }],
        nicho_detectado: 'clínica odontológica',
        resumo: 'Site simples e datado.',
        custo_usd: 0.012,
      };
    };

    const a = await analyzeSite(
      { dominio: 'clinicasorriso.test', empresa: 'Clínica Sorriso', lista: '40679415' },
      { browser, pagespeedKey: 'k', outDir, pagespeed, vision },
    );

    expect(['erro_ssl', 'ok'], JSON.stringify(a.acesso)).toContain(a.acesso.status);
    expect(psiCalls).toHaveLength(2);
    for (const f of Object.values(a.prints!)) expect((await stat(f)).size).toBeGreaterThan(1000);

    expect(a.marca).toMatchObject({ telefone: '(41) 3333-4444' });
    expect(a.marca!.logo_url).toMatch(/^data:image\/png/);
    expect(a.marca!.endereco).toMatch(/^Rua das Flores, 123/);
    expect(a.marca!.variaveis_css).toMatchObject({ '--cor-primaria': '#0a5c8a', '--cor-destaque': '#f2a900' });
    expect(a.marca!.cores.length).toBeGreaterThan(0);
    expect(a.marca!.fonte_corpo).toContain('Georgia');

    const textos = a.problemas.map((p) => p.descricao_curta);
    expect(textos).toEqual(expect.arrayContaining([
      'Demora 6,8 segundos para mostrar o conteúdo principal no celular',
      'O site não foi feito para celular',
      'O site passa a impressão de abandonado',
      'O Google não tem um resumo do site para mostrar nas buscas',
      'O botão de contato não aparece na primeira tela do celular',
      'Visual antigo',
    ]));
    expect(a.problemas.find((p) => p.tipo === 'design' && p.origem === 'medido')?.evidencia).toBe('O rodapé mostra © 2019');
    // Without a viewport tag mobile lays out at 980px, so the 900px strip fits: no overflow claim.
    expect(textos).not.toContain('No celular a página fica mais larga que a tela');
    expect(textos.some((t) => t === 'O navegador mostra alerta de site não seguro' || t === 'O site não tem cadeado de segurança')).toBe(true);
    expect(a.nota_site).toBe(41);
    expect(a.nicho_detectado).toBe('clínica odontológica');
    expect((visionInput as { medidos: unknown[] }).medidos.length).toBeGreaterThan(5);
  }, 90_000);

  it('reports an unreachable site without calling PageSpeed or Claude', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'analise-'));
    const fail = async () => { throw new Error('não deveria ser chamado'); };
    const a = await analyzeSite(
      { dominio: 'naoexiste.invalid', empresa: null, lista: null },
      { browser, pagespeedKey: 'k', outDir, pagespeed: fail, vision: fail },
    );
    expect(a.acesso.status).toBe('fora_do_ar');
    expect(a.nota_site).toBe(0);
    expect(a.problemas[0]?.descricao_curta).toBe('O site não abre');
  }, 90_000);
});
