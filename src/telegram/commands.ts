import { getEnv } from '../config/env.js';
import { isPaused, setPaused } from '../db/control.js';
import { businessDay } from '../lib/dates.js';
import { renderResumo } from '../monitor/locks.js';
import { andamento, contarStatus, metricasDoDia, motivoPausa } from '../monitor/store.js';
import { readFile } from 'node:fs/promises';
import { runNpm } from '../lib/run.js';
import { publishPainel } from '../panel/publish.js';
import { notify } from './notify.js';
import { AJUSTES, CHAVE_DESLIGADOS, CHAVE_MODO, desligados, lerAjustes, salvarAjuste, validarNumero, type Ajustes } from '../control/ajustes.js';
import { JOBS, JOBS_OPCIONAIS, ajustarJob } from '../scheduler/jobs.js';
import { block } from '../replies/store.js';
import { sendDocument, type Botao } from './client.js';
import { leadsQuentes, NOME_STATUS, renderSemana, resumoSemana } from './dados.js';

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
  '/andamento: o que está rodando agora, em qual empresa e o ritmo',
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
  '/leads: quem respondeu, em que pé está, com botões para o esboço e para responder',
  '/revisao: mostra os próximos emails da fila (também chega sozinho às 7h50)',
  '/semana: a semana em números (também chega sexta às 18h)',
  '/lista 41711292: importa só essa lista do Snov (ou cole o link da lista)',
  '/esboco site.com.br e /aprovar site.com.br',
  '/site site.com.br: analisa, cria o esboço e publica (ou só cole o link de qualquer site)',
  '/ajustar site.com.br: pede ajustes no esboço publicado',
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
const emAndamento = new Map<string, { inicio: number; passo: string }>();
function emSegundoPlano(titulo: string, passos: [string, string[]][], depois?: () => Promise<string>): void {
  const chave = `${titulo}#${Date.now()}`;
  void (async () => {
    try {
      for (const [script, args] of passos) {
        emAndamento.set(chave, { inicio: emAndamento.get(chave)?.inicio ?? Date.now(), passo: script });
        const r = await runNpm(script, args);
        if (r.code !== 0) return notify(`⚠️ ${titulo} falhou:\n${r.saida.slice(-600)}`);
      }
      await notify(depois ? await depois() : `✅ ${titulo}: pronto.`);
    } finally {
      emAndamento.delete(chave);
    }
  })();
}

const PASSOS: Record<string, string> = { analyze: 'analisando sites', emails: 'escrevendo emails', esbocos: 'criando esboço', 'snov:import': 'importando do Snov', 'snov:enviar': 'enviando', 'respostas:ler': 'lendo respostas', 'esbocos:ajustar': 'ajustando esboço' };

export async function textoAndamento(): Promise<string> {
  const [a, m] = await Promise.all([andamento(), metricasDoDia()]);
  const min = (t: number) => Math.round((Date.now() - t) / 60000);
  const tarefas = [...emAndamento.entries()].map(([k, v]) => `• ${k.split('#')[0]}: ${PASSOS[v.passo] ?? v.passo} (há ${min(v.inicio)} min)`);
  const ritmo = a.porHora ? `${a.porHora} empresas na última hora` : 'nenhuma empresa avançou na última hora';
  const s = a.status;
  return [
    '⏱️ Andamento agora',
    tarefas.length ? `Rodando pelo Telegram:\n${tarefas.join('\n')}` : 'Nenhuma tarefa do Telegram rodando (o automático segue no horário).',
    a.agora.length ? `Trabalhando em: ${a.agora.join(', ')}` : '',
    `Ritmo: ${ritmo}`,
    a.ultimos.length ? `Últimas: ${a.ultimos.map((u) => `${u.dominio} (${u.status.replace(/_/g, ' ')})`).join(', ')}` : '',
    '',
    `Fila: ${s.novo} para analisar, ${s.analisado} analisadas esperando email, ${s.email_pronto} emails prontos, ${s.enviado_snov} enviadas`,
    `Descartadas (site bom): ${s.descartado_site_bom}${s.erro ? `, com erro: ${s.erro}` : ''}`,
    `Gasto hoje: US$${m.custo_api_usd.toFixed(2)}`,
  ].filter((l, i, arr) => l || arr[i - 1]).join('\n');
}

const trecho = async (arquivo: string, max = 3500) => (await readFile(arquivo, 'utf8').catch(() => '')).slice(0, max);

export interface Resposta { texto: string; botoes?: Botao[]; linhas?: Botao[][] }

// Extra check before anything that changes, costs or sends: the bot explains what will happen and
// waits for the ✅ button. The pending command stays in memory (a bot restart expires the button).
const pendentes = new Map<string, string>();
export function pedirConfirmacao(explicacao: string, comando: string, rotulo = '✅ Sim, pode fazer'): Resposta {
  const id = Math.random().toString(36).slice(2, 8);
  pendentes.set(id, comando);
  if (pendentes.size > 50) pendentes.delete(pendentes.keys().next().value!);
  return { texto: `${explicacao}\n\nConfirma?`, botoes: [{ texto: rotulo, dados: `/ok ${id}` }, { texto: '❌ Cancelar', dados: '/cancelar' }] };
}
export function tirarPendente(id: string | undefined): string | null {
  const c = id ? pendentes.get(id) ?? null : null;
  if (id) pendentes.delete(id);
  return c;
}

const CICLOS: Record<string, string> = {
  importar: 'lê as listas do Snov e coloca empresas novas na fila (não custa API)',
  analisar: 'analisa os sites da fila (PageSpeed, prints e Claude), cerca de US$0,07 por empresa',
  emails: 'escreve o email das empresas já analisadas, cerca de US$0,03 por empresa',
  enviar: 'manda os emails prontos para a campanha do Snov (no modo teste só monta a prévia)',
  respostas: 'lê as respostas da campanha, classifica e age (esboço, aviso para você, bloqueio de quem pediu para sair)',
  esbocos: 'gera o esboço de quem pediu e te manda para aprovar',
  travas: 'confere bounce, descadastros e custo e pausa tudo se passar do limite',
  resumo: 'manda o resumo do dia aqui',
  revisao: 'manda os próximos 3 emails para você revisar (dias úteis, 7h50)',
  semana: 'manda a semana em números (sexta, 18h)',
};

// Returns what will happen (null = safe to run without asking).
export async function explicacao(cmd: string, resto: string[]): Promise<string | null> {
  const a = await lerAjustes();
  const real = modoReal(a);
  const n = (padrao: number, max: number) => numero(resto[0], padrao, max);
  const d = limpaDominio(resto[0]);
  switch (cmd) {
    case '/pausar':
      return `⏸️ Pausar tudo\nParam o envio, as análises, os emails, a leitura de respostas e os esboços até você mandar /retomar. Travas e resumo continuam.${resto.length ? `\nMotivo: ${resto.join(' ')}` : ''}`;
    case '/retomar':
      return `▶️ Retomar\nOs ciclos automáticos voltam a rodar no horário. Modo atual: ${real ? 'REAL, os emails vão para os leads' : 'teste, nada vai para leads'}.`;
    case '/importar':
      return `📥 Importar até ${n(300, 2000)} leads\nLê as listas do Snov e grava as empresas novas na fila. Não manda email e não custa API. Leva cerca de ${Math.ceil(n(300, 2000) / 60)} minutos.`;
    case '/fila': {
      const q = n(20, 300);
      return `⚙️ Analisar e escrever o email de até ${q} empresas\nCusto estimado: US$${(q * 0.1).toFixed(0)}. Tempo: cerca de ${Math.ceil(q * 1.2)} minutos.\nNão envia nada: os emails ficam prontos esperando o envio.`;
    }
    case '/analisar':
      if (/^\d+$/.test(resto[0] ?? '')) return `🔍 Analisar até ${n(20, 300)} empresas da fila\nCusto estimado: US$${(n(20, 300) * 0.07).toFixed(0)}. Sites bons (nota ${valorAtual(a, 'MIN_SITE_SCORE_TO_SKIP')} ou mais) são descartados. Não envia nada.`;
      return DOMINIO.test(d) ? `🔍 Analisar ${d}\nMede velocidade, SEO, celular e prontidão para IA e te manda o resultado. Cerca de US$0,07 e 2 minutos. Não mexe na fila.` : null;
    case '/emails':
      return `✉️ Escrever o email de até ${n(20, 300)} empresas já analisadas\nCusto estimado: US$${(n(20, 300) * 0.03).toFixed(0)}. Não envia nada.`;
    case '/enviar':
      return real
        ? `📤 Envio REAL\nOs emails prontos entram na campanha do Snov e os leads começam a receber, até o limite de ${valorAtual(a, 'MAX_NEW_PER_DAY')} empresas hoje.`
        : '📤 Envio em modo teste\nSó monta a prévia de quem seria enviado. Nada vai para leads.';
    case '/respostas':
      return `📬 Ler as respostas agora\nClassifica as respostas novas da campanha e age: quem pediu ganha esboço, quem perguntou preço te avisa, quem pediu para sair é bloqueado para sempre.${real ? '' : ' No modo teste só classifica.'}`;
    case '/lista': {
      const id = resto[0] ?? '';
      if (!/^\d{5,}$/.test(id)) return null;
      return `📥 Importar só a lista ${id} do Snov\nLê até ${numero(resto[1], 300, 2000)} leads dessa lista, tira repetidos e bloqueados e coloca os novos na fila. Não manda email e não custa API.`;
    }
    case '/revisao':
      return null;
    case '/rodar': {
      const j = (resto[0] ?? '').toLowerCase();
      return CICLOS[j] ? `▶️ Rodar o ciclo ${j} agora\nO que ele faz: ${CICLOS[j]}.` : null;
    }
    case '/esboco':
      return DOMINIO.test(d) ? `🎨 Gerar o esboço de ${d}\nCusto cerca de US$0,90, leva uns 6 minutos. Fica no ar em ${getEnv().DRAFT_BASE_URL.replace(/^https?:\/\//, '')} (sem aparecer no Google) e eu te mando o link. Não vai para ninguém.` : null;
    case '/site':
      return DOMINIO.test(d) ? `🎨 Criar esboço para ${d}\n1. Analiso o site (cerca de 2 min)\n2. Crio o esboço (cerca de 6 min)\n3. Publico em ${getEnv().DRAFT_BASE_URL.replace(/^https?:\/\//, '')} e te mando os prints e o link\nCusto cerca de US$1. A empresa entra no banco e nunca recebe email de prospecção.` : null;
    case '/aprovar':
      return DOMINIO.test(d) ? `✅ Aprovar o esboço de ${d}\nMarca como aprovado por você. Isso libera o envio do link para o lead quando ele vier da campanha.` : null;
    case '/bloquear':
      return DOMINIO.test(d) ? `🚫 Bloquear ${d} para sempre\nNunca recebe email, mesmo se aparecer de novo em outra lista do Snov.` : null;
    case '/auto': {
      const [nome, estado] = resto;
      if (!nome || !JOBS_OPCIONAIS.includes(nome)) return null;
      const desligar = estado ? /^(off|desligar|nao|não)$/i.test(estado) : !desligados(a).has(nome);
      return desligar
        ? `⛔ Desligar o ciclo ${nome}\nEle para de rodar sozinho (${CICLOS[nome]}). Você ainda pode rodar na mão com /rodar ${nome}.`
        : `✅ Ligar o ciclo ${nome}\nEle volta a rodar sozinho no horário (${CICLOS[nome]}).`;
    }
    case '/modo':
      return (resto[0] ?? '').toLowerCase() === 'real'
        ? `⚠️ Ligar o envio DE VERDADE\nOs leads da fila entram na campanha do Snov e recebem email (até ${valorAtual(a, 'MAX_NEW_PER_DAY')} empresas por dia, de segunda a sexta às 8h15), e os esboços aprovados vão para o lead.`
        : null;
    default: {
      const aj = AJUSTES.find((x) => `/${x.comando}` === cmd);
      if (!aj) return null;
      const v = validarNumero(aj, resto[0]);
      if (typeof v === 'string') return null; // the command itself answers with the validation message
      return `🔧 Mudar ${aj.descricao}\nDe ${valorAtual(a, aj.nome)} para ${v}. Vale a partir do próximo ciclo.`;
    }
  }
}

// Only these actions exist; anything else gets the help text.
export async function executar(comando: string, confirmado = false): Promise<Resposta> {
  const [cmd, ...resto] = comando.trim().split(/\s+/);
  const nome = (cmd ?? '').toLowerCase().replace(/@\w+$/, '');
  if (nome === '/cancelar') return { texto: '👍 Cancelado, nada foi feito.' };
  if (!confirmado) {
    const e = await explicacao(nome, resto);
    if (e) return pedirConfirmacao(e, comando);
  }
  switch (nome) {
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
    case '/site': {
      const d = limpaDominio(resto[0]);
      if (!DOMINIO.test(d)) return { texto: 'Me manda o site assim: /site site.com.br' };
      const nomeEmpresa = resto.slice(1).join(' ');
      emSegundoPlano(`Esboço de ${d}`, [['analyze', ['--dominio', d, '--criar', ...(nomeEmpresa ? ['--nome', nomeEmpresa] : [])]], ['esbocos', ['--dominio', d, '--sem-abrir']]],
        async () => `✅ Processo de ${d} terminado (prints e link acima).`);
      return { texto: `🎨 Começando ${d}: análise e depois o esboço. Uns 8 minutos, te mando os prints e o link.` };
    }
    case '/aprovar': {
      const d = limpaDominio(resto[0]);
      if (!DOMINIO.test(d)) return { texto: 'Me manda o site assim: /aprovar site.com.br' };
      const r = await runNpm('esbocos:aprovar', [d]);
      return { texto: r.code === 0 ? `✅ Esboço de ${d} aprovado.` : `Não consegui aprovar: ${r.saida.slice(-300)}` };
    }
    case '/leads': {
      const leads = await leadsQuentes();
      if (!leads.length) return { texto: '🔥 Nenhum lead respondeu ainda. Quando responderem, aparecem aqui.' };
      const quando = (d: string) => new Date(d).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      const texto = ['🔥 Leads quentes', ...leads.map((l, i) => [
        `\n${i + 1}. ${l.empresa ?? l.dominio ?? l.email} (${l.nome ?? 'sem nome'})`,
        `   ${NOME_STATUS[l.status] ?? l.status} · ${quando(l.quando)}`,
        l.resumo ? `   "${l.resumo.slice(0, 140)}"` : '',
        `   ${l.email}`,
      ].filter(Boolean).join('\n'))].join('\n');
      const linhas: Botao[][] = leads.slice(0, 8).map((l, i) => [
        ...(l.esboco ? [{ texto: `${i + 1}. 🎨 Esboço`, dados: '', url: l.esboco }] : []),
        ...(l.dominio ? [{ texto: `${i + 1}. 🌐 Site`, dados: '', url: `https://${l.dominio}` }] : []),
        { texto: `${i + 1}. ✍️ Responder`, dados: `/resp ${l.prospect_id}` },
      ]);
      return { texto: texto.slice(0, 4000), linhas };
    }
    case '/semana':
      return { texto: renderSemana(await resumoSemana()) };
    case '/revisao': {
      const q = String(numero(resto[0], 3, 10));
      const r = await runNpm('revisao', ['--quantos', q]);
      return { texto: r.code === 0 ? '✉️ Mandei acima os próximos emails da fila.' : `Não consegui montar a revisão: ${r.saida.slice(-300)}` };
    }
    case '/lista': {
      const id = resto[0] ?? '';
      if (!/^\d{5,}$/.test(id)) return { texto: 'Me manda o número da lista (ou cole o link dela do Snov): /lista 41711292' };
      const env = getEnv();
      if ([env.SNOV_OUTREACH_LIST_ID, env.SNOV_DRAFT_LIST_ID].includes(id)) return { texto: 'Essa é a lista de saída da campanha, não dá para importar dela.' };
      const max = String(numero(resto[1], 300, 2000));
      emSegundoPlano(`Importação da lista ${id}`, [['snov:import', ['--max', max, id]]], async () => `📥 Lista ${id} importada:\n\n${await trecho('out/importacao.md', 1500)}`);
      return { texto: `📥 Lendo a lista ${id} do Snov...` };
    }
    case '/andamento':
    case '/agora':
      return { texto: await textoAndamento(), botoes: [{ texto: '🔄 Atualizar', dados: '/andamento' }] };
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
    esboco: d, aprovar: d, bloquear: d, site: `${d} ${v}`.trim(),
    fila: q, importar: q, emails: q, enviar: q,
    limite: q, custo: q, lote: q, estoque: q, nota: q,
    modo: v === 'real' ? 'real' : v === 'teste' ? 'teste' : '',
    rodar: v, relatorio: v, auto: v, lista: `${v} ${q}`.trim(), revisao: q,
  };
  return `/${i.acao} ${args[i.acao] ?? ''}`.trim();
}
