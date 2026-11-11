# Atelier Vareda

Landing page conceitual de um escritório fictício de arquitetura residencial de alto padrão.

Stack: Next.js 16 (App Router), Tailwind 4, GSAP 3.15 (ScrollTrigger, SplitText), Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Onde mexer

- `lib/content.ts`: todos os textos, projetos, fotos e o link do WhatsApp (o número atual é um placeholder).
- `components/`: uma seção por arquivo. `Experience.tsx` concentra Lenis e todas as animações de scroll.
- `app/globals.css`: tokens de cor e fonte, revelação das imagens e a animação do hero.

## Decisões de movimento e performance

- Hero animado só com CSS (começa na primeira pintura, não espera o JavaScript).
- GSAP e Lenis carregam depois do `load`, montados em etapas curtas.
- Imagens "abrem de baixo para cima" com duas camadas em translate opostos: mesmo efeito de um clip-path, animando só transform.
- `prefers-reduced-motion`: sem Lenis, sem pin, galeria vira rolagem lateral nativa, tudo visível.
- Fotos do Unsplash pela CDN deles via loader do `next/image` (`lib/unsplash-loader.ts`).
- Fontes self-hosted e instanciadas (ver `app/fonts/README.md`).

Lighthouse (build de produção local): mobile 96 a 98, desktop 100, acessibilidade, boas práticas e SEO 100.
