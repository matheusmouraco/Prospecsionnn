import { describe, expect, it } from 'vitest';
import { parseProspect } from '../src/snov/parse.js';

describe('parseProspect', () => {
  it('reads the documented shape and picks the verified email', () => {
    const p = parseProspect({
      id: 'abc',
      name: 'Ana Souza',
      firstName: 'Ana',
      lastName: 'Souza',
      position: 'CEO',
      companyName: 'Loja da Ana',
      companySite: 'https://www.lojadaana.com.br',
      locality: 'Curitiba',
      emails: [
        { email: 'Contato@lojadaana.com.br', emailStatus: 'unknown' },
        { email: 'ana@lojadaana.com.br', emailStatus: 'valid' },
      ],
    });
    expect(p).toMatchObject({
      snovId: 'abc',
      email: 'ana@lojadaana.com.br',
      emailVerified: true,
      firstName: 'Ana',
      position: 'CEO',
      companyName: 'Loja da Ana',
      website: 'https://www.lojadaana.com.br',
      city: 'Curitiba',
    });
  });

  it('finds the site in nested company, current job or custom fields', () => {
    expect(parseProspect({ id: 1, emails: [{ email: 'a@x.com' }], company: { name: 'X', site: 'x.com' } })?.website).toBe('x.com');
    expect(parseProspect({ id: 1, emails: [{ email: 'a@x.com' }], currentJob: [{ site: 'y.com', position: 'Dono' }] }))
      .toMatchObject({ website: 'y.com', position: 'Dono' });
    expect(parseProspect({ id: 1, emails: ['a@x.com'], customFields: [{ name: 'Company Website', value: 'z.com' }] })?.website).toBe('z.com');
    expect(parseProspect({ id: 1, emails: ['a@x.com'], 'customField_Company Website': 'w.com' })?.website).toBe('w.com');
  });

  it('splits full name when first name is missing', () => {
    expect(parseProspect({ id: 1, name: 'João da Silva', emails: ['j@x.com'] })).toMatchObject({
      firstName: 'João',
      lastName: 'da Silva',
    });
  });

  it('skips invalid emails and returns null without a usable one', () => {
    expect(parseProspect({ id: 1, emails: [{ email: 'a@x.com', emailStatus: 'not valid' }] })).toBeNull();
    expect(parseProspect({ id: 1, emails: [] })).toBeNull();
    expect(parseProspect({ emails: ['a@x.com'] })).toBeNull();
  });
});
