# Estúdio Bloco 7

Landing page de um escritório fictício de arquitetura autoral em concreto aparente.
Next.js (App Router), Tailwind 4, GSAP (ScrollTrigger, SplitText, Flip) e Lenis.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Para rodar atrás de proxy (o otimizador de imagens busca as fotos no Unsplash), use `NODE_USE_ENV_PROXY=1 npm start`.

## Antes de publicar

- `lib/data.ts`: o número de WhatsApp (`site.whatsapp`) é fictício (`5511900000000`). Troque pelo real, junto com e-mail, endereço e Instagram.
- Fotos: Unsplash (licença livre), servidas pelo `next/image` a partir do próprio domínio.

## Estrutura

- `app/globals.css`: tokens (cinza `#E9E9E6`, preto, laranja queimado `#B3460F`), grade de 12 colunas (4 no celular), linhas de 1px, estados iniciais das animações.
- `components/Guides.tsx`: linhas da grade fixas atrás da página.
- `components/Hero.tsx`: nome do estúdio ajustado à largura toda (razões `--k` medidas para Space Grotesk 700; se trocar fonte ou texto, meça de novo).
- `components/Projects.tsx`: índice de projetos, filtro com Flip, foto que segue o cursor (P&B, ganha cor com atraso). No celular e em telas de toque vira lista com miniatura, que ganha cor ao cruzar o meio da tela.
- `components/Motion.tsx`: Lenis + revelações (máscara por linha, réguas, fade) com IntersectionObserver e parallax com ScrollTrigger.

## Movimento e performance

- Só `transform` e `opacity` animam. P&B para cor é feito com duas camadas da mesma imagem.
- A primeira dobra (título, linhas da grade, metadados) anima em CSS puro, sem esperar JS.
- GSAP e Lenis carregam no primeiro scroll, toque ou movimento do mouse (ou após 3,5 s).
- `prefers-reduced-motion`: sem Lenis, marquee, revelações nem parallax; tudo já aparece pronto.
- Lighthouse local (build de produção): mobile 96 a 98 de performance, desktop 100; acessibilidade, boas práticas e SEO 100.
