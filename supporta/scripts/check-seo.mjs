// Confere, no HTML gerado pelo build, title (até 60), description (até 155), canonical, og:image, um H1 e ausência de travessão.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = ".next/server/app";
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p);
    else if (entry.name.endsWith(".html") && !p.includes("_not-found") && !p.includes("_global-error")) files.push(p);
  }
}
await walk(root);

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
let problems = 0;
for (const file of files.sort()) {
  const html = await readFile(file, "utf8");
  if (html.includes("Essa página não existe.")) continue; // rota que responde 404 de propósito (ex.: /cases sem cases)
  const route = file.slice(root.length).replace(/\.html$/, "").replace(/\/index$/, "") || "/";
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const issues = [];
  if (!title || [...title].length > 60) issues.push(`title ${[...title].length}`);
  if (!desc || [...desc].length > 155) issues.push(`description ${[...desc].length}`);
  if (!/<link rel="canonical"/.test(html)) issues.push("sem canonical");
  if (!/property="og:image"/.test(html)) issues.push("sem og:image");
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) issues.push(`${h1} h1`);
  if (/—/.test(html)) issues.push("travessão");
  if (issues.length) problems++;
  console.log(`${issues.length ? "✗" : "✓"} ${route.padEnd(48)} t=${String([...title].length).padStart(2)} d=${String([...desc].length).padStart(3)} ${issues.join(", ")}`);
}
console.log(problems ? `\n${problems} página(s) com problema.` : "\nTodas as páginas passaram.");
process.exit(problems ? 1 : 0);
