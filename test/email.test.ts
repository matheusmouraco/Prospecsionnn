import { describe, expect, it } from 'vitest';
import type { parseJson } from '../src/lib/claude.js';
import type { Problema } from '../src/analysis/checks.js';
import { generateEmail, SemProblemasSuficientes } from '../src/email/generate.js';
import { renderEmail1 } from '../src/email/report.js';
import { chooseProblems } from '../src/email/select.js';
import { numbersIn, validateCampos, type CamposEmail } from '../src/email/validate.js';

const P = (tipo: Problema['tipo'], gravidade: number, descricao_curta: string, evidencia: string, origem: Problema['origem'] = 'medido'): Problema =>
  ({ tipo, gravidade, descricao_curta, evidencia, origem });

// Real problems from the dentelli.com.br analysis.
const dentelli: Problema[] = [
  P('design', 5, 'Depois dos tratamentos, a página fica vazia', 'No print da página inteira há uma área enorme de fundo cinza sem conteúdo', 'visual'),
  P('velocidade', 5, 'Demora 47,7 segundos para mostrar o conteúdo principal no celular', 'Google PageSpeed (celular): LCP de 47,7 s; o recomendado é até 2,5 s'),
  P('conversao', 4, 'Não tem um jeito rápido de o cliente entrar em contato', 'Nenhum botão de WhatsApp, link de telefone ou formulário na página inicial'),
  P('ia', 4, 'Não tem um resumo próprio para assistentes de IA (llms.txt)', 'Arquivo /llms.txt não encontrado'),
  P('ia', 3, 'Google e IAs não recebem de forma organizada o que a empresa faz, onde fica e como contatar', 'Nenhum dado estruturado schema.org'),
];

describe('chooseProblems', () => {
  it('takes the most severe (measured wins ties) and an AI problem as the second', () => {
    const [p1, p2] = chooseProblems(dentelli)!;
    expect(p1.descricao_curta).toContain('47,7 segundos');
    expect(p2!.tipo).toBe('ia');
    expect(p2!.gravidade).toBe(4);
  });

  it('without AI problems, picks the next most severe of another type', () => {
    const [p1, p2] = chooseProblems(dentelli.filter((p) => p.tipo !== 'ia'))!;
    expect(p1.tipo).toBe('velocidade');
    expect(p2!.tipo).toBe('design');
  });

  it('when the worst is already AI, the second is another type', () => {
    const [p1, p2] = chooseProblems([P('ia', 5, 'IA bloqueada', 'robots.txt bloqueia GPTBot'), P('ia', 4, 'Sem llms', 'sem arquivo'), P('seo', 2, 'Sem título', 'sem title')])!;
    expect(p1.tipo).toBe('ia');
    expect(p2!.tipo).toBe('seo');
  });

  it('ignores problems without evidence', () => {
    expect(chooseProblems([P('design', 5, 'Feio', '')])).toBeNull();
  });
});

const fontes = [
  { campo: 'problema_1' as const, texto: 'Demora 47,7 segundos para mostrar o conteúdo principal no celular. LCP de 47,7 s; o recomendado é até 2,5 s' },
  { campo: 'problema_2' as const, texto: 'Não tem um resumo próprio para assistentes de IA (llms.txt). Arquivo /llms.txt não encontrado' },
];
const bom: CamposEmail = {
  nome_empresa: 'Dentelli',
  problema_1: 'No celular, o site leva 47,7 segundos para mostrar o conteúdo principal. A maioria das pessoas desiste bem antes disso.',
  problema_2: 'O site não tem um resumo preparado para assistentes como o ChatGPT, então eles têm pouca informação para indicar a clínica.',
  gancho: 'Hoje muita gente pergunta para o ChatGPT ou para o Google qual dentista procurar, e quem não aparece lá perde o paciente para o vizinho.',
  nicho: 'clínica odontológica',
};

describe('validateCampos', () => {
  it('accepts well-written fields', () => {
    expect(validateCampos(bom, fontes)).toEqual([]);
  });

  it('rejects invented numbers, jargon, dashes, links, AI phrases, stats and long fields', () => {
    const issues = validateCampos(
      {
        nome_empresa: 'Dentelli',
        problema_1: 'O LCP é de 47,7 s e 53% das pessoas desistem — péssimo.',
        problema_2: 'Veja em www.dentelli.com.br, no cenário atual falta o llms.txt.',
        gancho: 'Hoje 70% dos clientes pesquisam com IA.',
        nicho: 'x'.repeat(256),
      },
      fontes,
    );
    const all = issues.join('\n');
    expect(all).toContain('problema_1 usa travessão');
    expect(all).toContain('problema_1 usa termo técnico (LCP)');
    expect(all).toContain('problema_1 cita números que não estão na evidência medida: 53');
    expect(all).toContain('problema_2 contém link');
    expect(all).toContain('problema_2 usa frase de efeito artificial');
    expect(all).toContain('problema_2 usa termo técnico (llms.txt)');
    expect(all).toContain('gancho não pode ter números (70)');
    expect(all).toContain('nicho tem 256 caracteres');
  });

  it('normalizes decimal separators and does not flag words that contain jargon letters', () => {
    expect(numbersIn('7,2 e 7.2 e 10')).toEqual(['7.2', '7.2', '10']);
    expect(validateCampos({ ...bom, gancho: 'No domingo ninguém liga, mas no Google sim.' }, fontes)).toEqual([]);
  });
});

describe('generateEmail', () => {
  const input = { empresa: 'DENTELLI ODONTOLOGIA LTDA', dominio: 'dentelli.com.br', nicho: 'clínica odontológica', titulos: ['Dentelli'], problemas: dentelli };

  it('rewrites until the fields pass validation, telling the model what failed', async () => {
    const calls: string[] = [];
    const answers = [{ ...bom, problema_1: 'O LCP é de 47,7 s.' }, bom];
    const parse = (async (opts: { content: Array<{ type: string; text?: string }>; system: string }) => {
      calls.push(opts.content.map((c) => c.text ?? '').join(''));
      if (calls.length === 1) expect(opts.system).toContain('ChatGPT, no Gemini e no Google com IA');
      return { data: answers[calls.length - 1], costUsd: 0.01 };
    }) as unknown as typeof parseJson;

    const r = await generateEmail(input, { parse });
    expect(r.tentativas).toBe(2);
    expect(r.campos).toEqual(bom);
    expect(r.custo_usd).toBeCloseTo(0.02);
    expect(calls[1]).toContain('termo técnico (LCP)');
    expect(calls[0]).toContain('LCP de 47,7 s');
  });

  it('gives up after three invalid answers and needs two problems', async () => {
    const parse = (async () => ({ data: { ...bom, gancho: '90% das pessoas' }, costUsd: 0 })) as unknown as typeof parseJson;
    await expect(generateEmail(input, { parse })).rejects.toThrow('após 3 tentativas');
    await expect(generateEmail({ ...input, problemas: dentelli.slice(0, 1) }, { parse })).rejects.toBeInstanceOf(SemProblemasSuficientes);
  });
});

describe('renderEmail1', () => {
  it('has no link and no dash', () => {
    const txt = renderEmail1('Ana', bom, 'Moura', 'Matilab');
    expect(txt).toContain('Oi Ana, tudo bem?');
    expect(txt).toContain('1. No celular, o site leva 47,7 segundos');
    expect(txt).not.toMatch(/https?:|www\.|—|–/);
  });
});
