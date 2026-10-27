// Proteção e orçamento de tempo dos jobs agendados (Vercel Cron manda Authorization: Bearer CRON_SECRET).

export function isCronAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

/** Processa itens em sequência até acabar o tempo; o que sobrar fica para a próxima execução do cron. */
export async function runWithBudget<T>(items: T[], budgetMs: number, fn: (item: T) => Promise<unknown>) {
  const started = Date.now();
  const done: { item: T; ok: boolean; error?: string }[] = [];
  for (const item of items) {
    if (Date.now() - started > budgetMs) break;
    try {
      await fn(item);
      done.push({ item, ok: true });
    } catch (err) {
      done.push({ item, ok: false, error: (err as Error).message.slice(0, 300) });
    }
  }
  return { processed: done.length, remaining: items.length - done.length, failures: done.filter((d) => !d.ok) };
}
