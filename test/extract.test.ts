import { chromium, type Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { EXTRACT_SCRIPT } from '../src/analysis/extract-script.js';
import type { DomFacts } from '../src/analysis/facts.js';

let browser: Browser;
beforeAll(async () => { browser = await chromium.launch(); }, 30_000);
afterAll(async () => { await browser?.close(); });

async function extract(html: string): Promise<DomFacts> {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.setContent(html);
  const facts = (await page.evaluate(EXTRACT_SCRIPT)) as DomFacts;
  await page.close();
  return facts;
}

describe('brand extraction', () => {
  it('finds an inline SVG logo in the header and background photos', async () => {
    const f = await extract(`<html><body>
      <header><a href="/" class="brand"><svg viewBox="0 0 120 40" width="120" height="40"><rect width="120" height="40" fill="#402080"/></svg></a></header>
      <section style="width:1200px;height:600px;background-image:url('https://cdn.exemplo.com/fachada.jpg')"></section>
      <img data-src="https://cdn.exemplo.com/equipe.jpg" style="width:400px;height:300px">
    </body></html>`);
    expect(f.marca.logo_url).toMatch(/^data:image\/svg\+xml/);
    expect(decodeURIComponent(f.marca.logo_url!)).toContain('#402080');
    expect(f.marca.fotos).toEqual(expect.arrayContaining(['https://cdn.exemplo.com/fachada.jpg', 'https://cdn.exemplo.com/equipe.jpg']));
  });

  it('uses a CSS background logo or the first header image', async () => {
    const bg = await extract(`<html><body><header><div class="site-logo" style="width:150px;height:50px;background:url(https://cdn.exemplo.com/logo.png)"></div></header></body></html>`);
    expect(bg.marca.logo_url).toBe('https://cdn.exemplo.com/logo.png');
    const img = await extract(`<html><body><header><img src="https://cdn.exemplo.com/marca-final.png" style="width:160px;height:48px"></header></body></html>`);
    expect(img.marca.logo_url).toBe('https://cdn.exemplo.com/marca-final.png');
  });
});
