import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type Anthropic from '@anthropic-ai/sdk';
import { devices, type Browser, type BrowserContextOptions } from 'playwright';
import { z } from 'zod';
import { EXTRACT_SCRIPT } from '../analysis/extract-script.js';
import type { DomFacts } from '../analysis/facts.js';
import { parseJson } from '../lib/claude.js';
import { revealPage } from '../lib/page.js';
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
  movimento: z.string(),
});

export type Ficha = z.infer<typeof FichaSchema> & {
  url: string;
  favorito: boolean;
  fontes: string[];
  cores: string[];
  bibliotecas: string[]; // motion libraries detected on the page
};

// Motion is invisible in screenshots, so the libraries and running animations are detected in the page.
const MOTION_SCRIPT = `(() => {
  const srcs = Array.from(document.scripts).map((s) => s.src.toLowerCase()).join(' ');
  const has = (cond) => { try { return !!cond(); } catch { return false; } };
  const libs = [
    ['GSAP', () => window.gsap || /gsap/.test(srcs)],
    ['ScrollTrigger', () => window.ScrollTrigger || /scrolltrigger/.test(srcs)],
    ['Lenis', () => window.Lenis || window.lenis || /lenis/.test(srcs) || document.documentElement.classList.contains('lenis')],
    ['Locomotive Scroll', () => window.LocomotiveScroll || /locomotive/.test(srcs) || document.querySelector('[data-scroll-container]')],
    ['Swiper', () => window.Swiper || /swiper/.test(srcs)],
    ['Three.js', () => window.THREE || /three(\\.min)?\\.js/.test(srcs)],
    ['Lottie', () => window.lottie || /lottie/.test(srcs) || document.querySelector('lottie-player')],
    ['Framer Motion', () => document.querySelector('[data-framer-name], [data-framer-appear-id]')],
    ['Webflow Interactions', () => document.documentElement.getAttribute('data-wf-page') || /webflow/.test(srcs)],
    ['AOS', () => window.AOS || document.querySelector('[data-aos]')],
    ['Splitting / SplitText', () => window.Splitting || window.SplitText || /split/.test(srcs)],
  ].filter(([, test]) => has(test)).map(([name]) => name);
  const css = has(() => document.getAnimations().length) ? document.getAnimations().length : 0;
  return { libs, css };
})()`;

export const PRINTS = { desktop: 'desktop.png', longa: 'longa.png', mobile: 'mobile.png' } as const;
const LONGA_HEIGHT = 3_600;

async function open(browser: Browser, url: string, options: BrowserContextOptions) {
  const context = await browser.newContext({ ...options, locale: 'pt-BR' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.waitForLoadState('load', { timeout: 20_000 }).catch(() => undefined);
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);
  await revealPage(page);
  return { context, page };
}

// Screenshots of one reference site (first screen desktop, long desktop, first screen mobile).
export type FatosReferencia = DomFacts & { movimento: { libs: string[]; css: number } };

export async function captureReferencia(browser: Browser, ref: Referencia, dir = REFERENCIAS_DIR): Promise<FatosReferencia> {
  const out = join(dir, ref.slug);
  await mkdir(out, { recursive: true });

  const desktop = await open(browser, ref.url, { viewport: { width: 1440, height: 900 } });
  let facts: DomFacts & { movimento: { libs: string[]; css: number } };
  try {
    const motion = (await desktop.page.evaluate(MOTION_SCRIPT)) as { libs: string[]; css: number };
    facts = { ...((await desktop.page.evaluate(EXTRACT_SCRIPT)) as DomFacts), movimento: motion };
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
// `facts` is null for a manual print (an image, no live page to measure).
export async function describeReferencia(model: string, ref: Referencia, facts: FatosReferencia | null, dir = REFERENCIAS_DIR): Promise<Ficha> {
  const out = join(dir, ref.slug);
  const fontes = facts ? [facts.marca.fonte_titulo, facts.marca.fonte_corpo].filter((f): f is string => !!f) : [];
  const cores = facts?.marca.cores ?? [];
  const libs = facts?.movimento.libs ?? [];
  const mobile = join(out, PRINTS.mobile);
  const { data } = await parseJson({
    model,
    system: await loadPrompt('referencia-ficha'),
    content: [
      { type: 'text', text: 'Primeira tela no computador:' },
      await image(join(out, PRINTS.desktop)),
      { type: 'text', text: 'Página longa no computador:' },
      await image(join(out, PRINTS.longa)),
      ...(existsSync(mobile) ? [{ type: 'text' as const, text: 'Primeira tela no celular:' }, await image(mobile)] : []),
      {
        type: 'text',
        text: facts
          ? `Site: ${ref.url}\nFontes medidas: ${fontes.join(' / ') || '-'}\nCores mais presentes: ${cores.join(', ') || '-'}\n` +
            `Bibliotecas de animação detectadas: ${libs.join(', ') || 'nenhuma'}; animações CSS rodando na primeira tela: ${facts.movimento.css}`
          : `Print salvo pela agência (${ref.url}), sem site para medir. Fontes, cores e movimento só pelo que a imagem mostra; se não der para saber o movimento, diga "não observável no print".`,
      },
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
    cores,
    bibliotecas: libs,
  };
  await writeFile(join(out, 'ficha.json'), JSON.stringify(ficha, null, 2));
  return ficha;
}

// The mobile print is optional: manual references are a single image.
export function hasPrints(slug: string, dir = REFERENCIAS_DIR): boolean {
  return [PRINTS.desktop, PRINTS.longa].every((f) => existsSync(join(dir, slug, f)));
}

export const MANUAIS_DIR = join(REFERENCIAS_DIR, 'manuais');
const IMAGEM = /\.(png|jpe?g|webp)$/i;

// Images the agency saved by hand (referencias/manuais). Each becomes a reference "manual-<name>".
export async function listManuais(dir = MANUAIS_DIR): Promise<{ ref: Referencia; file: string }[]> {
  if (!existsSync(dir)) return [];
  const files = (await readdir(dir, { recursive: true })).filter((f) => IMAGEM.test(f)).sort();
  return files.map((f) => {
    const name = f.replace(IMAGEM, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return { file: join(dir, f), ref: { url: `print: ${f}`, slug: `manual-${name}`, favorito: false } };
  });
}

// Renders the image at 1440px wide and saves first screen + long crop, as for a live site.
export async function captureManual(browser: Browser, ref: Referencia, file: string, dir = REFERENCIAS_DIR): Promise<void> {
  const out = join(dir, ref.slug);
  await mkdir(out, { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    const ext = file.split('.').pop()!.toLowerCase().replace('jpg', 'jpeg');
    const src = `data:image/${ext};base64,${(await readFile(file)).toString('base64')}`;
    await page.setContent(`<html><body style="margin:0;background:#fff"><img src="${src}" style="display:block;width:1440px"></body></html>`, { waitUntil: 'load' });
    const height = await page.evaluate('document.images[0].getBoundingClientRect().height') as number;
    await page.screenshot({ path: join(out, PRINTS.desktop) });
    await page.screenshot({ path: join(out, PRINTS.longa), fullPage: true, clip: { x: 0, y: 0, width: 1440, height: Math.max(900, Math.min(height, LONGA_HEIGHT)) } });
  } finally {
    await context.close();
  }
}
