import { describe, expect, it } from 'vitest';
import { dueJobs, momento } from '../src/scheduler/jobs.js';

describe('scheduler', () => {
  it('runs each cycle at its São Paulo time', () => {
    const nomes = (dia: number, hora: number, minuto: number) => dueJobs({ dia, hora, minuto }).map((j) => j.nome);
    expect(nomes(1, 7, 0)).toEqual(['importar']);
    expect(nomes(1, 8, 15)).toEqual(['enviar', 'esbocos']);
    expect(nomes(6, 8, 15)).toEqual(['esbocos']);       // Saturday: no sending
    expect(nomes(0, 19, 0)).toEqual(['resumo']);         // Sunday: summary only
    expect(nomes(2, 10, 25)).toEqual(['travas']);
    expect(nomes(3, 21, 5)).toEqual([]);                 // replies only from 8h to 20h
  });

  it('reads the clock in São Paulo', () => {
    expect(momento(new Date('2026-10-23T10:00:00Z'))).toEqual({ dia: 5, hora: 7, minuto: 0 });
  });
});
