import type { Page } from 'playwright';

// Scrolls through the whole page and back so scroll-triggered animations, lazy images and
// sticky sections reach their final state before measuring or taking screenshots.
export async function revealPage(page: Page): Promise<void> {
  await page.evaluate(`(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 140));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
  })()`);
  await page.waitForTimeout(1_200);
}
