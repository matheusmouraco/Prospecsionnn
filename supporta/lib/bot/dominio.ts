// Domínio próprio .com.br: disponibilidade consultada no registro.br (RDAP público, sem chave).
// 404 = livre; 200 = já tem dono; outra resposta (403/429 por excesso de consultas) = não deu para saber,
// e aí o robô não afirma nada: avisa a equipe para conferir.

export type Disponibilidade = "livre" | "ocupado" | "desconhecido";

const semAcento = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "");

/** "Clínica X", "www.clinicax.com", "clinicax" viram "clinicax.com.br". Só .com.br. */
export function normalizarDominio(entrada: string): string | null {
  let t = semAcento(entrada.trim().toLowerCase()).replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#\s]/)[0] ?? "";
  if (!t) return null;
  const base = t.endsWith(".com.br") ? t.slice(0, -7) : t.split(".")[0];
  const label = base.replace(/[^a-z0-9-]+/g, "").replace(/^-+|-+$/g, "");
  return /^[a-z0-9][a-z0-9-]{1,25}$/.test(label) ? `${label}.com.br` : null;
}

export async function consultarDominio(dominio: string): Promise<Disponibilidade> {
  try {
    const r = await fetch(`https://rdap.registro.br/domain/${encodeURIComponent(dominio)}`, {
      headers: { accept: "application/rdap+json" },
      signal: AbortSignal.timeout(8_000),
    });
    if (r.status === 404) return "livre";
    if (r.status === 200) return "ocupado";
    return "desconhecido";
  } catch {
    return "desconhecido";
  }
}

/** Sugestões a partir do que o cliente pediu e do nome do negócio. */
export function candidatos(empresa: string, desejado?: string, cidade?: string): string[] {
  const slug = semAcento(empresa.toLowerCase()).replace(/[^a-z0-9]+/g, " ").trim();
  const junto = slug.replace(/\s+/g, "");
  const hifen = slug.replace(/\s+/g, "-");
  const local = cidade ? semAcento(cidade.toLowerCase()).split(/[,\-]/)[0].replace(/[^a-z0-9]+/g, "") : "";
  const lista = [desejado, junto, hifen, `${junto}oficial`, local && `${junto}${local}`, `site${junto}`, `${junto}br`]
    .filter((x): x is string => Boolean(x))
    .map(normalizarDominio)
    .filter((x): x is string => Boolean(x));
  return [...new Set(lista)];
}

/** Consulta os candidatos um por um (sem rajada) até achar `quantos` livres. */
export async function opcoesLivres(lista: string[], quantos = 3) {
  const livres: string[] = [];
  let incerto = false;
  for (const d of lista) {
    const r = await consultarDominio(d);
    if (r === "livre") livres.push(d);
    if (r === "desconhecido") incerto = true;
    if (livres.length >= quantos) break;
    await new Promise((ok) => setTimeout(ok, 400));
  }
  return { livres, incerto };
}
