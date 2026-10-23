import { getEnv } from '../config/env.js';
import { getSupabase } from '../db/client.js';
import { businessDay } from '../lib/dates.js';
import { logger } from '../lib/logger.js';
import { contarStatus } from '../monitor/store.js';
import { notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'estoque' });

// `npm run estoque` (weekdays 9h): warns once a day when the ready emails or the leads waiting for
// analysis are about to run out, with buttons to prepare more or import more from Snov.
async function main(): Promise<void> {
  const porDia = getEnv().MAX_NEW_PER_DAY;
  const [prontos, novos] = await Promise.all([contarStatus(['email_pronto']), contarStatus(['novo'])]);
  const dias = Math.floor(prontos / Math.max(porDia, 1));
  const poucosEmails = dias < 5;
  const poucosLeads = novos < porDia * 5;
  if (!poucosEmails && !poucosLeads) return log.info('Estoque ok', { prontos, novos, dias });

  const db = getSupabase();
  const hoje = businessDay();
  const { data } = await db.from('controle').select('valor').eq('chave', 'alerta_estoque').maybeSingle();
  if (data?.valor === hoje) return;
  await db.from('controle').upsert({ chave: 'alerta_estoque', valor: hoje });

  const linhas = [
    '📦 Estoque acabando',
    `Emails prontos: ${prontos} (dá para ${dias} dia${dias === 1 ? '' : 's'} de envio, com ${porDia} por dia)`,
    `Empresas esperando análise: ${novos}`,
    '',
    poucosLeads ? 'Faltam empresas na fila: importe mais das listas do Snov e depois prepare os emails.' : 'Ainda tem empresas na fila: é só preparar mais emails.',
  ];
  await notify(linhas.join('\n'), [
    ...(poucosLeads ? [{ texto: '📥 Importar mais 300 do Snov', dados: '/importar 300' }] : []),
    { texto: '➕ Preparar mais 100 emails', dados: '/fila 100' },
  ]);
  log.info('Aviso de estoque enviado', { prontos, novos });
}

main().catch((err: unknown) => {
  log.error('estoque falhou', { err });
  process.exitCode = 1;
});
