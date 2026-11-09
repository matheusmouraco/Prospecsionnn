// Cadência do "o que achou?" para quem some depois da prévia, no mesmo ritmo da conversa de referência (Khone):
// 10 min, 1h, 6h, um áudio ~15h depois, e no dia seguinte bom dia (8h), 13h e 18h.
// Cuidados: fora das 8h às 21h (São Paulo) só manda se o cliente estava conversando nas últimas 2 horas (como na referência,
// em que o "O que achou??" saiu de madrugada porque o cliente tinha acabado de falar); sempre 20 min entre um e outro,
// minutos "quebrados" (8h07, 13h11...) para não parecer robô, e mensagem de horário marcado que perdeu a hora é pulada.

export type Retorno =
  | { tipo: "depois"; minutos: number; texto: string; audio?: boolean }
  | { tipo: "diaSeguinte" | "mesmoDia"; hora: number; texto: string; textoSemAudio?: string };

export const RETORNOS: Retorno[] = [
  { tipo: "depois", minutos: 10, texto: "O que achou??" },
  { tipo: "depois", minutos: 60, texto: "Fala comigo" },
  { tipo: "depois", minutos: 360, texto: "👀" },
  // Áudio gravado pelo Moura (BOT_AUDIO_RETORNO_URL). Sem áudio configurado, vai este texto.
  { tipo: "depois", minutos: 900, audio: true, texto: "Oi! Conseguiu ver o site? Se quiser mudar qualquer coisa, me fala que eu ajusto sem custo." },
  { tipo: "diaSeguinte", hora: 8, texto: "Bom dia!! Tô no aguardo pra deixar seu site no ar 😆" },
  { tipo: "mesmoDia", hora: 13, texto: "Se algo no site não te agradou, me diz o que mudar que eu ajusto sem custo." },
  {
    tipo: "mesmoDia",
    hora: 18,
    texto: "Boa tarde! Se preferir, me manda por áudio o que mudaria no site, que eu ajusto hoje.",
    textoSemAudio: "Boa tarde! Se preferir, me escreve o que mudaria no site, que eu ajusto hoje.",
  },
];

const MIN = 60_000;
const HORA = 60 * MIN;
const OFFSET_SP = -3 * HORA; // São Paulo sem horário de verão desde 2019
export const JANELA = { inicio: 8, fim: 21 };
const INTERVALO_MINIMO = 20 * MIN;
const ATRASO_MAXIMO_HORARIO = 3 * HORA;
const CONVERSA_ATIVA = 2 * HORA;

/** 0 a 19 minutos, sempre o mesmo para o mesmo número e etapa. */
export function quebrado(telefone: string, etapa: number) {
  let h = 7;
  for (const c of `${telefone}:${etapa}`) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (h % 20) * MIN;
}

const local = (t: number) => new Date(t + OFFSET_SP); // campos UTC desta data = relógio de São Paulo
/** Instante de `hora`:00 em São Paulo no dia de `t` somado a `dias`. */
function horaDoDia(t: number, dias: number, hora: number) {
  const d = local(t);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + dias, hora) - OFFSET_SP;
}

/** Empurra para a próxima abertura da janela (8h + minutos quebrados) se cair de madrugada ou à noite. */
export function dentroDaJanela(t: number, jitter: number) {
  const h = local(t).getUTCHours();
  if (h >= JANELA.inicio && h < JANELA.fim) return t;
  return horaDoDia(t, h >= JANELA.fim ? 1 : 0, JANELA.inicio) + jitter;
}

/**
 * Quando mandar a etapa `i`. `base`: a prévia ou a última mensagem do cliente (o que for mais recente);
 * `ultimoEnvio`: o último retorno mandado (ou a base); `ultimaDoCliente`: a última mensagem dele. Devolve `pular` quando a hora marcada já passou demais.
 */
export function quandoMandar(i: number, base: number, ultimoEnvio: number, telefone: string, agora: number, ultimaDoCliente = 0): { em: number } | { pular: true } | null {
  const r = RETORNOS[i];
  if (!r) return null;
  const jitter = quebrado(telefone, i);
  const minimo = ultimoEnvio > base ? ultimoEnvio + INTERVALO_MINIMO : base;
  if (r.tipo === "depois") {
    const t = Math.max(base + r.minutos * MIN, minimo);
    if (t - ultimaDoCliente <= CONVERSA_ATIVA) return { em: t };
    const h = local(t).getUTCHours();
    if (h >= JANELA.inicio && h < JANELA.fim) return { em: t };
    // Cairia de noite ou de madrugada: antecipa para as 20h (como o áudio da referência), se ainda der.
    const noite = horaDoDia(t, h < JANELA.inicio ? -1 : 0, JANELA.fim - 1) + jitter;
    if (noite >= minimo && noite >= base + (r.minutos * MIN) / 2) return { em: noite };
    return { em: dentroDaJanela(t, jitter) };
  }
  const alvo = Math.max(horaDoDia(ultimoEnvio, r.tipo === "diaSeguinte" ? 1 : 0, r.hora) + jitter, minimo);
  if (agora > alvo + ATRASO_MAXIMO_HORARIO) return { pular: true };
  return { em: dentroDaJanela(alvo, jitter) };
}
