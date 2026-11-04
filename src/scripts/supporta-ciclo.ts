import { logger } from '../lib/logger.js';
import { gerarPrevia, publicarPago } from '../supporta/cycle.js';

// Supporta builder worker (runs every minute from the scheduler): paid sites first (a client is waiting
// on a published site), then previews. A few per run so one slow generation never blocks the queue for long.
const log = logger.child({ etapa: 'supporta' });

async function main() {
  let feitos = 0;
  for (let i = 0; i < 2 && (await publicarPago()); i++) feitos++;
  for (let i = 0; i < 3 && (await gerarPrevia()); i++) feitos++;
  if (feitos) log.info('Ciclo da Supporta terminou', { sites: feitos });
}

main().catch((err) => {
  log.error('Ciclo da Supporta falhou', { erro: (err as Error).message });
  process.exit(1);
});
