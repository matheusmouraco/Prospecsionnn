/** Artes neon da marca (public/img/<nome>-640.webp e -1200.webp). Decorativas: o texto ao lado já diz o que importa. */
export type ArtName = "chat-ia" | "bolha-chat" | "camadas" | "lupa-busca" | "lupa" | "ondas" | "rede" | "reguas" | "passo-1-cartao" | "passo-2-briefing" | "passo-3-navegador";

const ratios: Record<ArtName, [number, number]> = {
  "chat-ia": [1122, 1402],
  "bolha-chat": [1254, 1254],
  camadas: [1448, 1086],
  "lupa-busca": [1672, 941],
  lupa: [1254, 1254],
  ondas: [1672, 941],
  rede: [1254, 1254],
  reguas: [1672, 941],
  "passo-1-cartao": [1448, 1086],
  "passo-2-briefing": [1448, 1086],
  "passo-3-navegador": [1448, 1086],
};

export function NeonArt({ name, sizes = "(min-width: 1024px) 40vw, 100vw", eager, className = "" }: { name: ArtName; sizes?: string; eager?: boolean; className?: string }) {
  const [w, h] = ratios[name];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/img/${name}-1200.webp`}
      srcSet={`/img/${name}-640.webp 640w, /img/${name}-1200.webp 1200w`}
      sizes={sizes}
      width={w}
      height={h}
      alt=""
      aria-hidden
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`block h-auto w-full bg-ink object-cover ${className}`}
    />
  );
}
