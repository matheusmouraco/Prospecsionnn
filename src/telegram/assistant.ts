import { z } from 'zod';
import { getEnv } from '../config/env.js';
import { parseJson } from '../lib/claude.js';
import { loadPrompt } from '../lib/prompts.js';

export const ACOES = ['nenhuma', 'status', 'pausar', 'retomar', 'painel', 'analisar', 'fila', 'importar', 'esboco', 'aprovar'] as const;

const Intencao = z.object({
  acao: z.enum(ACOES),
  motivo: z.string().default(''),
  dominio: z.string().default(''),
  quantidade: z.number().int().default(0),
  resposta: z.string(),
});
export type Intencao = z.infer<typeof Intencao>;

export interface Turno { de: 'moura' | 'bot'; texto: string }

// Free-text message from Moura -> one allowed action + a reply. The model never runs anything itself:
// the bot maps `acao` to the same fixed commands as the slash commands.
export async function interpretar(texto: string, situacao: string, historico: Turno[], deps: { parse?: typeof parseJson } = {}): Promise<Intencao> {
  const env = getEnv();
  const system = await loadPrompt('telegram-assistente', { dono: env.SENDER_NAME.split(' ')[0] ?? 'Moura', marca: env.SENDER_BRAND });
  const conversa = historico.slice(-8).map((t) => `${t.de === 'moura' ? 'Ele' : 'Você'}: ${t.texto}`).join('\n');
  const { data } = await (deps.parse ?? parseJson)({
    model: env.MODEL_FAST,
    system,
    content: [{ type: 'text', text: `Situação agora:\n${situacao}\n\nConversa recente:\n${conversa || '(nenhuma)'}\n\nMensagem nova: ${texto}` }],
    schema: Intencao,
    effort: 'low',
    maxTokens: 2000,
  });
  return data;
}
