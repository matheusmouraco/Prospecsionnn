import type { Analise } from './analyze.js';

const fmt = (v: number | null | undefined, suffix = '') => (v === null || v === undefined ? '-' : `${v}${suffix}`);
const seg = (ms: number | null | undefined) => (ms == null ? '-' : `${(ms / 1000).toFixed(1).replace('.', ',')} s`);

const ACESSO: Record<Analise['acesso']['status'], string> = {
  ok: 'abre normalmente',
  redireciona_terceiro: 'redireciona para outro domínio',
  erro_ssl: 'erro de certificado (HTTPS)',
  fora_do_ar: 'fora do ar',
};

export interface ReportItem {
  analise: Analise;
  empresa: string | null;
  decisao: 'analisado' | 'descartado_site_bom';
}

// Markdown for human review (Phase 3 criterion: out/analises.md).
export function renderReport(items: ReportItem[], minScore: number): string {
  const lines = [
    '# Análises de sites',
    '',
    `Gerado em ${new Date().toISOString()}. Sites com nota ${minScore} ou mais são descartados (site bom).`,
    '',
    '| Site | Nicho | Nota | Decisão | Problemas | Custo |',
    '| --- | --- | ---: | --- | ---: | ---: |',
    ...items.map(({ analise: a, decisao }) =>
      `| ${a.dominio} | ${a.nicho_detectado ?? '-'} | ${a.nota_site} | ${decisao === 'analisado' ? 'prospectar' : 'descartar'} | ${a.problemas.length} | US$ ${a.custo_usd.toFixed(3)} |`,
    ),
    '',
  ];

  for (const { analise: a, empresa, decisao } of items) {
    const m = a.pagespeed_mobile;
    const d = a.pagespeed_desktop;
    lines.push(
      `## ${a.dominio}${empresa ? ` (${empresa})` : ''}`,
      '',
      `- **Nota:** ${a.nota_site}/100, ${decisao === 'analisado' ? 'segue para email' : 'descartado, site bom'}`,
      `- **Nicho detectado:** ${a.nicho_detectado ?? '-'}`,
      `- **Acesso:** ${ACESSO[a.acesso.status]}`,
      `- **Resumo:** ${a.resumo ?? '-'}`,
      `- **PageSpeed celular:** desempenho ${fmt(m?.performance)}, SEO ${fmt(m?.seo)}, carregamento principal ${seg(m?.lcp_ms)}`,
      `- **PageSpeed computador:** desempenho ${fmt(d?.performance)}, SEO ${fmt(d?.seo)}, carregamento principal ${seg(d?.lcp_ms)}`,
    );
    if (a.prints) lines.push(`- **Prints:** \`${a.prints.desktop_dobra}\`, \`${a.prints.mobile_dobra}\``);
    if (a.marca) {
      lines.push(
        `- **Marca:** logo ${a.marca.logo_url ? `[link](${a.marca.logo_url})` : 'não encontrado'}; cores ${a.marca.cores.join(', ') || '-'}; fontes ${a.marca.fonte_titulo ?? '-'} / ${a.marca.fonte_corpo ?? '-'}`,
      );
    }
    lines.push('', '| Gravidade | Tipo | Problema | Evidência | Origem |', '| ---: | --- | --- | --- | --- |');
    for (const p of a.problemas) {
      lines.push(`| ${p.gravidade} | ${p.tipo} | ${p.descricao_curta} | ${p.evidencia.replace(/\|/g, '/')} | ${p.origem} |`);
    }
    if (!a.problemas.length) lines.push('| - | - | Nenhum problema encontrado | - | - |');
    lines.push('');
  }
  return lines.join('\n');
}
