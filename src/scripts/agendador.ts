import { isPaused, setPaused } from '../db/control.js';
import { logger } from '../lib/logger.js';
import { runNpm } from '../lib/run.js';
import { contarStatus } from '../monitor/store.js';
import { dueJobs, MAX_FALHAS_SEGUIDAS, momento, type Job } from '../scheduler/jobs.js';
import { notify } from '../telegram/notify.js';

const log = logger.child({ etapa: 'agendador' });
const rodando = new Set<string>();
const falhas = new Map<string, number>();

async function executar(job: Job): Promise<void> {
  if (rodando.has(job.nome)) return log.warn('Job ainda rodando; pulando esta vez', { job: job.nome });
  if (job.nome !== 'travas' && job.nome !== 'resumo' && await isPaused()) return;
  if (job.precisaFila && (await contarStatus([job.precisaFila.status])) >= job.precisaFila.maximo) {
    return log.info('Fila cheia; pulando', { job: job.nome, status: job.precisaFila.status });
  }
  rodando.add(job.nome);
  const inicio = Date.now();
  try {
    const r = await runNpm(job.script, job.args ?? []);
    log.info('Job terminou', { job: job.nome, codigo: r.code, segundos: Math.round((Date.now() - inicio) / 1000) });
    if (r.code === 0) return void falhas.delete(job.nome);
    const n = (falhas.get(job.nome) ?? 0) + 1;
    falhas.set(job.nome, n);
    log.error('Job falhou', { job: job.nome, vezes: n, saida: r.saida.slice(-600) });
    if (n >= MAX_FALHAS_SEGUIDAS) {
      await setPaused(true, `${job.nome} falhou ${n} vezes seguidas`);
      await notify(`⛔ Pausei tudo: o ciclo "${job.nome}" falhou ${n} vezes seguidas.\nÚltimo erro:\n${r.saida.slice(-500)}\n\nQuando resolver, mande /retomar.`);
      falhas.delete(job.nome);
    }
  } finally {
    rodando.delete(job.nome);
  }
}

// `npm run agendador`: always-on process (pm2) that starts each cycle at its time, São Paulo clock.
// Unlike pm2 cron, a deploy or restart never fires a job outside its time.
let ultimo = '';
function tick(): void {
  const m = momento();
  const chave = `${m.dia}-${m.hora}-${m.minuto}`;
  if (chave === ultimo) return;
  ultimo = chave;
  for (const job of dueJobs(m)) void executar(job);
}

log.info('Agendador ligado');
setInterval(tick, 15_000);
tick();
