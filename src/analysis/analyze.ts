import { join } from 'node:path';
import type { Browser } from 'playwright';
import type { FetchLike } from '../snov/client.js';
import { checkAiReadiness, type ProntidaoIA } from './ai-readiness.js';
import { captureSite } from './browser.js';
import { aiProblems, measuredProblems, type Problema } from './checks.js';
import type { Acesso, Marca, Prints } from './facts.js';
import { runPageSpeed, type PageSpeedResult } from './pagespeed.js';
import { evaluateVisually } from './vision.js';

export interface AnaliseInput {
  dominio: string;
  empresa: string | null;
  lista: string | null;
}

export interface Analise {
  dominio: string;
  acesso: Acesso;
  pagespeed_mobile: PageSpeedResult | null;
  pagespeed_desktop: PageSpeedResult | null;
  prints: Prints | null;
  marca: Marca | null;
  prontidao_ia: ProntidaoIA | null;
  problemas: Problema[];
  nota_site: number;
  nicho_detectado: string | null;
  resumo: string | null;
  custo_usd: number;
}

export interface AnalyzeDeps {
  browser: Browser;
  pagespeedKey: string;
  outDir: string;
  pagespeed?: typeof runPageSpeed;
  vision?: typeof evaluateVisually;
  fetch?: FetchLike; // robots.txt, llms.txt, sitemap and raw HTML
}

// Full analysis of one site. Only measured facts and what is visible in the prints become problems.
export async function analyzeSite(input: AnaliseInput, deps: AnalyzeDeps): Promise<Analise> {
  const psi = deps.pagespeed ?? runPageSpeed;
  const captura = await captureSite(deps.browser, input.dominio, join(deps.outDir, input.dominio));

  if (captura.acesso.status === 'fora_do_ar') {
    return {
      dominio: input.dominio,
      acesso: captura.acesso,
      pagespeed_mobile: null,
      pagespeed_desktop: null,
      prints: null,
      marca: null,
      prontidao_ia: null,
      problemas: measuredProblems(captura, null, null),
      nota_site: 0,
      nicho_detectado: null,
      resumo: 'O site não abriu durante a análise.',
      custo_usd: 0,
    };
  }

  const url = captura.acesso.url_final ?? `https://${input.dominio}`;
  const [mobile, desktop, ia] = await Promise.all([
    psi(url, 'mobile', deps.pagespeedKey).catch(() => null),
    psi(url, 'desktop', deps.pagespeedKey).catch(() => null),
    checkAiReadiness(url, captura.desktop, deps.fetch),
  ]);

  const marca = captura.desktop?.marca ?? null;
  const medidos = [
    ...measuredProblems(captura, mobile, desktop),
    ...aiProblems(ia, mobile, !!(marca?.telefone || marca?.endereco)),
  ];
  const visual = await (deps.vision ?? evaluateVisually)({
    dominio: input.dominio,
    empresa: input.empresa,
    lista: input.lista,
    captura,
    medidos,
  });

  return {
    dominio: input.dominio,
    acesso: captura.acesso,
    pagespeed_mobile: mobile,
    pagespeed_desktop: desktop,
    prints: captura.prints,
    marca,
    prontidao_ia: ia,
    problemas: [...medidos, ...visual.problemas].sort((a, b) => b.gravidade - a.gravidade),
    nota_site: visual.nota_site,
    nicho_detectado: visual.nicho_detectado || null,
    resumo: visual.resumo || null,
    custo_usd: visual.custo_usd,
  };
}
