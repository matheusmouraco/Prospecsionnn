import { isFranchiseDomain, isIgnoredDomain, normalizeDomain } from './domain.js';
import { parseProspect, type SnovProspect } from './parse.js';
import { roleTier } from './roles.js';

export interface Candidate extends SnovProspect {
  domain: string;
  // 'site': from the company website field; 'email': no website, taken from a corporate email domain.
  domainSource: 'site' | 'email';
  listId: string;
}

export interface ImportStats {
  lidos: number;
  invalidos: number;          // no id or no usable email
  enriquecidos: number;       // details fetched with get-prospect-by-id
  sem_site: number;
  site_pelo_email: number;    // no website in Snov, domain taken from the corporate email
  dominio_ignorado: number;
  email_duplicado_na_lista: number;
  contatos_extras_mesma_empresa: number;
  empresas_unicas_com_site: number;
  ja_no_banco: number;        // email or domain already in prospects/empresas
  ja_lidos: number;           // Snov id processed in an earlier run
  listas_lidas: number;
  bloqueados: number;
  novos: number;
  inseridos: number;
  falhas_insercao: number;
}

export function emptyStats(): ImportStats {
  return {
    lidos: 0, invalidos: 0, enriquecidos: 0, sem_site: 0, site_pelo_email: 0, dominio_ignorado: 0, email_duplicado_na_lista: 0,
    contatos_extras_mesma_empresa: 0, empresas_unicas_com_site: 0, ja_no_banco: 0, ja_lidos: 0, listas_lidas: 0, bloqueados: 0,
    novos: 0, inseridos: 0, falhas_insercao: 0,
  };
}

// Better contact first: role tier, then a verified email, then having a first name.
function compareCandidates(a: Candidate, b: Candidate): number {
  return (
    roleTier(a.position) - roleTier(b.position) ||
    Number(b.emailVerified === true) - Number(a.emailVerified === true) ||
    Number(!!b.firstName) - Number(!!a.firstName)
  );
}

// Turns raw Snov prospects into one candidate per domain.
export function selectCandidates(
  rows: { listId: string; raw: Record<string, unknown> }[],
  stats: ImportStats = emptyStats(),
): Candidate[] {
  const byDomain = new Map<string, Candidate>();
  const seenEmails = new Set<string>();

  for (const { listId, raw } of rows) {
    stats.lidos++;
    const p = parseProspect(raw);
    if (!p) {
      stats.invalidos++;
      continue;
    }
    if (seenEmails.has(p.email)) {
      stats.email_duplicado_na_lista++;
      continue;
    }
    seenEmails.add(p.email);

    const siteDomain = normalizeDomain(p.website);
    const emailDomain = normalizeDomain(p.email.split('@')[1]);
    let domain: string;
    let domainSource: Candidate['domainSource'];
    if (siteDomain && !isIgnoredDomain(siteDomain)) {
      domain = siteDomain;
      domainSource = 'site';
    } else if (emailDomain && !isIgnoredDomain(emailDomain) && !(siteDomain && isFranchiseDomain(siteDomain))) {
      // A franchise-sales page means a franchise network: skip it instead of falling back to the email.
      domain = emailDomain;
      domainSource = 'email';
      stats.site_pelo_email++;
    } else {
      // Website pointed to a social/marketplace page vs. no website at all (email was generic too).
      if (siteDomain) stats.dominio_ignorado++;
      else stats.sem_site++;
      continue;
    }

    const candidate: Candidate = { ...p, domain, domainSource, listId };
    const current = byDomain.get(domain);
    if (!current) {
      byDomain.set(domain, candidate);
    } else {
      stats.contatos_extras_mesma_empresa++;
      if (compareCandidates(candidate, current) < 0) byDomain.set(domain, candidate);
    }
  }

  stats.empresas_unicas_com_site = byDomain.size;
  return [...byDomain.values()];
}

// What the importer needs from the database. Implemented over Supabase in store.ts.
export interface ImportStore {
  existingDomains(domains: string[]): Promise<Set<string>>;   // empresas already registered
  existingEmails(emails: string[]): Promise<Set<string>>;     // prospects already registered
  blockedEmails(emails: string[]): Promise<Set<string>>;
  blockedDomains(domains: string[]): Promise<Set<string>>;
  insert(candidate: Candidate): Promise<void>;
}

// Drops candidates already known or blocked (rules 2 and 3).
export async function filterNew(store: ImportStore, candidates: Candidate[], stats: ImportStats): Promise<Candidate[]> {
  const domains = candidates.map((c) => c.domain);
  const emails = candidates.map((c) => c.email);
  const emailDomains = [...new Set(emails.map((e) => e.split('@')[1]!).filter(Boolean))];

  const [knownDomains, knownEmails, blockedE, blockedD] = await Promise.all([
    store.existingDomains(domains),
    store.existingEmails(emails),
    store.blockedEmails(emails),
    store.blockedDomains([...new Set([...domains, ...emailDomains])]),
  ]);

  const fresh: Candidate[] = [];
  for (const c of candidates) {
    const emailDomain = c.email.split('@')[1] ?? '';
    if (blockedE.has(c.email) || blockedD.has(c.domain) || blockedD.has(emailDomain)) {
      stats.bloqueados++;
    } else if (knownDomains.has(c.domain) || knownEmails.has(c.email)) {
      stats.ja_no_banco++;
    } else {
      fresh.push(c);
    }
  }
  stats.novos = fresh.length;
  return fresh;
}

export interface RawSource {
  iterateList(listId: string): AsyncIterable<Record<string, unknown>>;
  // Optional detail lookup; list rows lack company, position and website.
  getProspectById?(id: string): Promise<Record<string, unknown> | null>;
}

// Snov ids already processed in an earlier run (imported or discarded), so big lists are read once
// and a run with a cap continues where the last one stopped.
export interface SeenStore {
  seen(ids: string[]): Promise<Set<string>>;
  markSeen(ids: string[]): Promise<void>;
}

export interface RunImportOptions {
  source: RawSource;
  store: ImportStore;
  listIds: string[];
  write: boolean;
  seen?: SeenStore;
  maxNew?: number; // stop after this many unseen prospects (each costs ~1 s of Snov lookups)
  onInsertError?: (candidate: Candidate, err: unknown) => void;
  isSkip?: (err: unknown) => boolean;
  onEnrichError?: (snovId: string, err: unknown) => void;
}

// Phase 2 pipeline: read lists > one contact per domain > drop known/blocked > insert as `novo`.
export async function runImport(opts: RunImportOptions): Promise<{ stats: ImportStats; novos: Candidate[] }> {
  const stats = emptyStats();
  const rows: { listId: string; raw: Record<string, unknown> }[] = [];
  const max = opts.maxNew ?? Infinity;
  lists: for (const listId of opts.listIds) {
    let page: Record<string, unknown>[] = [];
    const flush = async () => {
      const ids = page.map((r) => parseProspect(r)?.snovId).filter((id): id is string => !!id);
      const known = opts.seen && ids.length ? await opts.seen.seen(ids) : new Set<string>();
      for (const raw of page) {
        const id = parseProspect(raw)?.snovId;
        if (id && known.has(id)) {
          stats.ja_lidos++;
          continue;
        }
        if (rows.length >= max) return false;
        rows.push({ listId, raw: await enrich(opts, raw, stats) });
      }
      page = [];
      return true;
    };
    for await (const raw of opts.source.iterateList(listId)) {
      page.push(raw);
      if (page.length >= 200 && !(await flush())) break lists;
    }
    if (!(await flush())) break;
  }
  stats.listas_lidas = opts.listIds.length;

  const candidates = selectCandidates(rows, stats);
  const novos = await filterNew(opts.store, candidates, stats);

  if (opts.write) {
    for (const c of novos) {
      try {
        await opts.store.insert(c);
        stats.inseridos++;
      } catch (err) {
        if (opts.isSkip?.(err)) {
          stats.ja_no_banco++;
        } else {
          stats.falhas_insercao++;
          opts.onInsertError?.(c, err);
        }
      }
    }
  }
  if (opts.write && opts.seen) {
    const ids = rows.map((r) => parseProspect(r.raw)?.snovId).filter((id): id is string => !!id);
    if (ids.length) await opts.seen.markSeen(ids);
  }
  return { stats, novos };
}

// Merges the full record into a list row when the row lacks website or position.
async function enrich(opts: RunImportOptions, raw: Record<string, unknown>, stats: ImportStats) {
  const parsed = parseProspect(raw);
  if (!opts.source.getProspectById || !parsed || (parsed.website && parsed.position)) return raw;
  try {
    const detail = await opts.source.getProspectById(parsed.snovId);
    if (!detail) return raw;
    stats.enriquecidos++;
    // List fields win for id and emails; detail fills everything else.
    return { ...detail, ...raw, emails: raw.emails ?? detail.emails };
  } catch (err) {
    opts.onEnrichError?.(parsed.snovId, err);
    return raw;
  }
}
