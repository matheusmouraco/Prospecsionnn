import { isIgnoredDomain, normalizeDomain } from './domain.js';
import { parseProspect, type SnovProspect } from './parse.js';
import { roleTier } from './roles.js';

export interface Candidate extends SnovProspect {
  domain: string;
  listId: string;
}

export interface ImportStats {
  lidos: number;
  invalidos: number;          // no id or no usable email
  sem_site: number;
  dominio_ignorado: number;
  email_duplicado_na_lista: number;
  contatos_extras_mesma_empresa: number;
  empresas_unicas_com_site: number;
  ja_no_banco: number;        // email or domain already in prospects/empresas
  bloqueados: number;
  novos: number;
  inseridos: number;
  falhas_insercao: number;
}

export function emptyStats(): ImportStats {
  return {
    lidos: 0, invalidos: 0, sem_site: 0, dominio_ignorado: 0, email_duplicado_na_lista: 0,
    contatos_extras_mesma_empresa: 0, empresas_unicas_com_site: 0, ja_no_banco: 0, bloqueados: 0,
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

    const domain = normalizeDomain(p.website);
    if (!domain) {
      stats.sem_site++;
      continue;
    }
    if (isIgnoredDomain(domain)) {
      stats.dominio_ignorado++;
      continue;
    }

    const candidate: Candidate = { ...p, domain, listId };
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
}

export interface RunImportOptions {
  source: RawSource;
  store: ImportStore;
  listIds: string[];
  write: boolean;
  onInsertError?: (candidate: Candidate, err: unknown) => void;
  isSkip?: (err: unknown) => boolean;
}

// Phase 2 pipeline: read lists > one contact per domain > drop known/blocked > insert as `novo`.
export async function runImport(opts: RunImportOptions): Promise<{ stats: ImportStats; novos: Candidate[] }> {
  const stats = emptyStats();
  const rows: { listId: string; raw: Record<string, unknown> }[] = [];
  for (const listId of opts.listIds) {
    for await (const raw of opts.source.iterateList(listId)) rows.push({ listId, raw });
  }

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
  return { stats, novos };
}
