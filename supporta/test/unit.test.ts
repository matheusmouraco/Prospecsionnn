// Testes rápidos das regras puras: npm test (Node 22, sem dependências).
import assert from "node:assert/strict";
import { test } from "node:test";
import { isCnpj, isCpf } from "../lib/documents.ts";
import { findMention } from "../lib/monitor/mention.ts";
import { createToken, readToken } from "../lib/tokens.ts";

const names = ["Clínica Sorriso Real", "Sorriso Real", "sorrisoreal.com.br"];

test("citação: nome no texto, sem depender de acento ou caixa", () => {
  assert.equal(findMention({ text: "1. CLINICA SORRISO REAL, no Cambuí.", sources: [] }, names).cited, true);
});

test("citação: domínio só nas fontes (inclusive título do Gemini)", () => {
  assert.equal(findMention({ text: "Veja.", sources: [{ url: "https://www.sorrisoreal.com.br/implantes" }] }, names).cited, true);
  assert.equal(findMention({ text: "x", sources: [{ url: "https://vertexaisearch.cloud.google.com/a", title: "sorrisoreal.com.br" }] }, names).cited, true);
});

test("citação: palavra parcial e concorrente não contam", () => {
  assert.equal(findMention({ text: "A clínica Sorriso Realeza é boa.", sources: [] }, names).cited, false);
  assert.equal(findMention({ text: "Recomendo a Odonto Prime.", sources: [{ url: "https://odontoprime.com.br" }] }, names).cited, false);
});

test("citação: domínio no fim da frase", () => {
  assert.equal(findMention({ text: "Mais em sorrisoreal.com.br.", sources: [] }, names).cited, true);
});

test("CPF e CNPJ pelos dígitos verificadores", () => {
  assert.equal(isCnpj("11.222.333/0001-81"), true);
  assert.equal(isCnpj("11.222.333/0001-82"), false);
  assert.equal(isCpf("529.982.247-25"), true);
  assert.equal(isCpf("111.111.111-11"), false);
});

test("token assinado: válido, adulterado e expirado", () => {
  const t = createToken({ cid: "abc" }, 60);
  assert.equal(readToken<{ cid: string }>(t)?.cid, "abc");
  assert.equal(readToken(`${t.slice(0, -2)}xx`), null);
  assert.equal(readToken(createToken({ cid: "abc" }, -1)), null);
});
