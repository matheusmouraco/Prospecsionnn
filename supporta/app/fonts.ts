import localFont from "next/font/local";

// Geist e Geist Mono (OFL), recortadas para latim + português e pesos usados (400 a 600).
// O arquivo original variável tem ~70 KB cada; o recorte reduz o tempo até o LCP no celular.
export const geistSans = localFont({
  src: "./fonts/geist-sans-latin.woff2",
  variable: "--font-geist-sans",
  weight: "400 600",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Arial"],
});

// Mono só aparece nos rótulos pequenos: sem preload, para não disputar banda com o conteúdo principal.
export const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "400 500",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "Menlo", "monospace"],
});
