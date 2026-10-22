import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { launchBrowser } from '../analysis/browser.js';
import { getEnv, requireEnv } from '../config/env.js';
import { adjustDraftHtml, stripInjected } from '../draft/adjust.js';
import { measureDraft } from '../draft/gains.js';
import { arquivar, selo } from '../draft/pipeline.js';
import { applyMandatory, extractHtml, injectComparativo, injectJsonLd, injectSelo, validateDraft } from '../draft/rules.js';
import { empresaIdByDomain, loadDraftInput, setApproval } from '../draft/store.js';
import { logger } from '../lib/logger.js';

const OUT_DIR = 'out/esbocos';
const log = logger.child({ etapa: 'esboco' });

// Adjusts an existing draft instead of creating a new one:
//   npm run esbocos:ajustar -- site.com.br --pedidos ajustes.txt [--base caminho/da/versao.html]
// ajustes.txt has one request per line. The current files go to historico/ first.
async function main(): Promise<void> {
  const env = getEnv();
  requireEnv('ANTHROPIC_API_KEY');
  const whatsapp = requireEnv('SENDER_WHATSAPP_URL');
  const args = process.argv.slice(2);
  const opt = (n: string) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
  const dominio = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
  const pedidosFile = opt('pedidos');
  if (!dominio || !pedidosFile) throw new Error('Uso: npm run esbocos:ajustar -- site.com.br --pedidos ajustes.txt [--base versao.html]');

  const dir = join(OUT_DIR, dominio);
  const basePath = opt('base') ?? join(dir, 'index.html');
  if (!existsSync(basePath)) throw new Error(`Versão base não encontrada: ${basePath}`);
  const pedidos = (await readFile(pedidosFile, 'utf8')).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const base = stripInjected(await readFile(basePath, 'utf8'), whatsapp);
  const input = await loadDraftInput(await empresaIdByDomain(dominio));
  const fonteNumeros = [input.empresa, input.dominio, ...input.marca.titulos, ...input.marca.paragrafos, input.marca.telefone ?? '', input.marca.endereco ?? '', base].join(' ');
  const check = { agencia: env.SENDER_BRAND, empresa: input.empresa, whatsapp, fonteNumeros };

  log.info('Ajustando esboço', { dominio, base: basePath, pedidos: pedidos.length });
  let extra: string[] = [];
  let html: string | null = null;
  for (let tentativa = 1; tentativa <= 2 && !html; tentativa++) {
    const gen = await adjustDraftHtml(env.MODEL_DESIGN, env.SENDER_BRAND, base, [...pedidos, ...extra]);
    const raw = extractHtml(gen.text);
    if (!raw) { extra = ['responda com o HTML completo']; continue; }
    const candidate = applyMandatory(raw, { agencia: env.SENDER_BRAND, empresa: input.empresa, whatsapp });
    const issues = validateDraft(candidate, check);
    if (issues.length) { log.warn('Ajuste recusado pelas regras', { problemas: issues }); extra = issues; continue; }
    html = candidate;
  }
  if (!html) throw new Error('O ajuste não passou nas regras em 2 tentativas; a versão atual foi mantida');

  const browser = await launchBrowser();
  try {
    const medidas = await measureDraft(browser, html);
    const final = injectSelo(injectComparativo(injectJsonLd(html, {
      nome: input.empresa, url: `https://${dominio}`, nicho: input.nicho, telefone: input.marca.telefone,
      endereco: input.marca.endereco, descricao: medidas.desktop.meta_description, logo: input.marca.logo_url,
    }), []), await selo(), env.SENDER_BRAND);
    const baseCopy = await readFile(basePath, 'utf8');
    await arquivar(dir);
    await writeFile(join(dir, 'base.html'), baseCopy);
    await writeFile(join(dir, 'index.html'), final);
  } finally {
    await browser.close();
  }
  await setApproval(dominio, false);
  log.info('Esboço ajustado. Revise e aprove de novo', { arquivo: join(dir, 'index.html') });
}

main().catch((err: unknown) => {
  log.error('esbocos:ajustar falhou', { err });
  process.exitCode = 1;
});
