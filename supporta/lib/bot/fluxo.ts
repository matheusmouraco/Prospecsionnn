import { randomBytes } from "node:crypto";
import { isCpfOrCnpj, onlyDigits } from "@/lib/documents";
import { notifyTeam } from "@/lib/email/send";
import { isEmail } from "@/lib/leads";
import { respostasVazias, slugify, slugsReservados, type Respostas } from "@/lib/criador";
import { pricing } from "@/lib/plans";
import { createSite, getSiteByToken, getSubscriptionById, slugTaken, type Cliente, type Site } from "@/lib/repo";
import { tryDb } from "@/lib/db";
import { uploadSiteFile } from "@/lib/storage";
import {
  adicionarMidia,
  buscarConversa,
  conversaDoSite,
  conversasEsperandoRetorno,
  mesclarBriefing,
  pegarConversa,
  registrarMensagem,
  salvarConversa,
  type Briefing,
  type Conversa,
  type Midia,
} from "./db";
import { acharLinks, baixarImagem, lerGoogle, lerInstagram, lerSite } from "./enriquecer";
import { transcrever, transcricaoLigada } from "./audio";
import { baixarMidia, enviarAudio, enviarTexto, evolutionEnabled, marcarLida, type MensagemRecebida } from "./evolution";
import { DIAS_PREVIA, DIAS_REATIVADA, lerExpiracao, marcarAvisoExpiracao, previaExpirou, previasNoUltimoDia, reativarPrevia } from "./expiracao";
import { candidatos, consultarDominio, normalizarDominio, opcoesLivres } from "./dominio";
import { RETORNOS, quandoMandar } from "./retornos";
import { extrairDados, extrairNegocio, extrairServicos, interpretarResposta, lerImagem, resumoFinal } from "./ia";
import { linkPagamento } from "./pagamento";

type Depois = (p: Promise<unknown>) => void;

const ESPERA_FOTOS_MS = Number(process.env.BOT_ESPERA_FOTOS_MS ?? 45_000);
const MAX_AJUSTES_ANTES_DE_PAGAR = 8;
const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));
const primeiroNome = (n?: string | null) => (n ?? "").trim().split(/\s+/)[0] ?? "";

export const previaUrl = (slug: string) => `https://analise.supporta.com.br/${slug}`;
export const siteUrl = (s: Pick<Site, "slug" | "dominio">) => (s.dominio ? `https://${s.dominio}` : `https://${s.slug}.supporta.com.br`);

export function formatarFone(n: string) {
  const d = n.replace(/\D/g, "").replace(/^55/, "");
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length === 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : n;
}

// Quem "fala" no WhatsApp (como na conversa de referência: "Opa João, Matheus aqui!").
const ATENDENTE = process.env.BOT_ATENDENTE || "Matheus";

// ---------- roteiro (o que o cliente lê) ----------
const R = {
  abertura: (nome: string) => [
    `Opa${nome ? ` ${nome}` : ""}, ${ATENDENTE} aqui!`,
    `Eu monto o site do seu negócio agora, aqui pelo WhatsApp, e você só paga se gostar: R$ ${pricing.site}, uma vez só.`,
  ],
  pedeNegocio: "Qual o nome do seu negócio? Se tiver Instagram ou site, me manda o link que eu já puxo as informações de lá.",
  olhando: (onde: string) => `Beleza, já vou dar uma olhada no seu ${onde}.`,
  pedeServicos: "O que vocês vendem ou fazem? Se quiser mostrar preço, me passa também. E de que cidade vocês atendem?",
  pedeFotos: (temOnline: boolean) =>
    temOnline
      ? "Agora me manda a logo e algumas fotos do seu trabalho aqui mesmo. Se preferir, eu uso as do seu site e do Instagram. Se não tiver nada, me fala que eu monto sem."
      : "Agora me manda a logo e algumas fotos do seu trabalho aqui mesmo. Se não tiver, me fala que eu monto sem.",
  recebiFotos: (logo: boolean, fotos: number) =>
    logo && fotos ? "Recebi a logo e as fotos!"
    : fotos ? "Recebi as fotos! Sem logo, eu faço uma versão bonita só com o nome."
    : logo ? "Recebi a logo! Sem fotos, eu uso imagens do seu ramo e depois você troca pelas suas se quiser."
    : "Sem problema, eu monto com imagens do seu ramo e o nome bem trabalhado. Depois, se quiser, você manda as suas e eu troco.",
  pedeWhatsapp: (aqui: string) => `Os botões do site vão levar os clientes pra qual WhatsApp? Se for este mesmo (${aqui}), é só responder "esse". Se for outro, me manda o número com DDD.`,
  whatsappInvalido: 'Não entendi o número. Me manda o WhatsApp com DDD (ex.: 11 91234-5678) ou responda "esse" pra usar este mesmo.',
  pedeOk: "Posso começar? Em uns 50 minutos te mando a prévia aqui. Você só paga se gostar.",
  anotado: "Anotado. Posso começar?",
  comecou: "Fechado! Já estou montando. Te mando a prévia aqui em uns 50 minutos.",
  gerando: "Estou terminando o seu site, já te mando aqui.",
  previa: (url: string) => [
    `Pronto! Essa é a prévia do seu site: ${url}`,
    "Abre e me fala o que achou. Se quiser mudar qualquer coisa, é só me falar aqui.",
    `Ela fica no ar por ${DIAS_PREVIA} dias. Depois disso eu tiro do ar.`,
  ],
  ultimoDia: (url: string) => [
    `Passando pra avisar: hoje é o último dia da prévia do seu site no ar (${url}). Amanhã eu tiro do ar.`,
    "Se quiser deixar ele no ar de vez, me fala que eu te mando o link do pagamento. E se quiser mudar alguma coisa antes, é só pedir.",
  ],
  reativada: (url: string) => `A prévia tinha saído do ar, mas já coloquei de volta por mais ${DIAS_REATIVADA} dias: ${url}`,
  previaNova: (url: string) => [`Pronto, atualizei: ${url}`, "Dá uma olhada e me fala."],
  ajustando: "Deixa comigo, já mudo isso. Te mando a nova versão aqui em alguns minutos.",
  muitosAjustes: "Anotei. Esses últimos ajustes eu vou olhar com calma e já te chamo aqui.",
  pedeDados: (slug: string) => [
    "Que bom que gostou! Pra gerar o pagamento, me passa: nome completo, e-mail e CPF ou CNPJ.",
    `E me diz como prefere o endereço do site: ${slug}.supporta.com.br (já incluso), um domínio .com.br novo (+R$ ${pricing.dominio}/ano, eu vejo a disponibilidade pra você) ou um domínio que você já tem (aí não tem custo nenhum).`,
  ],
  faltaDados: (falta: string[]) => `Só falta: ${falta.join(", ")}.`,
  pagamento: (url: string, hoje: number, anual: number, endereco: string) => [
    `Total hoje: R$ ${hoje}. A partir do 2º ano você só renova o endereço${anual > pricing.endereco ? " e o domínio" : ""}: R$ ${anual}/ano.`,
    `Link do pagamento: ${url}`,
    `Pagando, você aceita os Termos de uso (supporta.com.br/termos). Assim que cair, o site vai ao ar em até ${pricing.prazoHoras}h em ${endereco} e eu te aviso aqui.`,
  ],
  aguardandoPagamento: "Assim que o pagamento confirmar eu te aviso aqui.",
  pagou: (endereco: string) => [
    "Pagamento confirmado! Muito obrigado 🙌",
    `Agora eu termino o site: além da página inicial que você viu, entram as páginas Sobre, Serviços, Perguntas frequentes e Contato, todas no mesmo estilo. Ele vai ao ar em até ${pricing.prazoHoras}h em ${endereco} e eu te mando o link aqui.`,
  ],
  noAr: (url: string) => [`Seu site está no ar: ${url}`, `Nos primeiros ${pricing.diasAlteracaoGratis} dias, qualquer alteração é sem custo. É só me pedir aqui.`],
  ajusteNoAr: (pago: boolean, url: string | null) =>
    pago ? "Anotado! A equipe faz a alteração e te avisa aqui." : `Anotado! Essa alteração custa R$ ${pricing.alteracao}${url ? `, link do pagamento: ${url}` : ". Já te mando o link do pagamento."}`,
  humano: "Entendi. Vou ver isso pessoalmente e já te respondo aqui.",
  mandaTexto: "Me manda por texto, por favor, que aqui eu não consigo ouvir áudio.",
  erro: "Deu um problema aqui do meu lado. Já estou vendo e te retorno.",
  erroGerador: "Tive um problema pra terminar o seu site. Já avisei a equipe e a gente te retorna aqui.",
};

/** Manda uma ou mais mensagens e guarda no histórico. Sem Evolution configurada (teste local), só registra. */
async function falar(telefone: string, textos: string | string[]) {
  for (const t of Array.isArray(textos) ? textos : [textos]) {
    let id: string | null = null;
    if (evolutionEnabled()) id = await enviarTexto(telefone, t);
    else console.log(`[bot -> ${telefone}] ${t}`);
    await registrarMensagem({ telefone, direcao: "out", tipo: "texto", corpo: t, wa_id: id });
  }
}

const ignorados = () => new Set((process.env.BOT_IGNORAR ?? "").split(",").map((n) => n.replace(/\D/g, "")).filter(Boolean));

/** Ponto de entrada: uma mensagem que chegou no WhatsApp do robô. Trabalho demorado vai para `depois`. */
export async function tratarMensagem(m: MensagemRecebida, depois: Depois) {
  if (ignorados().has(m.de)) return;
  const nova = await registrarMensagem({ telefone: m.de, direcao: "in", tipo: m.tipo, corpo: m.texto || `[${m.tipo}]`, wa_id: m.id });
  if (!nova) return; // a Evolution reenviou o mesmo evento
  if (evolutionEnabled()) await marcarLida(m);

  const conv = await pegarConversa(m.de, m.nome);
  // O cliente respondeu depois da prévia: a cadência recomeça a partir desta mensagem, mas já no "👀" (6h),
  // para não cobrar 10 minutos depois de alguém que disse "vou ver com meu sócio".
  await salvarConversa(m.de, { ultima_msg_cliente_em: new Date(), retornos: conv.previa_em ? 2 : 0, ultimo_retorno_em: null });
  if (conv.etapa === "humano") return; // alguém da equipe assumiu
  // Prévia que já saiu do ar e o cliente voltou a falar: volta ao ar por mais uns dias antes de seguir a conversa.
  if (conv.site_id && ["previa", "dados", "pagamento"].includes(conv.etapa)) {
    const e = await lerExpiracao(conv.site_id);
    const site = e && previaExpirou(e) ? await siteDe(conv) : null;
    if (site) {
      await reativarPrevia(site.id);
      await falar(conv.telefone, R.reativada(previaUrl(site.slug)));
    }
  }

  try {
    if (m.tipo === "imagem") return depois(tratarImagem(conv, m));
    if (m.tipo === "video") return await falar(conv.telefone, R.mandaTexto);
    if (m.tipo === "audio") {
      if (!transcricaoLigada()) return await falar(conv.telefone, R.mandaTexto);
      const { base64, mime } = m.base64 ? { base64: m.base64, mime: m.mime || "audio/ogg" } : await baixarMidia(m.id);
      m.texto = await transcrever(base64, mime);
      await registrarMensagem({ telefone: m.de, direcao: "in", tipo: "transcricao", corpo: m.texto });
    }
    const texto = m.texto.trim();
    if (!texto) return;
    switch (conv.etapa) {
      case "inicio": return await etapaInicio(conv, texto, depois);
      case "negocio": return await etapaNegocio(conv, texto, depois);
      case "servicos": return await etapaServicos(conv, texto);
      case "fotos": return await etapaFotos(conv, texto);
      case "confirmacao": return await etapaConfirmacao(conv, texto, depois);
      case "gerando": return await falar(conv.telefone, R.gerando);
      case "previa": return await etapaPrevia(conv, texto);
      case "dados": return await etapaDados(conv, texto);
      case "pagamento": return await etapaPagamento(conv, texto);
      case "pago": return await etapaPago(conv, texto);
    }
  } catch (err) {
    console.error("[bot] erro", conv.etapa, (err as Error).message);
    await falar(conv.telefone, R.erro).catch(() => {});
    await notifyTeam(`Robô do WhatsApp com erro: ${formatarFone(conv.telefone)}`, [`Etapa ${conv.etapa}`, (err as Error).message]);
  }
}

// ---------- etapas ----------

async function etapaInicio(conv: Conversa, texto: string, depois: Depois) {
  const links = acharLinks(texto);
  // Veio da prévia (analise.supporta.com.br/nome): continua a conversa daquele site.
  if (links.analise && (await assumirSitePorSlug(conv, links.analise))) return;
  // Já tem site com este WhatsApp (criado pelo site ou numa conversa antiga).
  if (await assumirSiteDoNumero(conv)) return;

  await falar(conv.telefone, R.abertura(primeiroNome(conv.nome)));
  await notifyTeam(`Novo contato no robô: ${conv.nome ?? ""} ${formatarFone(conv.telefone)}`, [texto.slice(0, 300)]);
  if (links.instagram || links.site) return etapaNegocio({ ...conv, etapa: "negocio" }, texto, depois);
  await salvarConversa(conv.telefone, { etapa: "negocio" });
  await falar(conv.telefone, R.pedeNegocio);
}

async function etapaNegocio(conv: Conversa, texto: string, depois: Depois) {
  const links = acharLinks(texto);
  const ia = await extrairNegocio(texto);
  const instagram = links.instagram ?? ia.instagram ?? undefined;
  const site = links.site ?? ia.site ?? undefined;
  const negocio = ia.negocio ?? (instagram || site ? undefined : texto.slice(0, 80));
  const origem: Briefing["origem"] = site ? "site" : instagram ? "instagram" : "whatsapp";
  await mesclarBriefing(conv.telefone, { negocio: negocio ?? conv.briefing.negocio, instagram, siteAtual: site, origem: conv.briefing.origem ?? origem });
  await salvarConversa(conv.telefone, { etapa: "servicos" });
  const onde = [instagram && "Instagram", site && "site"].filter(Boolean).join(" e ");
  await falar(conv.telefone, onde ? [R.olhando(onde), R.pedeServicos] : R.pedeServicos);
  // Puxa o que der do Instagram e do site enquanto o cliente responde.
  if (instagram || site) depois(enriquecer(conv.telefone, { instagram, site, negocio }));
}

async function enriquecer(telefone: string, q: { instagram?: string; site?: string; negocio?: string }) {
  const [perfil, siteLido] = await Promise.all([q.instagram ? lerInstagram(q.instagram) : undefined, q.site ? lerSite(q.site) : undefined]);
  let negocio = q.negocio;
  if (!negocio && siteLido?.titulo) negocio = siteLido.titulo.split(/[|\-\u2013\u2014:]/)[0].trim().slice(0, 80) || undefined;
  if (!negocio && q.instagram) negocio = q.instagram.replace(/[._]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
  const siteDoPerfil = !q.site && perfil?.site ? perfil.site.replace(/^https?:\/\//, "").split("/")[0] : undefined;
  await mesclarBriefing(telefone, { instagramPerfil: perfil, site: siteLido, siteAtual: q.site ?? siteDoPerfil, negocio: (await buscarConversa(telefone))?.briefing.negocio ?? negocio });
}

async function etapaServicos(conv: Conversa, texto: string) {
  const r = await extrairServicos(texto, conv.briefing);
  const atual = await mesclarBriefing(conv.telefone, {
    servicos: r.servicos,
    cidade: r.cidade ?? undefined,
    atendeTodoBrasil: r.atendeTodoBrasil,
    ramo: r.ramo,
    ramoOutro: r.ramoOutro ?? undefined,
    frase: r.frase,
  });
  if (!atual.briefing.negocio) await mesclarBriefing(conv.telefone, { negocio: texto.slice(0, 60) });
  await salvarConversa(conv.telefone, { etapa: "fotos" });
  await falar(conv.telefone, [r.confirmacao, R.pedeFotos(Boolean(atual.briefing.instagram || atual.briefing.siteAtual))]);
}

async function tratarImagem(conv: Conversa, m: MensagemRecebida) {
  let midia: Midia;
  try {
    const { base64, mime } = m.base64 ? { base64: m.base64, mime: m.mime || "image/jpeg" } : await baixarMidia(m.id);
    const leitura = await lerImagem(base64, mime, conv.briefing.negocio);
    const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
    const url = await uploadSiteFile(`whatsapp/${conv.telefone}/${m.id}.${ext}`, Buffer.from(base64, "base64"), mime === "image/png" || mime === "image/webp" ? mime : "image/jpeg");
    midia = { id: m.id, tipo: leitura.tipo, url, alt: leitura.alt, cores: leitura.cores };
    await adicionarMidia(conv.telefone, midia);
  } catch (err) {
    console.error("[bot] imagem:", (err as Error).message);
    return;
  }
  const atual = (await buscarConversa(conv.telefone)) ?? conv;
  if (["previa", "dados", "pagamento", "pago"].includes(atual.etapa) && atual.site_id) {
    const site = await siteDe(atual);
    if (site) {
      const pedido = m.texto ? `O cliente mandou esta imagem dizendo: "${m.texto}".` : midia.tipo === "logo" ? "Trocar a logo do site por ela." : "Colocar no lugar de uma foto de banco, onde ficar melhor.";
      await pedirAjuste(atual, site, `Imagem nova do cliente (${midia.tipo}): ${midia.url} (${midia.alt}). ${pedido}`);
    }
    return;
  }
  if (!["negocio", "servicos", "fotos"].includes(atual.etapa)) return;
  // Espera o cliente terminar de mandar; só a última foto da rajada responde.
  await pausa(ESPERA_FOTOS_MS);
  const depois = await buscarConversa(conv.telefone);
  if (!depois || depois.etapa !== "fotos" || depois.midias.at(-1)?.id !== m.id) return;
  await seguirParaResumo(depois);
}

async function etapaFotos(conv: Conversa, texto: string) {
  const t = texto.toLowerCase();
  const semFotos = /n[aã]o tenho|sem logo|sem foto|n[aã]o tem|nenhuma|pode montar|monta sem/.test(t);
  const usaOnline = /(usa|pega|pode usar).{0,20}(site|insta)/.test(t);
  const pronto = /pronto|[ée] isso|s[oó] isso|essas|mandei|enviei|acabei|^ok|beleza|pode seguir/.test(t);
  if (semFotos || usaOnline || pronto || conv.midias.length > 0) return seguirParaResumo(conv);
  await falar(conv.telefone, R.pedeFotos(Boolean(conv.briefing.instagram || conv.briefing.siteAtual)));
}

async function seguirParaResumo(conv: Conversa) {
  const logo = conv.midias.some((x) => x.tipo === "logo");
  const fotos = conv.midias.filter((x) => x.tipo === "foto").length;
  const online = conv.briefing.instagram || conv.briefing.siteAtual;
  // Sem fotos mandadas mas com site ou Instagram: as fotos saem de lá (importarImagensOnline), não do banco de imagens.
  const aviso = fotos || !online ? R.recebiFotos(logo, fotos) : logo ? `Recebi a logo! As fotos eu pego do seu ${conv.briefing.siteAtual ? "site" : "Instagram"}.` : `Beleza, eu uso a logo e as fotos do seu ${conv.briefing.siteAtual ? "site" : "Instagram"}.`;
  // Antes do resumo: para qual WhatsApp vão as mensagens do site (nem sempre é quem está conversando).
  await mesclarBriefing(conv.telefone, { aguardandoWhatsapp: true });
  await salvarConversa(conv.telefone, { etapa: "confirmacao" });
  await falar(conv.telefone, [aviso, R.pedeWhatsapp(formatarFone(conv.telefone))]);
}

async function mandarResumo(conv: Conversa) {
  const numero = formatarFone(conv.briefing.whatsappSite ?? conv.telefone);
  const resumo = await resumoFinal(conv.briefing, numero).catch(
    () => `Show, então ficou assim: ${conv.briefing.negocio}, ${conv.briefing.servicos?.map((s) => s.nome).join(", ")}, ${conv.briefing.atendeTodoBrasil ? "para todo o Brasil" : (conv.briefing.cidade ?? "")}, com o botão no WhatsApp ${numero}.`,
  );
  await falar(conv.telefone, [resumo, R.pedeOk]);
}

/** Resposta à pergunta do WhatsApp do site: "esse" (o número da conversa) ou outro número com DDD. */
async function respostaWhatsapp(conv: Conversa, texto: string) {
  const digitos = texto.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  let numero: string | null = null;
  if (digitos.length === 10 || digitos.length === 11) numero = digitos;
  else if (digitos.length < 8 && /\b(esse|este|mesmo|essa|esta|pode ser|sim|isso|aqui|o meu|meu)\b/i.test(texto)) numero = conv.telefone.replace(/^55/, "");
  if (!numero) return falar(conv.telefone, R.whatsappInvalido);
  const atual = await mesclarBriefing(conv.telefone, { whatsappSite: numero, aguardandoWhatsapp: false });
  return mandarResumo(atual);
}

const ehOk = (t: string) =>
  /^(ok|okay|sim|pode|combinado|fechado|fechou|beleza|bora|vamos|isso|certo|show|top|blz|👍|perfeito|manda|t[aá]|tamo|vai|claro)\b/i.test(t.trim()) || /combinado|fechado|pode come[cç]ar|pode fazer|pode seguir/i.test(t);

async function etapaConfirmacao(conv: Conversa, texto: string, depois: Depois) {
  if (conv.briefing.aguardandoWhatsapp) return respostaWhatsapp(conv, texto);
  if (!ehOk(texto)) {
    await mesclarBriefing(conv.telefone, { ajustes: [...(conv.briefing.ajustes ?? []), texto.slice(0, 500)] });
    await falar(conv.telefone, R.anotado);
    return;
  }
  await salvarConversa(conv.telefone, { etapa: "gerando" });
  await falar(conv.telefone, R.comecou);
  depois(
    criarPedido(conv.telefone).catch(async (err) => {
      console.error("[bot] criar pedido:", (err as Error).message);
      await salvarConversa(conv.telefone, { etapa: "confirmacao" });
      await falar(conv.telefone, R.erro);
      await notifyTeam(`Robô não conseguiu criar o pedido: ${formatarFone(conv.telefone)}`, [(err as Error).message]);
    }),
  );
}

/** Subdomínio livre: o nome do negócio, e se já existir, com um número no fim. */
async function slugLivre(empresa: string) {
  const base = slugify(empresa);
  for (let i = 0; i < 20; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    if (slugsReservados.has(slug)) continue;
    const taken = await slugTaken(slug);
    if (taken === null) throw new Error("banco indisponível");
    if (!taken) return slug;
  }
  return `${base}-${randomBytes(2).toString("hex")}`;
}

/** Fotos e logo do site atual (e a foto do perfil do Instagram, se for logo) viram arquivos da Supporta. */
async function importarImagensOnline(conv: Conversa): Promise<Midia[]> {
  const b = conv.briefing;
  const novas: Midia[] = [];
  const temLogo = conv.midias.some((x) => x.tipo === "logo");
  const temFotos = conv.midias.some((x) => x.tipo === "foto");
  const candidatas = [
    ...(!temLogo && b.site?.logo ? [{ url: b.site.logo, tipo: "logo" as const }] : []),
    ...(!temLogo && !b.site?.logo && b.instagramPerfil?.fotoPerfil ? [{ url: b.instagramPerfil.fotoPerfil, tipo: "talvez-logo" as const }] : []),
    ...(!temFotos ? (b.site?.imagens ?? []).slice(0, 6).map((url) => ({ url, tipo: "foto" as const })) : []),
  ];
  for (const [i, c] of candidatas.entries()) {
    const img = await baixarImagem(c.url);
    if (!img) continue;
    const base64 = img.buffer.toString("base64");
    const leitura = await lerImagem(base64, img.mime, b.negocio).catch(() => null);
    if (!leitura || leitura.qualidade === "ruim") continue;
    if (c.tipo === "talvez-logo" && leitura.tipo !== "logo") continue;
    const ext = img.mime === "image/png" ? "png" : img.mime === "image/webp" ? "webp" : "jpg";
    const url = await uploadSiteFile(`whatsapp/${conv.telefone}/online-${Date.now()}-${i}.${ext}`, img.buffer, img.mime).catch(() => null);
    if (url) novas.push({ id: `online-${i}`, tipo: c.tipo === "foto" ? leitura.tipo : "logo", url, alt: leitura.alt, cores: leitura.cores });
  }
  return novas;
}

/** O briefing da conversa no formato que o gerador do VPS já entende (o mesmo do criador), com o resto em `extra`. */
export function montarRespostas(conv: Conversa, midias: Midia[]): Respostas & Record<string, unknown> {
  const b = conv.briefing;
  const logo = midias.find((x) => x.tipo === "logo");
  const cores = logo?.cores?.filter((c) => /^#[0-9a-f]{6}$/i.test(c)) ?? [];
  const precos = (b.servicos ?? []).filter((s) => s.preco).map((s) => `${s.nome}: ${s.preco}`);
  const extra = [
    precos.length ? `Preços informados pelo dono: ${precos.join("; ")}` : "",
    b.instagramPerfil?.bio ? `Bio do Instagram: ${b.instagramPerfil.bio}` : "",
    b.instagramPerfil?.posts?.length ? `Legendas recentes do Instagram: ${b.instagramPerfil.posts.join(" | ").slice(0, 1200)}` : "",
    b.google?.nota ? `Google: nota ${b.google.nota} com ${b.google.avaliacoes ?? 0} avaliações` : "",
    b.site?.textos?.length ? `Textos do site atual: ${b.site.textos.join(" | ").slice(0, 2000)}` : "",
    b.ajustes?.length ? `Pedidos do dono no resumo (prioridade máxima): ${b.ajustes.join(" | ")}` : "",
  ].filter(Boolean).join("\n");
  return {
    ...respostasVazias,
    empresa: (b.negocio ?? conv.nome ?? "Meu negócio").replace(/\s*[\u2014\u2013]\s*/g, ", ").slice(0, 80),
    ramo: b.ramo ?? "outro",
    ramoOutro: b.ramoOutro ?? "",
    frase: b.frase ?? "",
    servicos: (b.servicos ?? []).map((s) => s.nome).slice(0, 8),
    cidade: b.atendeTodoBrasil ? `Atende todo o Brasil${b.cidade ? ` (base em ${b.cidade})` : ""}` : (b.cidade ?? ""),
    endereco: b.google?.endereco ?? b.instagramPerfil?.endereco ?? "",
    horario: b.google?.horario?.join("; ") ?? "",
    publico: b.publico ?? "",
    diferenciais: b.diferenciais ?? "",
    historia: b.historia ?? "",
    whatsappSite: (b.whatsappSite ?? conv.telefone).replace(/^55(?=\d{10,11}$)/, ""),
    instagram: b.instagram ?? "",
    siteAtual: b.siteAtual ?? "",
    logo: logo?.url ?? "",
    fotos: midias.filter((x) => x.tipo === "foto").map((x) => x.url).slice(0, 8),
    cores: cores.length ? { modo: "propria", primaria: cores[0].toUpperCase(), secundaria: (cores[1] ?? cores[0]).toUpperCase() } : { modo: "ia" },
    coresOrigem: cores.length ? "logo" : "ia",
    extra,
    origem: "whatsapp",
    ajustesPendentes: [],
  };
}

async function criarPedido(telefone: string) {
  let conv = (await buscarConversa(telefone))!;
  // Dá um tempo para o Instagram/site terminarem de ser lidos, se ainda não chegaram.
  if ((conv.briefing.instagram && !conv.briefing.instagramPerfil && process.env.APIFY_TOKEN) || (conv.briefing.siteAtual && !conv.briefing.site)) {
    await pausa(15_000);
    conv = (await buscarConversa(telefone))!;
  }
  if (!conv.briefing.google && conv.briefing.negocio) {
    const google = await lerGoogle(conv.briefing.negocio, conv.briefing.cidade);
    if (google) conv = await mesclarBriefing(telefone, { google });
  }
  const online = await importarImagensOnline(conv);
  const midias = [...conv.midias, ...online];
  if (online.length) await salvarConversa(telefone, { midias });
  const respostas = montarRespostas(conv, midias);
  const site = await createSite({
    token: randomBytes(18).toString("base64url"),
    slug: await slugLivre(respostas.empresa),
    plano: "pro",
    empresa: respostas.empresa,
    contato: { nome: conv.nome || respostas.empresa, email: "", whatsapp: telefone.replace(/^55/, "") },
    respostas,
    ip: "whatsapp",
  });
  if (!site) throw new Error("banco indisponível");
  await salvarConversa(telefone, { site_id: site.id });
  await notifyTeam(`Site novo pelo WhatsApp: ${site.empresa}`, [`${conv.nome ?? ""} · ${formatarFone(telefone)}`, `${respostas.ramo} · ${respostas.cidade}`, `Prévia: ${previaUrl(site.slug)}`]);
}

async function siteDe(conv: Conversa) {
  if (!conv.site_id) return null;
  return tryDb("siteDaConversa", async (sql) => {
    const [row] = await sql<Site[]>`select * from sites where id = ${conv.site_id}`;
    return row ?? null;
  });
}

/** Pedido de mudança antes de pagar: o gerador do VPS aplica na home e devolve a prévia (evento "previa"). */
async function pedirAjuste(conv: Conversa, site: Site, ajuste: string) {
  const r = site.respostas as { ajustesPendentes?: string[]; ajustesFeitos?: string[] };
  if ((r.ajustesPendentes?.length ?? 0) + (r.ajustesFeitos?.length ?? 0) >= MAX_AJUSTES_ANTES_DE_PAGAR) {
    await salvarConversa(conv.telefone, { etapa: "humano" });
    await falar(conv.telefone, R.muitosAjustes);
    await notifyTeam(`Muitos ajustes antes de pagar: ${site.empresa}`, [formatarFone(conv.telefone), ajuste, previaUrl(site.slug)]);
    return;
  }
  const ok = await tryDb("pedirAjuste", (sql) => sql`
    update sites set
      respostas = jsonb_set(respostas, '{ajustesPendentes}', coalesce(respostas->'ajustesPendentes', '[]'::jsonb) || ${sql.json([ajuste.slice(0, 600)] as never)}),
      status = case when status = 'ajustando' then status else 'ajuste' end,
      locked_at = case when status = 'ajustando' then locked_at else null end,
      atualizado_em = now()
    where id = ${site.id} and status in ('previa', 'ajuste', 'ajustando', 'erro') returning id`);
  if (!ok?.length) return pedirAjusteNoAr(conv, site, ajuste);
  await falar(conv.telefone, R.ajustando);
}

/** Site já pago: vira uma alteração da área do cliente (sem custo nos primeiros 30 dias). */
async function pedirAjusteNoAr(conv: Conversa, site: Site, ajuste: string) {
  const cliente = site.assinatura_id
    ? await tryDb("clienteDoSite", async (sql) => (await sql<Cliente[]>`select * from clientes where assinatura_id = ${site.assinatura_id}`)[0] ?? null)
    : null;
  if (!cliente) {
    await falar(conv.telefone, R.ajusteNoAr(true, null));
    await notifyTeam(`Ajuste pedido no WhatsApp: ${site.empresa}`, [formatarFone(conv.telefone), ajuste]);
    return;
  }
  const { requestAdjustment } = await import("@/lib/autoatendimento");
  const assinatura = await getSubscriptionById(cliente.assinatura_id);
  const r = await requestAdjustment(cliente, assinatura, ajuste);
  await falar(conv.telefone, R.ajusteNoAr(r.pago, r.cobrancaUrl));
  await notifyTeam(`Alteração pedida no WhatsApp: ${site.empresa}`, [ajuste, r.valor ? `Cobrada: R$ ${r.valor}` : "Sem custo (30 dias)"]);
}

async function chamarHumano(conv: Conversa, texto: string) {
  await salvarConversa(conv.telefone, { etapa: "humano" });
  await falar(conv.telefone, R.humano);
  await notifyTeam(`Cliente pediu atendimento no WhatsApp: ${conv.briefing.negocio ?? conv.nome ?? ""}`, [formatarFone(conv.telefone), texto.slice(0, 500), "O robô parou nessa conversa. Para devolver, mude a etapa da conversa no banco."]);
}

async function etapaPrevia(conv: Conversa, texto: string) {
  const site = await siteDe(conv);
  if (!site) return falar(conv.telefone, R.gerando);
  const r = await interpretarResposta(texto, `O cliente recebeu a prévia do site dele em ${previaUrl(site.slug)}. Ele ainda não pagou.`);
  switch (r.intencao) {
    case "aprovou":
      await salvarConversa(conv.telefone, { etapa: "dados" });
      return falar(conv.telefone, R.pedeDados(site.slug));
    case "ajuste":
      return pedirAjuste(conv, site, r.ajuste ?? texto);
    case "pagou":
      return falar(conv.telefone, R.aguardandoPagamento);
    case "humano":
      return chamarHumano(conv, texto);
    default:
      return falar(conv.telefone, r.resposta ?? "Dá uma olhada na prévia e me fala o que achou.");
  }
}

async function etapaDados(conv: Conversa, texto: string) {
  const site = await siteDe(conv);
  if (!site) return falar(conv.telefone, R.gerando);
  if (conv.briefing.aguardandoDominio) return escolhaDeDominio(conv, site, texto);
  const d = await extrairDados(texto);
  const achou = d.nome || d.email || d.documento || d.dominio !== null || d.jaTemDominio;
  if (!achou) {
    const r = await interpretarResposta(texto, `O cliente aprovou a prévia (${previaUrl(site.slug)}) e o robô pediu nome, e-mail e CPF/CNPJ para gerar o pagamento, e se quer o endereço incluso, um domínio novo ou um que ele já tem.`);
    if (r.intencao === "ajuste") return pedirAjuste(conv, site, r.ajuste ?? texto);
    if (r.intencao === "humano") return chamarHumano(conv, texto);
    return falar(conv.telefone, [r.resposta ?? "", R.pedeDados(site.slug)[0]].filter(Boolean));
  }
  const existente = d.jaTemDominio && d.dominioDesejado ? d.dominioDesejado.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] : undefined;
  const atual = await mesclarBriefing(conv.telefone, {
    responsavel: d.nome ?? undefined,
    email: d.email && isEmail(d.email.toLowerCase()) ? d.email.toLowerCase() : undefined,
    documento: d.documento && isCpfOrCnpj(onlyDigits(d.documento)) ? onlyDigits(d.documento) : undefined,
    dominio: d.jaTemDominio ? false : (d.dominio ?? undefined),
    dominioDesejado: d.jaTemDominio ? undefined : (d.dominioDesejado ?? undefined),
    jaTemDominio: existente,
  });
  const b = atual.briefing;
  const falta = [!b.responsavel && "nome completo", !b.email && "e-mail", !b.documento && (d.documento ? "um CPF ou CNPJ válido" : "CPF ou CNPJ")].filter((x): x is string => Boolean(x));
  if (d.jaTemDominio && !existente) falta.push("qual é o domínio que você já tem");
  if (falta.length) return falar(conv.telefone, R.faltaDados(falta));
  if (b.dominio === true && !b.dominioEscolhido) return oferecerDominios(atual, site);
  return gerarPagamento(atual, site);
}

/** Domínio novo: consulta o registro.br e manda até 3 opções livres para o cliente escolher. */
async function oferecerDominios(conv: Conversa, site: Site) {
  await falar(conv.telefone, "Vou ver a disponibilidade no registro.br e já te mando as opções.");
  const cidade = conv.briefing.cidade;
  const { livres } = await opcoesLivres(candidatos(site.empresa, conv.briefing.dominioDesejado, cidade));
  if (livres.length) {
    await mesclarBriefing(conv.telefone, { dominioOpcoes: livres, aguardandoDominio: true });
    return falar(conv.telefone, [
      `Esses estão livres:\n${livres.map((x, i) => `${i + 1}) ${x}`).join("\n")}`,
      "Qual você prefere? Se quiser outro nome, me manda que eu verifico.",
    ]);
  }
  // Não deu para consultar (ou nada livre): a equipe pesquisa e manda as opções; o pagamento segue com o domínio incluso.
  await notifyTeam(`Pesquisar domínio .com.br: ${site.empresa}`, [`Cliente ${formatarFone(conv.telefone)} quer domínio novo.`, `Pediu: ${conv.briefing.dominioDesejado ?? "(não disse)"}`, "A consulta automática ao registro.br não achou opção livre ou não respondeu. Mande as opções pelo WhatsApp."]);
  const atual = await mesclarBriefing(conv.telefone, { dominioEscolhido: "a definir" });
  await falar(conv.telefone, "Vou pesquisar com calma as opções de domínio no registro.br e te mando aqui pra você escolher. O pagamento já pode ser feito, com o domínio incluso:");
  return gerarPagamento(atual, site);
}

async function escolhaDeDominio(conv: Conversa, site: Site, texto: string) {
  const t = texto.trim().toLowerCase();
  const opcoes = conv.briefing.dominioOpcoes ?? [];
  if (/incluso|n[aã]o quero|sem dom[ií]nio|supporta\.com\.br|deixa sem/.test(t)) {
    const atual = await mesclarBriefing(conv.telefone, { dominio: false, aguardandoDominio: false });
    return gerarPagamento(atual, site);
  }
  const numero = t.match(/^\s*(?:op[cç][aã]o\s*)?(\d)\b/)?.[1];
  let escolhido = numero ? opcoes[Number(numero) - 1] : opcoes.find((o) => t.includes(o) || t.includes(o.replace(".com.br", "")));
  if (!escolhido) {
    const pedido = normalizarDominio(texto);
    if (!pedido) return falar(conv.telefone, `Me diz o número da opção (1 a ${opcoes.length}) ou o nome que você quer, que eu verifico.`);
    const r = await consultarDominio(pedido);
    if (r === "ocupado") {
      return falar(conv.telefone, `O ${pedido} já tem dono. ${opcoes.length ? `Os livres que eu achei: ${opcoes.join(", ")}. ` : ""}Quer um deles ou outro nome?`);
    }
    if (r === "desconhecido") {
      await notifyTeam(`Confirmar domínio no registro.br: ${pedido}`, [site.empresa, formatarFone(conv.telefone), "A consulta automática não respondeu; confira se está livre antes de registrar."]);
      await falar(conv.telefone, `Vou confirmar se o ${pedido} está livre e te aviso. Se não estiver, te mando outras opções.`);
    }
    escolhido = pedido;
  }
  const atual = await mesclarBriefing(conv.telefone, { dominioEscolhido: escolhido, aguardandoDominio: false, dominio: true });
  await falar(conv.telefone, `Fechado, ${escolhido}!`);
  return gerarPagamento(atual, site);
}

async function gerarPagamento(conv: Conversa, site: Site) {
  const b = conv.briefing;
  await tryDb("contatoDoSite", (sql) => sql`update sites set contato_nome = ${b.responsavel!}, contato_email = ${b.email!}, atualizado_em = now() where id = ${site.id}`);
  // CNPJ do cliente vai para o rodapé do site dele (CPF nunca aparece).
  if (b.documento?.length === 14) await tryDb("cnpjDoSite", (sql) => sql`update sites set respostas = respostas || ${sql.json({ cnpj: b.documento } as never)} where id = ${site.id}`);
  const comDominio = b.dominio === true;
  const pag = await linkPagamento({ site, nome: b.responsavel!, email: b.email!, documento: b.documento!, telefone: conv.telefone, dominio: comDominio });
  await mesclarBriefing(conv.telefone, { checkoutUrl: pag.url });
  await salvarConversa(conv.telefone, { etapa: "pagamento", previa_em: new Date(), retornos: 0, ultimo_retorno_em: null });
  if (b.jaTemDominio) {
    await falar(conv.telefone, `Como você já tem o domínio ${b.jaTemDominio}, não tem custo nenhum: depois que o site entrar no ar, eu te passo o passo a passo pra apontar ele pra gente.`);
    await notifyTeam(`Ligar domínio que o cliente já tem: ${site.empresa}`, [b.jaTemDominio, formatarFone(conv.telefone), "Sem custo. Depois de no ar: mandar a configuração do DNS e gravar em sites.dominio."]);
  }
  const textos = R.pagamento(pag.url, pag.hoje, pag.anual, `${site.slug}.supporta.com.br`);
  if (comDominio && b.dominioEscolhido && b.dominioEscolhido !== "a definir") textos.splice(1, 0, `O domínio ${b.dominioEscolhido} entra junto: assim que o pagamento cair, eu registro ele pra você.`);
  await falar(conv.telefone, textos);
  if (comDominio) await notifyTeam(`Registrar domínio novo: ${site.empresa}`, [b.dominioEscolhido ?? "(a definir)", `CPF/CNPJ do titular: ${b.documento}`, formatarFone(conv.telefone), "Registrar no registro.br depois que o pagamento cair e gravar em sites.dominio."]);
}

async function etapaPagamento(conv: Conversa, texto: string) {
  const site = await siteDe(conv);
  if (!site) return falar(conv.telefone, R.gerando);
  const r = await interpretarResposta(texto, `O cliente aprovou a prévia (${previaUrl(site.slug)}) e recebeu o link de pagamento: ${conv.briefing.checkoutUrl ?? ""}. Ainda não pagou.`);
  switch (r.intencao) {
    case "pagou":
      return falar(conv.telefone, R.aguardandoPagamento);
    case "aprovou":
      return falar(conv.telefone, conv.briefing.checkoutUrl ? `Link do pagamento: ${conv.briefing.checkoutUrl}` : R.aguardandoPagamento);
    case "ajuste":
      return pedirAjuste(conv, site, r.ajuste ?? texto);
    case "humano":
      return chamarHumano(conv, texto);
    default:
      return falar(conv.telefone, r.resposta ?? R.aguardandoPagamento);
  }
}

async function etapaPago(conv: Conversa, texto: string) {
  const site = await siteDe(conv);
  if (!site) return chamarHumano(conv, texto);
  const r = await interpretarResposta(texto, `O site do cliente já foi pago${site.status === "no_ar" ? ` e está no ar em ${siteUrl(site)}` : " e está sendo publicado"}.`);
  if (r.intencao === "ajuste") return pedirAjusteNoAr(conv, site, r.ajuste ?? texto);
  if (r.intencao === "humano") return chamarHumano(conv, texto);
  await falar(conv.telefone, r.resposta ?? "Qualquer coisa é só me chamar aqui.");
}

/** Link da prévia colado no WhatsApp: liga a conversa àquele site (só se ainda não for de outro número). */
async function assumirSitePorSlug(conv: Conversa, slug: string) {
  const site = await tryDb("sitePorSlug", async (sql) => (await sql<Site[]>`select * from sites where slug = ${slug} and status <> 'cancelado'`)[0] ?? null);
  if (!site) return false;
  const dono = await conversaDoSite(site.id);
  if (dono && dono.telefone !== conv.telefone) return false;
  return continuarSite(conv, site);
}

async function assumirSiteDoNumero(conv: Conversa) {
  const site = await tryDb("siteDoNumero", async (sql) =>
    (await sql<Site[]>`select * from sites where contato_whatsapp = ${conv.telefone.replace(/^55/, "")} and status <> 'cancelado' order by criado_em desc limit 1`)[0] ?? null);
  return site ? continuarSite(conv, site) : false;
}

async function continuarSite(conv: Conversa, site: Site) {
  const nome = primeiroNome(conv.nome);
  if (site.status === "no_ar" || site.status === "pago" || site.status === "publicando") {
    await salvarConversa(conv.telefone, { site_id: site.id, etapa: "pago" });
    await falar(conv.telefone, site.status === "no_ar" ? `Oi${nome ? ` ${nome}` : ""}! O site da ${site.empresa} está no ar: ${siteUrl(site)}. Precisa de algo?` : `Oi${nome ? ` ${nome}` : ""}! O site da ${site.empresa} já está sendo publicado. Te aviso aqui assim que entrar no ar.`);
    return true;
  }
  if (["na_fila", "gerando"].includes(site.status)) {
    await salvarConversa(conv.telefone, { site_id: site.id, etapa: "gerando" });
    await falar(conv.telefone, `Oi${nome ? ` ${nome}` : ""}! O site da ${site.empresa} está sendo montado. Te mando a prévia aqui assim que ficar pronta.`);
    return true;
  }
  const e = await lerExpiracao(site.id);
  if (e && previaExpirou(e)) await reativarPrevia(site.id);
  await salvarConversa(conv.telefone, { site_id: site.id, etapa: "previa", previa_em: new Date(), retornos: 0, ultimo_retorno_em: null });
  await falar(conv.telefone, [`Oi${nome ? ` ${nome}` : ""}! Que bom que você viu a prévia do site da ${site.empresa}: ${previaUrl(site.slug)}`, "O que achou? Se quiser mudar qualquer coisa, me fala aqui. Se gostou, eu já te passo o pagamento e ele vai ao ar."]);
  return true;
}

// ---------- avisos do gerador e do pagamento ----------

/** Chamado pelo /api/interno/site quando o gerador termina algo. Devolve true se havia conversa no WhatsApp. */
export async function avisarConversa(token: string, evento: "previa" | "no_ar" | "erro" | "pago", siteId?: string) {
  const site = siteId ? await siteDe({ site_id: siteId } as Conversa) : await getSiteByToken(token);
  if (!site) return false;
  const conv = await conversaDoSite(site.id);
  if (!conv) return false;
  if (evento === "previa") {
    const primeira = conv.etapa === "gerando" || !conv.previa_em;
    await salvarConversa(conv.telefone, { etapa: ["dados", "pagamento"].includes(conv.etapa) ? conv.etapa : "previa", previa_em: new Date(), retornos: 0, ultimo_retorno_em: null });
    await falar(conv.telefone, primeira ? R.previa(previaUrl(site.slug)) : R.previaNova(previaUrl(site.slug)));
  } else if (evento === "pago") {
    await salvarConversa(conv.telefone, { etapa: "pago" });
    await falar(conv.telefone, R.pagou(`${site.slug}.supporta.com.br`));
  } else if (evento === "no_ar") {
    await salvarConversa(conv.telefone, { etapa: "pago" });
    await falar(conv.telefone, R.noAr(siteUrl(site)));
  } else {
    await falar(conv.telefone, R.erroGerador);
  }
  return true;
}

// ---------- "o que achou?" para quem sumiu depois da prévia (cadência em retornos.ts) ----------

/** Áudio do retorno: arquivo gravado pelo Moura. Sem ele, vai o texto da mesma etapa. */
async function mandarAudio(telefone: string, url: string) {
  let id: string | null = null;
  if (evolutionEnabled()) id = await enviarAudio(telefone, url);
  else console.log(`[bot -> ${telefone}] (áudio) ${url}`);
  await registrarMensagem({ telefone, direcao: "out", tipo: "audio", corpo: `[áudio] ${url}`, wa_id: id });
}

export async function cobrarRetornos(agora = Date.now()) {
  const enviados: string[] = [];
  // Áudio gravado pelo Matheus (public/bot/retorno.ogg, ogg/opus como mensagem de voz do WhatsApp).
  const audio = process.env.BOT_AUDIO_RETORNO_URL || "https://supporta.com.br/bot/retorno.ogg";
  for (const c of await conversasEsperandoRetorno()) {
    if (!c.previa_em) continue;
    const base = Math.max(new Date(c.previa_em).getTime(), c.ultima_msg_cliente_em ? new Date(c.ultima_msg_cliente_em).getTime() : 0);
    const ultimo = Math.max(base, c.ultimo_retorno_em ? new Date(c.ultimo_retorno_em).getTime() : 0);
    let i = c.retornos;
    const doCliente = c.ultima_msg_cliente_em ? new Date(c.ultima_msg_cliente_em).getTime() : 0;
    let quando = quandoMandar(i, base, ultimo, c.telefone, agora, doCliente);
    while (quando && "pular" in quando) quando = quandoMandar(++i, base, ultimo, c.telefone, agora, doCliente); // horário marcado que já passou
    if (!quando || agora < quando.em) {
      if (i !== c.retornos) await salvarConversa(c.telefone, { retornos: i });
      continue;
    }
    const r = RETORNOS[i];
    // Marca antes de mandar: se a Evolution falhar, não repete a mesma mensagem a cada minuto.
    await salvarConversa(c.telefone, { retornos: i + 1, ultimo_retorno_em: new Date(agora) });
    try {
      if (r.tipo === "depois" && r.audio && audio) await mandarAudio(c.telefone, audio);
      else await falar(c.telefone, r.tipo !== "depois" && r.textoSemAudio && !transcricaoLigada() ? r.textoSemAudio : r.texto);
      enviados.push(c.telefone);
    } catch (err) {
      console.error("[bot] retorno:", (err as Error).message);
    }
  }
  return enviados;
}

/** Último dia da prévia no ar, sem pagamento: um lembrete só (o link sai do ar no fim do dia, sem apagar nada). */
export async function avisarUltimoDia(agora = new Date()) {
  const enviados: string[] = [];
  for (const p of await previasNoUltimoDia(agora)) {
    await marcarAvisoExpiracao(p.id); // marca antes: se o envio falhar, não repete a cada minuto
    try {
      await falar(p.telefone, R.ultimoDia(previaUrl(p.slug)));
      enviados.push(p.telefone);
    } catch (err) {
      console.error("[bot] último dia:", (err as Error).message);
    }
  }
  return enviados;
}

/** Mensagem fora de uma conversa (ex.: aviso de renovação), registrada no histórico do número. */
export const mensagemAvulsa = falar;

export const roteiro = R;
