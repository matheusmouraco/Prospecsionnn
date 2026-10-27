// Aplica supabase/migrations/*.sql em ordem, pulando as já registradas em supporta._migrations.
// Uso: SUPABASE_DB_URL=postgres://... npm run db:migrate
import { readdir, readFile } from "node:fs/promises";
import postgres from "postgres";

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("Defina SUPABASE_DB_URL.");
  process.exit(1);
}
const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
const files = (await readdir("supabase/migrations")).filter((f) => f.endsWith(".sql")).sort();
const exists = await sql`select to_regclass('supporta._migrations') as t`;
const done = exists[0].t ? new Set((await sql`select nome from supporta._migrations`).map((r) => r.nome)) : new Set();
for (const file of files) {
  if (done.has(file)) continue;
  console.log(`Aplicando ${file}...`);
  await sql.begin(async (tx) => {
    await tx.unsafe(await readFile(`supabase/migrations/${file}`, "utf8"));
    await tx`insert into supporta._migrations (nome) values (${file}) on conflict do nothing`;
  });
}
console.log("Migrations em dia.");
await sql.end();
