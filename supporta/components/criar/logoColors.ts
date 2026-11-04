/**
 * Lê as cores do logo no próprio navegador, a partir do arquivo escolhido.
 * Ignora transparência, branco, preto e cinzas. Sem nenhuma cor sobrando, o logo é monocromático
 * e o jogo pergunta as cores da marca ao cliente.
 */

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** Saturação e luminosidade (0 a 1) no modelo HSL. */
function satLum(r: number, g: number, b: number) {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
  return { s, l };
}

function distancia(a: number[], b: number[]) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

/** Até duas cores da marca, da mais presente para a menos presente. Lista vazia: preto, branco ou cinza. */
export function coresDosPixels(data: Uint8ClampedArray | number[]): string[] {
  const baldes = new Map<string, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i + 3 < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 128) continue;
    const { s, l } = satLum(r, g, b);
    if (l > 0.93 || l < 0.08 || s < 0.18) continue;
    const chave = `${r >> 4}-${g >> 4}-${b >> 4}`;
    const balde = baldes.get(chave) ?? { n: 0, r: 0, g: 0, b: 0 };
    balde.n += 1;
    balde.r += r;
    balde.g += g;
    balde.b += b;
    baldes.set(chave, balde);
  }
  const ordenados = [...baldes.values()].sort((a, b) => b.n - a.n);
  const total = ordenados.reduce((soma, b) => soma + b.n, 0);
  // Poucos pixels coloridos são sobra de suavização nas bordas de um logo preto ou branco.
  if (total < 12) return [];
  const escolhidas: number[][] = [];
  for (const b of ordenados) {
    if (b.n / total < 0.04) break;
    const cor = [b.r / b.n, b.g / b.n, b.b / b.n];
    if (escolhidas.every((e) => distancia(e, cor) > 70)) escolhidas.push(cor);
    if (escolhidas.length === 2) break;
  }
  return escolhidas.map(([r, g, b]) => toHex(r, g, b));
}

export async function coresDoLogo(file: File): Promise<string[]> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 96;
    canvas.height = 96;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return [];
    ctx.drawImage(img, 0, 0, 96, 96);
    return coresDosPixels(ctx.getImageData(0, 0, 96, 96).data);
  } catch {
    return [];
  } finally {
    URL.revokeObjectURL(url);
  }
}
