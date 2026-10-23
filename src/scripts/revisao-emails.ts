import { getEnv, requireEnv } from '../config/env.js';
import { renderEmail1 } from '../email/report.js';
import { logger } from '../lib/logger.js';
import { sendMessageWithButtons } from '../telegram/client.js';
import { proximosEmails } from '../telegram/dados.js';

const log = logger.child({ etapa: 'revisao' });

// `npm run revisao`: weekday mornings (8h05, sending runs at 8h15) the next 3 emails of the day go to Telegram for a look,
// with buttons to keep, rewrite with an instruction or never send.
async function main(): Promise<void> {
  const env = getEnv();
  const dono = requireEnv('TELEGRAM_CHAT_ID');
  const n = Number(process.argv[process.argv.indexOf('--quantos') + 1]) || 3;
  const emails = await proximosEmails(n);
  if (!emails.length) return log.info('Nenhum email pronto para revisar');
  for (const [i, e] of emails.entries()) {
    const texto = renderEmail1(e.campos, env.SENDER_NAME, env.SENDER_BRAND).replace(/\*\*/g, '');
    const aviso = i === 0 ? 'Se você não mexer em 5 minutos, vai como está no envio das 8h15.\n\n' : '';
    await sendMessageWithButtons(dono, `${aviso}✉️ Revisão ${i + 1} de ${emails.length}: ${e.empresa ?? e.dominio} (${e.dominio})\nPara: ${e.email}\n\n${texto}`.slice(0, 4000), [[
      { texto: '✅ Está bom', dados: '/rev_ok' },
      { texto: '✏️ Reescrever', dados: `/rev_aj ${e.prospect_id}` },
      { texto: '🚫 Não enviar', dados: `/bloquear ${e.dominio}` },
    ]]);
  }
  log.info('Revisão enviada', { emails: emails.length });
}

main().catch((err: unknown) => {
  log.error('revisao falhou', { err });
  process.exitCode = 1;
});
