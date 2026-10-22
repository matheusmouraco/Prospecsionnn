import { generateText } from '../lib/claude.js';
import { loadPrompt } from '../lib/prompts.js';
import { COMPARATIVO_MARKER } from './rules.js';

// Removes what the code injects (comparison, seal, structured data) and puts the WhatsApp placeholder
// back, so the model edits only its own page and the code injects fresh versions afterwards.
export function stripInjected(html: string, whatsapp: string): string {
  return html
    .replace(/<section class="comparativo" data-secao="comparativo">[\s\S]*?<\/section>/i, COMPARATIVO_MARKER)
    .replace(/<div class="selo-agencia" data-secao="selo"[\s\S]*?<\/div>\s*/i, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '')
    .split(whatsapp.replace(/&/g, '&amp;')).join('%%WHATSAPP%%')
    .split(whatsapp).join('%%WHATSAPP%%');
}

// Applies Moura's requested changes to an existing page, keeping the layout.
export async function adjustDraftHtml(model: string, agencia: string, base: string, pedidos: string[], deps: { generate?: typeof generateText } = {}) {
  const system = await loadPrompt('esboco-ajustar', { marca: agencia });
  return (deps.generate ?? generateText)({
    model,
    system: [{ type: 'text', text: system }],
    content: [{ type: 'text', text: `Ajustes pedidos:\n${pedidos.map((p) => `- ${p}`).join('\n')}\n\nPágina atual:\n\n${base}` }],
    effort: 'medium',
    maxTokens: 64000,
  });
}
