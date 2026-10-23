import { describe, expect, it } from 'vitest';
import { METRICAS_ZERO, motivosParaPausar, renderResumo } from '../src/monitor/locks.js';
import { formatLead } from '../src/telegram/notify.js';

describe('safety locks', () => {
  it('pauses on bounce, unsubscribes and cost, but not on tiny samples', () => {
    expect(motivosParaPausar({ ...METRICAS_ZERO, enviados: 5, bounces: 1 }, 10)).toEqual([]);
    const m = motivosParaPausar({ ...METRICAS_ZERO, enviados: 40, bounces: 2, descadastros: 1, custo_api_usd: 12 }, 10).join('\n');
    expect(m).toContain('bounce de 5.0%');
    expect(m).toContain('descadastros em 2.5%');
    expect(m).toContain('US$12.00');
    expect(motivosParaPausar({ ...METRICAS_ZERO, enviados: 40, bounces: 1 }, 10)).toEqual([]);
  });

  it('renders the daily summary and the lead alert', () => {
    const r = renderResumo('2026-10-23', { ...METRICAS_ZERO, enviados: 45 }, { leads: 2, erros: 0, pausado: true, motivo: 'bounce' });
    expect(r).toContain('23/10/2026');
    expect(r).toContain('Enviados: 45');
    expect(r).toContain('PAUSADO: bounce');
    const l = formatLead({ nome: 'Bruna', empresa: 'Dentelli', dominio: 'dentelli.com.br', email: 'b@d.com', categoria: 'interesse', resumo: 'quer preço', texto: 'Quanto custa?' });
    expect(l).toContain('Site: https://dentelli.com.br');
    expect(l).toContain('"Quanto custa?"');
    expect(l).not.toContain('Esboço:');
  });
});
