type LoaderArgs = { src: string; width: number; quality?: number };

// src arrives as "https://images.unsplash.com/photo-...?<grade params>".
export default function unsplashLoader({ src, width, quality }: LoaderArgs) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 62));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
