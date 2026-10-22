import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  canTransition,
  FINAL_STATUSES, TRANSITIONS,
  PROSPECT_STATUSES,
  retryTarget,
} from '../src/domain/status.js';

describe('state machine', () => {
  it('follows the documented happy path', () => {
    const path = ['novo', 'analisando', 'analisado', 'email_pronto', 'enviado_snov', 'respondeu_quer_ver',
      'gerando_esboco', 'esboco_publicado', 'link_enviado'] as const;
    for (let i = 0; i < path.length - 1; i++) {
      expect(canTransition(path[i]!, path[i + 1]!)).toBe(true);
    }
  });

  it('blocks skipping steps and leaving final states', () => {
    expect(canTransition('novo', 'enviado_snov')).toBe(false);
    expect(canTransition('respondeu_descadastro', 'enviado_snov')).toBe(false);
    expect(canTransition('respondeu_descadastro', 'erro')).toBe(false);
    expect(canTransition('analisando', 'erro')).toBe(true);
  });

  it('has the documented final states', () => {
    expect([...FINAL_STATUSES].sort()).toEqual(
      ['descartado_site_bom', 'erro_final', 'notificado_moura', 'respondeu_descadastro',
        'sem_resposta', 'site_ok_ou_sem_site'].sort(),
    );
  });

  it('contacts an "agora não" again from a fresh analysis', () => {
    expect(TRANSITIONS.respondeu_nao).toEqual(['novo']);
  });

  it('retries up to 3 times then gives up', () => {
    expect(retryTarget('analisando', 1)).toBe('analisando');
    expect(retryTarget('analisando', 2)).toBe('analisando');
    expect(retryTarget('analisando', 3)).toBe('erro_final');
    expect(retryTarget(null, 1)).toBe('erro_final');
  });

  it('matches the status check constraint in the migration', () => {
    const sql = readFileSync(new URL('../supabase/migrations/0001_init.sql', import.meta.url), 'utf8');
    const block = sql.match(/status text not null default 'novo' check \(status in \(([\s\S]*?)\)\)/);
    expect(block).not.toBeNull();
    const inSql = [...block![1]!.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
    expect(inSql).toEqual([...PROSPECT_STATUSES]);
  });
});
