// Snov.io API client.
//
// Endpoints confirmed against the snov.io/api reference and knowledge base (Oct 2026):
// - POST https://api.snov.io/v1/oauth/access_token  grant_type=client_credentials, client_id, client_secret
//   -> { access_token, token_type, expires_in } (1 hour)
// - GET  https://api.snov.io/v1/get-user-lists
// - https://api.snov.io/v1/prospect-list  listId (required), page, perPage (max 5000). Free, no credits.
//   The reference says POST and the knowledge base says GET, so we try POST and fall back to GET on 405.
//   Verified on a real list (Oct 2026): each prospect only has id, name, firstName, lastName, emails, source.
// - https://api.snov.io/v1/get-prospect-by-id  id. Full record with company/site (shape confirmed via snov:inspect).
// - Rate limit: 60 requests per minute across all endpoints.
// Field names inside each prospect are not fully documented; see parseProspect() and `npm run snov:inspect`.
import { logger } from '../lib/logger.js';

const BASE_URL = 'https://api.snov.io';
const MIN_INTERVAL_MS = 1000; // 60 req/min
const TOKEN_SAFETY_MS = 60_000;
const MAX_RETRIES = 3;

export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export interface SnovClientOptions {
  clientId: string;
  clientSecret: string;
  fetch?: FetchLike;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  minIntervalMs?: number;
}

export class SnovAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SnovAuthError';
  }
}

export class SnovApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'SnovApiError';
  }
}

export interface SnovList {
  id: string;
  name: string;
  contacts: number | null;
  isDeleted: boolean;
}

export interface ProspectPage {
  prospects: Record<string, unknown>[];
}

const log = logger.child({ etapa: 'snov' });

export class SnovClient {
  private token: { value: string; expiresAt: number } | undefined;
  private lastRequestAt = 0;
  private prospectListMethod: 'POST' | 'GET' = 'POST';
  private prospectByIdMethod: 'POST' | 'GET' = 'POST';
  private readonly fetch: FetchLike;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly now: () => number;
  private readonly minIntervalMs: number;

  constructor(private readonly opts: SnovClientOptions) {
    this.fetch = opts.fetch ?? ((url, init) => fetch(url, init));
    this.sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
    this.now = opts.now ?? Date.now;
    this.minIntervalMs = opts.minIntervalMs ?? MIN_INTERVAL_MS;
  }

  async getUserLists(): Promise<SnovList[]> {
    const data = await this.request('GET', '/v1/get-user-lists');
    const rows = Array.isArray(data) ? data : [];
    return rows.map((r: Record<string, unknown>) => ({
      id: String(r.id),
      name: String(r.name ?? ''),
      contacts: typeof r.contacts === 'number' ? r.contacts : null,
      isDeleted: r.isDeleted === true,
    }));
  }

  // Full prospect record (company, position, site). prospect-list only returns id, name and emails.
  // Endpoint per snov.io/api: /v1/get-prospect-by-id with `id`. Response shape not fully documented;
  // returns the `data` object when wrapped, otherwise the body itself. Null when not found.
  async getProspectById(id: string): Promise<Record<string, unknown> | null> {
    let data: unknown;
    try {
      data = await this.request(this.prospectByIdMethod, '/v1/get-prospect-by-id', { id });
    } catch (err) {
      if (err instanceof SnovApiError && err.status === 405 && this.prospectByIdMethod === 'POST') {
        this.prospectByIdMethod = 'GET';
        data = await this.request('GET', '/v1/get-prospect-by-id', { id });
      } else if (err instanceof SnovApiError && err.status === 404) {
        return null;
      } else {
        throw err;
      }
    }
    const body = (data ?? {}) as Record<string, unknown>;
    if (body.success === false) return null;
    const inner = body.data;
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) return inner as Record<string, unknown>;
    return body;
  }

  async getProspectsPage(listId: string, page: number, perPage: number): Promise<ProspectPage> {
    const params = { listId, page: String(page), perPage: String(perPage) };
    let data: unknown;
    try {
      data = await this.request(this.prospectListMethod, '/v1/prospect-list', params);
    } catch (err) {
      if (err instanceof SnovApiError && err.status === 405 && this.prospectListMethod === 'POST') {
        log.warn('prospect-list recusou POST, usando GET');
        this.prospectListMethod = 'GET';
        data = await this.request('GET', '/v1/prospect-list', params);
      } else {
        throw err;
      }
    }
    const body = (data ?? {}) as Record<string, unknown>;
    if (body.success === false) {
      throw new SnovApiError(`prospect-list retornou success=false para a lista ${listId}`, 200);
    }
    const prospects = Array.isArray(body.prospects) ? (body.prospects as Record<string, unknown>[]) : [];
    return { prospects };
  }

  // Yields every raw prospect of a list, page by page. Stops on an empty page or on a page
  // with nothing new, so a server-side perPage cap or an ignored `page` cannot loop forever.
  async *iterateList(listId: string, perPage = 500, maxPages = 1000): AsyncGenerator<Record<string, unknown>> {
    const seen = new Set<string>();
    for (let page = 1; page <= maxPages; page++) {
      const { prospects } = await this.getProspectsPage(listId, page, perPage);
      let fresh = 0;
      for (const p of prospects) {
        const id = p.id === undefined ? undefined : String(p.id);
        if (id !== undefined) {
          if (seen.has(id)) continue;
          seen.add(id);
        }
        fresh++;
        yield p;
      }
      if (prospects.length === 0 || fresh === 0) return;
    }
    log.warn('Lista atingiu o limite de páginas', { lista: listId, paginas: maxPages });
  }

  private async getToken(force = false): Promise<string> {
    if (!force && this.token && this.token.expiresAt > this.now()) return this.token.value;

    await this.throttle();
    const res = await this.fetch(`${BASE_URL}/v1/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.opts.clientId,
        client_secret: this.opts.clientSecret,
      }),
    });
    const body = (await safeJson(res)) as { access_token?: string; expires_in?: number } | null;
    if (!res.ok || !body?.access_token) {
      throw new SnovAuthError(`Falha na autenticação do Snov (HTTP ${res.status})`);
    }
    const ttlMs = (body.expires_in ?? 3600) * 1000;
    this.token = { value: body.access_token, expiresAt: this.now() + ttlMs - TOKEN_SAFETY_MS };
    return this.token.value;
  }

  private async request(method: 'GET' | 'POST', path: string, params: Record<string, string> = {}): Promise<unknown> {
    let refreshed = false;
    for (let attempt = 0; ; attempt++) {
      const token = await this.getToken();
      await this.throttle();

      const qs = new URLSearchParams(params).toString();
      const url = method === 'GET' && qs ? `${BASE_URL}${path}?${qs}` : `${BASE_URL}${path}`;
      const res = await this.fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
        },
        ...(method === 'POST' ? { body: new URLSearchParams(params) } : {}),
      });

      if (res.status === 401 && !refreshed) {
        refreshed = true;
        await this.getToken(true);
        continue;
      }
      if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
        const retryAfter = Number(res.headers.get('retry-after'));
        const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2000 * 2 ** attempt;
        log.warn('Snov pediu para esperar', { caminho: path, status: res.status, espera_ms: waitMs });
        await this.sleep(waitMs);
        continue;
      }
      if (res.status === 401) throw new SnovAuthError(`Snov recusou o token em ${path}`);
      if (!res.ok) throw new SnovApiError(`Snov respondeu HTTP ${res.status} em ${method} ${path}`, res.status);
      return safeJson(res);
    }
  }

  private async throttle(): Promise<void> {
    const wait = this.lastRequestAt + this.minIntervalMs - this.now();
    if (wait > 0) await this.sleep(wait);
    this.lastRequestAt = this.now();
  }
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
