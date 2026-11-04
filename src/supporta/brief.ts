import { loadPrompt } from '../lib/prompts.js';
import { describeReferencias } from '../draft/generate.js';
import type { FichaRef } from '../references/select.js';
import type { Respostas, SiteRow } from './db.js';

// Same options as supporta/lib/criador.ts (the builder). Kept here so the generator explains them to the model.
const PALETAS: Record<string, { nome: string; cores: string[] }> = {
  azul: { nome: 'Azul confiança', cores: ['#1E3A8A', '#3B82F6', '#EFF6FF'] },
  verde: { nome: 'Verde natural', cores: ['#14532D', '#22C55E', '#F0FDF4'] },
  terracota: { nome: 'Terracota acolhedor', cores: ['#7C2D12', '#EA580C', '#FFF7ED'] },
  dourado: { nome: 'Preto e dourado', cores: ['#111111', '#B8892B', '#FAF7F0'] },
  rosa: { nome: 'Rosa vibrante', cores: ['#831843', '#EC4899', '#FDF2F8'] },
  lilas: { nome: 'Lilás calmo', cores: ['#4C1D95', '#8B5CF6', '#F5F3FF'] },
  laranja: { nome: 'Laranja energia', cores: ['#111827', '#F97316', '#FFF7ED'] },
  cinza: { nome: 'Cinza minimal', cores: ['#111111', '#6B7280', '#F5F5F5'] },
};

export const ESTILOS: Record<string, string> = {
  'arquitetura-autoral': 'editorial e minimalista: muito branco, tipografia serifada elegante, fotos grandes, pouca cor',
  'agencia-design': 'ousado e vibrante: cor forte de fundo, títulos enormes em caixa alta, contraste alto',
  psicologia: 'acolhedor e calmo: tons suaves, cantos arredondados, fotos de pessoas, leitura tranquila',
  'academia-fitness': 'energético: tipografia condensada e pesada, laranja e preto, chamadas diretas',
  cafeteria: 'artesanal e caloroso: serifada com itálico, tons quentes, fotos de perto, clima de bairro',
  tecnologia: 'corporativo e confiável: azul, layout organizado em blocos, sem serifa, cara de empresa grande',
};

const RAMOS: Record<string, string> = {
  odontologia: 'Dentista', saude: 'Clínica ou médico', psicologia: 'Psicologia e terapia', estetica: 'Beleza e estética',
  academia: 'Academia e esporte', advocacia: 'Advocacia', contabilidade: 'Contabilidade', arquitetura: 'Arquitetura e interiores',
  construcao: 'Construção e reformas', restaurante: 'Restaurante ou café', comercio: 'Loja e comércio', servicos: 'Prestador de serviço',
  tecnologia: 'Tecnologia e agência', educacao: 'Escola e cursos', pet: 'Pet e veterinária',
};

const lista = (items: string[]) => (items.length ? items.map((t) => `- ${t}`).join('\n') : '(nenhum)');
const ou = (v: string, vazio = '(não informado)') => (v?.trim() ? v.trim() : vazio);

export function ramoDe(r: Respostas): string {
  return r.ramo === 'outro' ? ou(r.ramoOutro, 'negócio local') : (RAMOS[r.ramo] ?? r.ramo);
}

export function coresDe(r: Respostas): string {
  if (r.cores.modo === 'paleta') {
    const p = PALETAS[r.cores.paleta];
    return p ? `paleta "${p.nome}": ${p.cores.join(', ')} (escura, destaque, fundo suave)` : 'escolha você';
  }
  if (r.cores.modo === 'propria') return `cores da marca: principal ${r.cores.primaria}, apoio ${r.cores.secundaria}`;
  return 'o dono pediu para você escolher, de acordo com o ramo e a personalidade';
}

export function whatsappLink(r: Respostas, site: SiteRow): string {
  const digits = (r.whatsappSite || site.contato_whatsapp).replace(/\D/g, '');
  return `https://wa.me/55${digits}?text=${encodeURIComponent(`Oi! Vim pelo site da ${site.empresa}.`)}`;
}

/** All real text the owner gave: any number on the page must come from here. */
export function fonteNumeros(r: Respostas, site: SiteRow): string {
  return [site.empresa, r.frase, r.publico, r.diferenciais, r.cidade, r.endereco, r.horario, r.instagram, r.siteAtual, r.whatsappSite, site.contato_whatsapp, ...r.servicos, String(new Date().getFullYear())].join(' ');
}

export async function buildSiteBrief(site: SiteRow, referencias: FichaRef[], feedback: string[]): Promise<string> {
  const r = site.respostas;
  return loadPrompt('supporta-site-dados', {
    empresa: site.empresa,
    ramo: ramoDe(r),
    frase: ou(r.frase),
    publico: ou(r.publico),
    objetivo: ou(r.objetivo),
    personalidade: r.personalidade.length ? r.personalidade.join(' e ') : '(livre)',
    servicos: lista(r.servicos),
    diferenciais: ou(r.diferenciais, '(nenhum informado: não escreva diferenciais)'),
    cores: coresDe(r),
    estilos: r.estilos.length ? lista(r.estilos.map((s) => ESTILOS[s] ?? s)) : '(não escolheu; siga as referências)',
    cidade: ou(r.cidade),
    endereco: ou(r.endereco, '(atende sem endereço físico ou não informou: não escreva endereço)'),
    horario: ou(r.horario, '(não informado: não escreva horário)'),
    instagram: r.instagram ? `https://instagram.com/${r.instagram}` : '(não tem)',
    site_atual: ou(r.siteAtual, '(não tem)'),
    logo: r.logo || '(sem logo: use o nome da empresa com tratamento tipográfico forte)',
    fotos: r.fotos.length ? lista(r.fotos) : '(nenhuma foto: proibido usar imagens; construa a força visual com tipografia, cor e formas)',
    referencias: describeReferencias(referencias),
    feedback: feedback.length ? `\nA versão anterior foi recusada. Corrija tudo isto:\n${lista(feedback)}` : '',
  });
}
