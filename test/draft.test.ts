import { readFileSync } from 'node:fs';
import { mkdtemp, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, type Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Problema } from '../src/analysis/checks.js';
import type { Marca } from '../src/analysis/facts.js';
import { computeGains, measureDraft } from '../src/draft/gains.js';
import { createDraft } from '../src/draft/pipeline.js';
import {
  applyMandatory, COMPARATIVO_MARKER, extractHtml, faixaTexto, injectComparativo, injectJsonLd, injectSelo, validateDraft,
} from '../src/draft/rules.js';
import { makeSlug } from '../src/draft/store.js';

const WHATS = 'https://wa.me/5541999999999';
// Hand-written pages used as stand-ins for the model's output.
const template = (name: string) => readFileSync(new URL(`./fixtures/esbocos/${name}.html`, import.meta.url), 'utf8');
// What a well-behaved model would return: the template with every placeholder filled.
const filled = (name: string, extra = '') =>
  template(name)
    .replace(/\[URL[^\]]*\]/g, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
    .replace(/\[Telefone real\]/g, '(41) 3333-4444')
    .replace(/\[Endereço real\]/g, 'Rua das Flores, 123, Curitiba')
    .replace(/\[[^\]]+\]/g, 'Clínica Sorriso')
    .replace('</main>', `${extra}</main>`);

const check = { agencia: 'Matilab', empresa: 'Clínica Sorriso', whatsapp: WHATS, fonteNumeros: 'Telefone (41) 3333-4444. Rua das Flores, 123' };

describe('draft rules', () => {
  it('well-formed pages pass the rules', () => {
    for (const t of ['saude', 'profissional', 'negocios']) {
      const html = applyMandatory(filled(t), check);
      expect(validateDraft(html, check), t).toEqual([]);
      expect(html).toContain(faixaTexto('Matilab', 'Clínica Sorriso'));
      expect(html).not.toContain('%%WHATSAPP%%');
    }
  });

  it('keeps animation scripts, drops unknown external scripts, restores noindex and the banner text', () => {
    const raw = filled('saude')
      .replace('<meta name="robots" content="noindex, nofollow">', '')
      .replace('</body>', `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://evil.example.com/tracker.js"></script>
<script>document.documentElement.classList.add('js'); gsap.from('h1', { y: 40, opacity: 0 });</script></body>`)
      .replace(/(data-secao="faixa">)[^<]*/, '$1Texto errado');
    const html = applyMandatory(raw, check);
    expect(html).toMatch(/noindex/);
    expect(html).toContain('gsap/3.12.5/gsap.min.js');
    expect(html).toContain("gsap.from('h1'");
    expect(html).not.toContain('evil.example.com');
    expect(validateDraft(html, check)).toEqual([]);
    expect(html).toContain('Proposta conceitual criada pela Matilab para Clínica Sorriso. Este não é o site oficial.');
  });

  it('rejects scripts that send or store data', () => {
    const html = applyMandatory(filled('saude').replace('</body>', "<script>fetch('https://x.com', { method: 'POST' }); localStorage.setItem('a', 1)</script></body>"), check);
    expect(validateDraft(html, check).join()).toContain('o JavaScript da página só pode animar; remova "fetch("');
  });

  it('rejects forms, invented numbers, leftovers, dashes and missing pieces', () => {
    const html = applyMandatory(
      filled('saude', '<section><p>Mais de 500 pacientes atendidos — desde 1998. [Depoimento real]</p><form><input></form></section>')
        .replace(COMPARATIVO_MARKER, ''),
      check,
    );
    const issues = validateDraft(html, check).join('\n');
    expect(issues).toContain('não pode ter <form>');
    expect(issues).toContain('campos de formulário');
    expect(issues).toContain('números que não existem no site original: 500, 1998');
    expect(issues).toContain('sobraram textos de exemplo');
    expect(issues).toContain('travessão');
    expect(issues).toContain('COMPARATIVO');
  });

  it('extracts the html from a fenced answer and builds slugs', () => {
    expect(extractHtml('Aqui está:\n```html\n<!doctype html><html><body>x</body></html>\n```')).toBe('<!doctype html><html><body>x</body></html>');
    expect(extractHtml('sem html')).toBeNull();
    expect(makeSlug('Clínica Odontológica São José!', () => 'k3f9')).toBe('clinica-odontologica-sao-jose-k3f9');
  });

  it('injects schema.org data and the comparison table', () => {
    const html = injectComparativo(
      injectJsonLd(filled('saude'), { nome: 'Clínica Sorriso', url: 'https://sorriso.com.br', nicho: 'clínica odontológica', telefone: '(41) 3333-4444', endereco: null, descricao: null, logo: null }),
      [{ item: 'Contato no celular', atual: 'Sem botão', proposta: 'Botão visível' }, { item: 'Perguntas frequentes', atual: 'Sem FAQ', proposta: 'Com FAQ' }],
    );
    expect(html).toContain('"@type":"Dentist"');
    expect(html).toContain('<h3>Contato no celular</h3>');
    expect(html).not.toContain(COMPARATIVO_MARKER);
  });

  it('leaves the comparison out with a single gain and adds the seal at the end', () => {
    const one = injectComparativo(filled('saude'), [{ item: 'Leitura no celular', atual: 'a', proposta: 'b' }]);
    expect(one).not.toContain('data-secao="comparativo"');
    expect(one).not.toContain(COMPARATIVO_MARKER);
    const html = injectSelo(one, 'data:image/webp;base64,AA', 'Matilab');
    expect(html).toMatch(/data-secao="selo"[\s\S]*<\/body>/);
    expect(html).toContain('alt="Selo de qualidade Matilab"');
  });

  it('rejects struck-through copy', () => {
    const html = applyMandatory(filled('saude').replace('</h1>', ' <s>frio</s></h1>'), check);
    expect(validateDraft(html, check).join()).toContain('riscado');
  });

});

const P = (descricao_curta: string, gravidade: number, origem: Problema['origem'] = 'medido'): Problema =>
  ({ tipo: 'ia', descricao_curta, evidencia: 'medido', gravidade, origem });

let browser: Browser;
beforeAll(async () => { browser = await chromium.launch(); }, 30_000);
afterAll(async () => { await browser?.close(); });

describe('measured gains on a real render', () => {
  it('only lists problems from the original that the draft really fixes, most severe first', async () => {
    const html = injectJsonLd(applyMandatory(filled('saude'), check), {
      nome: 'Clínica Sorriso', url: 'https://sorriso.com.br', nicho: 'clínica odontológica', telefone: null, endereco: null, descricao: null, logo: null,
    });
    const medidas = await measureDraft(browser, html);
    expect(medidas.mobile.contato_visivel_na_dobra).toBe(true);
    expect(medidas.desktop.tem_faq).toBe(true);
    const ganhos = computeGains(
      [
        P('O site não responde as dúvidas que os clientes perguntam para a IA', 2),
        P('O botão de contato não aparece na primeira tela do celular', 2),
        P('Google e IAs não recebem de forma organizada o que a empresa faz, onde fica e como contatar', 3),
        P('Demora 7,2 segundos para mostrar o conteúdo principal no celular', 5), // not measurable locally
        P('Visual antigo', 5, 'visual'), // visual problems never enter the measured table
        P('O site não foi feito para celular', 5),
      ],
      medidas,
    );
    expect(ganhos.map((g) => g.item)).toEqual(['Celular', 'Leitura por Google e IAs', 'Perguntas frequentes']);
  }, 60_000);
});

describe('createDraft', () => {
  const marca: Marca = {
    logo_url: null, cores: ['#0a5c8a'], variaveis_css: {}, fonte_titulo: null, fonte_corpo: null,
    titulos: ['Clínica Sorriso'], paragrafos: ['Implantes e ortodontia em Curitiba.'], telefone: '(41) 3333-4444', endereco: 'Rua das Flores, 123, Curitiba', fotos: [],
  };
  const input = {
    dominio: 'sorriso.com.br', empresa: 'Clínica Sorriso', nicho: 'clínica odontológica', marca, printOriginal: null, referencias: [],
    problemas: [P('O botão de contato não aparece na primeira tela do celular', 2), P('O site não responde as dúvidas que os clientes perguntam para a IA', 2)],
  };

  it('regenerates only after a rule violation; a low score never triggers a new design', async () => {
    const answers = [
      filled('saude', '<p>Mais de 500 pacientes</p>'), // invented number: rejected by rules
      filled('profissional'),                           // judged 60: kept, not regenerated
      filled('negocios'),                               // never requested
    ];
    const briefs: string[] = [];
    const generate = async (_m: string, _a: string, brief: string) => {
      briefs.push(brief);
      return { text: '```html\n' + answers[briefs.length - 1] + '\n```', costUsd: 0.5, model: 'claude-opus-5-5' };
    };
    const notas = [60, 88];
    let j = 0;
    const judge = async () => {
      const nota = notas[j++]!;
      return { nivel_referencia: nota, originalidade: nota, fidelidade_marca: nota, legibilidade_celular: nota, conteudo: nota, nota, feedback: nota < 80 ? ['hero apertado no celular'] : [], resumo: 'ok', custo_usd: 0.05 };
    };
    const outDir = await mkdtemp(join(tmpdir(), 'esboco-'));
    const e = await createDraft(input, { browser, outDir, agencia: 'Matilab', whatsapp: WHATS, model: 'claude-opus-5-5', minScore: 80, generate, judge });

    expect(e).toMatchObject({ aprovado: false, nota: 60, tentativas: 2 });
    expect(briefs).toHaveLength(2);
    expect(e.custo_usd).toBeCloseTo(1.05);
    expect(e.recusas[0]!.join()).toContain('500');
    expect(briefs[1]).toContain('500');                     // rule feedback sent back
    expect(e.ganhos.map((g) => g.item)).toEqual(['Contato no celular', 'Perguntas frequentes']);

    const saved = await readFile(join(outDir, 'sorriso.com.br', 'index.html'), 'utf8');
    expect(saved).toContain('<!-- template: profissional'); // the third answer was kept
    expect(saved).toContain('data-secao="comparativo"');
    expect(saved).toContain('application/ld+json');
    expect(saved).toContain('data-secao="selo"');
    expect(saved).toContain(`href="${WHATS}"`);
    expect((await stat(e.arquivos!.mobile)).size).toBeGreaterThan(5000);
  }, 120_000);
});

describe('draft adjustment', () => {
  it('strips code-injected parts so they can be re-injected after the edit', async () => {
    const { stripInjected } = await import('../src/draft/adjust.js');
    const page = injectSelo(
      injectComparativo(
        injectJsonLd(applyMandatory(filled('saude'), check), { nome: 'X', url: 'https://x.com', nicho: null, telefone: null, endereco: null, descricao: null, logo: null }),
        [{ item: 'A', atual: 'a', proposta: 'b' }, { item: 'B', atual: 'c', proposta: 'd' }],
      ),
      'data:image/webp;base64,AA', 'Matilab',
    );
    const base = stripInjected(page, WHATS);
    expect(base).toContain(COMPARATIVO_MARKER);
    expect(base).not.toContain('data-secao="selo"');
    expect(base).not.toContain('application/ld+json');
    expect(base).toContain('href="%%WHATSAPP%%"');
    expect(validateDraft(applyMandatory(base, check), check)).toEqual([]);
  });
});
