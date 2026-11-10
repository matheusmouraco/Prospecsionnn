import assert from "node:assert/strict";
import { test } from "node:test";
import { SURFACES } from "../config/options.ts";
import { buildEditPrompt, buildPrompt } from "../lib/ai/prompt-builder.ts";
import { summarySentence } from "../lib/ai/summary.ts";
import { closestRatio } from "../lib/image/aspect.ts";
import { DEFAULT_CHOICES, creditsFor, mergeChoices, type Choices } from "../lib/wizard/types.ts";

const kitchen: Choices = mergeChoices(DEFAULT_CHOICES, {
  inputType: "3d",
  goal: "reformar",
  room: "cozinha",
  style: "japandi",
  materials: { ...DEFAULT_CHOICES.materials, piso: "porc-areia", marcenaria: "freijo", bancadas: "quartzo-branco", teto: "manter" },
  lighting: { ...DEFAULT_CHOICES.lighting, time: "fim-tarde", artificial: ["pendentes"] },
  furniture: { ...DEFAULT_CHOICES.furniture, avoid: "televisão" },
  refine: { notes: "ilha central com cooktop e 3 pendentes pretos", fidelity: 20 },
});

test("prompt always carries the geometry lock and the chosen materials", () => {
  const p = buildPrompt(kitchen, { hasMask: false, referenceCount: 0 });
  assert.match(p, /GEOMETRY LOCK/);
  assert.match(p, /a kitchen/);
  assert.match(p, /japandi/);
  assert.match(p, /sand-beige porcelain/);
  assert.match(p, /freijó wood veneer/);
  assert.match(p, /white quartz/);
  assert.match(p, /Ceiling: keep exactly as it is/);
  assert.match(p, /golden hour/);
  assert.match(p, /pendant lights/);
  assert.match(p, /televisão/);
  assert.match(p, /ilha central/);
  assert.match(p, /No people/);
  assert.match(p, /FIDELITY: maximum/);
  assert.doesNotMatch(p, /MASK/);
});

test("mask and references are only mentioned when present", () => {
  const p = buildPrompt(kitchen, { hasMask: true, referenceCount: 2 });
  assert.match(p, /labeled MASK/);
  assert.match(p, /2 image\(s\) labeled REFERENCE/);
});

test("surfaces that do not exist in the room are not sent", () => {
  const facade = mergeChoices(DEFAULT_CHOICES, { room: "fachada", materials: { ...DEFAULT_CHOICES.materials, bancadas: "granito-preto" } });
  assert.doesNotMatch(buildPrompt(facade, { hasMask: false, referenceCount: 0 }), /Countertops/);
});

test("'realista' keeps the existing furniture by default", () => {
  const c = mergeChoices(DEFAULT_CHOICES, { goal: "realista", room: "sala-estar" });
  const p = buildPrompt(c, { hasMask: false, referenceCount: 0 });
  assert.match(p, /Keep all existing furniture/);
  assert.match(p, /keep the current material and color/);
});

test("every option has a prompt text and a label", () => {
  for (const s of SURFACES) for (const o of s.options) assert.ok(o.prompt.length > 5 && o.label.length > 1, `${s.key}/${o.id}`);
});

test("edit prompt quotes the instruction", () => {
  assert.match(buildEditPrompt("troque o piso por madeira", { hasMask: false }), /troque o piso por madeira/);
});

test("summary reads like the client brief", () => {
  const s = summarySentence(kitchen);
  assert.match(s, /^Cozinha japandi/);
  assert.match(s, /piso porcelanato areia/);
  assert.match(s, /marcenaria freijó/);
  assert.match(s, /fim de tarde dourado/);
  assert.match(s, /bancada quartzo branco/);
  assert.match(s, /sem pessoas/);
  assert.doesNotMatch(s, /—/);
});

test("credits and aspect ratio helpers", () => {
  assert.equal(creditsFor("1k", 4), 4);
  assert.equal(creditsFor("2k", 2), 6);
  assert.equal(closestRatio(1920, 1080), "16:9");
  assert.equal(closestRatio(1080, 1350), "4:5");
  assert.equal(closestRatio(1000, 1000), "1:1");
  assert.equal(closestRatio(1600, 1200), "4:3");
});
