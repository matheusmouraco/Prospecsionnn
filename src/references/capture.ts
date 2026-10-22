import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import { devices, type Browser, type BrowserContextOptions } from 'playwright';
import { z } from 'zod';
import { EXTRACT_SCRIPT } from '../analysis/extract-script.js';
import type { DomFacts } from '../analysis/facts.js';
import { parseJson } from '../lib/claude.js';
import { loadPrompt } from '../lib/prompts.js';
import { REFERENCIAS_DIR, type Referencia } from './list.js';

export const FichaSchema = z.object({
  segmentos: z.array(z.string()),
  estilo: z.string(),
  tipografia: z.string(),
  paleta: z.string(),
  padroes: z.array(z.string()),
  destaques: z.array(z.string()),
  nivel: z.number(),
});

export type Ficha = z.infer<typeof FichaSchema> & { url: string; favorito: boolean; fontes: string[]; cores: string[] };

export const PRINTS = { desktop: 'desktop.png', longa: 'longa.png', mobile: 'mobile.png' } as const;
const LONGA_HEIGHT = 3_600;

async function open(browser: Browser, url: string, options: BrowserContextOptions) {
  const context = await browser.newContext({ ...options, locale: 'pt-BR' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.waitForLoadState('load', { timeout: 20_000 }).catch(() => undefined);
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);
  // Scroll once so lazy images and scroll animations render before the long screenshot.
  await page.evaluate('(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); })()');
  await page.waitForTimeout(1_500);
  return { context, page };
}

// Screenshots of one reference site (first screen desktop, long desktop, first screen mobile).
export async function captureReferencia(browser: Browser, ref: Referencia, dir = REFERENCIAS_DIR): Promise<DomFacts> {
  const out = join(dir, ref.slug);
  await mkdir(out, { recursive: true });

  const desktop = await open(browser, ref.url, { viewport: { width: 1440, height: 900 } });
  let facts: DomFacts;
  try {
    facts = (await desktop.page.evaluate(EXTRACT_SCRIPT)) as DomFacts;
    await desktop.page.screenshot({ path: join(out, PRINTS.desktop) });
    const height = Math.min(facts.altura_pagina, LONGA_HEIGHT);
    await desktop.page.screenshot({ path: join(out, PRINTS.longa), fullPage: true, clip: { x: 0, y: 0, width: 1440, height } });
  } finally {
    await desktop.context.close();
  }

  const mobile = await open(browser, ref.url, devices['iPhone 13']);
  try {
    await mobile.page.screenshot({ path: join(out, PRINTS.mobile) });
  } finally {
    await mobile.context.close();
  }
  return facts;
}

async function image(path: string): Promise<Anthropic.ImageBlockParam> {
  return { type: 'image', source: { type: 'base64', media_type: 'image/png', data: (await readFile(path)).toString('base64') } };
}

// Design notes written by MODEL_FAST from the screenshots; saved as ficha.json next to them.
export async function describeReferencia(model: string, ref: Referencia, facts: DomFacts, dir = REFERENCIAS_DIR): Promise<Ficha> {
  const out = join(dir, ref.slug);
  const fontes = [facts.marca.fonte_titulo, facts.marca.fonte_corpo].filter((f): f is string => !!f);
  const { data } = await parseJson({
    model,
    system: await loadPrompt('referencia-ficha'),
    content: [
      { type: 'text', text: 'Primeira tela no computador:' },
      await image(join(out, PRINTS.desktop)),
      { type: 'text', text: 'Página longa no computador:' },
      await image(join(out, PRINTS.longa)),
      { type: 'text', text: 'Primeira tela no celular:' },
      await image(join(out, PRINTS.mobile)),
      { type: 'text', text: `Site: ${ref.url}\nFontes medidas: ${fontes.join(' / ') || '-'}\nCores mais presentes: ${facts.marca.cores.join(', ') || '-'}` },
    ],
    schema: FichaSchema,
    effort: 'medium',
    maxTokens: 6000,
  });
  const ficha: Ficha = {
    ...data,
    segmentos: data.segmentos.map((s) => s.toLowerCase().trim()),
    nivel: Math.min(100, Math.max(0, Math.round(data.nivel))),
    url: ref.url,
    favorito: ref.favorito,
    fontes,
    cores: facts.marca.cores,
  };
  await writeFile(join(out, 'ficha.json'), JSON.stringify(ficha, null, 2));
  return ficha;
}

export function hasPrints(slug: string, dir = REFERENCIAS_DIR): boolean {
  return Object.values(PRINTS).every((f) => existsSync(join(dir, slug, f)));
}
