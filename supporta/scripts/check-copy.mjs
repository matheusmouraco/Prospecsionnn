// Garante que nenhum texto do site tem travessão (—).
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const hits = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", "assets"].includes(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p);
    else if (/\.(tsx?|mdx?|txt)$/.test(entry.name)) {
      (await readFile(p, "utf8")).split("\n").forEach((line, i) => line.includes("—") && hits.push(`${p}:${i + 1}`));
    }
  }
}
await walk(".");
console.log(hits.length ? `Travessão encontrado:\n${hits.join("\n")}` : "Nenhum travessão no conteúdo.");
process.exit(hits.length ? 1 : 0);
