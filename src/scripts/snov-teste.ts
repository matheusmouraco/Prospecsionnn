import { getEnv, requireEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { SnovClient } from '../snov/client.js';
import { firstReadyDomain, loadEnvio, prospectIdByDomain } from '../snov/outreach-store.js';

const log = logger.child({ etapa: 'envio-teste' });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// `npm run snov:teste -- voce@gmail.com outro@gmail.com [--dominio site.com.br] --confirmar`
// Puts YOUR OWN addresses in the outreach list with the real fields of one analyzed company, so the
// campaign sends you exactly what that company would get. Nothing changes in the prospect queue or metrics.
// It ignores DRY_RUN on purpose (only the addresses typed here receive anything) and needs --confirmar.
async function main(): Promise<void> {
  const env = getEnv();
  const args = process.argv.slice(2);
  const i = args.indexOf('--dominio');
  const dominio = i >= 0 ? args[i + 1]! : await firstReadyDomain();
  const destinos = args.filter((a, j) => EMAIL.test(a) && j !== i + 1);
  if (!destinos.length) throw new Error('Informe pelo menos um email seu: npm run snov:teste -- voce@gmail.com --confirmar');

  const e = await loadEnvio(await prospectIdByDomain(dominio));
  log.info('Campos que vão no teste', { dominio, ...e.campos });
  if (!args.includes('--confirmar')) {
    log.warn('Prévia apenas. Para colocar os emails na lista de saída, rode de novo com --confirmar');
    return;
  }
  const listId = requireEnv('SNOV_OUTREACH_LIST_ID');
  const snov = new SnovClient({ clientId: requireEnv('SNOV_CLIENT_ID'), clientSecret: requireEnv('SNOV_CLIENT_SECRET') });
  for (const email of destinos) {
    const r = await snov.addProspectToList(listId, {
      email, firstName: null, companyName: e.empresa, companySite: e.dominio ? `https://${e.dominio}` : null, customFields: e.campos,
    });
    log.info(r.ok ? 'Email de teste na lista de saída' : 'Snov não confirmou', { email, lista: listId, dry_run_ignorado: env.DRY_RUN });
  }
}

main().catch((err: unknown) => {
  log.error('snov:teste falhou', { err });
  process.exitCode = 1;
});
