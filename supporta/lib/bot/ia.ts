import { ramos } from "@/lib/criador";
import { pricing } from "@/lib/plans";
import type { Briefing, Servico } from "./db";

// Chamadas ao Claude pela API de Messages (fetch, sem SDK). Sempre JSON; se vier quebrado, uma nova tentativa com o erro.

const MODELO = () => process.env.BOT_MODEL || "claude-sonnet-5-5";

type Bloco = { type: "text"; text: string } | { type: "image"; source: { type: "base64"; media_type: string; data: string } };

function limparJson(texto: string) {
  const t = texto.replace(/```json\s*|```/g, "").trim();
  const ini = t.indexOf("{");
  const fim = t.lastIndexOf("}");
  return ini >= 0 && fim > ini ? t.slice(ini, fim + 1) : t;
}

async function json<T>(sistema: string, conteudo: string | Bloco[], maxTokens = 1200): Promise<T> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY ausente.");
  const mensagens: { role: "user" | "assistant"; content: string | Bloco[] }[] = [{ role: "user", content: conteudo }];
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    const res = await fetch(`${process.env.ANTHROPIC_BASE_URL?.replace(/\/$/, "") ?? "https://api.anthropic.com"}/v1/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODELO(), max_tokens: maxTokens, system: `${sistema}\n\nResponda SOMENTE com JSON válido, sem markdown e sem comentários.`, messages: mensagens }),
      signal: AbortSignal.timeout(60_000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`Claude: ${res.status} ${data?.error?.message ?? ""}`.trim());
    const texto = ((data.content ?? []) as { type: string; text?: string }[]).filter((b) => b.type === "text").map((b) => b.text).join("");
    try {
      return JSON.parse(limparJson(texto)) as T;
    } catch (err) {
      mensagens.push({ role: "assistant", content: texto || "(vazio)" }, { role: "user", content: `Isso não é um JSON válido (${(err as Error).message}). Devolva só o JSON.` });
    }
  }
  throw new Error("Claude não devolveu JSON válido.");
}

const TOM = `Português do Brasil, simples e direto, como uma pessoa falando no WhatsApp. Frases curtas. Nunca use travessão (os traços longos, nem o meia-risca). Nada de "transforme", "soluções", "excelência", "venha conhecer". Sem emoji.`;

/** O que o robô pode afirmar sobre a Supporta. Nada além disso. */
export const FATOS = `Fatos da Supporta (não invente nada além disso):
- O site profissional custa R$ ${pricing.site} pago uma vez. Fica pronto em até ${pricing.prazoHoras}h depois do pagamento, com até 5 páginas (início, sobre, serviços, perguntas e contato).
- Endereço nome.supporta.com.br com hospedagem e SSL incluso no 1º ano. A partir do 2º ano, renova por R$ ${pricing.endereco}/ano. Sem mensalidade, sem fidelidade.
- Domínio próprio .com.br é opcional: R$ ${pricing.dominio}/ano desde o 1º ano.
- Alterações sem custo nos primeiros ${pricing.diasAlteracaoGratis} dias depois da entrega. Depois, R$ ${pricing.alteracao} cada.
- A prévia é feita antes de pagar: o cliente só paga se gostar. Arrependimento em até 7 dias.
- O site já vem pronto pro Google e pras IAs (ChatGPT, Gemini), com botão de WhatsApp e mapa.
- Algo fora disso (loja virtual, sistema, integração) é projeto personalizado, com orçamento à parte combinado aqui mesmo no WhatsApp.
- Quem conversa com o cliente é o Matheus, da Supporta. Fale sempre em primeira pessoa, como ele.`;

const listaRamos = ramos.filter((r) => r.slug !== "outro").map((r) => `${r.slug} (${r.nome})`).join(", ");

export async function extrairNegocio(texto: string) {
  return json<{ negocio: string | null; instagram: string | null; site: string | null }>(
    `Extraia de uma mensagem de WhatsApp o nome do negócio, o @ do Instagram e o endereço do site. Se só vier o @, deduza um nome legível (ex: "@qualypisos_" vira "Qualy Pisos"). instagram sem @ e sem URL. site só o domínio (ex: "clinicax.com.br"). null quando não houver.`,
    `Mensagem: """${texto}"""\nJSON: {"negocio": string|null, "instagram": string|null, "site": string|null}`,
    300,
  );
}

export type ServicosExtraidos = {
  servicos: Servico[];
  cidade: string | null;
  atendeTodoBrasil: boolean;
  ramo: string;
  ramoOutro: string | null;
  frase: string;
  confirmacao: string;
};

export async function extrairServicos(texto: string, b: Briefing) {
  return json<ServicosExtraidos>(
    `${TOM}
Um dono de negócio respondeu "o que vocês vendem, com o preço, e de que cidade atendem?". Estruture:
- servicos: até 8 {nome, preco}. preco curto ("R$ 50 o m²", "a partir de R$ 80") ou null se não deu preço.
- cidade: "Barueri, SP", "Osasco e região"... null se não disse.
- atendeTodoBrasil: true se atende o Brasil todo ou online.
- ramo: um destes slugs: ${listaRamos}, ou "outro".
- ramoOutro: o ramo em 2 a 4 palavras quando ramo for "outro"; senão null.
- frase: uma frase de até 160 caracteres dizendo o que o negócio faz e para quem, só com o que foi dito.
- confirmacao: UMA frase curta começando com "Entendi," repetindo o essencial.`,
    `Negócio: ${b.negocio ?? "?"}\nBio do Instagram: ${b.instagramPerfil?.bio ?? "-"}\nSite atual: ${b.site?.titulo ?? "-"} ${b.site?.descricao ?? ""}\nResposta: """${texto}"""`,
    900,
  );
}

export type LeituraImagem = { tipo: "logo" | "foto"; alt: string; cores: string[]; qualidade: "boa" | "media" | "ruim" };

export async function lerImagem(base64: string, mime: string, negocio?: string) {
  const media = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mime) ? mime : "image/jpeg";
  return json<LeituraImagem>(
    `Você classifica imagens que um dono de negócio (${negocio ?? "?"}) mandou pelo WhatsApp para montar o site.
- tipo: "logo" se for logotipo ou marca; "foto" se for trabalho, produto, loja, equipe, ambiente.
- alt: descrição concreta em uma frase, em português.
- cores: até 3 cores principais em hex (para logo, a cor da marca primeiro; ignore branco e preto puros se houver outra).
- qualidade: boa, media ou ruim (borrada, escura, pequena).`,
    [
      { type: "image", source: { type: "base64", media_type: media, data: base64 } },
      { type: "text", text: 'JSON: {"tipo","alt","cores","qualidade"}' },
    ],
    300,
  );
}

export async function resumoFinal(b: Briefing, whatsapp: string) {
  const r = await json<{ resumo: string }>(
    `${TOM}\nEscreva UMA mensagem curta começando com "Show, então ficou assim:" resumindo o que vai no site: nome, o que faz, serviços principais (com preço se tiver), cidade ou abrangência e que o botão do site leva pro WhatsApp ${whatsapp}. Sem lista e sem quebra de linha.`,
    JSON.stringify({ negocio: b.negocio, frase: b.frase, servicos: b.servicos, cidade: b.cidade, todoBrasil: b.atendeTodoBrasil, ajustes: b.ajustes }) + '\nJSON: {"resumo": string}',
    400,
  );
  return r.resumo;
}

export type Intencao = { intencao: "aprovou" | "ajuste" | "duvida" | "pagou" | "humano" | "outro"; ajuste: string | null; resposta: string | null };

/** Depois da prévia (ou do site no ar): gostou, quer mudar algo, dúvida ou quer falar com gente? */
export async function interpretarResposta(texto: string, contexto: string) {
  return json<Intencao>(
    `${TOM}
${contexto}
Classifique a mensagem do cliente:
- "aprovou": gostou, aprovou, quer publicar, quer pagar, "pode ser", "fechou", "manda o link".
- "ajuste": pede qualquer mudança no site (texto, foto, cor, preço, tirar ou colocar algo). Em "ajuste", a instrução objetiva.
- "pagou": diz que já pagou ou mandou comprovante.
- "duvida": pergunta sobre preço, prazo, domínio, o que está incluso. Responda em "resposta" com 1 ou 2 frases, só com os fatos abaixo.
- "humano": quer falar com uma pessoa, reclamação séria, ou pede algo fora do site (loja, sistema).
- "outro": o resto. "resposta" curta e simpática puxando de volta pro site.
${FATOS}`,
    `Mensagem: """${texto}"""\nJSON: {"intencao", "ajuste": string|null, "resposta": string|null}`,
    500,
  );
}

export type DadosPagamento = { nome: string | null; email: string | null; documento: string | null; dominio: boolean | null; dominioDesejado: string | null };

export async function extrairDados(texto: string) {
  return json<DadosPagamento>(
    `Extraia de uma mensagem de WhatsApp os dados para emitir o pagamento:
- nome: nome completo do responsável, se veio.
- email: e-mail, se veio.
- documento: CPF ou CNPJ só com números, se veio.
- dominio: true se quer domínio próprio .com.br, false se disse que não quer ou que fica com o endereço da Supporta, null se não falou.
- dominioDesejado: o domínio que ele quer (ex: "clinicax.com.br"), se disse.`,
    `Mensagem: """${texto}"""\nJSON: {"nome","email","documento","dominio","dominioDesejado"}`,
    300,
  );
}
