import { PRECO, registrarCusto } from "./custos";
export { acharLinks } from "./links";
import type { Briefing } from "./db";

// Dados públicos do negócio para o robô perguntar menos: Instagram (Apify, opcional), Google (Places, opcional) e o site atual.
// A análise completa do site (prints, cores, fotos) é feita pelo gerador no VPS, com o mesmo analisador do Prospector.

const UA = "Mozilla/5.0 (compatible; SupportaBot/1.0; +https://supporta.com.br)";

export async function lerInstagram(usuario: string): Promise<Briefing["instagramPerfil"] | undefined> {
  const token = process.env.APIFY_TOKEN;
  if (!token || !usuario) return undefined;
  try {
    const r = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?timeout=90`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ usernames: [usuario] }),
      signal: AbortSignal.timeout(100_000),
    });
    await registrarCusto("apify", "instagram", PRECO.instagramPerfil);
    if (!r.ok) return undefined;
    const p = ((await r.json()) as Record<string, any>[])?.[0];
    if (!p) return undefined;
    const bio = String(p.biography ?? "");
    return {
      bio,
      site: p.externalUrl || undefined,
      telefone: p.businessPhoneNumber || undefined,
      endereco: p.businessAddress ? [p.businessAddress.street_address, p.businessAddress.city_name].filter(Boolean).join(", ") || undefined : undefined,
      seguidores: Number(p.followersCount ?? 0) || undefined,
      posts: ((p.latestPosts as { caption?: string }[]) ?? []).map((x) => x.caption ?? "").filter(Boolean).slice(0, 6),
      fotoPerfil: p.profilePicUrlHD || p.profilePicUrl || undefined,
    };
  } catch (err) {
    console.warn("[bot] instagram:", (err as Error).message);
    return undefined;
  }
}

export async function lerGoogle(nome: string, cidade?: string): Promise<Briefing["google"] | undefined> {
  const key = process.env.GOOGLE_PLACES_KEY;
  if (!key || !nome) return undefined;
  try {
    const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.formattedAddress,places.nationalPhoneNumber,places.regularOpeningHours,places.rating,places.userRatingCount,places.googleMapsUri,places.websiteUri",
      },
      body: JSON.stringify({ textQuery: `${nome} ${cidade ?? ""}`.trim(), languageCode: "pt-BR", regionCode: "BR", maxResultCount: 1 }),
      signal: AbortSignal.timeout(10_000),
    });
    await registrarCusto("google", "google", PRECO.googleBusca);
    if (!r.ok) return undefined;
    const p = ((await r.json()) as { places?: Record<string, any>[] }).places?.[0];
    if (!p) return undefined;
    return {
      endereco: p.formattedAddress,
      telefone: p.nationalPhoneNumber,
      horario: p.regularOpeningHours?.weekdayDescriptions,
      nota: p.rating,
      avaliacoes: p.userRatingCount,
      mapsUrl: p.googleMapsUri,
      site: p.websiteUri ? String(p.websiteUri).replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] : undefined,
    };
  } catch (err) {
    console.warn("[bot] google:", (err as Error).message);
    return undefined;
  }
}

const limpar = (t: string) => t.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

/** Título, descrição, textos principais, logo e imagens do site atual do cliente. */
export async function lerSite(dominio: string): Promise<Briefing["site"] | undefined> {
  try {
    const url = /^https?:\/\//.test(dominio) ? dominio : `https://${dominio}`;
    const r = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(12_000) });
    if (!r.ok) return undefined;
    const html = (await r.text()).slice(0, 500_000);
    const base = new URL(r.url || url);
    const abs = (src?: string) => {
      try {
        return src ? new URL(src, base).href : undefined;
      } catch {
        return undefined;
      }
    };
    const meta = (nome: string) => html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${nome}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1];
    const textos = [...html.matchAll(/<(h1|h2|h3|p)[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => limpar(m[2])).filter((t) => t.length > 3 && t.length < 300).slice(0, 25);
    const imgs = [...html.matchAll(/<img[^>]+>/gi)].map((m) => m[0]);
    const logoTag = imgs.find((t) => /logo/i.test(t));
    const src = (tag?: string) => tag?.match(/(?:data-src|src)=["']([^"']+)["']/i)?.[1];
    return {
      titulo: html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim(),
      descricao: meta("description") ?? meta("og:description"),
      textos,
      logo: abs(src(logoTag)),
      imagens: [abs(meta("og:image")), ...imgs.filter((t) => t !== logoTag).map((t) => abs(src(t)))].filter((x): x is string => Boolean(x) && !/\.svg(\?|$)|data:/i.test(x!)).slice(0, 8),
    };
  } catch (err) {
    console.warn("[bot] site:", (err as Error).message);
    return undefined;
  }
}

/** Baixa uma imagem pública (foto do perfil, logo do site) para reaproveitar no bucket da Supporta. */
export async function baixarImagem(url: string): Promise<{ buffer: Buffer; mime: string } | null> {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(15_000) });
    const mime = (r.headers.get("content-type") ?? "").split(";")[0];
    if (!r.ok || !["image/jpeg", "image/png", "image/webp"].includes(mime)) return null;
    const buffer = Buffer.from(await r.arrayBuffer());
    return buffer.length > 2_000 && buffer.length < 10 * 1024 * 1024 ? { buffer, mime } : null;
  } catch {
    return null;
  }
}
