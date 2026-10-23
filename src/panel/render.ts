import type { DadosPainel } from './store.js';

const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const data = (iso: string | null) => (iso ? new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }) : '');

// Funnel order, with the names Moura reads.
const ETAPAS: [string, string][] = [
  ['novo', 'Na fila'], ['analisado', 'Analisados'], ['email_pronto', 'Email pronto'], ['enviado_snov', 'Na campanha'],
  ['respondeu_quer_ver', 'Pediram o esboço'], ['respondeu_interesse', 'Interessados'], ['notificado_moura', 'Com você'],
  ['respondeu_nao', 'Agora não'], ['respondeu_descadastro', 'Descadastro'], ['descartado_site_bom', 'Site já bom'], ['erro_final', 'Erro'],
];

const CATEGORIA: Record<string, string> = {
  quer_ver: 'Quer ver', interesse: 'Interesse', outro: 'Outro', nao: 'Não', descadastro: 'Sair', ausente: 'Ausente',
};

// Private dashboard, served only on a protected Vercel preview URL.
export function renderPainel(d: DadosPainel): string {
  const hoje = d.dias[0];
  const total30 = d.dias.reduce((s, x) => s + x.custo_api_usd, 0);
  const cards = [
    ['Enviados hoje', hoje?.enviados ?? 0], ['Respostas hoje', hoje?.respostas ?? 0], ['Positivas hoje', hoje?.positivas ?? 0],
    ['Custo hoje', `US$ ${(hoje?.custo_api_usd ?? 0).toFixed(2)}`], ['Custo 14 dias', `US$ ${total30.toFixed(2)}`], ['Esboços no ar', d.esbocos.length],
  ];
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Painel Prospector</title>
<style>
:root{--bg:#f7f8fa;--card:#fff;--ink:#14161a;--mute:#6b7280;--line:#e5e7eb;--ok:#0f9d58;--warn:#d93025;--acc:#2563eb}
@media (prefers-color-scheme:dark){:root{--bg:#0f1115;--card:#171a20;--ink:#e8eaed;--mute:#9aa0a6;--line:#2a2f37}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{max-width:1100px;margin:0 auto;padding:24px 16px 64px}h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:32px 0 12px}
.sub{color:var(--mute);font-size:13px}.estado{display:inline-block;margin-top:12px;padding:6px 12px;border-radius:999px;font-weight:600;font-size:13px}
.on{background:#0f9d5822;color:var(--ok)}.off{background:#d9302522;color:var(--warn)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}.card b{display:block;font-size:24px;margin-top:4px}
.card span{color:var(--mute);font-size:13px}table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);font-size:14px;vertical-align:top}th{color:var(--mute);font-weight:500;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
tr:last-child td{border-bottom:0}a{color:var(--acc)}.wrap{overflow-x:auto}.tag{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--line)}
</style></head><body><main>
<h1>Prospector Matilab</h1><div class="sub">Atualizado em ${esc(data(d.geradoEm))}</div>
<div class="estado ${d.pausado ? 'off' : 'on'}">${d.pausado ? `Pausado: ${esc(d.motivo || 'sem motivo')}` : 'Rodando'}</div>
<h2>Hoje</h2><div class="grid">${cards.map(([t, v]) => `<div class="card"><span>${esc(t)}</span><b>${esc(v)}</b></div>`).join('')}</div>
<h2>Funil</h2><div class="grid">${ETAPAS.map(([k, t]) => `<div class="card"><span>${esc(t)}</span><b>${d.status[k] ?? 0}</b></div>`).join('')}</div>
<h2>Respostas recentes</h2><div class="wrap"><table><tr><th>Quando</th><th>Empresa</th><th>Tipo</th><th>Resumo</th><th>Resposta</th></tr>
${d.respostas.map((r) => `<tr><td>${esc(data(r.recebida_em))}</td><td>${esc(r.empresa ?? r.dominio)}<br><span class="sub">${esc(r.email)}</span></td><td><span class="tag">${esc(CATEGORIA[r.categoria ?? ''] ?? r.categoria)}</span></td><td>${esc(r.resumo)}</td><td>${esc((r.texto ?? '').slice(0, 220))}</td></tr>`).join('') || '<tr><td colspan="5" class="sub">Nenhuma resposta ainda</td></tr>'}
</table></div>
<h2>Esboços no ar</h2><div class="wrap"><table><tr><th>Empresa</th><th>Link</th><th>Nota do juiz</th><th>Publicado</th></tr>
${d.esbocos.map((e) => `<tr><td>${esc(e.empresa ?? e.dominio)}</td><td>${e.url ? `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.url.replace(/^https:\/\//, ''))}</a>` : ''}</td><td>${esc(e.nota)}</td><td>${esc(data(e.publicado_em))}</td></tr>`).join('') || '<tr><td colspan="4" class="sub">Nenhum esboço publicado</td></tr>'}
</table></div>
<h2>Últimos 14 dias</h2><div class="wrap"><table><tr><th>Dia</th><th>Enviados</th><th>Respostas</th><th>Positivas</th><th>Esboços</th><th>Custo</th></tr>
${d.dias.map((x) => `<tr><td>${esc(x.dia.split('-').reverse().join('/'))}</td><td>${x.enviados}</td><td>${x.respostas}</td><td>${x.positivas}</td><td>${x.esbocos_gerados}</td><td>US$ ${x.custo_api_usd.toFixed(2)}</td></tr>`).join('')}
</table></div>
</main></body></html>`;
}
