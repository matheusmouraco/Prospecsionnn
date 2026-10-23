export interface Publicado {
  slug: string;
  html: string;
}

export interface Arquivo {
  file: string;
  data: string;
}

// Static site with every published draft at /<slug>. noindex on every response (rule 5),
// and a blank root page so nobody browses a list of drafts.
export function buildSite(drafts: Publicado[]): Arquivo[] {
  const config = {
    cleanUrls: true,
    trailingSlash: false,
    headers: [{ source: '/(.*)', headers: [
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
    ] }],
  };
  const raiz = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Matilab</title></head><body></body></html>';
  return [
    { file: 'vercel.json', data: JSON.stringify(config, null, 2) },
    { file: 'index.html', data: raiz },
    { file: 'robots.txt', data: 'User-agent: *\nDisallow: /\n' },
    ...drafts.map((d) => ({ file: `${d.slug}/index.html`, data: d.html })),
  ];
}
