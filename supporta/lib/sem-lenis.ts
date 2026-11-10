/** Tira o Lenis (rolagem suave) do HTML: nos sites gerados ele só roda se a biblioteca carregar, e no celular deixa a rolagem esquisita. */
export const semLenis = (html: string) => html.replace(/<script\b[^>]*\bsrc=["'][^"']*lenis[^"']*["'][^>]*>\s*<\/script>\s*/gi, "");
