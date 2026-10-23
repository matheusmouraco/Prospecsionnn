import { describe, expect, it } from 'vitest';
import { AJUSTES, envDosAjustes, validarNumero } from '../src/control/ajustes.js';
import { ajustarJob, JOBS } from '../src/scheduler/jobs.js';
import { comandoDe } from '../src/telegram/commands.js';

const aj = (c: string) => AJUSTES.find((a) => a.comando === c)!;

describe('telegram settings', () => {
  it('validates numbers against each range', () => {
    expect(validarNumero(aj('limite'), '30')).toBe(30);
    expect(validarNumero(aj('custo'), '72,5')).toBe(72.5);
    expect(validarNumero(aj('limite'), '0')).toMatch(/de 1 a 200/);
    expect(validarNumero(aj('nota'), 'abc')).toMatch(/número/);
  });

  it('turns settings into env for child scripts and forces DRY_RUN when the database fails', async () => {
    expect(await envDosAjustes(async () => ({ MAX_NEW_PER_DAY: '25', DRY_RUN: 'false', AUTO_DESLIGADOS: 'enviar' })))
      .toEqual({ MAX_NEW_PER_DAY: '25', DRY_RUN: 'false' });
    expect(await envDosAjustes(async () => { throw new Error('fetch failed'); })).toEqual({ DRY_RUN: 'true' });
  });

  it('applies batch size and stock to the daily jobs only', () => {
    const a = { AUTO_LOTE: '50', AUTO_FILA_MAX: '100' };
    const analisar = ajustarJob(JOBS.find((j) => j.nome === 'analisar')!, a);
    expect(analisar.args).toEqual(['--limit', '50']);
    expect(analisar.precisaFila?.maximo).toBe(100);
    expect(ajustarJob(JOBS.find((j) => j.nome === 'enviar')!, a).args).toBeUndefined();
  });

  it('maps free-text intents to the same slash commands', () => {
    expect(comandoDe({ acao: 'limite', quantidade: 30 })).toBe('/limite 30');
    expect(comandoDe({ acao: 'auto', valor: 'enviar off' })).toBe('/auto enviar off');
    expect(comandoDe({ acao: 'modo', valor: 'confirmar-real' })).toBe('/modo');
    expect(comandoDe({ acao: 'analisar', dominio: 'x.com.br' })).toBe('/analisar x.com.br');
    expect(comandoDe({ acao: 'analisar', quantidade: 40 })).toBe('/analisar 40');
  });
});
