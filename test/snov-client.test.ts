import { describe, expect, it } from 'vitest';
import { parseAddResult, SnovAuthError, SnovClient } from '../src/snov/client.js';
import { parseReply } from '../src/snov/replies.js';

type Call = { url: string; method: string; auth?: string; body?: string };

function fakeSnov(handler: (call: Call, n: number) => { status: number; body?: unknown; headers?: Record<string, string> }) {
  const calls: Call[] = [];
  const fetch = async (url: string, init?: RequestInit) => {
    const headers = (init?.headers ?? {}) as Record<string, string>;
    const call = { url, method: init?.method ?? 'GET', auth: headers.Authorization, body: init?.body?.toString() };
    calls.push(call);
    const r = handler(call, calls.length);
    return new Response(r.body === undefined ? null : JSON.stringify(r.body), { status: r.status, headers: r.headers });
  };
  let t = 0;
  const client = new SnovClient({
    clientId: 'id',
    clientSecret: 'secret',
    fetch,
    sleep: async (ms) => {
      t += ms;
    },
    now: () => t,
    minIntervalMs: 0,
  });
  return { client, calls, advance: (ms: number) => (t += ms) };
}

const tokenOk = { status: 200, body: { access_token: 'tok1', token_type: 'Bearer', expires_in: 3600 } };

describe('SnovClient', () => {
  it('authenticates once and reuses the token until it expires', async () => {
    let tokens = 0;
    const { client, calls, advance } = fakeSnov((c) => {
      if (c.url.endsWith('/oauth/access_token')) {
        tokens++;
        return { status: 200, body: { access_token: `tok${tokens}`, expires_in: 3600 } };
      }
      return { status: 200, body: [{ id: 1, name: 'Lista', contacts: 10, isDeleted: false }] };
    });
    await client.getUserLists();
    await client.getUserLists();
    expect(tokens).toBe(1);
    expect(calls[0]?.body).toContain('grant_type=client_credentials');
    expect(calls[1]?.auth).toBe('Bearer tok1');

    advance(3600 * 1000);
    const lists = await client.getUserLists();
    expect(tokens).toBe(2);
    expect(calls.at(-1)?.auth).toBe('Bearer tok2');
    expect(lists).toEqual([{ id: '1', name: 'Lista', contacts: 10, isDeleted: false }]);
  });

  it('refreshes the token once on 401', async () => {
    let tokens = 0;
    let first = true;
    const { client } = fakeSnov((c) => {
      if (c.url.endsWith('/oauth/access_token')) return { status: 200, body: { access_token: `t${++tokens}`, expires_in: 3600 } };
      if (first) {
        first = false;
        return { status: 401 };
      }
      return { status: 200, body: [] };
    });
    await expect(client.getUserLists()).resolves.toEqual([]);
    expect(tokens).toBe(2);
  });

  it('raises SnovAuthError when credentials are rejected', async () => {
    const { client } = fakeSnov(() => ({ status: 400, body: { error: 'invalid_client' } }));
    await expect(client.getUserLists()).rejects.toBeInstanceOf(SnovAuthError);
  });

  it('falls back to GET when prospect-list rejects POST, and paginates until empty', async () => {
    const pages: Record<string, unknown[]> = { '1': [{ id: 1 }, { id: 2 }], '2': [{ id: 3 }], '3': [] };
    const { client, calls } = fakeSnov((c) => {
      if (c.url.endsWith('/oauth/access_token')) return tokenOk;
      if (c.method === 'POST') return { status: 405 };
      const page = new URL(c.url).searchParams.get('page')!;
      expect(new URL(c.url).searchParams.get('listId')).toBe('L9');
      return { status: 200, body: { success: true, prospects: pages[page] } };
    });
    const ids: unknown[] = [];
    for await (const p of client.iterateList('L9', 2)) ids.push(p.id);
    expect(ids).toEqual([1, 2, 3]);
    expect(calls.filter((c) => c.method === 'POST' && c.url.includes('prospect-list'))).toHaveLength(1);
  });

  it('stops when a page repeats (server ignoring page)', async () => {
    const { client } = fakeSnov((c) =>
      c.url.endsWith('/oauth/access_token') ? tokenOk : { status: 200, body: { success: true, prospects: [{ id: 1 }, { id: 2 }] } },
    );
    const ids: unknown[] = [];
    for await (const p of client.iterateList('L', 2)) ids.push(p.id);
    expect(ids).toEqual([1, 2]);
  });

  it('waits and retries on 429', async () => {
    let n = 0;
    const { client } = fakeSnov((c) => {
      if (c.url.endsWith('/oauth/access_token')) return tokenOk;
      return ++n === 1 ? { status: 429, headers: { 'retry-after': '5' } } : { status: 200, body: [] };
    });
    await expect(client.getUserLists()).resolves.toEqual([]);
    expect(n).toBe(2);
  });
});

describe('Snov outreach', () => {
  it('adds a prospect with custom fields to the outreach list', async () => {
    const { client, calls } = fakeSnov((c) => (c.url.endsWith('/oauth/access_token') ? tokenOk : { status: 200, body: { success: true, added: true } }));
    const r = await client.addProspectToList('123', { email: 'bruna@sorriso.com.br', firstName: 'Bruna', customFields: { problema_1: 'Demora 7,2 s', saudacao: 'Oi Bruna' } });
    expect(r).toMatchObject({ ok: true, added: true });
    const call = calls.at(-1)!;
    expect(call.url).toBe('https://api.snov.io/v1/add-prospect-to-list');
    const form = new URLSearchParams(call.body);
    expect(form.get('listId')).toBe('123');
    expect(form.get('customFields[problema_1]')).toBe('Demora 7,2 s');
    expect(form.get('createDuplicates')).toBe('1');
    expect(form.get('updateContact')).toBeNull();
  });

  it('treats an update without addition as failure (prospect not in the list)', async () => {
    const { parseAddResult } = await import('../src/snov/client.js');
    expect(parseAddResult({ success: true, added: false, updated: true }).ok).toBe(false);
    expect(parseAddResult({ success: true, id: 'x', added: true, updated: false }).ok).toBe(true);
  });

  it('sends every do-not-email item as items[]', async () => {
    const { client, calls } = fakeSnov((c) => (c.url.endsWith('/oauth/access_token') ? tokenOk : { status: 200, body: { success: true } }));
    await client.addToDoNotEmailList(['a@x.com', 'y.com']);
    expect(new URLSearchParams(calls.at(-1)!.body).getAll('items[]')).toEqual(['a@x.com', 'y.com']);
  });

  it('reads replies from a wrapped or bare array', async () => {
    const { client, calls } = fakeSnov((c) => (c.url.endsWith('/oauth/access_token') ? tokenOk : { status: 200, body: { data: [{ id: 1 }] } }));
    expect(await client.getEmailReplies('77')).toEqual([{ id: 1 }]);
    expect(calls.at(-1)!.url).toBe('https://api.snov.io/v1/get-emails-replies?campaignId=77');
  });

  it('reads the add result defensively', () => {
    expect(parseAddResult({ success: false }).ok).toBe(false);
    expect(parseAddResult({ success: true, updated: true })).toMatchObject({ ok: false, added: false, updated: true });
  });

  it('parses replies under different field names and strips html', () => {
    expect(parseReply({ id: 9, prospect: { email: 'Bruna@Sorriso.com.br' }, body: '<p>Pode mandar!</p>', date: '2026-10-22 10:00' }))
      .toEqual({ id: '9', email: 'bruna@sorriso.com.br', texto: 'Pode mandar!', recebida_em: '2026-10-22 10:00' });
    expect(parseReply({ from: 'Bruna <bruna@x.com>', text: 'Sair' })?.email).toBe('bruna@x.com');
    expect(parseReply({ id: 1 })).toBeNull();
    expect(parseReply({ id: 5, prospectEmail: 'eu@x.com', emails: [{ body: 'Olá...' }, { body: 'Quero ver o esboço', date: '2026-10-23' }] }))
      .toEqual({ id: '5', email: 'eu@x.com', texto: 'Quero ver o esboço', recebida_em: '2026-10-23' });
  });
});

describe('email from another company', () => {
  it('flags a corporate email whose domain is not the analyzed site', async () => {
    const { outraEmpresa } = await import('../src/snov/outreach-store.js');
    expect(outraEmpresa('gabriel@sani.med.br', 'unb.br')).toBe(true);
    expect(outraEmpresa('thais@radiomed.med.br', 'ilikia.com')).toBe(true);
    expect(outraEmpresa('camila@caliandrasaude.com.br', 'caliandrasaude.com.br')).toBe(false);
    expect(outraEmpresa('ana@gmail.com', 'clinica.com.br')).toBe(false);
    expect(outraEmpresa('ana@mail.clinica.com.br', 'clinica.com.br')).toBe(false);
    expect(outraEmpresa('ana@sorriso.com', 'sorriso.com.br')).toBe(false);
  });
});
