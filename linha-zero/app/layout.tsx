import type { Metadata, Viewport } from 'next';
import { Sora, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sora = Sora({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sora', display: 'swap' });
const jet = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-jet', display: 'swap' });

export const metadata: Metadata = {
  title: 'Linha Zero Arquitetura · Do traço à obra pronta',
  description:
    'Escritório de arquitetura residencial em São Paulo. Projetamos casas do primeiro croqui à entrega das chaves, com o mesmo time do começo ao fim da obra.',
  openGraph: {
    title: 'Linha Zero Arquitetura',
    description: 'Do traço à obra pronta. Arquitetura residencial em São Paulo.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0e1a24',
  colorScheme: 'dark light',
};

/*
  Adds .js only when motion is allowed, so [data-reveal] can start hidden.
  If GSAP has not booted in 5 s (blocked script, slow network) the class is removed and the page shows its final state.
*/
const bootScript = `(function(d,w){if(w.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.documentElement.classList.add('js');setTimeout(function(){if(!w.__lzMotion)d.documentElement.classList.remove('js')},5000)})(document,window)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${jet.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
