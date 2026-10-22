// Field names of get-emails-replies are not documented in detail, so each value is looked up under
// the likely names. Confirm with `npm run respostas:ler -- --amostra` and adjust here, with a test.
export interface RespostaSnov {
  id: string;
  email: string;
  texto: string;
  recebida_em: string | null;
}

type Obj = Record<string, unknown>;

const pick = (o: Obj | undefined, keys: string[]): unknown => {
  if (!o) return undefined;
  for (const k of keys) if (o[k] !== undefined && o[k] !== null && o[k] !== '') return o[k];
  return undefined;
};

const asObj = (v: unknown): Obj | undefined => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : undefined);

function stripHtml(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseReply(raw: Obj): RespostaSnov | null {
  const prospect = asObj(raw.prospect) ?? asObj(raw.contact);
  const emailRaw = pick(raw, ['prospectEmail', 'prospect_email', 'email', 'from', 'fromEmail', 'from_email']) ?? pick(prospect, ['email']);
  const email = typeof emailRaw === 'string' ? (emailRaw.match(/[^\s<>"]+@[^\s<>"]+/)?.[0] ?? '').toLowerCase() : '';
  const msg = asObj(raw.message) ?? asObj(raw.reply);
  const bodyRaw = pick(raw, ['text', 'body', 'replyText', 'reply_text', 'content', 'message']) ?? pick(msg, ['text', 'body', 'content']);
  const texto = typeof bodyRaw === 'string' ? stripHtml(bodyRaw) : '';
  if (!email || !texto) return null;
  const date = pick(raw, ['date', 'created_at', 'createdAt', 'replied_at', 'repliedAt', 'received_at']) ?? pick(msg, ['date', 'created_at']);
  const idRaw = pick(raw, ['id', 'reply_id', 'replyId', 'message_id', 'messageId']);
  const recebida_em = typeof date === 'string' || typeof date === 'number' ? String(date) : null;
  return { id: idRaw !== undefined ? String(idRaw) : `${email}|${recebida_em ?? ''}|${texto.slice(0, 40)}`, email, texto, recebida_em };
}
