import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium, devices, type Browser, type BrowserContextOptions, type Page } from 'playwright';
import { normalizeDomain } from '../snov/domain.js';
import { EXTRACT_SCRIPT } from './extract-script.js';
import type { Acesso, Captura, DomFacts, Prints } from './facts.js';

const NAV_TIMEOUT_MS = 45_000;
const SETTLE_MS = 2_500;
// Very long pages are cut so screenshots stay usable (and under image size limits).
const MAX_FULL_HEIGHT = 8_000;
// Shorter cut sent to Claude: images are downscaled to ~1568px on the long edge, so a
// 1440x2700 crop stays legible where the full page would not.
const RESUMO_HEIGHT = 2_700;

const DESKTOP: BrowserContextOptions = { viewport: { width: 1440, height: 900 }, locale: 'pt-BR' };
const MOBILE: BrowserContextOptions = { ...devices['iPhone 13'], locale: 'pt-BR' }; // 390x844

export async function launchBrowser(): Promise<Browser> {
  return chromium.launch({ headless: true });
}

// Same site if the final host equals the domain or is a subdomain of it (or vice versa).
export function isSameSite(domain: string, finalUrl: string): boolean {
  const host = normalizeDomain(finalUrl);
  if (!host) return false;
  return host === domain || host.endsWith(`.${domain}`) || domain.endsWith(`.${host}`);
}

function isSslError(message: string): boolean {
  return /ERR_CERT|SSL|ERR_SSL|certificate/i.test(message);
}

// Waits for the DOM, then gives the full load a bounded extra time: some sites have a resource
// that never finishes, and the page is already usable (seen on orthopride.com.br).
async function open(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
  await page.waitForLoadState('load', { timeout: 20_000 }).catch(() => undefined);
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(SETTLE_MS);
}

// Tries https first. An SSL failure on https is itself a finding, then http is tried
// so the rest of the analysis can still run.
async function resolveAccess(browser: Browser, domain: string): Promise<{ acesso: Acesso; url: string | null }> {
  const context = await browser.newContext({ ...DESKTOP, ignoreHTTPSErrors: false });
  try {
    let httpsError: string;
    try {
      const page = await context.newPage();
      await open(page, `https://${domain}`);
      const finalUrl = page.url();
      const status = isSameSite(domain, finalUrl) ? 'ok' : 'redireciona_terceiro';
      return { acesso: { status, https: finalUrl.startsWith('https://'), url_final: finalUrl }, url: finalUrl };
    } catch (err) {
      httpsError = (err instanceof Error ? err.message : String(err)).split('\n')[0]!;
    }
    // Fresh page: the failed one may still be loading Chrome's error page.
    try {
      const page = await context.newPage();
      await open(page, `http://${domain}`);
      const finalUrl = page.url();
      if (isSslError(httpsError)) {
        return { acesso: { status: 'erro_ssl', detalhe: httpsError, url_final: finalUrl }, url: finalUrl };
      }
      const status = isSameSite(domain, finalUrl) ? 'ok' : 'redireciona_terceiro';
      return { acesso: { status, https: finalUrl.startsWith('https://'), url_final: finalUrl }, url: finalUrl };
    } catch (err) {
      const httpError = (err instanceof Error ? err.message : String(err)).split('\n')[0]!;
      return { acesso: { status: 'fora_do_ar', detalhe: isSslError(httpsError) ? httpsError : httpError }, url: null };
    }
  } finally {
    await context.close();
  }
}

// Some sites keep a web font request hanging forever and Playwright waits for fonts before every
// screenshot (tommasi.com.br, 29/10/2026). On that timeout, block font downloads, reload and try again:
// the print loses the custom font but the analysis goes on.
async function semFontes(page: Page, url: string): Promise<void> {
  await page.route('**/*', (r) => (r.request().resourceType() === 'font' ? r.abort() : r.continue()));
  await open(page, url);
}

async function screenshot(page: Page, url: string, opts: Parameters<Page['screenshot']>[0]): Promise<void> {
  try {
    await page.screenshot({ ...opts, timeout: 20_000 });
  } catch (err) {
    if (!(err instanceof Error) || err.name !== 'TimeoutError') throw err;
    await semFontes(page, url);
    await page.screenshot({ ...opts, timeout: 30_000 });
  }
}

async function shoot(
  browser: Browser,
  url: string,
  options: BrowserContextOptions,
  dir: string,
  prefix: 'desktop' | 'mobile',
): Promise<{ facts: DomFacts; dobra: string; inteira: string; resumo: string }> {
  const context = await browser.newContext({ ...options, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  try {
    await open(page, url);
    // Facts are read at the top of the page, before scrolling for the full screenshot.
    const facts = (await page.evaluate(EXTRACT_SCRIPT)) as DomFacts;
    const dobra = join(dir, `${prefix}-dobra.png`);
    const inteira = join(dir, `${prefix}-inteira.png`);
    await screenshot(page, url, { path: dobra });
    const height = Math.min(facts.altura_pagina, MAX_FULL_HEIGHT);
    const width = options.viewport?.width ?? 1440;
    await screenshot(page, url, { path: inteira, fullPage: true, clip: { x: 0, y: 0, width, height } });
    const resumo = join(dir, `${prefix}-resumo.png`);
    await screenshot(page, url, { path: resumo, fullPage: true, clip: { x: 0, y: 0, width, height: Math.min(height, RESUMO_HEIGHT) } });
    return { facts, dobra, inteira, resumo };
  } finally {
    await context.close();
  }
}

// Opens the site on desktop and mobile, saves 4 screenshots under outDir and extracts facts.
export async function captureSite(browser: Browser, domain: string, outDir: string): Promise<Captura> {
  const { acesso, url } = await resolveAccess(browser, domain);
  if (!url) return { acesso, desktop: null, mobile: null, prints: null };

  await mkdir(outDir, { recursive: true });
  const desktop = await shoot(browser, url, DESKTOP, outDir, 'desktop');
  const mobile = await shoot(browser, url, MOBILE, outDir, 'mobile');
  const prints: Prints = {
    desktop_dobra: desktop.dobra,
    desktop_inteira: desktop.inteira,
    mobile_dobra: mobile.dobra,
    mobile_inteira: mobile.inteira,
    desktop_resumo: desktop.resumo,
  };
  return { acesso, desktop: desktop.facts, mobile: mobile.facts, prints };
}
