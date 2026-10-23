import { getEnv, requireEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { telegram } from '../telegram/client.js';
import { ajustar, ajustarSite, aprovarEEnviar, naoEnviar } from '../flow/lead-esboco.js';
import { loadLead } from '../flow/store.js';
import { interpretar, type Turno } from '../telegram/assistant.js';
import { comandoDe, executar, pedirConfirmacao, resumoAtual, textoConfig, tirarPendente, type Resposta } from '../telegram/commands.js';
import { aplicarAjustesNoProcesso } from '../control/ajustes.js';

const log = logger.child({ etapa: 'telegram' });

interface Update {
  update_id: number;
  message?: { chat: { id: number }; text?: string };
  callback_query?: { id: string; data?: string; message?: { chat: { id: number } } };
}

// `npm run telegram:bot`: long-polls the bot and answers Moura's commands and buttons.
// Messages from any other chat are ignored.
// Finds a site in a message that is basically just a link (optionally with the company name).
function linkColado(texto: string): string | null {
  const t = texto.trim();
  if (t.split(/\s+/).length > 8) return null;
  const m = t.match(/(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})(?:[/?#]\S*)?/i);
  if (!m || (!/^https?:\/\//i.test(m[0]) && !/\.(com|br|net|org|io|med|adv|app|site|online|store|shop|co)\b/i.test(m[1]!))) return null;
  const d = m[1]!.toLowerCase();
  return /(instagram|facebook|wa\.me|whatsapp|linktr\.ee|google|youtube|tiktok)\./.test(d) ? null : d;
}

// Button pre-approved by the explanation shown with it: it runs without a second confirmation.
const guardar = (comando: string) => {
  const r = pedirConfirmacao('', comando);
  return r.botoes![0]!.dados.split(' ')[1]!;
};

async function main(): Promise<void> {
  const dono = requireEnv('TELEGRAM_CHAT_ID');
  await telegram('setMyCommands', { commands: [
    { command: 'status', description: 'Como está o sistema hoje' },
    { command: 'pausar', description: 'Pausa tudo' },
    { command: 'retomar', description: 'Volta a rodar' },
    { command: 'painel', description: 'Atualiza o painel na Vercel' },
    { command: 'analisar', description: 'Analisa um site: /analisar site.com.br' },
    { command: 'fila', description: 'Analisa e escreve emails: /fila 50' },
    { command: 'importar', description: 'Puxa leads novos do Snov' },
    { command: 'esboco', description: 'Gera esboço: /esboco site.com.br' },
    { command: 'aprovar', description: 'Aprova esboço: /aprovar site.com.br' },
    { command: 'andamento', description: 'O que está rodando agora e o ritmo' },
    { command: 'config', description: 'Limites, modo e ciclos, com botões' },
    { command: 'emails', description: 'Escreve emails: /emails 50' },
    { command: 'enviar', description: 'Manda para a campanha agora' },
    { command: 'respostas', description: 'Lê as respostas do Snov agora' },
    { command: 'rodar', description: 'Roda um ciclo agora' },
    { command: 'limite', description: 'Empresas novas por dia: /limite 20' },
    { command: 'custo', description: 'Teto de gasto por dia: /custo 50' },
    { command: 'lote', description: 'Análises por dia no automático: /lote 30' },
    { command: 'estoque', description: 'Emails prontos guardados: /estoque 40' },
    { command: 'nota', description: 'Nota de site bom: /nota 75' },
    { command: 'modo', description: 'Envio real ou teste: /modo real' },
    { command: 'auto', description: 'Liga e desliga ciclos automáticos' },
    { command: 'bloquear', description: 'Nunca contatar: /bloquear site.com.br' },
    { command: 'relatorio', description: 'Manda um relatório: /relatorio emails' },
    { command: 'site', description: 'Esboço de qualquer site: /site site.com.br' },
    { command: 'ajustar', description: 'Ajusta um esboço: /ajustar site.com.br' },
    { command: 'ajuda', description: 'Lista de comandos' },
  ] });
  log.info('Bot do Telegram ouvindo');
  let offset = 0;
  const historico: Turno[] = [];
  // Slash commands run directly; anything else goes through the assistant, which can only pick allowed actions.
  // Prospect id (lead flow) or domain (/ajustar) waiting for Moura's adjustment text.
  let ajustePendente: { tipo: 'lead' | 'site'; id: string } | null = null;
  const responder = async (texto: string, confirmado = false): Promise<Resposta> => {
    await aplicarAjustesNoProcesso();
    const [cmd, id] = texto.trim().split(/\s+/);
    if (cmd === '/ok') {
      const pendente = tirarPendente(id);
      return pendente ? responder(pendente, true) : { texto: 'Esse botão expirou (o bot reiniciou). Mande o pedido de novo.' };
    }
    if (cmd === '/esb_ok' && id) {
      if (!confirmado) {
        const lead = await loadLead(id);
        return pedirConfirmacao(!getEnv().DRY_RUN
          ? `📨 Aprovar e enviar para ${lead.email}\nEle entra na campanha "esboço pronto" do Snov e recebe o link do esboço por email em alguns minutos.`
          : `📨 Aprovar (modo teste)\nMarco como aprovado e deixo no ar, mas nada vai para ${lead.email}.`, texto);
      }
      return { texto: await aprovarEEnviar(id) };
    }
    if (cmd === '/esb_no' && id) {
      if (!confirmado) return pedirConfirmacao('🚫 Não enviar o esboço\nO lead fica com você para responder pessoalmente. Nada vai para ele.', texto);
      return { texto: await naoEnviar(id) };
    }
    if (cmd === '/esb_aj' && id) {
      ajustePendente = { tipo: 'lead', id };
      return { texto: 'O que eu mudo? Escreva os ajustes (um por linha ou separados por ponto e vírgula).' };
    }
    if (cmd === '/ajustar') {
      const d = (id ?? '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
      if (!d.includes('.')) return { texto: 'Me manda assim: /ajustar site.com.br' };
      ajustePendente = { tipo: 'site', id: d };
      return { texto: `O que eu mudo no esboço de ${d}? Escreva os ajustes (um por linha ou separados por ponto e vírgula). Cada ajuste custa cerca de US$0,50.` };
    }
    if (ajustePendente && !texto.startsWith('/')) {
      const alvo = ajustePendente;
      ajustePendente = null;
      await telegram('sendMessage', { chat_id: dono, text: '✏️ Ajustando, leva uns minutos...' });
      return { texto: alvo.tipo === 'lead' ? await ajustar(alvo.id, texto) : await ajustarSite(alvo.id, texto) };
    }
    // A pasted link (e.g. a site a client sent on WhatsApp): offer to build the draft.
    const link = !texto.startsWith('/') && linkColado(texto);
    if (link) {
      const nome = texto.replace(/https?:\/\/\S+|(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+\S*/i, '').trim().slice(0, 60);
      return {
        texto: `🔗 Recebi ${link}. O que eu faço?\n\n🎨 Criar esboço: analiso o site, crio o esboço, publico em ${getEnv().DRAFT_BASE_URL.replace(/^https?:\/\//, '')} e te mando prints e link. Cerca de US$1 e 8 minutos.\n🔍 Só analisar: te mando os problemas medidos. Cerca de US$0,07.${nome ? `\n\nNome da empresa: ${nome}` : '\n\nDica: mande o link com o nome da empresa junto (ex.: site.com.br Clínica Sorriso) para o esboço sair com o nome certo.'}`,
        linhas: [[{ texto: '🎨 Criar esboço', dados: `/ok ${guardar(`/site ${link} ${nome}`.trim())}` }, { texto: '🔍 Só analisar', dados: `/ok ${guardar(`/analisar ${link}`)}` }], [{ texto: '❌ Nada', dados: '/cancelar' }]],
      };
    }
    if (texto.startsWith('/')) return executar(texto, confirmado);
    const i = await interpretar(texto, `${await resumoAtual()}\n\n${(await textoConfig()).texto}`, historico);
    historico.push({ de: 'moura', texto }, { de: 'bot', texto: i.resposta });
    if (historico.length > 16) historico.splice(0, historico.length - 16);
    if (i.acao === 'nenhuma') return { texto: i.resposta };
    const r = await executar(comandoDe(i));
    return { ...r, texto: `${i.resposta}\n\n${r.texto}` };
  };
  for (;;) {
    let updates: Update[] = [];
    try {
      updates = await telegram<Update[]>('getUpdates', { offset, timeout: 50 });
    } catch (err) {
      log.warn('getUpdates falhou; tentando de novo em 5s', { err });
      await new Promise((r) => setTimeout(r, 5000));
      continue;
    }
    for (const u of updates) {
      offset = u.update_id + 1;
      const chat = String(u.message?.chat.id ?? u.callback_query?.message?.chat.id ?? '');
      const texto = u.message?.text ?? u.callback_query?.data;
      if (u.callback_query) await telegram('answerCallbackQuery', { callback_query_id: u.callback_query.id }).catch(() => undefined);
      if (chat !== dono || !texto) continue;
      try {
        const r = await responder(texto);
        await telegram('sendMessage', {
          chat_id: dono,
          text: r.texto,
          ...(r.botoes || r.linhas ? { reply_markup: { inline_keyboard: (r.linhas ?? [r.botoes!]).map((l) => l.map((b) => ({ text: b.texto, callback_data: b.dados }))) } } : {}),
        });
        log.info('Comando do Telegram', { comando: texto.split(/\s/)[0] });
      } catch (err) {
        log.error('Falha ao executar comando', { err });
        await telegram('sendMessage', { chat_id: dono, text: 'Deu erro ao executar. Veja o log no servidor.' }).catch(() => undefined);
      }
    }
  }
}

main().catch((err: unknown) => {
  log.error('telegram:bot falhou', { err });
  process.exitCode = 1;
});
