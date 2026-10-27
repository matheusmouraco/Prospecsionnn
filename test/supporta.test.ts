import { describe, expect, it } from 'vitest';
import { linkSupporta, segmentoSupporta } from '../src/flow/supporta.js';

describe('Supporta link', () => {
  it('maps the detected niche to a Supporta template', () => {
    expect(segmentoSupporta('Odontologia estética')).toBe('odontologia');
    expect(segmentoSupporta('Escritório de advocacia trabalhista')).toBe('advocacia');
    expect(segmentoSupporta('Clínica de fisioterapia')).toBe('saude');
    expect(segmentoSupporta('Pizzaria')).toBe('restaurante');
    expect(segmentoSupporta('Arquitetura de interiores')).toBe('arquitetura');
    expect(segmentoSupporta('Contabilidade')).toBe('servicos');
    expect(segmentoSupporta(null)).toBe('servicos');
  });

  it('builds the checkout link with the lead data', () => {
    const url = new URL(linkSupporta('https://www.supporta.com.br', { nicho: 'dentista', dominio: 'cirod.com.br', empresa: 'Cirod & Cia' }));
    expect(url.pathname).toBe('/assinar/start');
    expect(url.searchParams.get('modelo')).toBe('odontologia');
    expect(url.searchParams.get('site')).toBe('cirod.com.br');
    expect(url.searchParams.get('empresa')).toBe('Cirod & Cia');
    expect(url.searchParams.get('origem')).toBe('matilab-esboco');
  });

  it('never passes the 255 characters of a Snov custom field', () => {
    const link = linkSupporta('https://www.supporta.com.br', { nicho: null, dominio: 'exemplo.com.br', empresa: 'Á'.repeat(200) });
    expect(link.length).toBeLessThanOrEqual(255);
    expect(new URL(link).searchParams.get('site')).toBe('exemplo.com.br');
  });
});
