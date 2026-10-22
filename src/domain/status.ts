// Prospect state machine. Keep in sync with the check constraint in supabase/migrations.
export const PROSPECT_STATUSES = [
  'novo',
  'site_ok_ou_sem_site',
  'analisando',
  'descartado_site_bom',
  'analisado',
  'email_pronto',
  'enviado_snov',
  'respondeu_quer_ver',
  'gerando_esboco',
  'esboco_publicado',
  'link_enviado',
  'respondeu_interesse',
  'notificado_moura',
  'respondeu_nao',
  'respondeu_descadastro',
  'respondeu_ausente',
  'sem_resposta',
  'erro',
  'erro_final',
] as const;

export type ProspectStatus = (typeof PROSPECT_STATUSES)[number];

export const MAX_ATTEMPTS = 3;
export const LOCK_TTL_MINUTES = 15;

const REPLY_OUTCOMES: ProspectStatus[] = [
  'respondeu_quer_ver',
  'respondeu_interesse',
  'respondeu_nao',
  'respondeu_descadastro',
  'respondeu_ausente',
  'sem_resposta',
];

// Allowed forward moves. `erro` is reachable from any non-final state and is handled separately.
export const TRANSITIONS: Record<ProspectStatus, readonly ProspectStatus[]> = {
  novo: ['site_ok_ou_sem_site', 'analisando'],
  site_ok_ou_sem_site: [],
  analisando: ['descartado_site_bom', 'analisado'],
  descartado_site_bom: [],
  analisado: ['email_pronto'],
  email_pronto: ['enviado_snov'],
  enviado_snov: REPLY_OUTCOMES,
  respondeu_quer_ver: ['gerando_esboco'],
  gerando_esboco: ['esboco_publicado', 'notificado_moura'],
  esboco_publicado: ['link_enviado'],
  link_enviado: REPLY_OUTCOMES.filter((s) => s !== 'respondeu_quer_ver'),
  respondeu_interesse: ['notificado_moura'],
  notificado_moura: [],
  // "Agora não": contacted again after prospects.retomar_em (6 months), starting from a fresh analysis.
  respondeu_nao: ['novo'],
  respondeu_descadastro: [],
  // An out-of-office reply can be followed by a real one.
  respondeu_ausente: REPLY_OUTCOMES.filter((s) => s !== 'respondeu_ausente'),
  sem_resposta: [],
  // Retry goes back to prospects.status_anterior; see retryTarget().
  erro: ['erro_final'],
  erro_final: [],
};

export const FINAL_STATUSES: readonly ProspectStatus[] = PROSPECT_STATUSES.filter(
  (s) => s !== 'erro' && TRANSITIONS[s].length === 0,
);

export function isFinal(status: ProspectStatus): boolean {
  return FINAL_STATUSES.includes(status);
}

export function canTransition(from: ProspectStatus, to: ProspectStatus): boolean {
  if (to === 'erro') return !isFinal(from) && from !== 'erro';
  return TRANSITIONS[from].includes(to);
}

// Where a failed record goes on its next cycle: back to the step that failed, or erro_final.
export function retryTarget(statusAnterior: ProspectStatus | null, tentativas: number): ProspectStatus {
  if (!statusAnterior || tentativas >= MAX_ATTEMPTS || isFinal(statusAnterior) || statusAnterior === 'erro') {
    return 'erro_final';
  }
  return statusAnterior;
}

export function assertTransition(from: ProspectStatus, to: ProspectStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Transição inválida de status: ${from} > ${to}`);
  }
}
