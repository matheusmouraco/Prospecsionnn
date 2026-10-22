import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { devices, type Browser, type BrowserContextOptions } from 'playwright';
import type { Problema } from '../analysis/checks.js';
import type { Marca } from '../analysis/facts.js';
import { logger } from '../lib/logger.js';
import { computeGains, measureDraft } from './gains.js';
import { buildBrief, generateDraftHtml } from './generate.js';
import { judgeDraft, type Juizo } from './judge.js';
import {
  applyMandatory,
  extractHtml,
  injectComparativo,
  injectJsonLd,
  templateUsado,
  validateDraft,
  type LinhaComparativo,
} from './rules.js';

const log = logger.child({ etapa: 'esboco' });
const MAX_ATTEMPTS = 3;
const LONGA_HEIGHT = 2_700;

export interface EsbocoInput {
  dominio: string;
  empresa: string;
  nicho: string | null;
  marca: Marca;
  problemas: Problema[];
  printOriginal: string | null;
}

export interface EsbocoDeps {
  browser: Browser;
  outDir: string;
  agencia: string;
  whatsapp: string;
  model: string;
  minScore: number;
  generate?: typeof generateDraftHtml;
  judge?: typeof judgeDraft;
}

export interface Esboco {
  dominio: string;
  html: string;
  template: string | null;
  nota: number;
  aprovado: boolean;
  tentativas: number;
  ganhos: LinhaComparativo[];
  juizo: Juizo | null;
  arquivos: { html: string; desktop: string; mobile: string; desktopLonga: string } | null;
  custo_usd: number;
  recusas: string[][]; // rule violations per rejected attempt
}

async function shoot(browser: Browser, html: string, options: BrowserContextOptions, path: string, fullHeight?: number) {
  const context = await browser.newContext(options);
  try {
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: 'load', timeout: 45_000 }).catch(() => undefined);
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);
    await page.waitForTimeout(800);
    if (fullHeight) {
      const height = Math.min(await page.evaluate('document.documentElement.scrollHeight') as number, fullHeight);
      await page.screenshot({ path, fullPage: true, clip: { x: 0, y: 0, width: options.viewport?.width ?? 1440, height } });
    } else {
      await page.screenshot({ path });
    }
  } finally {
    await context.close();
  }
}

// Generate > enforce rules > measure gains > render > judge, up to 3 times. Keeps the best version;
// `aprovado` is false when no version reached the minimum score (Moura is notified instead of sending).
export async function createDraft(input: EsbocoInput, deps: EsbocoDeps): Promise<Esboco> {
  const dir = join(deps.outDir, input.dominio);
  await mkdir(dir, { recursive: true });
  const url = `https://${input.dominio}`;
  const fonteNumeros = [input.empresa, input.dominio, ...input.marca.titulos, ...input.marca.paragrafos, input.marca.telefone ?? '', input.marca.endereco ?? ''].join(' ');

  let best: Esboco | null = null;
  let feedback: string[] = [];
  let custo = 0;
  const recusas: string[][] = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const brief = await buildBrief({ empresa: input.empresa, url, nicho: input.nicho, marca: input.marca, problemas: input.problemas }, feedback);
    const gen = await (deps.generate ?? generateDraftHtml)(deps.model, deps.agencia, brief);
    custo += gen.costUsd;

    const raw = extractHtml(gen.text);
    if (!raw) {
      feedback = ['responda apenas com o documento HTML completo, de <!doctype html> até </html>'];
      recusas.push(feedback);
      continue;
    }
    const html = applyMandatory(raw, { agencia: deps.agencia, empresa: input.empresa, whatsapp: deps.whatsapp });
    const issues = validateDraft(html, { agencia: deps.agencia, empresa: input.empresa, whatsapp: deps.whatsapp, fonteNumeros });
    if (issues.length) {
      log.warn('Esboço recusado pelas regras', { dominio: input.dominio, tentativa: attempt, problemas: issues });
      feedback = issues;
      recusas.push(issues);
      continue;
    }

    const medidas = await measureDraft(deps.browser, html);
    const ganhos = computeGains(input.problemas, medidas);
    const final = injectComparativo(
      injectJsonLd(html, {
        nome: input.empresa,
        url,
        nicho: input.nicho,
        telefone: input.marca.telefone,
        endereco: input.marca.endereco,
        descricao: medidas.desktop.meta_description,
        logo: input.marca.logo_url,
      }),
      ganhos,
    );

    const files = {
      html: join(dir, `tentativa-${attempt}.html`),
      desktop: join(dir, `tentativa-${attempt}-desktop.png`),
      mobile: join(dir, `tentativa-${attempt}-mobile.png`),
      desktopLonga: join(dir, `tentativa-${attempt}-desktop-longa.png`),
    };
    await writeFile(files.html, final);
    const desktopOpts: BrowserContextOptions = { viewport: { width: 1440, height: 900 }, locale: 'pt-BR' };
    await shoot(deps.browser, final, desktopOpts, files.desktop);
    await shoot(deps.browser, final, { ...devices['iPhone 13'], locale: 'pt-BR' }, files.mobile);
    await shoot(deps.browser, final, desktopOpts, files.desktopLonga, LONGA_HEIGHT);

    const juizo = await (deps.judge ?? judgeDraft)({
      model: deps.model,
      original: input.printOriginal,
      desktop: files.desktop,
      mobile: files.mobile,
      desktopLonga: files.desktopLonga,
      checagens: [
        'Faixa de proposta conceitual, noindex, sem formulário e botão de WhatsApp: ok',
        ganhos.length
          ? `Comparativo com ${ganhos.length} ganhos medidos: ${ganhos.map((g) => g.item).join(', ')}`
          : 'Nenhum ganho mensurável no comparativo',
      ],
    });
    custo += juizo.custo_usd;
    log.info('Esboço avaliado', { dominio: input.dominio, tentativa: attempt, nota: juizo.nota, template: templateUsado(final) });

    if (!best || juizo.nota > best.nota) {
      best = {
        dominio: input.dominio, html: final, template: templateUsado(final), nota: juizo.nota,
        aprovado: juizo.nota >= deps.minScore, tentativas: attempt, ganhos, juizo, arquivos: files, custo_usd: 0, recusas,
      };
    }
    if (juizo.nota >= deps.minScore) break;
    feedback = juizo.feedback.length ? juizo.feedback : [`nota ${juizo.nota}: ${juizo.resumo}`];
  }

  if (!best) {
    return { dominio: input.dominio, html: '', template: null, nota: 0, aprovado: false, tentativas: MAX_ATTEMPTS, ganhos: [], juizo: null, arquivos: null, custo_usd: custo, recusas };
  }
  // The best version is the one served.
  await writeFile(join(dir, 'index.html'), best.html);
  await writeFile(join(dir, 'juiz.json'), JSON.stringify({ nota: best.nota, tentativa: best.tentativas, juizo: best.juizo, ganhos: best.ganhos, recusas }, null, 2));
  return { ...best, custo_usd: custo, recusas };
}
