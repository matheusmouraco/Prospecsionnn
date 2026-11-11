"use client";

import type { ImageLoaderProps } from "next/image";

// next/image loader that asks Unsplash's own image CDN for the exact width and a
// modern format (AVIF/WebP via auto=format). Fast and cached at the edge on any host,
// with no server-side image optimization needed.
export default function unsplashLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 70));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
