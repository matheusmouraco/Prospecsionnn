// Follow-ups escritos pela OpenAI a partir da conversa de cada cliente (decisão do Moura, nov/2026): nada de texto pronto
// igual para todo mundo, que soa robô e chama atenção do WhatsApp. Sem chave ou com erro, quem chama usa o texto padrão.

import { registrarCusto } from "./custos";

const MODELO = () => process.env.BOT_MODELO_FOLLOWUP || "gpt-4o-mini";
// USD por milhão de tokens (gpt-4o-mini).
const PRECO = { input: 0.15, output: 0.6 };

export const followUpIaLigado = () => Boolean(process.env.OPENAI_API_KEY);

/** Uma mensagem curta de follow-up, no tom do Matheus, sobre o que a conversa já tem. null se não der. */
export async function escreverFollowUp(o: { historico: string; objetivo: string; nome: string; contexto: string }): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || !o.historico.trim()) return null;
  const sistema = `Você é o Matheus, da Supporta, que cria sites para pequenos negócios pelo WhatsApp. O cliente parou de responder e você vai mandar UMA mensagem de follow-up.
Regras:
- Português do Brasil, simples, como uma pessoa no WhatsApp. Uma ou duas frases curtas, no máximo 220 caracteres.
- Personalizada: use o que a conversa já tem (nome do negócio, o que ele faz, o que ele disse por último). Nunca repita uma mensagem que já está na conversa.
- Calma, sem pressão, sem "última chance", sem urgência falsa.
- O pagamento só acontece depois de ver o site pronto, e só se gostar: lembre disso quando fizer sentido.
- Se o cliente ainda não mandou fotos, a prévia está com fotos fictícias: quando couber, peça fotos dele, do trabalho dele ou as que gostaria de ver no site.
- Nunca use travessão. No máximo um emoji. Não invente preço, prazo ou nada que não esteja no contexto.
- Responda só com o texto da mensagem.
${o.contexto}`;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODELO(),
        temperature: 0.9,
        max_tokens: 160,
        messages: [
          { role: "system", content: sistema },
          { role: "user", content: `Nome do cliente: ${o.nome || "(não sei)"}\nObjetivo desta mensagem: ${o.objetivo}\n\nConversa até aqui:\n${o.historico}` },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${res.status} ${data?.error?.message ?? ""}`);
    const uso = data.usage ?? {};
    await registrarCusto("openai", "followup", ((uso.prompt_tokens ?? 0) * PRECO.input + (uso.completion_tokens ?? 0) * PRECO.output) / 1_000_000);
    return limparFollowUp(String(data.choices?.[0]?.message?.content ?? ""));
  } catch (err) {
    console.error("[bot] follow-up openai:", (err as Error).message);
    return null;
  }
}

/** Tira aspas, travessão e o que passar do tamanho; vazio vira null. */
export function limparFollowUp(t: string): string | null {
  const limpo = t.trim().replace(/^["'“”]+|["'“”]+$/g, "").replace(/\s*[—–]\s*/g, ", ").trim();
  return limpo && limpo.length <= 400 ? limpo : null;
}
