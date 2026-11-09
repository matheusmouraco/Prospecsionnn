import assert from "node:assert/strict";
import { test } from "node:test";
import { candidatos, normalizarDominio } from "../lib/bot/dominio.ts";

test("normaliza qualquer jeito de escrever para .com.br", () => {
  assert.equal(normalizarDominio("www.ClínicaX.com"), "clinicax.com.br");
  assert.equal(normalizarDominio("https://qualypisos.com.br/sobre"), "qualypisos.com.br");
  assert.equal(normalizarDominio("qualy-pisos"), "qualy-pisos.com.br");
  assert.equal(normalizarDominio("x"), null);
});

test("sugere a partir do pedido e do nome, sem repetir", () => {
  const c = candidatos("Qualy Pisos", "qualypisos.com", "Barueri, SP");
  assert.equal(c[0], "qualypisos.com.br");
  assert.ok(c.includes("qualy-pisos.com.br"));
  assert.ok(c.includes("qualypisosbarueri.com.br"));
  assert.equal(new Set(c).size, c.length);
});
