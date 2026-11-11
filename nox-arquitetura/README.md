# NOX Arquitetura

Landing page do escritório fictício NOX Arquitetura (projetos comerciais e residenciais de alto padrão).
App Next.js separado, sem relação com o Prospector.

## Rodar

```bash
cd nox-arquitetura
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Deploy na Vercel: criar o projeto com **Root Directory = `nox-arquitetura`**.

## Stack

Next.js 16 (App Router), Tailwind 4, GSAP 3.15 (ScrollTrigger, SplitText), Lenis. Fontes Anton e Inter via `next/font`.

## Estrutura

- `lib/data.ts`: textos, projetos, números e o número do WhatsApp (`WHATSAPP_NUMBER`, fictício: trocar antes de publicar).
- `lib/unsplash-loader.ts`: as fotos saem direto do CDN do Unsplash (imgix), já redimensionadas, em AVIF/WebP e com a gradação noturna (`sat`, `con`, `exp`) aplicada lá. Zero custo no navegador.
- `lib/gsap.ts`: registro dos plugins, easing padrão `power3.inOut` e o evento `nox:ready` (fim do preloader).
- `lib/idle.ts`: as cenas abaixo da dobra são montadas uma por vez em tempo ocioso, na ordem do DOM (evita tarefas longas e mantém os pins medidos na ordem certa).
- `components/`: `Preloader`, `SmoothScroll` (Lenis + ScrollTrigger), `Cursor`, `Header`, `Hero`, `Manifesto`, `Projects`, `Numbers`, `Contact`.

## Movimento

- Preloader de ~2s só na primeira visita da sessão (`sessionStorage`).
- Hero com zoom lento contínuo e título entrando linha por linha (SplitText com máscara).
- Manifesto fixado; as palavras acendem com o scroll.
- Projetos: seção fixada, cada projeto entra por clip-path sobre o anterior, com contra-zoom na foto.
- Contadores sobem ao entrar na tela.
- Cursor próprio que cresce sobre os projetos (só em mouse).
- `prefers-reduced-motion`: sem preloader, sem Lenis, sem pin. Tudo aparece estático e empilhado. Sem JS a página também é legível.

## Medido (Lighthouse mobile, build de produção local)

Performance 92 a 95, Acessibilidade 100, Boas práticas 100, SEO 100. CLS 0.
