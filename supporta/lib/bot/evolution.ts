// Evolution API v2 (WhatsApp do robô, +55 11 93621-4697). Rotas conferidas no código oficial (EvolutionAPI/evolution-api):
// POST /message/sendText/{instance}, POST /chat/getBase64FromMediaMessage/{instance}, POST /chat/markMessageAsRead/{instance}.

export type MensagemRecebida = {
  id: string;
  /** Só números, com 55. */
  de: string;
  remoteJid: string;
  nome: string;
  tipo: "texto" | "imagem" | "documento" | "audio" | "video" | "sticker" | "outro";
  texto: string;
  mime: string;
  /** Mídia já em base64 quando o webhook está com base64 ligado. */
  base64: string | null;
};

function config() {
  const url = process.env.EVOLUTION_URL?.replace(/\/$/, "");
  const key = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;
  return url && key && instance ? { url, key, instance: encodeURIComponent(instance) } : null;
}

export const evolutionEnabled = () => Boolean(config());

async function chamar<T>(rota: string, body: unknown, timeout = 20_000): Promise<T> {
  const c = config();
  if (!c) throw new Error("Evolution não configurada (EVOLUTION_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE).");
  const res = await fetch(`${c.url}/${rota}/${c.instance}`, {
    method: "POST",
    headers: { "content-type": "application/json", apikey: c.key },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Evolution ${rota}: ${res.status} ${JSON.stringify(data).slice(0, 200)}`);
  return data as T;
}

/** Texto simples. `delay` mostra "digitando..." antes, para não parecer robô respondendo em 0 segundo. */
export async function enviarTexto(numero: string, texto: string) {
  // "digitando..." no tempo de uma pessoa: ~40 ms por letra, entre 1,5 e 7 segundos, com uma variação.
  const delay = Math.round(Math.min(7000, Math.max(1500, 1200 + texto.length * 40)) * (0.85 + Math.random() * 0.3));
  const r = await chamar<{ key?: { id?: string } }>("message/sendText", { number: numero, text: texto, delay, linkPreview: true });
  return r.key?.id ?? null;
}

/** Baixa a mídia de uma mensagem recebida (quando o webhook não trouxe o base64). */
export async function baixarMidia(id: string): Promise<{ base64: string; mime: string }> {
  const r = await chamar<{ base64?: string; mimetype?: string }>("chat/getBase64FromMediaMessage", { message: { key: { id } }, convertToMp4: false }, 40_000);
  if (!r.base64) throw new Error("Evolution não devolveu a mídia.");
  return { base64: r.base64, mime: r.mimetype ?? "image/jpeg" };
}

export async function marcarLida(m: MensagemRecebida) {
  await chamar("chat/markMessageAsRead", { readMessages: [{ id: m.id, fromMe: false, remoteJid: m.remoteJid }] }).catch(() => {});
}

type Dados = {
  key?: { remoteJid?: string; remoteJidAlt?: string; fromMe?: boolean; id?: string };
  pushName?: string;
  messageType?: string;
  message?: Record<string, any> & { base64?: string };
};

/** Lê o evento messages.upsert. Devolve null para o que o robô ignora: grupos, status, mensagens enviadas pelo próprio número. */
export function lerWebhook(payload: unknown): MensagemRecebida | null {
  const p = (payload ?? {}) as { event?: string; data?: Dados | Dados[] };
  const evento = String(p.event ?? "").toLowerCase().replace(/_/g, ".");
  if (evento && evento !== "messages.upsert") return null;
  const d = Array.isArray(p.data) ? p.data[0] : p.data;
  const key = d?.key;
  if (!d || !key?.id || key.fromMe) return null;
  let jid = key.remoteJid ?? "";
  if (jid.endsWith("@lid") && key.remoteJidAlt) jid = key.remoteJidAlt;
  if (!jid.endsWith("@s.whatsapp.net")) return null; // grupo, status, newsletter
  const de = jid.split("@")[0].replace(/\D/g, "");
  const msg = d.message ?? {};
  const tipoBruto = d.messageType ?? Object.keys(msg).find((k) => k.endsWith("Message") || k === "conversation") ?? "";
  const legenda = (k: string) => String(msg[k]?.caption ?? "");
  const base = { id: key.id, de, remoteJid: jid, nome: String(d.pushName ?? ""), base64: typeof msg.base64 === "string" ? msg.base64 : null };
  switch (tipoBruto) {
    case "conversation":
      return { ...base, tipo: "texto", texto: String(msg.conversation ?? ""), mime: "" };
    case "extendedTextMessage":
      return { ...base, tipo: "texto", texto: String(msg.extendedTextMessage?.text ?? ""), mime: "" };
    case "imageMessage":
      return { ...base, tipo: "imagem", texto: legenda("imageMessage"), mime: String(msg.imageMessage?.mimetype ?? "image/jpeg") };
    case "documentMessage":
    case "documentWithCaptionMessage": {
      const doc = msg.documentMessage ?? msg.documentWithCaptionMessage?.message?.documentMessage ?? {};
      const mime = String(doc.mimetype ?? "");
      return { ...base, tipo: mime.startsWith("image/") ? "imagem" : "documento", texto: String(doc.caption ?? ""), mime };
    }
    case "audioMessage":
      return { ...base, tipo: "audio", texto: "", mime: "" };
    case "videoMessage":
      return { ...base, tipo: "video", texto: legenda("videoMessage"), mime: "" };
    case "stickerMessage":
      return { ...base, tipo: "sticker", texto: "", mime: "" };
    default:
      return { ...base, tipo: "outro", texto: "", mime: "" };
  }
}

/** Mensagem de voz (aparece como áudio gravado na hora, com "gravando..." antes). `audio`: URL pública do arquivo. */
export async function enviarAudio(numero: string, audio: string) {
  const r = await chamar<{ key?: { id?: string } }>("message/sendWhatsAppAudio", { number: numero, audio, delay: 2500, encoding: true }, 60_000);
  return r.key?.id ?? null;
}

/** Mensagem de texto que saiu do próprio número sem passar pelo robô (prospecção fria, resposta manual, saudação automática). */
export function lerEnviada(payload: unknown): { id: string; para: string; texto: string } | null {
  const p = (payload ?? {}) as { event?: string; data?: Dados | Dados[] };
  const evento = String(p.event ?? "").toLowerCase().replace(/_/g, ".");
  // Pelo celular chega em messages.upsert; pela API da Evolution (disparador), em send.message.
  if (evento && evento !== "messages.upsert" && evento !== "send.message") return null;
  const d = Array.isArray(p.data) ? p.data[0] : p.data;
  const key = d?.key;
  if (!d || !key?.id || !key.fromMe) return null;
  let jid = key.remoteJid ?? "";
  if (jid.endsWith("@lid") && key.remoteJidAlt) jid = key.remoteJidAlt;
  if (!jid.endsWith("@s.whatsapp.net")) return null;
  const msg = d.message ?? {};
  const texto = String(msg.conversation ?? msg.extendedTextMessage?.text ?? "").trim();
  return texto ? { id: key.id, para: jid.split("@")[0].replace(/\D/g, ""), texto } : null;
}
