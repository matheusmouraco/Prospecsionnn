import type { Browser, BrowserContextOptions } from 'playwright';
import { devices } from 'playwright';
import { htmlTextLength } from '../analysis/ai-readiness.js';
import type { Problema } from '../analysis/checks.js';
import { EXTRACT_SCRIPT } from '../analysis/extract-script.js';
import type { DomFacts } from '../analysis/facts.js';
import { revealPage } from '../lib/page.js';
import type { LinhaComparativo } from './rules.js';

const DESKTOP: BrowserContextOptions = { viewport: { width: 1440, height: 900 }, locale: 'pt-BR' };
const MOBILE: BrowserContextOptions = { ...devices['iPhone 13'], locale: 'pt-BR' };

export interface MedidasEsboco {
  desktop: DomFacts;
  mobile: DomFacts;
  texto_html_chars: number;
}

async function factsFor(browser: Browser, html: string, options: BrowserContextOptions): Promise<DomFacts> {
  const context = await browser.newContext(options);
  try {
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: 'load', timeout: 30_000 }).catch(() => undefined);
    await revealPage(page);
    return (await page.evaluate(EXTRACT_SCRIPT)) as DomFacts;
  } finally {
    await context.close();
  }
}

// Same extraction used on the original site, run on the draft.
export async function measureDraft(browser: Browser, html: string): Promise<MedidasEsboco> {
  const [desktop, mobile] = await Promise.all([factsFor(browser, html, DESKTOP), factsFor(browser, html, MOBILE)]);
  return { desktop, mobile, texto_html_chars: htmlTextLength(html) };
}

const NEGOCIO = /Organization|LocalBusiness|Dentist|Medical|Physician|Clinic|Hospital|Store|Professional|Service|Legal/i;

interface Ganho {
  // descricao_curta of the original measured problem (src/analysis/checks.ts)
  problema: RegExp;
  corrigido: (m: MedidasEsboco) => boolean;
  linha: LinhaComparativo;
}

// Each gain pairs a problem measured on the original site with the same check passing on the draft.
// Speed, HTTPS, sitemap and llms.txt are left out: they can only be measured once the page is published.
const GANHOS: Ganho[] = [
  {
    problema: /^O site não foi feito para celular/,
    corrigido: (m) => m.mobile.tem_viewport,
    linha: { item: 'Celular', atual: 'Página encolhida na tela do celular', proposta: 'Página feita para a tela do celular' },
  },
  {
    problema: /^No celular a página fica mais larga que a tela/,
    corrigido: (m) => !m.mobile.rolagem_horizontal,
    linha: { item: 'Largura no celular', atual: 'Conteúdo maior que a tela, com rolagem para o lado', proposta: 'Conteúdo cabe na tela do celular' },
  },
  {
    problema: /^(O botão de contato não aparece na primeira tela do celular|Não tem um jeito rápido de o cliente entrar em contato)/,
    corrigido: (m) => m.mobile.contato_visivel_na_dobra,
    linha: { item: 'Contato no celular', atual: 'Sem botão de contato na primeira tela', proposta: 'Botão de WhatsApp visível na primeira tela' },
  },
  {
    problema: /^Google e IAs não recebem de forma organizada/,
    corrigido: (m) => m.desktop.dados_estruturados.some((t) => NEGOCIO.test(t)),
    linha: { item: 'Leitura por Google e IAs', atual: 'Sem dados organizados sobre a empresa', proposta: 'Nome, contato e área da empresa organizados para Google e IAs' },
  },
  {
    problema: /^Para as IAs a página aparece quase vazia/,
    corrigido: (m) => m.texto_html_chars >= m.desktop.texto_renderizado_chars * 0.7,
    linha: { item: 'Texto lido pelas IAs', atual: 'Página quase vazia para robôs de IA', proposta: 'Todo o texto disponível para robôs de IA' },
  },
  {
    problema: /^O site não responde as dúvidas que os clientes perguntam para a IA/,
    corrigido: (m) => m.desktop.tem_faq,
    linha: { item: 'Perguntas frequentes', atual: 'Sem seção de dúvidas', proposta: 'Seção de perguntas frequentes com respostas do próprio site' },
  },
  {
    problema: /^Uma IA que lê o site não encontra telefone nem endereço/,
    corrigido: (m) => !!(m.desktop.marca.telefone || m.desktop.marca.endereco),
    linha: { item: 'Contato em texto', atual: 'Telefone e endereço fora do texto da página', proposta: 'Telefone e endereço em texto, legíveis por Google e IAs' },
  },
  {
    problema: /^Assistentes de IA que navegam sozinhos não entendem parte dos botões/,
    corrigido: (m) => m.desktop.controles_sem_nome === 0,
    linha: { item: 'Botões identificáveis', atual: 'Botões e links sem nome', proposta: 'Todos os botões com nome claro' },
  },
  {
    problema: /^O Google não tem um resumo do site para mostrar nas buscas/,
    corrigido: (m) => !!m.desktop.meta_description,
    linha: { item: 'Resumo no Google', atual: 'Sem resumo para as buscas', proposta: 'Resumo da empresa pronto para as buscas' },
  },
  {
    problema: /^A página não tem (título para o Google|um título principal)/,
    corrigido: (m) => !!m.desktop.title && m.desktop.h1.length >= 1,
    linha: { item: 'Títulos da página', atual: 'Sem título principal definido', proposta: 'Título principal claro para pessoas e para o Google' },
  },
  {
    problema: /^O link do site fica sem imagem e sem título quando compartilhado/,
    corrigido: (m) => !!(m.desktop.og_title && m.desktop.og_image),
    linha: { item: 'Link no WhatsApp', atual: 'Link compartilhado sem imagem e sem título', proposta: 'Link compartilhado com imagem e título' },
  },
  {
    problema: /^Texto pequeno demais para ler no celular/,
    corrigido: (m) => (m.mobile.fonte_corpo_px ?? 0) >= 16,
    linha: { item: 'Leitura no celular', atual: 'Texto pequeno demais', proposta: 'Texto em tamanho confortável' },
  },
  {
    problema: /^As imagens não têm descrição para o Google/,
    corrigido: (m) => m.desktop.imagens_sem_alt === 0,
    linha: { item: 'Imagens', atual: 'Imagens sem descrição', proposta: 'Todas as imagens com descrição' },
  },
  {
    problema: /^A aba do navegador não mostra o ícone da marca/,
    corrigido: (m) => m.desktop.tem_favicon,
    linha: { item: 'Ícone da marca', atual: 'Sem ícone na aba do navegador', proposta: 'Ícone da marca na aba do navegador' },
  },
];

// Up to `max` rows, most severe original problem first, each verified on the draft.
export function computeGains(originais: Problema[], medidas: MedidasEsboco, max = 3): LinhaComparativo[] {
  const medidos = originais.filter((p) => p.origem === 'medido').sort((a, b) => b.gravidade - a.gravidade);
  const out: LinhaComparativo[] = [];
  const usados = new Set<Ganho>();
  for (const p of medidos) {
    const g = GANHOS.find((x) => x.problema.test(p.descricao_curta) && !usados.has(x));
    if (!g || !g.corrigido(medidas)) continue;
    usados.add(g);
    out.push(g.linha);
    if (out.length >= max) break;
  }
  return out;
}
