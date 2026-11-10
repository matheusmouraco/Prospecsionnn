import assert from "node:assert/strict";
import { test } from "node:test";
import { RETORNOS, quandoMandar, quandoParado } from "../lib/bot/retornos.ts";

const H = 3600_000;
const sp = (iso: string) => new Date(`${iso}-03:00`).getTime();
const hhmm = (t: number) => new Date(t - 3 * H).toISOString().slice(5, 16).replace("T", " ");

/** Simula um cliente que nunca responde: roda o relógio de minuto em minuto e anota quando cada retorno sai. */
function linhaDoTempo(previa: number, cliente: number, tel = "5511988887777") {
  const saidas: string[] = [];
  let i = 0;
  let ultimo = previa;
  for (let agora = previa; agora < previa + 4 * 24 * H && i < RETORNOS.length; agora += 60_000) {
    let q = quandoMandar(i, previa, ultimo, tel, agora, cliente);
    while (q && "pular" in q) q = quandoMandar(++i, previa, ultimo, tel, agora, cliente);
    if (!q || agora < q.em) continue;
    saidas.push(hhmm(agora));
    ultimo = agora;
    i++;
  }
  return saidas;
}

test("mesmo ritmo da referência: prévia 3h38 com o cliente acabando de falar", () => {
  const t = linhaDoTempo(sp("2026-11-06T03:38"), sp("2026-11-06T03:07"));
  assert.equal(t.length, 7);
  assert.equal(t[0], "11-06 03:48"); // conversa ativa: pode de madrugada
  assert.equal(t[1], "11-06 04:38"); // ainda dentro das 2h de conversa ativa (a referência mandou 4h30)
  assert.match(t[2], /^11-06 09:/); // 👀 ~6h depois
  assert.match(t[3], /^11-06 18:/); // áudio ~15h depois
  assert.match(t[4], /^11-07 08:/);
  assert.match(t[5], /^11-07 13:/);
  assert.match(t[6], /^11-07 18:/);
});

test("nunca manda de madrugada sem conversa ativa e respeita 20 min entre mensagens", () => {
  const t = linhaDoTempo(sp("2026-11-06T19:50"), sp("2026-11-06T12:00"));
  assert.equal(t.length, 7);
  for (const x of t) {
    const h = Number(x.slice(6, 8));
    assert.ok(h >= 8 && h < 21, `saiu ${x}`);
  }
});

test("prévia de manhã: áudio sai às 20h do mesmo dia e o bom dia no dia seguinte", () => {
  const t = linhaDoTempo(sp("2026-11-06T10:00"), sp("2026-11-06T09:55"));
  assert.match(t[3], /^11-06 20:/);
  assert.match(t[4], /^11-07 08:/);
  assert.match(t[6], /^11-07 18:/);
});

test("lembrete de quem parou antes da prévia: 1h, ~1 dia e 3 dias, sempre de dia", () => {
  const tel = "556191864076";
  const base = sp("2026-11-10T14:02");
  const t0 = quandoParado(0, base, base, tel)!;
  assert.ok(t0 >= base + H && t0 < base + 1.4 * H, hhmm(t0));
  const t1 = quandoParado(1, base, t0, tel)!;
  assert.ok(t1 >= base + 22 * H, hhmm(t1));
  const t2 = quandoParado(2, base, t1, tel)!;
  assert.ok(t2 >= base + 72 * H, hhmm(t2));
  assert.equal(quandoParado(3, base, t2, tel), null);
  for (const t of [t0, t1, t2]) {
    const h = new Date(t - 3 * H).getUTCHours();
    assert.ok(h >= 8 && h < 21, hhmm(t));
  }
  // Parou à noite: o 1º sai na manhã seguinte, não de madrugada.
  const noite = sp("2026-11-10T20:30");
  assert.equal(new Date(quandoParado(0, noite, noite, tel)! - 3 * H).getUTCHours(), 8);
  // Parou ontem e já mandamos o 1º agora: o 2º espera pelo menos 12h.
  const ontem = sp("2026-11-09T10:00");
  const agora = sp("2026-11-10T15:00");
  assert.ok(quandoParado(1, ontem, agora, tel)! >= agora + 12 * H);
});

test("quem pediu alteração só recebe follow-up 4 dias depois, de dia", async () => {
  const { quandoDepoisDeAjuste } = await import("../lib/bot/retornos.ts");
  const base = sp("2026-11-10T15:00");
  const t = quandoDepoisDeAjuste(base, "5522998021987");
  assert.ok(t >= base + 96 * H, hhmm(t));
  const h = new Date(t - 3 * H).getUTCHours();
  assert.ok(h >= 8 && h < 21, hhmm(t));
});
