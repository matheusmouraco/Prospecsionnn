import assert from "node:assert/strict";
import { test } from "node:test";
import { lerEnviada, lerWebhook } from "../lib/bot/evolution.ts";
import { acharLinks } from "../lib/bot/links.ts";

const evento = (data: object) => ({ event: "messages.upsert", instance: "supporta", data });

test("lê texto, imagem e ignora grupo e mensagens do próprio número", () => {
  const texto = lerWebhook(evento({ key: { remoteJid: "5511988887777@s.whatsapp.net", fromMe: false, id: "A1" }, pushName: "Ana", messageType: "conversation", message: { conversation: "oi" } }));
  assert.equal(texto?.de, "5511988887777");
  assert.equal(texto?.texto, "oi");
  const img = lerWebhook(evento({ key: { remoteJid: "5511988887777@s.whatsapp.net", fromMe: false, id: "A2" }, messageType: "imageMessage", message: { imageMessage: { caption: "logo", mimetype: "image/png" }, base64: "AAA" } }));
  assert.equal(img?.tipo, "imagem");
  assert.equal(img?.base64, "AAA");
  assert.equal(lerWebhook(evento({ key: { remoteJid: "123-456@g.us", fromMe: false, id: "A3" }, message: { conversation: "x" } })), null);
  assert.equal(lerWebhook(evento({ key: { remoteJid: "5511988887777@s.whatsapp.net", fromMe: true, id: "A4" }, message: { conversation: "x" } })), null);
  assert.equal(lerWebhook({ event: "connection.update", data: {} }), null);
  const lid = lerWebhook(evento({ key: { remoteJid: "999@lid", remoteJidAlt: "5511911112222@s.whatsapp.net", fromMe: false, id: "A5" }, message: { extendedTextMessage: { text: "olá" } }, messageType: "extendedTextMessage" }));
  assert.equal(lid?.de, "5511911112222");
});

test("acha Instagram, site e link da prévia, sem confundir e-mail", () => {
  assert.deepEqual(acharLinks("meu insta é @qualy.pisos"), { instagram: "qualy.pisos" });
  assert.equal(acharLinks("https://www.instagram.com/clinicax/").instagram, "clinicax");
  assert.equal(acharLinks("o site é www.clinicax.com.br/sobre").site, "clinicax.com.br");
  assert.equal(acharLinks("meu email joao@empresa.com.br").site, undefined);
  assert.equal(acharLinks("Vi a prévia (analise.supporta.com.br/qualy-pisos)").analise, "qualy-pisos");
});

test("mensagem enviada por fora (celular ou API) é lida para a prospecção", () => {
  const celular = lerEnviada(evento({ key: { remoteJid: "5511998417415@s.whatsapp.net", fromMe: true, id: "P1" }, message: { conversation: "Oi! Matheus aqui" } }));
  assert.equal(celular?.para, "5511998417415");
  const api = lerEnviada({ event: "SEND_MESSAGE", data: { key: { remoteJid: "5511998417415@s.whatsapp.net", fromMe: true, id: "P2" }, message: { extendedTextMessage: { text: "Oi de novo" } } } });
  assert.equal(api?.texto, "Oi de novo");
  assert.equal(lerEnviada(evento({ key: { remoteJid: "5511998417415@s.whatsapp.net", fromMe: false, id: "P3" }, message: { conversation: "x" } })), null);
});
