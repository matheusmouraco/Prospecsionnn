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
          p(1, 'a@semsite.com', null),
          p(2, 'b@x.com', 'instagram.com/loja'),
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
