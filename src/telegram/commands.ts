import { getEnv } from '../config/env.js';
import { isPaused, setPaused } from '../db/control.js';
import { businessDay } from '../lib/dates.js';
import { renderResumo } from '../monitor/locks.js';
import { contarStatus, metricasDoDia, motivoPausa } from '../monitor/store.js';
import { readFile } from 'node:fs/promises';
import { runNpm } from '../lib/run.js';
import { publishPainel } from '../panel/publish.js';
import { notify } from './notify.js';

export const LEAD_STATUS = ['respondeu_interesse', 'notificado_moura'];

export async function resumoAtual(): Promise<string> {
  const [m, leads, erros, pausado, motivo] = await Promise.all([
    metricasDoDia(), contarStatus(LEAD_STATUS), contarStatus(['erro_final']), isPaused(), motivoPausa(),
  ]);
  const env = getEnv();
  const pendentes = [
    !env.SNOV_DRAFT_LIST_ID && 'criar no Snov a lista e a campanha "esboço pronto" e pôr SNOV_DRAFT_LIST_ID no .env',
  ].filter(Boolean);
  const texto = renderResumo(businessDay(), m, { leads, erros, pausado, motivo });
  return pendentes.length ? `${texto}\n\n📌 Falta fazer:\n${pendentes.map((p) => `• ${p}`).join('\n')}` : texto;
}

export const AJUDA = [
  'Comandos:',
  '/status: como está o sistema hoje',
  '/pausar motivo: pausa envios, análises e respostas',
  '/retomar: volta a rodar',
  '/painel: atualiza o painel na Vercel e manda o link',
  '/analisar site.com.br: analisa um site e manda o resultado',
  '/fila 50: analisa e escreve o email de até 50 empresas da fila',
  '/importar 300: puxa leads novos das listas do Snov',
  '/esboco site.com.br: gera o esboço de uma empresa já analisada',
  '/aprovar site.com.br: aprova um esboço',
  'Ou escreva normal, que eu entendo.',
  '/ajuda: esta lista',
].join('\n');

const DOMINIO = /^[a-z0-9.-]+\.[a-z]{2,}$/i;
const limpaDominio = (d = '') => d.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');

// Long jobs run in the background and report back on Telegram when they finish.
function emSegundoPlano(titulo: string, passos: [string, string[]][], depois?: () => Promise<string>): void {
  void (async () => {
    for (const [script, args] of passos) {
      const r = await runNpm(script, args);
      if (r.code !== 0) return notify(`⚠️ ${titulo} falhou:\n${r.saida.slice(-600)}`);
    }
    await notify(depois ? await depois() : `✅ ${titulo}: pronto.`);
  })();
}

const trecho = async (arquivo: string, max = 3500) => (await readFile(arquivo, 'utf8').catch(() => '')).slice(0, max);

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
    case '/painel':
      return { texto: `📈 Painel atualizado (abre logado na Vercel):\n${await publishPainel()}` };
    case '/analisar': {
      const d = limpaDominio(resto[0]);
      if (!DOMINIO.test(d)) return { texto: 'Me manda o site assim: /analisar site.com.br' };
      emSegundoPlano(`Análise de ${d}`, [['analyze', ['--dominio', d]]], async () => `🔍 Análise de ${d}:\n\n${await trecho('out/analises.md')}`);
      return { texto: `🔍 Analisando ${d}. Leva uns 2 minutos, te mando o resultado aqui.` };
    }
    case '/fila': {
      const n = Math.min(Math.max(Number(resto[0]) || 20, 1), 300);
      emSegundoPlano(`Fila de ${n}`, [['analyze', ['--limit', String(n)]], ['emails', ['--limit', String(n)]]],
        async () => `✅ Fila processada (até ${n}). Status atualizado:\n\n${await resumoAtual()}`);
      return { texto: `⚙️ Analisando e escrevendo o email de até ${n} empresas. Uns ${Math.ceil(n * 1.2)} minutos; aviso quando terminar.` };
    }
    case '/importar': {
      const n = Math.min(Math.max(Number(resto[0]) || 300, 1), 2000);
      emSegundoPlano(`Importação de até ${n}`, [['snov:import', ['--max', String(n)]]], async () => `📥 Importação feita:\n\n${await trecho('out/importacao.md', 1500)}`);
      return { texto: `📥 Lendo até ${n} leads novos das listas do Snov...` };
    }
    case '/esboco': {
      const d = limpaDominio(resto[0]);
      if (!DOMINIO.test(d)) return { texto: 'Me manda o site assim: /esboco site.com.br' };
      emSegundoPlano(`Esboço de ${d}`, [['esbocos', ['--dominio', d, '--sem-abrir']]], async () => `🎨 Esboço de ${d} pronto (prints acima). Para aprovar: /aprovar ${d}`);
      return { texto: `🎨 Gerando o esboço de ${d}. Leva uns 6 minutos.` };
    }
    case '/aprovar': {
      const d = limpaDominio(resto[0]);
      if (!DOMINIO.test(d)) return { texto: 'Me manda o site assim: /aprovar site.com.br' };
      const r = await runNpm('esbocos:aprovar', [d]);
      return { texto: r.code === 0 ? `✅ Esboço de ${d} aprovado.` : `Não consegui aprovar: ${r.saida.slice(-300)}` };
    }
    default:
      return { texto: `Não entendi.\n\n${AJUDA}` };
  }
}
