import { describe, expect, it } from 'vitest';
import { SnovAuthError, SnovClient } from '../src/snov/client.js';

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
