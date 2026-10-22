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
// A token that also appears in the domain or company name is the company's name or acronym
// ("ibo" for iboodontologia.com.br, "Odontoclinic" for odontoclinic.com.br), not a person.
// A real name inside the brand ("Mariana" at marianaodonto) also gets "Olá", which is harmless.
export function saudacao(primeiroNome: string | null, dominio: string, empresa: string | null): string {
  const token = (primeiroNome ?? '').trim().split(/\s+/)[0]?.replace(/[^\p{L}'-]/gu, '') ?? '';
  if (token.length < 3) return 'Olá';
  const f = fold(token);
  if (GENERICOS.has(f)) return 'Olá';

  const marca = fold(`${dominio.split('.')[0] ?? ''} ${empresa ?? ''}`);
  if (marca.includes(f)) return 'Olá';
  return `Oi ${capitalize(token)}`;
}
