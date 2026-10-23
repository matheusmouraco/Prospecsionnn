export interface Metricas {
  enviados: number;
  bounces: number;
  respostas: number;
  positivas: number;
  descadastros: number;
  esbocos_gerados: number;
  custo_api_usd: number;
}

export const METRICAS_ZERO: Metricas = { enviados: 0, bounces: 0, respostas: 0, positivas: 0, descadastros: 0, esbocos_gerados: 0, custo_api_usd: 0 };

// Below this many sends a single bounce would already be "3%", so rates only count from here.
export const MIN_ENVIOS_PARA_TAXA = 10;

// Safety locks (rule 6). Returns the reasons to pause, in Portuguese; empty means all fine.
export function motivosParaPausar(m: Metricas, limiteCustoUsd: number): string[] {
  const out: string[] = [];
  if (m.enviados >= MIN_ENVIOS_PARA_TAXA) {
    const bounce = m.bounces / m.enviados;
    if (bounce > 0.03) out.push(`bounce de ${(bounce * 100).toFixed(1)}% (limite 3%)`);
    const desc = m.descadastros / m.enviados;
    if (desc > 0.01) out.push(`descadastros em ${(desc * 100).toFixed(1)}% dos enviados (limite 1%)`);
  }
  if (m.custo_api_usd > limiteCustoUsd) out.push(`custo de API de US$${m.custo_api_usd.toFixed(2)} hoje (limite US$${limiteCustoUsd.toFixed(2)})`);
  return out;
}

export function renderResumo(dia: string, m: Metricas, extra: { leads: number; erros: number; pausado: boolean; motivo: string }): string {
  return [
    `📊 Resumo do dia ${dia.split('-').reverse().join('/')}`,
    '',
    `Enviados: ${m.enviados}`,
    `Respostas: ${m.respostas} (positivas: ${m.positivas})`,
    `Esboços gerados: ${m.esbocos_gerados}`,
    `Leads passados para você: ${extra.leads}`,
    `Descadastros: ${m.descadastros} · Bounces: ${m.bounces}`,
    `Custo de API: US$${m.custo_api_usd.toFixed(2)}`,
    `Erros sem solução: ${extra.erros}`,
    '',
    extra.pausado ? `⏸️ Sistema PAUSADO: ${extra.motivo || 'sem motivo registrado'}` : '▶️ Sistema rodando',
  ].join('\n');
}
