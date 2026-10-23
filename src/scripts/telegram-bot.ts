import { requireEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { telegram } from '../telegram/client.js';
import { ajustar, aprovarEEnviar, naoEnviar } from '../flow/lead-esboco.js';
import { interpretar, type Turno } from '../telegram/assistant.js';
import { comandoDe, executar, resumoAtual, textoConfig, type Resposta } from '../telegram/commands.js';
import { aplicarAjustesNoProcesso } from '../control/ajustes.js';

const log = logger.child({ etapa: 'telegram' });

interface Update {
  update_id: number;
  message?: { chat: { id: number }; text?: string };
  callback_query?: { id: string; data?: string; message?: { chat: { id: number } } };
}

// `npm run telegram:bot`: long-polls the bot and answers Moura's commands and buttons.
// Messages from any other chat are ignored.
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
    { command: 'ajuda', description: 'Lista de comandos' },
  ] });
  log.info('Bot do Telegram ouvindo');
  let offset = 0;
  const historico: Turno[] = [];
  // Slash commands run directly; anything else goes through the assistant, which can only pick allowed actions.
  let ajustePendente: string | null = null; // prospect id waiting for Moura's adjustment text
  const responder = async (texto: string): Promise<Resposta> => {
    await aplicarAjustesNoProcesso();
    const [cmd, id] = texto.trim().split(/\s+/);
    if (cmd === '/esb_ok' && id) return { texto: await aprovarEEnviar(id) };
    if (cmd === '/esb_no' && id) return { texto: await naoEnviar(id) };
    if (cmd === '/esb_aj' && id) {
      ajustePendente = id;
      return { texto: 'O que eu mudo? Escreva os ajustes (um por linha ou separados por ponto e vírgula).' };
    }
    if (ajustePendente && !texto.startsWith('/')) {
      const pid = ajustePendente;
      ajustePendente = null;
      await telegram('sendMessage', { chat_id: dono, text: '✏️ Ajustando, leva uns minutos...' });
      return { texto: await ajustar(pid, texto) };
    }
    if (texto.startsWith('/')) return executar(texto);
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
