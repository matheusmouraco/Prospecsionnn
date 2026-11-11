import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";

// Fraunces and Inter (SIL Open Font License), Latin subset, self-hosted.
// Fraunces is pinned to weight 300 but keeps its optical-size axis: at display sizes it
// switches to the high-contrast cut, and Portuguese accents stay seated on the letters.
// Inter keeps only the 400 to 500 range. See app/fonts/README.md.
const serif = localFont({
  src: [
    { path: "./fonts/fraunces-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/fraunces-300-italic.woff2", weight: "300", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = localFont({
  src: "./fonts/inter-400-500.woff2",
  weight: "400 500",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Atelier Vareda · Arquitetura residencial",
  description:
    "Atelier Vareda é um escritório de arquitetura residencial de alto padrão em São Paulo. Poucos projetos por ano, acompanhados do primeiro traço à entrega das chaves.",
  openGraph: {
    title: "Atelier Vareda · Arquitetura residencial",
    description: "Casas que guardam o tempo. Arquitetura residencial de alto padrão em São Paulo.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ec",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: only hide scroll-revealed elements when JS is on
// and the visitor accepts motion. Otherwise everything renders in place.
const motionFlag = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
