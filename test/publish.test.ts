import { describe, expect, it } from 'vitest';
import { buildSite } from '../src/publish/site.js';
import { deploy } from '../src/publish/vercel.js';

describe('publish', () => {
  it('builds a noindex static site with one folder per draft', () => {
    const files = buildSite([{ slug: 'dentelli-a1b2', html: '<html>x</html>' }]);
    expect(files.map((f) => f.file)).toEqual(['vercel.json', 'index.html', 'robots.txt', 'dentelli-a1b2/index.html']);
    expect(files[0]!.data).toContain('X-Robots-Tag');
    expect(files[2]!.data).toContain('Disallow: /');
  });

  it('uploads by sha and deploys to production only when asked', async () => {
    const calls: { url: string; body: string }[] = [];
    const fetchFn = (async (url: string, init: RequestInit) => {
      calls.push({ url, body: typeof init.body === 'string' ? init.body : '' });
      return new Response(url.includes('/deployments') ? JSON.stringify({ url: 'matilab-analise-x.vercel.app' }) : '{}', { status: 200 });
    }) as unknown as typeof fetch;
    const url = await deploy({ token: 't', teamId: 'team_1', project: 'matilab-analise', fetchFn }, buildSite([]), false);
    expect(url).toBe('https://matilab-analise-x.vercel.app');
    expect(calls.filter((c) => c.url.includes('/v2/files'))).toHaveLength(3);
    const dep = JSON.parse(calls.at(-1)!.body);
    expect(dep.target).toBeUndefined();
    expect(dep.files[0]).toMatchObject({ file: 'vercel.json' });
    expect(calls.every((c) => c.url.includes('teamId=team_1'))).toBe(true);
  });
});
