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

describe('telegram confirmation', () => {
  it('maps the site action with the company name', () => {
    expect(comandoDe({ acao: 'site', dominio: 'x.com.br', valor: 'Clínica X' })).toBe('/site x.com.br Clínica X');
  });

  it('keeps pending commands until the button is used once', async () => {
    const { pedirConfirmacao, tirarPendente } = await import('../src/telegram/commands.js');
    const r = pedirConfirmacao('Vai pausar', '/pausar viagem');
    expect(r.texto).toContain('Confirma?');
    const id = r.botoes![0]!.dados.split(' ')[1];
    expect(tirarPendente(id)).toBe('/pausar viagem');
    expect(tirarPendente(id)).toBeNull();
  });
});

describe('telegram reports', () => {
  it('renders the week with reply rates per niche', async () => {
    const { renderSemana } = await import('../src/telegram/dados.js');
    const t = renderSemana({ de: '2026-10-19', ate: '2026-10-25', enviados: 75, respostas: 6, positivas: 3, descadastros: 1, bounces: 0, esbocos: 3, custo: 12.5,
      nichos: [{ nicho: 'odontologia', enviados: 40, positivas: 3 }] });
    expect(t).toContain('19/10 a 25/10');
    expect(t).toContain('Respostas: 6 (8,0% dos enviados)');
    expect(t).toContain('odontologia: 3 de 40 (7,5%)');
  });

  it('turns buttons with url into link buttons', async () => {
    const { teclado } = await import('../src/telegram/client.js');
    expect(teclado([[{ texto: 'Esboço', dados: '', url: 'https://x' }, { texto: 'Ok', dados: '/rev_ok' }]]))
      .toEqual([[{ text: 'Esboço', url: 'https://x' }, { text: 'Ok', callback_data: '/rev_ok' }]]);
  });
});
