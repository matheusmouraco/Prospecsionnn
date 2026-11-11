import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import Motion from '@/components/Motion';
import './globals.css';

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-grotesk',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Estúdio Bloco 7 | Arquitetura autoral em concreto aparente',
  description:
    'Estúdio de arquitetura em São Paulo. Casas, edifícios culturais e retrofits em concreto aparente, onde estrutura, fôrma e luz são o projeto.',
  openGraph: {
    title: 'Estúdio Bloco 7',
    description: 'Arquitetura autoral em concreto aparente. São Paulo.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export const viewport: Viewport = {
  themeColor: '#e9e9e6',
};

// Turns on the JS-driven initial states only when motion is allowed,
// and drops them if the motion bundle never boots, so content is never stuck hidden.
const bootMotion = `(function(){try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion')},8000)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${grotesk.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootMotion }} />
      </head>
      <body>
        {children}
        <Motion />
      </body>
    </html>
  );
}
