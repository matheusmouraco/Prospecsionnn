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

describe('telegram adjust', () => {
  it('maps a free-text adjustment to /ajustar with the requests', () => {
    expect(comandoDe({ acao: 'ajustar', dominio: 'dentelli.com.br', valor: 'troca a cor do botão; tira a foto do topo' }))
      .toBe('/ajustar dentelli.com.br troca a cor do botão; tira a foto do topo');
  });
});

describe('full status', () => {
  it('shows queue, emails, replies, drafts, cost and settings', async () => {
    const { renderStatusCompleto } = await import('../src/telegram/dados.js');
    const t = renderStatusCompleto({
      status: { novo: 312, email_pronto: 225, descartado_site_bom: 41, erro: 12, enviado_snov: 0 },
      empresas: 590, lidosSnov: 600, emailsEscritos: 225, emailsEnviados: 0, bloqueados: 3,
      esbocos: { total: 5, publicados: 5, aprovados: 5 }, respostas: {}, custo: { hoje: 1.2, semana: 15.17, total: 30 }, enviadosTotal: 0,
    }, { modoReal: false, pausado: false, motivo: '', limite: 20, estoque: 60, teto: 50, desligados: [] }, new Date('2026-10-26T13:00:00Z'));
    expect(t).toContain('Esperando análise: 312');
    expect(t).toContain('Prontos para enviar: 225 (dá para 11 dias com 20 por dia)');
    expect(t).toContain('Gerados: 5 · No ar: 5');
    expect(t).toContain('7 dias: US$15.17');
    expect(t).toContain('🧪 teste');
    expect(t.length).toBeLessThan(4000);
  });
});
