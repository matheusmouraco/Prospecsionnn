import type { Captura } from './facts.js';
import type { PageSpeedResult } from './pagespeed.js';

export const TIPOS_PROBLEMA = ['mobile', 'velocidade', 'seo', 'design', 'conversao', 'tecnico'] as const;
export type TipoProblema = (typeof TIPOS_PROBLEMA)[number];

// Every problem carries the measurement that proves it (rule 1: never invent a problem).
export interface Problema {
  tipo: TipoProblema;
  descricao_curta: string;
  evidencia: string;
  gravidade: number; // 1 (leve) a 5 (grave)
  origem: 'medido' | 'visual';
}

const segundos = (ms: number) => (ms / 1000).toFixed(1).replace('.', ',');

// Problems derived only from PageSpeed numbers and HTML facts.
export function measuredProblems(
  captura: Captura,
  mobile: PageSpeedResult | null,
  desktop: PageSpeedResult | null,
  anoAtual: number = new Date().getFullYear(),
): Problema[] {
  const out: Problema[] = [];
  const add = (p: Omit<Problema, 'origem'>) => out.push({ ...p, origem: 'medido' });
  const { acesso } = captura;

  if (acesso.status === 'fora_do_ar') {
    add({ tipo: 'tecnico', descricao_curta: 'O site não abre', evidencia: `Tentativa de acesso falhou: ${acesso.detalhe}`, gravidade: 5 });
    return out;
  }
  if (acesso.status === 'erro_ssl') {
    add({
      tipo: 'tecnico',
      descricao_curta: 'O navegador mostra alerta de site não seguro',
      evidencia: `Certificado de segurança (HTTPS) com erro: ${acesso.detalhe}`,
      gravidade: 5,
    });
  }
  if (acesso.status === 'redireciona_terceiro') {
    add({
      tipo: 'tecnico',
      descricao_curta: 'O endereço do site leva para outra página que não é da empresa',
      evidencia: `Ao abrir o site, o navegador foi parar em ${acesso.url_final}`,
      gravidade: 4,
    });
  }
  if (acesso.status !== 'erro_ssl' && !acesso.https) {
    add({
      tipo: 'tecnico',
      descricao_curta: 'O site não tem cadeado de segurança',
      evidencia: `O site abre sem HTTPS (${acesso.url_final}); o Chrome marca como "Não seguro"`,
      gravidade: 4,
    });
  }

  if (mobile?.lcp_ms != null && mobile.lcp_ms >= 4000) {
    add({
      tipo: 'velocidade',
      descricao_curta: `Demora ${segundos(mobile.lcp_ms)} segundos para mostrar o conteúdo principal no celular`,
      evidencia: `Google PageSpeed (celular): LCP de ${segundos(mobile.lcp_ms)} s; o recomendado é até 2,5 s`,
      gravidade: mobile.lcp_ms >= 8000 ? 5 : 4,
    });
  } else if (mobile?.performance != null && mobile.performance < 50) {
    add({
      tipo: 'velocidade',
      descricao_curta: 'Site lento no celular',
      evidencia: `Google PageSpeed (celular): nota de desempenho ${mobile.performance}/100`,
      gravidade: 4,
    });
  }
  if (desktop?.lcp_ms != null && desktop.lcp_ms >= 4000) {
    add({
      tipo: 'velocidade',
      descricao_curta: `Demora ${segundos(desktop.lcp_ms)} segundos para carregar no computador`,
      evidencia: `Google PageSpeed (computador): LCP de ${segundos(desktop.lcp_ms)} s`,
      gravidade: 3,
    });
  }
  if (mobile?.cls != null && mobile.cls >= 0.25) {
    add({
      tipo: 'mobile',
      descricao_curta: 'Os elementos "pulam" de lugar enquanto a página carrega no celular',
      evidencia: `Google PageSpeed (celular): CLS de ${mobile.cls.toFixed(2)}; o recomendado é até 0,1`,
      gravidade: 2,
    });
  }
  if (mobile?.seo != null && mobile.seo < 70) {
    add({
      tipo: 'seo',
      descricao_curta: 'Site mal preparado para aparecer no Google',
      evidencia: `Google PageSpeed: nota de SEO ${mobile.seo}/100`,
      gravidade: 3,
    });
  }

  const d = captura.desktop;
  const m = captura.mobile;
  if (d) {
    if (!d.title) add({ tipo: 'seo', descricao_curta: 'A página não tem título para o Google', evidencia: 'Tag <title> vazia ou ausente', gravidade: 3 });
    if (!d.meta_description) {
      add({
        tipo: 'seo',
        descricao_curta: 'O Google não tem um resumo do site para mostrar nas buscas',
        evidencia: 'Meta description ausente',
        gravidade: 2,
      });
    }
    if (d.h1.length === 0) add({ tipo: 'seo', descricao_curta: 'A página não tem um título principal', evidencia: 'Nenhuma tag <h1> na página inicial', gravidade: 2 });
    if (!d.tem_viewport) {
      add({
        tipo: 'mobile',
        descricao_curta: 'O site não foi feito para celular',
        evidencia: 'Falta a meta tag viewport; no celular a página aparece encolhida',
        gravidade: 5,
      });
    }
    if (d.imagens >= 3 && d.imagens_sem_alt / d.imagens >= 0.5) {
      add({
        tipo: 'seo',
        descricao_curta: 'As imagens não têm descrição para o Google',
        evidencia: `${d.imagens_sem_alt} de ${d.imagens} imagens sem texto alternativo (alt)`,
        gravidade: 1,
      });
    }
    if (d.links_whatsapp === 0 && d.links_telefone === 0 && d.formularios === 0) {
      add({
        tipo: 'conversao',
        descricao_curta: 'Não tem um jeito rápido de o cliente entrar em contato',
        evidencia: 'Nenhum botão de WhatsApp, link de telefone ou formulário na página inicial',
        gravidade: 4,
      });
    }
    const ultimoAno = d.anos_copyright.length ? Math.max(...d.anos_copyright) : null;
    if (ultimoAno !== null && ultimoAno <= anoAtual - 2) {
      add({
        tipo: 'design',
        descricao_curta: 'O site passa a impressão de abandonado',
        evidencia: `O rodapé mostra © ${ultimoAno}`,
        gravidade: 2,
      });
    }
    if (!d.tem_favicon) add({ tipo: 'tecnico', descricao_curta: 'A aba do navegador não mostra o ícone da marca', evidencia: 'Favicon ausente', gravidade: 1 });
    if (!d.og_title && !d.og_image) {
      add({
        tipo: 'conversao',
        descricao_curta: 'O link do site fica sem imagem e sem título quando compartilhado no WhatsApp',
        evidencia: 'Tags Open Graph (og:title, og:image) ausentes',
        gravidade: 2,
      });
    }
  }
  if (m) {
    if (m.rolagem_horizontal) {
      add({
        tipo: 'mobile',
        descricao_curta: 'No celular a página fica mais larga que a tela',
        evidencia: 'Medido em tela de 390px: o conteúdo ultrapassa a largura e gera rolagem lateral',
        gravidade: 4,
      });
    }
    if (m.fonte_corpo_px !== null && m.fonte_corpo_px < 14) {
      add({
        tipo: 'mobile',
        descricao_curta: 'Texto pequeno demais para ler no celular',
        evidencia: `Fonte do texto com ${m.fonte_corpo_px}px no celular; o mínimo confortável é 16px`,
        gravidade: 2,
      });
    }
    if ((m.links_whatsapp > 0 || m.links_telefone > 0) && !m.contato_visivel_na_dobra) {
      add({
        tipo: 'conversao',
        descricao_curta: 'O botão de contato não aparece na primeira tela do celular',
        evidencia: 'Existe WhatsApp/telefone na página, mas fora da primeira tela em 390px',
        gravidade: 2,
      });
    }
  }
  return out.sort((a, b) => b.gravidade - a.gravidade);
}
