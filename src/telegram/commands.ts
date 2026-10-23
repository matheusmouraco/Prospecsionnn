import { isPaused, setPaused } from '../db/control.js';
import { businessDay } from '../lib/dates.js';
import { renderResumo } from '../monitor/locks.js';
import { contarStatus, metricasDoDia, motivoPausa } from '../monitor/store.js';

export const LEAD_STATUS = ['respondeu_interesse', 'notificado_moura'];

export async function resumoAtual(): Promise<string> {
  const [m, leads, erros, pausado, motivo] = await Promise.all([
    metricasDoDia(), contarStatus(LEAD_STATUS), contarStatus(['erro_final']), isPaused(), motivoPausa(),
  ]);
  return renderResumo(businessDay(), m, { leads, erros, pausado, motivo });
}

export const AJUDA = [
  'Comandos:',
  '/status: como está o sistema hoje',
  '/pausar motivo: pausa envios, análises e respostas',
  '/retomar: volta a rodar',
  '/ajuda: esta lista',
].join('\n');

export interface Resposta { texto: string; botoes?: { texto: string; dados: string }[] }

// Only these actions exist; anything else gets the help text.
export async function executar(comando: string): Promise<Resposta> {
  const [cmd, ...resto] = comando.trim().split(/\s+/);
  switch ((cmd ?? '').toLowerCase().replace(/@\w+$/, '')) {
    case '/start':
    case '/ajuda':
    case '/help':
      return { texto: AJUDA };
    case '/status':
    case '/resumo': {
      const pausado = await isPaused();
      return { texto: await resumoAtual(), botoes: [pausado ? { texto: '▶️ Retomar', dados: '/retomar' } : { texto: '⏸️ Pausar', dados: '/pausar pelo botão' }] };
    }
    case '/pausar':
      await setPaused(true, resto.join(' ') || 'pausado pelo Telegram');
      return { texto: '⏸️ Pausado. Nada é enviado até você mandar /retomar.', botoes: [{ texto: '▶️ Retomar', dados: '/retomar' }] };
    case '/retomar':
      await setPaused(false);
      return { texto: '▶️ Rodando de novo.' };
    default:
      return { texto: `Não entendi.\n\n${AJUDA}` };
  }
}
