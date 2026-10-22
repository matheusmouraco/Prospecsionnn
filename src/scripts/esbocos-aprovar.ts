import { setApproval } from '../draft/store.js';
import { logger } from '../lib/logger.js';

// Manual approval (Moura): `npm run esbocos:aprovar -- site.com.br` or `-- site.com.br --reprovar`.
// Only approved drafts can be published or sent (Phase 7).
async function main(): Promise<void> {
  const dominio = process.argv.slice(2).find((a) => !a.startsWith('--'));
  if (!dominio) throw new Error('Informe o site: npm run esbocos:aprovar -- site.com.br');
  const aprovado = !process.argv.includes('--reprovar');
  await setApproval(dominio, aprovado);
  logger.info(aprovado ? 'Esboço aprovado' : 'Aprovação retirada', { dominio });
}

main().catch((err: unknown) => {
  logger.error('esbocos:aprovar falhou', { err });
  process.exitCode = 1;
});
