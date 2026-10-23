export interface Momento { dia: number; hora: number; minuto: number } // dia: 0 = domingo (São Paulo)

export interface Job {
  nome: string;
  script: string;
  args?: string[];
  quando: (m: Momento) => boolean;
  // Skips the run when the queue already has enough work (saves API money while sending is slow).
  precisaFila?: { status: string; maximo: number };
}

const util = (m: Momento) => m.dia >= 1 && m.dia <= 5;
const as = (h: number, min: number) => (m: Momento) => m.hora === h && m.minuto === min;
const cada30 = (offset: number) => (m: Momento) => m.minuto === offset || m.minuto === offset + 30;

// Times in America/Sao_Paulo. Sending itself is paced by the Snov campaign schedule (8h30 to 17h30).
export const JOBS: Job[] = [
  { nome: 'importar', script: 'snov:import', quando: (m) => util(m) && as(7, 0)(m) },
  { nome: 'analisar', script: 'analyze', args: ['--limit', '20'], quando: (m) => util(m) && as(7, 20)(m), precisaFila: { status: 'email_pronto', maximo: 40 } },
  { nome: 'emails', script: 'emails', args: ['--limit', '20'], quando: (m) => util(m) && as(8, 0)(m), precisaFila: { status: 'email_pronto', maximo: 40 } },
  { nome: 'enviar', script: 'snov:enviar', quando: (m) => util(m) && as(8, 15)(m) },
  { nome: 'respostas', script: 'respostas:ler', quando: (m) => m.dia >= 1 && m.dia <= 6 && m.hora >= 8 && m.hora <= 20 && cada30(5)(m) },
  { nome: 'esbocos', script: 'ciclo:esbocos', quando: (m) => m.dia >= 1 && m.dia <= 6 && m.hora >= 8 && m.hora <= 20 && cada30(15)(m) },
  { nome: 'travas', script: 'travas', quando: cada30(25) },
  { nome: 'resumo', script: 'resumo', quando: as(19, 0) },
];

export function momento(d: Date = new Date()): Momento {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(d).map((x) => [x.type, x.value]),
  );
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday ?? '');
  return { dia, hora: Number(p.hour), minuto: Number(p.minute) };
}

export const dueJobs = (m: Momento, jobs: Job[] = JOBS) => jobs.filter((j) => j.quando(m));

// Rule 6: the same job failing 3 times in a row (auth error, API down...) pauses everything.
export const MAX_FALHAS_SEGUIDAS = 3;
