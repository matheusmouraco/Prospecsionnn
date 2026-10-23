import { getEnv } from '../config/env.js';
import { isPaused, setPaused } from '../db/control.js';
import { businessDay } from '../lib/dates.js';
import { renderResumo } from '../monitor/locks.js';
import { contarStatus, metricasDoDia, motivoPausa } from '../monitor/store.js';
import { readFile } from 'node:fs/promises';
import { runNpm } from '../lib/run.js';
import { publishPainel } from '../panel/publish.js';
import { notify } from './notify.js';
import { AJUSTES, CHAVE_DESLIGADOS, CHAVE_MODO, desligados, lerAjustes, salvarAjuste, validarNumero, type Ajustes } from '../control/ajustes.js';
import { JOBS, JOBS_OPCIONAIS, ajustarJob } from '../scheduler/jobs.js';
import { block } from '../replies/store.js';
import { sendDocument } from './client.js';

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
  'Dia a dia:',
  '/status: como está o sistema hoje',
  '/config: limites, modo e ciclos automáticos, com botões',
  '/pausar motivo e /retomar',
  '/painel: atualiza o painel na Vercel',
  '',
  'Rodar agora:',
  '/importar 300: puxa leads novos do Snov',
  '/fila 50: analisa e escreve o email de 50 empresas',
  '/analisar 50: só analisa 50 da fila (ou /analisar site.com.br)',
  '/emails 50: só escreve o email de 50 já analisadas',
  '/enviar 15: manda agora para a campanha (respeita o limite do dia)',
  '/respostas: lê as respostas do Snov agora',
  '/rodar nome: roda qualquer ciclo (importar, analisar, emails, enviar, respostas, esbocos, travas, resumo)',
  '',
  'Ajustes (ficam salvos):',
  '/limite 20: empresas novas enviadas por dia',
  '/custo 50: teto de gasto por dia em US$',
  '/lote 30: quantas o automático analisa por dia',
  '/estoque 40: emails prontos guardados antes de parar de analisar',
  '/nota 75: nota a partir da qual o site é bom e é descartado',
  '/modo teste ou /modo real: liga ou desliga o envio de verdade',
  '/auto: liga e desliga cada ciclo automático',
  '',
  'Empresas e relatórios:',
  '/bloquear site.com.br: nunca contatar essa empresa',
  '/esboco site.com.br e /aprovar site.com.br',
  '/relatorio emails (ou analises, envio, respostas, importacao, esbocos): manda o arquivo',
  '',
  'Ou escreva normal, que eu entendo. /ajuda mostra esta lista.',
].join('\n');

const RELATORIOS = ['emails', 'analises', 'envio', 'respostas', 'importacao', 'esbocos'];

const valorAtual = (a: Ajustes, nome: string): string => {
  const env = getEnv() as unknown as Record<string, unknown>;
  const def = AJUSTES.find((x) => x.nome === nome)?.padrao;
  return a[nome] ?? String(env[nome] ?? def ?? '');
};

const modoReal = (a: Ajustes) => (a[CHAVE_MODO] ? a[CHAVE_MODO] === 'false' : !getEnv().DRY_RUN);

export async function textoConfig(): Promise<Resposta> {
  const a = await lerAjustes();
  const off = desligados(a);
  const real = modoReal(a);
  const linhas = [
    `⚙️ Configuração`,
    `Modo: ${real ? '🟢 REAL (envia de verdade)' : '🧪 teste (nada vai para leads)'}`,
    ...AJUSTES.map((x) => `• ${x.descricao}: ${valorAtual(a, x.nome)}  (/${x.comando} N)`),
    '',
    'Ciclos automáticos:',
    ...JOBS_OPCIONAIS.map((j) => `${off.has(j) ? '⛔' : '✅'} ${j}`),
  ];
  const limite = Number(valorAtual(a, 'MAX_NEW_PER_DAY'));
  const custo = Number(valorAtual(a, 'MAX_DAILY_API_COST_USD'));
  return {
    texto: linhas.join('\n'),
    linhas: [
      [real ? { texto: '🧪 Voltar para teste', dados: '/modo teste' } : { texto: '🟢 Ligar envio real', dados: '/modo real' }],
      [{ texto: `Limite ${Math.max(1, limite - 5)}`, dados: `/limite ${Math.max(1, limite - 5)}` }, { texto: `Limite ${limite + 5}`, dados: `/limite ${limite + 5}` }],
      [{ texto: `Custo US$${Math.max(1, custo - 10)}`, dados: `/custo ${Math.max(1, custo - 10)}` }, { texto: `Custo US$${custo + 10}`, dados: `/custo ${custo + 10}` }],
      [{ texto: '🔁 Ciclos automáticos', dados: '/auto' }],
    ],
  };
}

async function textoAuto(): Promise<Resposta> {
  const off = desligados(await lerAjustes());
  return {
    texto: 'Ciclos automáticos (toque para ligar ou desligar). Travas e resumo nunca desligam.',
    linhas: JOBS_OPCIONAIS.map((j) => [{ texto: `${off.has(j) ? '⛔' : '✅'} ${j}`, dados: `/auto ${j} ${off.has(j) ? 'on' : 'off'}` }]),
  };
}

const numero = (t: string | undefined, padrao: number, max: number) => Math.min(Math.max(Number(t) || padrao, 1), max);

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

export interface Resposta { texto: string; botoes?: { texto: string; dados: string }[]; linhas?: { texto: string; dados: string }[][] }

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
      if (/^\d+$/.test(resto[0] ?? '')) {
        const n = numero(resto[0], 20, 300);
        emSegundoPlano(`Análise de ${n}`, [['analyze', ['--limit', String(n)]]], async () => `🔍 Análise de até ${n} feita.\n\n${await resumoAtual()}`);
        return { texto: `🔍 Analisando até ${n} empresas da fila (cerca de US$${(n * 0.07).toFixed(0)}). Aviso quando terminar.` };
      }
      const d = limpaDominio(resto[0]);
      if (!DOMINIO.test(d)) return { texto: 'Me manda o site assim: /analisar site.com.br' };
      emSegundoPlano(`Análise de ${d}`, [['analyze', ['--dominio', d]]], async () => `🔍 Análise de ${d}:\n\n${await trecho('out/analises.md')}`);
      return { texto: `🔍 Analisando ${d}. Leva uns 2 minutos, te mando o resultado aqui.` };
    }
    case '/fila': {
      const n = numero(resto[0], 20, 300);
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
    case '/config':
    case '/ajustes':
      return textoConfig();
    case '/auto': {
      const [nome, estado] = resto;
      if (!nome) return textoAuto();
      if (!JOBS_OPCIONAIS.includes(nome)) return { texto: `Ciclos que dá para ligar/desligar: ${JOBS_OPCIONAIS.join(', ')}` };
      const off = desligados(await lerAjustes());
      const desligar = estado ? /^(off|desligar|nao|não)$/i.test(estado) : !off.has(nome);
      if (desligar) off.add(nome); else off.delete(nome);
      await salvarAjuste(CHAVE_DESLIGADOS, [...off].join(','));
      const r = await textoAuto();
      return { ...r, texto: `${desligar ? '⛔' : '✅'} ${nome} ${desligar ? 'desligado' : 'ligado'} no automático.\n\n${r.texto}` };
    }
    case '/modo': {
      const alvo = (resto[0] ?? '').toLowerCase();
      if (alvo === 'teste') {
        await salvarAjuste(CHAVE_MODO, 'true');
        return { texto: '🧪 Modo teste ligado. Nada vai para leads; envios viram prévia.' };
      }
      if (alvo === 'real') {
        return {
          texto: '⚠️ Isso liga o envio DE VERDADE: os leads da fila entram na campanha do Snov e recebem email, e esboços aprovados vão para o lead. Confirma?',
          botoes: [{ texto: '✅ Sim, ligar envio real', dados: '/modo confirmar-real' }, { texto: 'Cancelar', dados: '/config' }],
        };
      }
      if (alvo === 'confirmar-real') {
        await salvarAjuste(CHAVE_MODO, 'false');
        const a = await lerAjustes();
        return { texto: `🟢 Envio real ligado. Até ${valorAtual(a, 'MAX_NEW_PER_DAY')} empresas novas por dia, de segunda a sexta às 8h15.\nPara voltar: /modo teste`, botoes: [{ texto: '🧪 Voltar para teste', dados: '/modo teste' }] };
      }
      return { texto: `Modo atual: ${modoReal(await lerAjustes()) ? 'REAL' : 'teste'}. Use /modo teste ou /modo real.` };
    }
    case '/emails': {
      const n = numero(resto[0], 20, 300);
      emSegundoPlano(`Emails de ${n}`, [['emails', ['--limit', String(n)]]], async () => `✉️ Emails escritos (até ${n}).\n\n${await resumoAtual()}`);
      return { texto: `✉️ Escrevendo o email de até ${n} empresas já analisadas (cerca de US$${(n * 0.03).toFixed(0)}).` };
    }
    case '/enviar': {
      const args = resto[0] && /^\d+$/.test(resto[0]) ? ['--limit', resto[0]] : [];
      const real = modoReal(await lerAjustes());
      emSegundoPlano('Envio', [['snov:enviar', args]], async () => `📤 Envio ${real ? '' : '(prévia, modo teste) '}feito:\n\n${await trecho('out/envio.md', 2500)}`);
      return { texto: real ? '📤 Mandando os emails prontos para a campanha do Snov (respeita o limite do dia)...' : '📤 Modo teste: vou só montar a prévia do envio, nada vai para leads.' };
    }
    case '/respostas':
      emSegundoPlano('Leitura de respostas', [['respostas:ler', []]], async () => `📬 Respostas lidas:\n\n${await trecho('out/respostas.md', 2500)}`);
      return { texto: '📬 Lendo as respostas do Snov agora...' };
    case '/rodar': {
      const job = JOBS.find((j) => j.nome === (resto[0] ?? '').toLowerCase());
      if (!job) return { texto: `Qual ciclo? ${JOBS.map((j) => j.nome).join(', ')}`, linhas: JOBS.map((j) => [{ texto: `▶️ ${j.nome}`, dados: `/rodar ${j.nome}` }]) };
      const j = ajustarJob(job, await lerAjustes());
      emSegundoPlano(`Ciclo ${j.nome}`, [[j.script, j.args ?? []]], async () => `✅ Ciclo ${j.nome} rodou.\n\n${await resumoAtual()}`);
      return { texto: `▶️ Rodando o ciclo ${j.nome} agora.` };
    }
    case '/bloquear': {
      const d = limpaDominio(resto[0]);
      if (!DOMINIO.test(d)) return { texto: 'Me manda o site assim: /bloquear site.com.br' };
      await block(`*@${d}`, d, resto.slice(1).join(' ') || 'bloqueado pelo Telegram');
      return { texto: `🚫 ${d} bloqueado. Nunca recebe email (se já estiver na fila, o envio pula).` };
    }
    case '/relatorio': {
      const nome = (resto[0] ?? '').toLowerCase().replace(/\.md$/, '');
      if (!RELATORIOS.includes(nome)) return { texto: 'Qual relatório?', linhas: RELATORIOS.map((r) => [{ texto: `📄 ${r}`, dados: `/relatorio ${r}` }]) };
      const conteudo = await readFile(`out/${nome}.md`).catch(() => null);
      if (!conteudo) return { texto: `Ainda não tem out/${nome}.md no servidor.` };
      await sendDocument(getEnv().TELEGRAM_CHAT_ID ?? '', conteudo, `${nome}.md`);
      return { texto: `📄 ${nome}.md enviado acima.` };
    }
    default: {
      const aj = AJUSTES.find((x) => `/${x.comando}` === (cmd ?? '').toLowerCase());
      if (aj) {
        const v = validarNumero(aj, resto[0]);
        if (typeof v === 'string') return { texto: v };
        await salvarAjuste(aj.nome, String(v));
        return { texto: `✅ ${aj.descricao}: agora ${v}. Vale a partir do próximo ciclo.` };
      }
      return { texto: `Não entendi.\n\n${AJUDA}` };
    }
  }
}

// Free-text intent -> the same slash command Moura could have typed. `modo real` still asks for the
// confirmation button, so the assistant alone never turns real sending on.
export function comandoDe(i: { acao: string; motivo?: string; dominio?: string; quantidade?: number; valor?: string }): string {
  const q = i.quantidade ? String(i.quantidade) : '';
  const v = (i.valor ?? '').trim();
  const d = i.dominio ?? '';
  const args: Record<string, string> = {
    pausar: i.motivo ?? '',
    analisar: d || q,
    esboco: d, aprovar: d, bloquear: d,
    fila: q, importar: q, emails: q, enviar: q,
    limite: q, custo: q, lote: q, estoque: q, nota: q,
    modo: v === 'real' ? 'real' : v === 'teste' ? 'teste' : '',
    rodar: v, relatorio: v, auto: v,
  };
  return `/${i.acao} ${args[i.acao] ?? ''}`.trim();
}
