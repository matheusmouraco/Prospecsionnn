// Mailbox words that show up as "first name" for role addresses (contato@, recepcao@...).
const GENERICOS = new Set([
  'contato', 'contatos', 'atendimento', 'comercial', 'financeiro', 'recepcao', 'recepção', 'adm', 'admin',
  'administrativo', 'administracao', 'marketing', 'vendas', 'sac', 'clinica', 'clínica', 'info', 'suporte',
  'agendamento', 'agenda', 'consultorio', 'consultório', 'odonto', 'dr', 'dra', 'dentista', 'secretaria',
  'faleconosco', 'ouvidoria', 'rh', 'diretoria', 'gerencia', 'gerência', 'equipe', 'time', 'empresa',
]);

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// "Oi Bruna" when the Snov first name looks like a person, otherwise "Olá".
// An all-lowercase or all-caps token that also appears in the domain or company name
// is the company's name or acronym (e.g. "ibo" for iboodontologia.com.br), not a person.
export function saudacao(primeiroNome: string | null, dominio: string, empresa: string | null): string {
  const token = (primeiroNome ?? '').trim().split(/\s+/)[0]?.replace(/[^\p{L}'-]/gu, '') ?? '';
  if (token.length < 3) return 'Olá';
  const f = fold(token);
  if (GENERICOS.has(f)) return 'Olá';

  const isLower = token === token.toLowerCase();
  const isCaps = token === token.toUpperCase();
  const marca = fold(`${dominio.split('.')[0] ?? ''} ${empresa ?? ''}`);
  if ((isLower || isCaps) && marca.includes(f)) return 'Olá';
  return `Oi ${capitalize(token)}`;
}
