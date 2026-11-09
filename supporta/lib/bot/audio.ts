// Áudio do cliente vira texto (OpenAI, modelo de transcrição), para o robô entender quem prefere falar.
// Sem OPENAI_API_KEY, o robô pede para mandar por texto.

import { PRECO, registrarCusto } from "./custos";

export const transcricaoLigada = () => Boolean(process.env.OPENAI_API_KEY);

export async function transcrever(base64: string, mime: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY ausente.");
  const tipo = (mime || "audio/ogg").split(";")[0];
  const ext = tipo.includes("mpeg") ? "mp3" : tipo.includes("mp4") ? "m4a" : tipo.includes("wav") ? "wav" : "ogg";
  const form = new FormData();
  form.append("file", new Blob([Buffer.from(base64, "base64")], { type: tipo }), `audio.${ext}`);
  form.append("model", process.env.BOT_MODELO_TRANSCRICAO || "gpt-4o-mini-transcribe");
  form.append("language", "pt");
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { authorization: `Bearer ${key}` },
    body: form,
    signal: AbortSignal.timeout(60_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Transcrição: ${res.status} ${data?.error?.message ?? ""}`.trim());
  // Duração estimada pelo tamanho (áudio de WhatsApp em opus fica perto de 2 KB por segundo).
  await registrarCusto("openai", "transcricao", (Buffer.byteLength(base64, "base64") / 2000 / 60) * PRECO.transcricaoPorMinuto);
  return String(data.text ?? "").trim();
}
