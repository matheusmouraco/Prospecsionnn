import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { Archivo } from "next/font/google";
import { APP_NAME, PRODUCT_NAME } from "@/lib/brand";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${APP_NAME} ${PRODUCT_NAME} · Render fotorrealista com IA`, template: `%s · ${APP_NAME} ${PRODUCT_NAME}` },
  description: "Do print do SketchUp ou Promob ao render fotorrealista, mantendo a geometria original. Para arquitetos, designers, marceneiros e construtoras.",
};

export const viewport: Viewport = { themeColor: "#0e100f", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
