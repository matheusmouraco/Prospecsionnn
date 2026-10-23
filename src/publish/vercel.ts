import { createHash } from 'node:crypto';
import type { Arquivo } from './site.js';

const API = 'https://api.vercel.com';

export interface VercelOpts {
  token: string;
  teamId: string;
  project: string;
  fetchFn?: typeof fetch;
}

async function call<T>(o: VercelOpts, path: string, init: RequestInit): Promise<{ status: number; body: T }> {
  const sep = path.includes('?') ? '&' : '?';
  const res = await (o.fetchFn ?? fetch)(`${API}${path}${sep}teamId=${o.teamId}`, {
    ...init,
    headers: { authorization: `Bearer ${o.token}`, ...(init.headers ?? {}) },
  });
  const text = await res.text();
  return { status: res.status, body: (text ? JSON.parse(text) : {}) as T };
}

// Uploads each file (POST /v2/files, by sha1) and creates one deployment that references them.
// target 'production' goes to the project domains; anything else is a preview.
export async function deploy(o: VercelOpts, files: Arquivo[], production: boolean): Promise<string> {
  const refs = [];
  for (const f of files) {
    const buf = Buffer.from(f.data, 'utf8');
    const sha = createHash('sha1').update(buf).digest('hex');
    const up = await call(o, '/v2/files', {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream', 'x-vercel-digest': sha, 'content-length': String(buf.length) },
      body: buf,
    });
    if (up.status >= 300) throw new Error(`Vercel recusou o arquivo ${f.file}: ${JSON.stringify(up.body).slice(0, 300)}`);
    refs.push({ file: f.file, sha, size: buf.length });
  }
  const dep = await call<{ url?: string; error?: { message: string } }>(o, '/v13/deployments?skipAutoDetectionConfirmation=1', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: o.project,
      project: o.project,
      files: refs,
      ...(production ? { target: 'production' } : {}),
      projectSettings: { framework: null, buildCommand: null, outputDirectory: null, installCommand: null },
    }),
  });
  if (dep.status >= 300 || !dep.body.url) throw new Error(`Vercel recusou o deploy: ${dep.body.error?.message ?? dep.status}`);
  return `https://${dep.body.url}`;
}

// Links the domain to the project once; "already in use by this project" counts as done.
export async function ensureDomain(o: VercelOpts, domain: string): Promise<{ ok: boolean; detalhe: string }> {
  const r = await call<{ verified?: boolean; error?: { code?: string; message?: string } }>(o, `/v10/projects/${o.project}/domains`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: domain }),
  });
  if (r.status < 300) return { ok: true, detalhe: r.body.verified === false ? 'domínio adicionado, aguardando verificação' : 'domínio adicionado' };
  if (r.body.error?.code === 'domain_already_in_use' || /already/i.test(r.body.error?.message ?? '')) return { ok: true, detalhe: 'domínio já estava no projeto' };
  return { ok: false, detalhe: r.body.error?.message ?? String(r.status) };
}
