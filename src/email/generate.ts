import { z } from 'zod';
import type { Problema } from '../analysis/checks.js';
import { getEnv } from '../config/env.js';
import { parseJson } from '../lib/claude.js';
import { loadPrompt } from '../lib/prompts.js';
import { saudacao } from './greeting.js';
import { chooseProblems, type ProblemaEscolhido } from './select.js';
import { validateCampos, type CamposEmail, type Fonte } from './validate.js';

const CamposSchema = z.object({
  nome_empresa: z.string(),
  site_da_empresa: z.string(),
  problema_1: z.string(),
  problema_2: z.string(),
  gancho: z.string(),
  nicho: z.string(),
});

const MAX_ATTEMPTS = 3;

const INSTRUCAO_IA =
  'Um dos problemas é sobre aparecer em buscas feitas com inteligência artificial: no gancho, lembre que hoje muitos clientes também pesquisam no ChatGPT, no Gemini e no Google com IA antes de escolher, e que o site precisa estar preparado para aparecer lá.';

export interface EmailInput {
  primeiro_nome: string | null;
  empresa: string | null;
  dominio: string;
  nicho: string | null;
  titulos: string[];
  problemas: Problema[];
}

export interface EmailGerado {
  campos: CamposEmail;
  problemas_usados: ProblemaEscolhido[];
  tentativas: number;
  custo_usd: number;
}

export class SemProblemasSuficientes extends Error {}

const fonte = (p: ProblemaEscolhido): string => `${p.descricao_curta} ${p.evidencia}`;
const trimAll = (c: CamposEmail): CamposEmail =>
  Object.fromEntries(Object.entries(c).map(([k, v]) => [k, String(v).replace(/\s+/g, ' ').trim()])) as unknown as CamposEmail;

// Writes the Snov custom fields for one prospect. Only the two problems chosen by the code
// can be cited, and the output is rejected (and rewritten) if it breaks any rule in validate.ts.
export async function generateEmail(input: EmailInput, deps: { parse?: typeof parseJson } = {}): Promise<EmailGerado> {
  const chosen = chooseProblems(input.problemas);
  if (!chosen || !chosen[1]) throw new SemProblemasSuficientes(`${input.dominio} tem menos de dois problemas com evidência`);
  const [p1, p2] = chosen as [ProblemaEscolhido, ProblemaEscolhido];
  const env = getEnv();
  const parse = deps.parse ?? parseJson;

  const system = await loadPrompt('email-campos', {
    marca: env.SENDER_BRAND,
    remetente: env.SENDER_NAME,
    instrucao_ia: p1.tipo === 'ia' || p2.tipo === 'ia' ? INSTRUCAO_IA : '',
  });
  const dados = await loadPrompt('email-campos-dados', {
    empresa: input.empresa ?? '(sem nome no cadastro)',
    dominio: input.dominio,
    nicho: input.nicho ?? '(não detectado)',
    titulos: input.titulos.slice(0, 8).join(' | ') || '(nenhum)',
    p1_descricao: p1.descricao_curta,
    p1_evidencia: p1.evidencia,
    p2_descricao: p2.descricao_curta,
    p2_evidencia: p2.evidencia,
  });
  const fontes: Fonte[] = [
    { campo: 'problema_1', texto: fonte(p1) },
    { campo: 'problema_2', texto: fonte(p2) },
  ];

  let feedback = '';
  let custo = 0;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const { data, costUsd } = await parse({
      model: env.MODEL_FAST,
      system,
      content: [{ type: 'text', text: dados + feedback }],
      schema: CamposSchema,
      effort: 'medium',
      maxTokens: 4000,
    });
    custo += costUsd;
    const campos = trimAll({ saudacao: saudacao(input.primeiro_nome, input.dominio, input.empresa), ...data });
    const issues = validateCampos(campos, fontes);
    if (!issues.length) return { campos, problemas_usados: [p1, p2], tentativas: attempt, custo_usd: custo };
    feedback =
      `\n\nSua versão anterior foi recusada:\n${JSON.stringify(campos, null, 2)}\n` +
      `Problemas encontrados:\n${issues.map((i) => `- ${i}`).join('\n')}\nReescreva corrigindo todos.`;
  }
  throw new Error(`Campos do email de ${input.dominio} continuaram inválidos após ${MAX_ATTEMPTS} tentativas: ${feedback}`);
}
