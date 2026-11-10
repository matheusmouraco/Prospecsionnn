import { db, tryDb } from "@/lib/db";

// Conversa de cada número com o robô (migration 0006). Telefone sempre só números, com 55.

export type Etapa = "inicio" | "prospeccao" | "encerrada" | "negocio" | "servicos" | "fotos" | "confirmacao" | "gerando" | "previa" | "dados" | "pagamento" | "pago" | "humano";

export type Servico = { nome: string; preco: string | null };

export type Briefing = {
  negocio?: string;
  instagram?: string;
  siteAtual?: string;
  ramo?: string;
  ramoOutro?: string;
  frase?: string;
  servicos?: Servico[];
  cidade?: string;
  atendeTodoBrasil?: boolean;
  publico?: string;
  diferenciais?: string;
  historia?: string;
  /** Correções que o cliente fez no resumo, antes de gerar. */
  ajustes?: string[];
  /** De onde veio: link do site, do Instagram, da análise (analise.supporta.com.br) ou conversa direta. */
  origem?: "whatsapp" | "instagram" | "site" | "analise" | "prospeccao";
  /** Mensagem de prospecção fria que mandamos antes de a pessoa responder. */
  prospeccaoTexto?: string;
  perguntouNegocioDeNovo?: boolean;
  instagramPerfil?: { bio?: string; site?: string; telefone?: string; endereco?: string; seguidores?: number; posts?: string[]; fotoPerfil?: string };
  google?: { endereco?: string; telefone?: string; horario?: string[]; nota?: number; avaliacoes?: number; mapsUrl?: string; site?: string };
  site?: { titulo?: string; descricao?: string; textos?: string[]; logo?: string; imagens?: string[] };
  responsavel?: string;
  email?: string;
  documento?: string;
  dominio?: boolean;
  dominioDesejado?: string;
  /** WhatsApp (só números, com DDD, sem 55) que recebe as mensagens do botão do site. */
  whatsappSite?: string;
  aguardandoWhatsapp?: boolean;
  /** Domínio que o cliente já tem (liga sem custo). */
  jaTemDominio?: string;
  /** Opções livres no registro.br mandadas ao cliente, esperando a escolha. */
  dominioOpcoes?: string[];
  aguardandoDominio?: boolean;
  /** Domínio .com.br novo escolhido ("a definir" quando a consulta falhou e a equipe vai pesquisar). */
  dominioEscolhido?: string;
  checkoutUrl?: string;
};

export type Midia = { id: string; tipo: "logo" | "foto"; url: string; alt: string; cores?: string[] };

export type Conversa = {
  telefone: string;
  nome: string | null;
  etapa: Etapa;
  briefing: Briefing;
  midias: Midia[];
  site_id: string | null;
  ultima_msg_cliente_em: Date | null;
  previa_em: Date | null;
  retornos: number;
  ultimo_retorno_em: Date | null;
  criado_em: Date;
};

/** Grava a mensagem. Devolve false se ela já existia (a Evolution reenviou o mesmo evento). */
export async function registrarMensagem(m: { telefone: string; direcao: "in" | "out"; tipo: string; corpo: string; wa_id?: string | null }) {
  const r = await tryDb("registrarMensagem", (sql) => sql`
    insert into mensagens (telefone, direcao, tipo, corpo, wa_id)
    values (${m.telefone}, ${m.direcao}, ${m.tipo}, ${m.corpo.slice(0, 4000)}, ${m.wa_id ?? null})
    on conflict (wa_id) where wa_id is not null do nothing
    returning id`);
  return r === null ? true : r.length > 0;
}

export async function pegarConversa(telefone: string, nome?: string): Promise<Conversa> {
  const sql = db();
  if (!sql) throw new Error("Banco indisponível.");
  const [row] = await sql<Conversa[]>`
    insert into conversas (telefone, nome) values (${telefone}, ${nome || null})
    on conflict (telefone) do update set nome = coalesce(conversas.nome, excluded.nome)
    returning *`;
  return row;
}

export async function buscarConversa(telefone: string) {
  return tryDb("buscarConversa", async (sql) => {
    const [row] = await sql<Conversa[]>`select * from conversas where telefone = ${telefone}`;
    return row ?? null;
  });
}

export async function conversaDoSite(siteId: string) {
  return tryDb("conversaDoSite", async (sql) => {
    const [row] = await sql<Conversa[]>`select * from conversas where site_id = ${siteId} limit 1`;
    return row ?? null;
  });
}

type Patch = Partial<Pick<Conversa, "nome" | "etapa" | "briefing" | "midias" | "site_id" | "ultima_msg_cliente_em" | "previa_em" | "retornos" | "ultimo_retorno_em">>;

export async function salvarConversa(telefone: string, patch: Patch) {
  const sql = db();
  if (!sql) throw new Error("Banco indisponível.");
  const cols = Object.keys(patch) as (keyof Patch)[];
  if (!cols.length) return;
  const valores = Object.fromEntries(cols.map((k) => [k, k === "briefing" || k === "midias" ? sql.json(patch[k] as never) : patch[k]]));
  await sql`update conversas set ${sql(valores, cols)}, atualizado_em = now() where telefone = ${telefone}`;
}

/** Junta uma mídia nova sem perder as que chegaram ao mesmo tempo (fotos chegam em rajada). */
export async function adicionarMidia(telefone: string, midia: Midia) {
  const sql = db();
  if (!sql) throw new Error("Banco indisponível.");
  const [row] = await sql<Conversa[]>`
    update conversas set midias = midias || ${sql.json([midia] as never)}, atualizado_em = now()
    where telefone = ${telefone} returning *`;
  return row;
}

/** Quem recebeu a prévia e ainda não respondeu (para o "o que achou?"). */
export async function conversasEsperandoRetorno() {
  return (await tryDb("conversasEsperandoRetorno", (sql) => sql<Conversa[]>`
    select * from conversas where etapa in ('previa', 'pagamento') and previa_em is not null and retornos < 10`)) ?? [];
}

export async function historico(telefone: string, limite = 12) {
  const rows = await tryDb("historico", (sql) => sql<{ direcao: "in" | "out"; corpo: string }[]>`
    select direcao, corpo from mensagens where telefone = ${telefone} order by criado_em desc limit ${limite}`);
  return (rows ?? []).reverse();
}

/** Junta campos no briefing sem apagar o que outra mensagem gravou ao mesmo tempo. */
export async function mesclarBriefing(telefone: string, patch: Briefing) {
  const sql = db();
  if (!sql) throw new Error("Banco indisponível.");
  const limpo = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
  const [row] = await sql<Conversa[]>`
    update conversas set briefing = briefing || ${sql.json(limpo as never)}, atualizado_em = now()
    where telefone = ${telefone} returning *`;
  return row;
}

export async function mensagemExiste(waId: string) {
  const r = await tryDb("mensagemExiste", (sql) => sql`select 1 from mensagens where wa_id = ${waId} limit 1`);
  return Boolean(r?.length);
}

/** O cliente mandou mensagem nos últimos `segundos`? (a saudação automática do WhatsApp Business sai junto com a 1ª mensagem dele) */
export async function clienteFalouHaPouco(telefone: string, segundos = 90) {
  const r = await tryDb("clienteFalouHaPouco", (sql) => sql`
    select 1 from mensagens where telefone = ${telefone} and direcao = 'in' and criado_em > now() - make_interval(secs => ${segundos}) limit 1`);
  return Boolean(r?.length);
}

export async function jaRecebeuDoCliente(telefone: string) {
  const r = await tryDb("jaRecebeuDoCliente", (sql) => sql`select 1 from mensagens where telefone = ${telefone} and direcao = 'in' limit 1`);
  return Boolean(r?.length);
}
