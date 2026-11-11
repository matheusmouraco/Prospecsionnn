# Linha Zero Arquitetura

Landing page de um escritório fictício de arquitetura residencial: "do traço à obra pronta". App Next.js independente dentro deste repositório (não depende do Prospector).

## Rodar

```bash
cd linha-zero
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Antes de publicar, troque o número em `lib/site.ts` (`WHATSAPP_NUMBER` é fictício).

## Stack

Next.js 16 (App Router) · Tailwind 4 · GSAP 3.15 (ScrollTrigger, DrawSVG, SplitText) · Lenis · next/font (Sora + JetBrains Mono) · next/image com fotos do Unsplash.

## Estrutura

- `components/drawings/`: todos os desenhos são SVG feitos à mão para o projeto
  - `FloorPlan.tsx`: planta da Casa Jatobá em escala 1:100 (40 unidades = 1 m), em camadas (`walls`, `inner`, `openings`, `labels`, `dims`, `marks`, `furniture`, `site`, `detail`) que animam separadas
  - `Croquis.tsx`: fachadas dos 3 projetos, desenhadas sobre a volumetria de cada foto, com traço que passa do canto como croqui à mão
  - `ProcessSketches.tsx`: a mesma casa nas 5 etapas (bolhas, zoneamento, anteprojeto, executivo, fachada)
- `components/Motion.tsx`: único componente cliente. Carrega GSAP e Lenis depois da hidratação e monta cada seção em uma tarefa separada (o hero primeiro), para não gerar tarefa longa
- Seções: `Hero`, `PlanToPhoto` (fixada), `Projects`, `Process`, `Contact`

## Regras de movimento

- Só `transform`, `opacity` e `stroke` (DrawSVG) são animados. A troca do fundo escuro para o claro é uma camada de papel subindo com `scaleY`, junto com a varredura da foto
- Scrub com `ease: none`, entradas com `expo.out`
- Celular: só 1 camada de parallax e fixação mais curta
- `prefers-reduced-motion`: nenhum JS de animação é baixado; o HTML já sai no estado final
- Sem JS: a classe `js` só entra quando há movimento permitido, e sai sozinha se o GSAP não subir em 5 s

## Medição (Lighthouse local, build de produção)

| | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| Mobile | 93 a 94 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Mobile: LCP observado 0,17 s (simulado 2,7 s), TBT ~190 ms, CLS 0.
