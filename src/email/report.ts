import type { EmailGerado } from './generate.js';
import { CAMPOS, MAX_FIELD_CHARS } from './validate.js';

export interface EmailReportItem {
  dominio: string;
  primeiro_nome: string | null;
  email: EmailGerado;
}

// Email 1 as the prospect will read it (same text as prompts/sequencia-snov.md).
export function renderEmail1(nome: string | null, c: EmailGerado['campos'], remetente: string, marca: string): string {
  return [
    `**Assunto:** site da ${c.nome_empresa}`,
    '',
    `Oi ${nome ?? '{primeiro_nome}'}, tudo bem?`,
    '',
    `Dei uma olhada no site da ${c.nome_empresa} e anotei dois pontos:`,
    '',
    `1. ${c.problema_1}`,
    `2. ${c.problema_2}`,
    '',
    c.gancho,
    '',
    'Fiz um esboço de como o site de vocês poderia ficar resolvendo isso. Quer que eu te mande?',
    '',
    `${remetente} | ${marca}`,
    '',
    'Se não fizer sentido, é só responder "sair".',
  ].join('\n');
}

// Phase 4 criterion: out/emails.md, each email traceable to measured evidence.
export function renderEmailReport(items: EmailReportItem[], remetente: string, marca: string): string {
  const lines = ['# Emails gerados', '', `Gerado em ${new Date().toISOString()}. Limite por campo: ${MAX_FIELD_CHARS} caracteres.`, ''];
  for (const { dominio, primeiro_nome, email } of items) {
    lines.push(`## ${dominio}`, '', '> ' + renderEmail1(primeiro_nome, email.campos, remetente, marca).split('\n').join('\n> '), '');
    lines.push('| Campo | Caracteres | Valor |', '| --- | ---: | --- |');
    for (const k of CAMPOS) lines.push(`| ${k} | ${email.campos[k].length} | ${email.campos[k].replace(/\|/g, '/')} |`);
    lines.push('', '**De onde veio cada problema:**', '');
    email.problemas_usados.forEach((p, i) => {
      lines.push(`- problema_${i + 1} (${p.tipo}, ${p.origem}, gravidade ${p.gravidade}): ${p.descricao_curta}. Evidência: ${p.evidencia}`);
    });
    lines.push('', `Tentativas: ${email.tentativas}. Custo: US$ ${email.custo_usd.toFixed(4)}`, '');
  }
  return lines.join('\n');
}
