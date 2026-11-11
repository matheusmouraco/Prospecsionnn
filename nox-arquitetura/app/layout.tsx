import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "NOX Arquitetura | Projetos comerciais e residenciais de alto padrão",
  description:
    "Escritório de arquitetura em São Paulo. Casas, edifícios comerciais e hotéis de alto padrão desenhados para a luz da noite.",
  openGraph: {
    title: "NOX Arquitetura",
    description: "Arquitetura que acende a noite. Projetos comerciais e residenciais de alto padrão.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

// Runs before first paint: flags JS, reduced motion and whether the preloader should play.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(r){d.classList.add('reduce');d.dataset.ready='1';return}var s=false;try{s=sessionStorage.getItem('nox-seen')==='1'}catch(e){}if(s){d.dataset.ready='1'}else{d.classList.add('preload')}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
