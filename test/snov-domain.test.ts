import { describe, expect, it } from 'vitest';
import { isIgnoredDomain, normalizeDomain } from '../src/snov/domain.js';
import { roleTier } from '../src/snov/roles.js';

describe('normalizeDomain', () => {
  it.each([
    ['https://www.Loja.com.br/contato?x=1', 'loja.com.br'],
    ['loja.com.br', 'loja.com.br'],
    ['WWW.LOJA.COM.BR', 'loja.com.br'],
    ['http://loja.com.br:8080/', 'loja.com.br'],
    ['www2.loja.com.br', 'loja.com.br'],
    ['  blog.loja.com.br/  ', 'blog.loja.com.br'],
    ['https://padaria.wixsite.com/site', 'padaria.wixsite.com'],
  ])('%s -> %s', (input, expected) => {
    expect(normalizeDomain(input)).toBe(expected);
  });

  it.each(['', null, undefined, 'localhost', 'semponto', 'http://192.168.0.1', 'http://'])('rejects %s', (input) => {
    expect(normalizeDomain(input)).toBeNull();
  });
});

describe('isIgnoredDomain', () => {
  it('ignores social, marketplaces, generic email and subdomains of them', () => {
    for (const d of ['instagram.com', 'm.facebook.com', 'linktr.ee', 'wa.me', 'gmail.com', 'sites.google.com',
      'produto.mercadolivre.com.br', 'loja.business.site', 'franqueado.oralcentter.com.br',
      'franquia.qualiteodontologia.com.br', 'sejafranqueado.marca.com.br', 'seja-franqueado.marca.com.br']) {
      expect(isIgnoredDomain(d), d).toBe(true);
    }
  });

  it('keeps real company domains', () => {
    for (const d of ['loja.com.br', 'padaria.wixsite.com', 'notinstagram.com', 'gmail.com.br.loja.net',
      'odontocompany.com', 'franquiasdobrasil.com.br']) {
      expect(isIgnoredDomain(d), d).toBe(false);
    }
  });
});

describe('roleTier', () => {
  it.each([
    ['Sócio-fundador', 0],
    ['CEO', 0],
    ['Diretor Comercial', 0],
    ['Proprietária', 0],
    ['Gerente de Marketing', 1],
    ['Analista de mkt', 1],
    ['Executivo Comercial', 2],
    ['Sales Manager', 2],
    ['Recepcionista', 3],
    ['Associate', 3],
    [null, 3],
  ])('%s -> %i', (cargo, tier) => {
    expect(roleTier(cargo)).toBe(tier);
  });
});
