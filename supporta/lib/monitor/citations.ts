import { monthStart, tryDb } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { citationsEmail } from "@/lib/email/templates";
import type { Cliente } from "@/lib/repo";
import { engines } from "./engines";
import { findMention } from "./mention";

/** Clientes Premium ativos que ainda não receberam o relatório de citações deste mês. */
export function pendingCitationClients(mes = monthStart(0)) {
  return tryDb("pendingCitationClients", (sql) => sql<Cliente[]>`
    select c.* from clientes c
    where c.ativo and c.plano = 'premium' and cardinality(c.perguntas_ia) > 0
      and not exists (select 1 from relatorios_citacoes r where r.cliente_id = c.id and r.mes = ${mes}::date)
    order by c.criado_em`);
}

/** Roda todas as perguntas do cliente em todas as IAs configuradas, grava e manda o relatório. */
export async function runCitationsFor(client: Cliente, mes = monthStart(0)) {
  const active = engines.filter((e) => e.enabled());
  if (!active.length) throw new Error("Nenhuma IA configurada (OPENAI_API_KEY, GEMINI_API_KEY, PERPLEXITY_API_KEY).");
  const names = [...client.nomes_busca, client.nome, client.site_url ?? ""].filter(Boolean);
  const questions = client.perguntas_ia.slice(0, 5);

  const jobs = questions.flatMap((pergunta) => active.map((engine) => ({ pergunta, engine })));
  const rows = await Promise.all(
    jobs.map(async ({ pergunta, engine }) => {
      try {
        const answer = await engine.ask(pergunta);
        const m = findMention(answer, names);
        return { motor: engine.label, pergunta, citado: m.cited, trecho: m.snippet, fontes: answer.sources.slice(0, 10), erro: null as string | null };
      } catch (err) {
        return { motor: engine.label, pergunta, citado: false, trecho: null, fontes: [], erro: (err as Error).message.slice(0, 300) };
      }
    }),
  );

  await tryDb("saveCitations", (sql) =>
    sql.begin(async (tx) => {
      for (const r of rows) {
        await tx`
          insert into citacoes (cliente_id, mes, motor, pergunta, citado, trecho, fontes, erro)
          values (${client.id}, ${mes}, ${r.motor}, ${r.pergunta}, ${r.citado}, ${r.trecho}, ${tx.json(r.fontes as never)}, ${r.erro})
          on conflict (cliente_id, mes, motor, pergunta) do update
            set citado = excluded.citado, trecho = excluded.trecho, fontes = excluded.fontes, erro = excluded.erro, rodado_em = now()`;
      }
      // Se tudo falhou (chave errada, cota), não marca como enviado: tenta de novo na próxima rodada.
      if (rows.some((r) => !r.erro)) {
        await tx`insert into relatorios_citacoes (cliente_id, mes) values (${client.id}, ${mes}) on conflict do nothing`;
      }
    }),
  );
  if (rows.some((r) => !r.erro)) await sendEmail({ to: client.email, ...citationsEmail(client.nome, mes, rows) });
  return rows;
}
