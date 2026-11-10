import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { APP_NAME } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${APP_NAME} · Render fotorrealista com IA`, template: `%s · ${APP_NAME}` },
  description: "Transforme print do SketchUp, Promob, foto ou croqui em render fotorrealista, mantendo a geometria original.",
};

export const viewport: Viewport = { themeColor: "#0b0b0c", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
