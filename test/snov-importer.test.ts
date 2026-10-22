import { describe, expect, it } from 'vitest';
import { runImport, type Candidate, type ImportStore } from '../src/snov/importer.js';

function memoryStore(seed: { domains?: string[]; emails?: string[]; blockedEmails?: string[]; blockedDomains?: string[] } = {}) {
  const inserted: Candidate[] = [];
  const has = (list: string[] = []) => async (xs: string[]) => new Set(xs.filter((x) => list.includes(x)));
  const store: ImportStore = {
    existingDomains: has(seed.domains),
    existingEmails: has(seed.emails),
    blockedEmails: has(seed.blockedEmails),
    blockedDomains: has(seed.blockedDomains),
    insert: async (c) => {
      inserted.push(c);
    },
  };
  return { store, inserted };
}

const source = (lists: Record<string, Record<string, unknown>[]>) => ({
  async *iterateList(id: string) {
    yield* lists[id] ?? [];
  },
});

const p = (id: number, email: string, site: string | null, position?: string) => ({
  id, email, companySite: site, position, firstName: 'X',
});

describe('runImport', () => {
  it('keeps one contact per domain, preferring decision makers', async () => {
    const { store, inserted } = memoryStore();
    const { stats } = await runImport({
      source: source({
        L1: [
          p(1, 'vendas@loja.com.br', 'loja.com.br', 'Vendedor'),
          p(2, 'dono@loja.com.br', 'https://www.loja.com.br/', 'Sócio'),
          p(3, 'mkt@loja.com.br', 'loja.com.br', 'Marketing'),
          p(4, 'a@b.com.br', 'b.com.br'),
        ],
      }),
      store,
      listIds: ['L1'],
      write: true,
    });
    expect(inserted.map((c) => c.email).sort()).toEqual(['a@b.com.br', 'dono@loja.com.br']);
    expect(stats).toMatchObject({ lidos: 4, contatos_extras_mesma_empresa: 2, empresas_unicas_com_site: 2, inseridos: 2 });
  });

  it('drops no-site, ignored domains, cross-list duplicates, known and blocked', async () => {
    const { store, inserted } = memoryStore({
      domains: ['ja.com.br'],
      emails: ['velho@outro.com.br'],
      blockedEmails: ['saiu@b1.com.br'],
      blockedDomains: ['bloq.com.br', 'emailbloq.com'],
    });
    const { stats } = await runImport({
      source: source({
        L1: [
          p(1, 'a@gmail.com', null),
          p(2, 'b@hotmail.com', 'instagram.com/loja'),
          p(3, 'c@ja.com.br', 'ja.com.br'),
          p(4, 'velho@outro.com.br', 'outro.com.br'),
          p(5, 'saiu@b1.com.br', 'b1.com.br'),
          p(6, 'x@bloq.com.br', 'bloq.com.br'),
          p(7, 'y@emailbloq.com', 'site-bom.com.br'),
          p(8, 'ok@novo.com.br', 'novo.com.br'),
        ],
        L2: [p(9, 'ok@novo.com.br', 'novo.com.br')],
      }),
      store,
      listIds: ['L1', 'L2'],
      write: true,
    });
    expect(inserted.map((c) => c.domain)).toEqual(['novo.com.br']);
    expect(inserted[0]?.listId).toBe('L1');
    expect(stats).toMatchObject({
      lidos: 9, sem_site: 1, dominio_ignorado: 1, email_duplicado_na_lista: 1,
      ja_no_banco: 2, bloqueados: 3, novos: 1, inseridos: 1,
    });
  });

  it('falls back to the corporate email domain when there is no usable website', async () => {
    const { store, inserted } = memoryStore();
    const { stats } = await runImport({
      source: source({
        L: [
          p(1, 'dra@clinicasorriso.com.br', null),
          p(2, 'joao@odontojoao.com.br', 'instagram.com/odontojoao'),
          p(3, 'ana@gmail.com', null),
          p(4, 'expansao@oralcentter.com.br', 'https://franqueado.oralcentter.com.br'),
        ],
      }),
      store, listIds: ['L'], write: true,
    });
    expect(inserted.map((c) => [c.domain, c.domainSource])).toEqual([
      ['clinicasorriso.com.br', 'email'],
      ['odontojoao.com.br', 'email'],
    ]);
    expect(stats).toMatchObject({ site_pelo_email: 2, sem_site: 1, dominio_ignorado: 1 });
  });

  it('fetches details for rows without website or position and keeps list emails', async () => {
    const { store, inserted } = memoryStore();
    const calls: string[] = [];
    const src = {
      ...source({ L: [{ id: 'x1', firstName: 'Ana', emails: [{ email: 'ana@gmail.com' }] }] }),
      async getProspectById(id: string) {
        calls.push(id);
        return { id, emails: [], social: [{ companyName: 'Clínica Ana', position: 'Proprietária', site: 'https://clinicaana.com.br' }] };
      },
    };
    const { stats } = await runImport({ source: src, store, listIds: ['L'], write: true });
    expect(calls).toEqual(['x1']);
    expect(stats.enriquecidos).toBe(1);
    expect(inserted[0]).toMatchObject({
      email: 'ana@gmail.com', domain: 'clinicaana.com.br', domainSource: 'site',
      companyName: 'Clínica Ana', position: 'Proprietária',
    });
  });

  it('writes nothing in preview mode and counts lost races as known', async () => {
    const { store, inserted } = memoryStore();
    const preview = await runImport({ source: source({ L: [p(1, 'a@a.com.br', 'a.com.br')] }), store, listIds: ['L'], write: false });
    expect(preview.stats.novos).toBe(1);
    expect(inserted).toHaveLength(0);

    class Skip extends Error {}
    store.insert = async () => {
      throw new Skip();
    };
    const raced = await runImport({
      source: source({ L: [p(1, 'a@a.com.br', 'a.com.br')] }), store, listIds: ['L'], write: true,
      isSkip: (e) => e instanceof Skip,
    });
    expect(raced.stats).toMatchObject({ inseridos: 0, ja_no_banco: 1, falhas_insercao: 0 });
  });
});

describe('runImport across many lists', () => {
  it('stops at the cap, then the next run continues from where it stopped and moves to the next list', async () => {
    const vistos = new Set<string>();
    const seen = { seen: async (ids: string[]) => new Set(ids.filter((i) => vistos.has(i))), markSeen: async (ids: string[]) => { ids.forEach((i) => vistos.add(i)); } };
    const lists = {
      Dentistas: [p(1, 'a@a1.com.br', 'a1.com.br'), p(2, 'b@b1.com.br', 'b1.com.br'), p(3, 'c@c1.com.br', 'c1.com.br')],
      Arquitetos: [p(4, 'd@d1.com.br', 'd1.com.br')],
    };
    const run = async () => {
      const { store, inserted } = memoryStore();
      const { stats } = await runImport({ source: source(lists), store, seen, maxNew: 2, listIds: ['Dentistas', 'Arquitetos'], write: true });
      return { emails: inserted.map((c) => c.email), stats };
    };
    expect((await run()).emails).toEqual(['a@a1.com.br', 'b@b1.com.br']);
    const second = await run();
    expect(second.emails).toEqual(['c@c1.com.br', 'd@d1.com.br']);
    expect(second.stats.ja_lidos).toBe(2);
    expect((await run()).emails).toEqual([]);
  });
});
