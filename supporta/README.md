# Supporta: site institucional e de vendas

Site da Supporta (sites por assinatura). Next.js 16 (App Router) + TypeScript + Tailwind 4, sistema visual "Camadas". Pensado para deploy na Vercel, com quase tudo estático.

## Rodar

```bash
cd supporta
npm install
cp .env.example .env.local   # preencher os placeholders
npm run dev                  # http://localhost:3000
npm run build && npm start   # produção local
npm run typecheck
npm run check:seo            # depois do build: title ≤ 60, description ≤ 155, canonical, og:image, 1 H1, sem travessão
npm run check:copy           # nenhum travessão no conteúdo
```

Sem `ASAAS_API_KEY`/`STRIPE_SECRET_KEY`, o checkout roda em **modo teste** fora de produção: registra o aceite, manda para o webhook e leva para `/obrigado?teste=1` sem cobrar nada. Em produção (`VERCEL_ENV=production`) sem chave, ele recusa e avisa o cliente.

## Arquitetura

```
app/
  layout.tsx                 fontes, header, rodapé, WhatsApp flutuante, cookies, analytics, JSON-LD Organization + WebSite
  fonts.ts + fonts/          Geist e Geist Mono recortadas (17 KB e 12 KB) via next/font/local
  page.tsx                   Home (13 seções)
  planos/  modelos/  modelos/[segmento]/  geo/  diagnostico/
  assinar/[plano]/           checkout em 3 etapas (noindex)
  obrigado/                  próximos passos e prazos (noindex)
  blog/  blog/[slug]/        MDX em content/blog
  termos/  privacidade/      minutas com placeholders para o jurídico
  api/diagnostico            PageSpeed (mobile) + checagens + webhook do lead, limite por IP
  api/checkout               valida, registra aceite (data, hora, IP, versão dos Termos), cria a assinatura
  api/webhooks/pagamento     aprovado / recusado / cancelado, repassa ao CRM
  sitemap.ts  robots.ts  llms.txt/  llms-full.txt/  opengraph-image.tsx (uma por página)
components/
  brand/    Symbol, Logo
  ui/       Button, Pill, Card, SectionLabel, Section, Faq, Breadcrumbs, PageHero, LegalPage, JsonLd
  layout/   Header (menu mobile em tela cheia), Footer, WhatsAppFloat, CookieConsent, Analytics
  home/     Hero, ProofStrip, AiProblem, Layers, TemplatesTabs, HowItWorks, Plans, CompareTable,
            CostComparison, DiagnosticCta, FinalCta
  mockups/  Frames (navegador e celular), SiteMock (modelos em HTML/CSS, zero imagem)
  diagnostico/ DiagnosticTool, Gauge
  checkout/ CheckoutFlow, CheckoutComplete
lib/
  site.ts (dados e placeholders)  plans.ts  segments.ts  faqs.ts  blog.ts
  seo.ts  schema.ts  llms.ts  og.tsx  analytics.ts  leads.ts  rate-limit.ts  documents.ts (CPF/CNPJ)
  diagnostico/  safe-fetch (anti-SSRF)  checks  psi  recommendations
  payments/     types (interface)  index (escolhe pelo .env)  asaas  stripe
```

**Trocar de provedor de pagamento:** `PAYMENT_PROVIDER=asaas` ou `stripe`. Os dois implementam a mesma interface (`lib/payments/types.ts`). Nos dois casos o cartão é digitado na página segura do provedor; nenhum dado de cartão passa pelo nosso servidor.

**Eventos de analytics** (GA4 + Meta Pixel, só depois do aceite de cookies): `plan_click`, `begin_checkout`, `checkout_complete`, `diagnostic_submit`, `whatsapp_click`. Qualquer elemento com `data-track="evento"` e `data-track-*` dispara automaticamente.

**Webhook de leads** (`LEAD_WEBHOOK_URL`): recebe `POST` JSON com `type` = `diagnostico`, `assinatura_iniciada`, `assinatura_teste`, `assinatura_erro`, `assinatura_sem_pagamento`, `pagamento_payment_approved`, `pagamento_payment_refused`, `pagamento_subscription_canceled`. Serve para Make, n8n, Zapier ou o CRM direto.

## Resultado das medições (build de produção local)

Lighthouse 12, celular, throttling simulado:

| Página | Desempenho | Acessib. | Boas práticas | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| / | 99 | 100 | 100 | 100 | 2,0 s | 0 |
| /planos | 99 | 100 | 100 | 100 | 1,9 s | 0 |
| /modelos | 99 | 100 | 100 | 100 | 1,9 s | 0 |
| /modelos/odontologia | 98 | 100 | 100 | 100 | 2,3 s | 0 |
| /diagnostico | 99 | 100 | 100 | 100 | 2,1 s | 0 |
| /geo | 99 | 100 | 100 | 100 | 2,0 s | 0 |
| /blog | 99 | 100 | 100 | 100 | 2,1 s | 0 |
| /blog/como-a-ia-escolhe-quem-indicar | 98 | 100 | 100 | 100 | 2,2 s | 0 |
| /assinar/pro | 100 | 100 | 100 | 66 (noindex proposital) | 1,8 s | 0 |

`npm run check:seo`: as 21 páginas passam (title ≤ 60, description ≤ 155, canonical, og:image, um H1, sem travessão). Sem rolagem horizontal em 390, 768 e 1440 px.

## Pontos de atenção (critérios não comprovados aqui)

1. **GTmetrix nota A**: não dá para rodar daqui. Pelos números do Lighthouse deve passar, mas precisa medir depois do deploy.
2. **PageSpeed real**: as notas acima são locais. Rodar o PSI na URL de produção.
3. **next/image**: o site não tem nenhuma imagem raster (mockups em HTML/CSS e OG gerado). O `next.config.ts` já está com AVIF/WebP para quando entrarem prints reais dos modelos.
4. **Animações**: só CSS, sem Motion One (não fez falta). `prefers-reduced-motion` desliga tudo.
5. **"O lead é salvo"**: hoje vai só para o webhook. Sem `LEAD_WEBHOOK_URL`, o lead fica só no log da Vercel. Se quiser banco próprio, plugar em `lib/leads.ts`.
6. **Limite por IP** fica em memória, por instância da Vercel. Segura abuso comum; para limite global, trocar por Upstash/Vercel KV em `lib/rate-limit.ts`.
7. **Asaas**: confirmar no sandbox que (a) o campo `callback` aceito na assinatura redireciona para `/obrigado` e (b) o cartão pago na primeira fatura fica salvo para as próximas. O domínio do `successUrl` precisa estar cadastrado na conta Asaas.
8. **Acessibilidade**: testes automáticos (axe) em 100. Falta um teste manual com leitor de tela (NVDA/VoiceOver).
9. **Decisões de negócio que eu supus** e precisam de confirmação: prazos de entrega (7, 15 e 30 dias úteis em `lib/site.ts`), regra de cancelamento antecipado, renovação do domínio a partir do 2º ano, o que é entregue ao fim da assinatura. Estão marcadas entre colchetes nos Termos.
10. Os negócios dos mockups (Clínica Sorrir Bem, Atelier Linha etc.) e os concorrentes do chat simulado são fictícios.

## Checklist de publicação

**Domínio e Vercel**
- [ ] Criar o projeto na Vercel com Root Directory = `supporta`
- [ ] Apontar o domínio (`www.supporta.com.br` e redirecionar o apex) e conferir o SSL
- [ ] Preencher `NEXT_PUBLIC_SITE_URL` com a URL final (canonical, sitemap, OG e llms.txt dependem dela)

**Variáveis de ambiente (Production e Preview)**
- [ ] `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_RAZAO_SOCIAL`, `NEXT_PUBLIC_CNPJ`
- [ ] `PSI_API_KEY` (Google Cloud > ativar PageSpeed Insights API > criar chave restrita a essa API). Sem chave o Google devolve 429 com frequência
- [ ] `LEAD_WEBHOOK_URL` (+ `LEAD_WEBHOOK_SECRET`) e testar um diagnóstico chegando no CRM
- [ ] `NEXT_PUBLIC_GA_ID` e `NEXT_PUBLIC_META_PIXEL_ID`

**Pagamento**
- [ ] Asaas: chave de produção em `ASAAS_API_KEY`, webhook apontando para `https://SEU_DOMINIO/api/webhooks/pagamento` com token em `ASAAS_WEBHOOK_TOKEN` (eventos de cobrança e de assinatura), domínio cadastrado para redirecionamento
- [ ] Ou Stripe: criar 3 preços recorrentes mensais em BRL, preencher `STRIPE_PRICE_*`, webhook com `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted` e o segredo em `STRIPE_WEBHOOK_SECRET`
- [ ] Fazer uma assinatura real de ponta a ponta no sandbox e depois uma em produção com estorno

**Jurídico**
- [ ] Revisar Termos e Privacidade e preencher todos os colchetes (endereço, regra de cancelamento antecipado, inadimplência, foro, DPO, provedores)
- [ ] Validar a aplicação do direito de arrependimento (art. 49 do CDC) e a fidelidade

**Google e IAs**
- [ ] Search Console: verificar o domínio, enviar `/sitemap.xml`, pedir indexação da Home, Planos e Modelos
- [ ] Bing Webmaster Tools: importar do Search Console
- [ ] Google Meu Negócio: criar o perfil da Supporta com o mesmo nome, telefone e site do rodapé
- [ ] Validar o JSON-LD no Rich Results Test (Home, Planos, um modelo e um artigo)
- [ ] Conferir `/robots.txt`, `/llms.txt` e `/llms-full.txt` no domínio final

**Depois do deploy**
- [ ] PageSpeed Insights (celular) na Home, Planos e Diagnóstico: meta 90+
- [ ] GTmetrix: meta nota A
- [ ] Testar o WhatsApp flutuante em 3 páginas (mensagem muda por página)
- [ ] Testar recusar e aceitar cookies e ver os eventos chegando no GA4 (DebugView) e no Meta (Test Events)

## Fontes

Geist e Geist Mono (SIL Open Font License, licença em `app/fonts/LICENSE.txt` e `assets/fonts/LICENSE.txt`). Para regerar os recortes: `scripts/subset-fonts.sh` (precisa de `pip install fonttools brotli`).
