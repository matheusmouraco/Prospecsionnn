import type { Respostas, SiteRow } from './db.js';
import { ramoDe } from './brief.js';
import type { PaginaSpec } from './generate.js';

const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

export interface Artigo { caminho: string; titulo: string; tema: string }

/** Two starter articles for the blog plan, from the owner's own services (educational, nothing invented). */
export function artigosDe(r: Respostas): Artigo[] {
  const ramo = ramoDe(r).toLowerCase();
  const s1 = r.servicos[0] ?? ramo;
  const s2 = r.servicos[1] ?? r.servicos[0] ?? ramo;
  const temas = [
    { titulo: `${s1}: o que é, para quem serve e como funciona`, tema: `explique ${s1} para quem está pesquisando o assunto: o que é, para quem é indicado, como costuma funcionar e quando procurar um profissional` },
    { titulo: `Como escolher ${s2 === s1 ? ramo : s2.toLowerCase()} com segurança`, tema: `um guia prático com critérios para escolher bem (o que perguntar, sinais de qualidade, o que evitar), sempre levando o leitor a conversar com a empresa` },
  ];
  return temas.map((t) => ({ ...t, caminho: `/blog/${slugify(t.titulo)}` }));
}

/**
 * Pages each plan gets after payment. The home ('/') already exists (it is the preview).
 * Moura's call (nov/2026): the price covers a one-page site only (saves tokens). Extra pages are a separate,
 * custom-priced project, switched on by hand with `respostas.multipagina = true`.
 */
export function paginasDoPlano(site: SiteRow): PaginaSpec[] {
  if (site.plano === 'start' || (site.respostas as { multipagina?: boolean }).multipagina !== true) return [];
  const r = site.respostas;
  const base: PaginaSpec[] = [
    { caminho: '/sobre', titulo: 'Sobre', instrucao: 'quem é a empresa: o que faz e para quem, como trabalha, os diferenciais informados e a região atendida. Termine com uma chamada para o WhatsApp.' },
    { caminho: '/servicos', titulo: 'Serviços', instrucao: `uma seção para cada serviço (${r.servicos.join(', ')}), explicando de forma honesta o que é, para quem serve e o que esperar, com chamada para o WhatsApp em cada um. Sem preços nem prazos.` },
    { caminho: '/perguntas', titulo: 'Perguntas frequentes', instrucao: 'de 8 a 10 perguntas que clientes desse ramo fazem de verdade, em <details>/<summary>, respondidas só com o que o dono informou ou com orientação geral e segura. Respostas diretas na primeira frase (ajuda o Google e as IAs).' },
    { caminho: '/contato', titulo: 'Contato', instrucao: 'como falar com a empresa: botão grande de WhatsApp, cidade ou região atendida, endereço e horário só se o dono informou, Instagram se houver. Sem formulário e sem mapa incorporado; se houver endereço, um link "Ver no mapa" para https://www.google.com/maps/search/?api=1&query= com o endereço.' },
  ];
  if (site.plano !== 'premium') return base;
  const artigos = artigosDe(r);
  return [
    ...base,
    { caminho: '/blog', titulo: 'Blog', instrucao: `a página do blog, com um cartão para cada artigo (título, uma linha de resumo e link): ${artigos.map((a) => `"${a.titulo}" em ${a.caminho}`).join(' e ')}. Sem datas inventadas.` },
    ...artigos.map((a) => ({
      caminho: a.caminho,
      titulo: a.titulo,
      instrucao: `um artigo de blog com o título "${a.titulo}" (no <h1>): ${a.tema}. Entre 700 e 1000 palavras, subtítulos em <h2>, parágrafos curtos, uma lista quando ajudar, e uma seção final "Fale com a ${site.empresa}" com o botão de WhatsApp. Escreva para aparecer no Google e nas IAs: responda a pergunta logo no começo. Sem estatísticas, números ou fontes inventadas. Inclua link de volta para /blog.`,
    })),
  ];
}

/** Menu shown on inner pages, with exact paths. */
export function menuDe(site: SiteRow): string {
  const itens = [['Início', '/'], ['Sobre', '/sobre'], ['Serviços', '/servicos'], ['Perguntas', '/perguntas'], ...(site.plano === 'premium' ? [['Blog', '/blog']] : []), ['Contato', '/contato']];
  return itens.map(([t, h]) => `${t} = "${h}"`).join(', ');
}

/** The home menu goes to the pages; on the blog plan a "Blog" item is added next to "Perguntas". */
export function homeMultipagina(html: string, site: SiteRow): string {
  let out = html;
  for (const [a, c] of [['sobre', '/sobre'], ['servicos', '/servicos'], ['perguntas', '/perguntas'], ['contato', '/contato']]) {
    out = out.replace(new RegExp(`href="#${a}"`, 'g'), `href="${c}"`);
  }
  if (site.plano === 'premium') {
    // Only in menus (header, nav, footer), never next to buttons in the page body.
    out = out.replace(/<(header|nav|footer)\b[\s\S]*?<\/\1>/gi, (bloco) =>
      bloco.replace(/(<a\b[^>]*href="\/perguntas"[^>]*>)([\s\S]*?)(<\/a>)/g, (m, open: string, _txt: string, close: string) => `${m}${open.replace('href="/perguntas"', 'href="/blog"').replace(/\saria-current="[^"]*"/, '')}Blog${close}`),
    );
  }
  return out;
}
