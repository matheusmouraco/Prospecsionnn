# O que fica com você (Moura)

Lista do que só você pode fazer para a Supporta funcionar 100%. Marque conforme for resolvendo.
Site no ar em https://supporta.com.br (Vercel, projeto `supportasite`, pasta `supporta`), com `www` redirecionando para o principal. `/teleprompter/` e `/casafirme/` continuam no ar com `noindex, nofollow`.

## 1. Publicação e domínio

- [x] Root Directory `supporta`, domínios na Vercel e DNS na Hostinger (feito por você em 27/10/2026)
- [ ] **Branch de produção.** O repositório não tem `main`: o branch padrão é `ccr-f93647ec-c2h8kz`, que não tem a pasta `supporta`. Todo o código da Supporta está em `ccr-5a451054-muwj01`, que já contém tudo do padrão. Escolha um:
  - Vercel > `supportasite` > Settings > Git > Production Branch = `ccr-5a451054-muwj01`; ou
  - juntar o `ccr-5a451054-muwj01` no branch padrão (eu abro o PR se você pedir).
  Enquanto isso, um push no branch padrão gera build com erro (não derruba o site, só não publica) e os meus pushes viram prévia. Por isso, até lá, eu publico produção manualmente.
- [ ] **CDN da Hostinger.** O supporta.com.br ainda está cadastrado como site na hospedagem com CDN. Se o CDN for reativado ou alguém clicar em "Redefinir registros DNS", ela recoloca o `ALIAS @` e derruba o site novo. Se não for usar aquela hospedagem para a raiz, desative o CDN.
- [ ] O teleprompter e o casafirme foram copiados da Hostinger sem alteração para `supporta/public/`. **Mudanças feitas na Hostinger não aparecem mais no ar:** copie a pasta nova para `supporta/public/` e publique de novo.

## 2. Banco de dados

- [ ] Decidir o projeto Supabase. Recomendo um projeto novo só da Supporta, porque guarda dados de clientes pagantes. Alternativa: schema `supporta` no `metodo-tracao`.
- [ ] Rodar `npm run db:migrate` com `SUPABASE_DB_URL` (URL do pooler, porta 6543).
- [ ] Na Vercel, cadastrar `SUPABASE_DB_URL`, `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (tipo sensitive).

## 3. Chaves e contas (variáveis na Vercel, projeto `supportasite`)

A conexão da Vercel que eu uso não tem permissão para cadastrar variáveis nem alterar o projeto, então todas ficam com você (Settings > Environment Variables). `NEXT_PUBLIC_SITE_URL` já vale `https://supporta.com.br` por padrão no código.

- [ ] `SESSION_SECRET` (32+ caracteres aleatórios, `openssl rand -base64 48`). **Sem ela, a área do cliente e o link do briefing ficam desligados** (o site avisa e manda para o WhatsApp).
- [ ] `CRON_SECRET` (aleatório). Sem ela, os relatórios mensais não rodam.

- [x] WhatsApp `+55 11 99264-4010`, CNPJ `40.283.248/0001-21` e razão social `Matilab Tecnologia` já estão no código como padrão. Confirme se a razão social exata é essa (com ou sem "Ltda") porque aparece no rodapé e nos Termos.
- [x] E-mail de contato `contato@supporta.com.br` no código. Confirme que a caixa existe e recebe (MX da Hostinger).
- [ ] `PSI_API_KEY`: Google Cloud > ativar PageSpeed Insights API > criar chave. Sem ela o diagnóstico grátis falha muitas vezes (o Google limita).
- [ ] `RESEND_API_KEY`, `EMAIL_FROM` (domínio verificado no Resend com SPF e DKIM), `TEAM_EMAIL`
- [ ] `ADMIN_PASSWORD` (12+ caracteres) para abrir o `/admin`
- [ ] `LEAD_WEBHOOK_URL` (opcional, para mandar leads ao CRM ou ao Make/n8n)
- [ ] `NEXT_PUBLIC_GA_ID` e `NEXT_PUBLIC_META_PIXEL_ID`
- [ ] Plausible: conta, `PLAUSIBLE_API_KEY` e o script instalado em cada site Pro e Premium (o `site_id` de cada um vai no painel)
- [ ] `OPENAI_API_KEY`, `GEMINI_API_KEY`, `PERPLEXITY_API_KEY` para o monitoramento de citações do Premium
- [ ] Depois de cadastrar variáveis, fazer **Redeploy** na Vercel (as `NEXT_PUBLIC_` só entram num build novo).

## 4. Pagamento (sem isso o checkout recusa em produção e avisa o cliente)

- [ ] Escolher Asaas ou Stripe (`PAYMENT_PROVIDER`).
- [ ] Asaas: `ASAAS_API_KEY`, webhook para `https://supporta.com.br/api/webhooks/pagamento` com token em `ASAAS_WEBHOOK_TOKEN` (eventos de cobrança e de assinatura) e o domínio cadastrado para redirecionamento. Testar no sandbox: (a) volta para `/obrigado` depois de pagar; (b) o cartão fica salvo para as próximas cobranças.
- [ ] Stripe: 3 preços mensais em BRL (`STRIPE_PRICE_START`, `_PRO`, `_PREMIUM`), webhook com `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed` e `customer.subscription.deleted`, segredo em `STRIPE_WEBHOOK_SECRET`.
- [ ] Uma assinatura real de ponta a ponta, depois estornar.

## 5. Decisões de negócio que eu supus

- [ ] Prazos de entrega: 7, 15 e 30 dias úteis (`lib/site.ts`)
- [x] Modelo: assinatura do site, não venda. O site fica no ar enquanto a assinatura estiver ativa; mínimo de 12 meses e, a partir do 13º mês, mês a mês com cancelamento quando quiser (já está no site, nas FAQs, no checkout e nos Termos)
- [ ] Regra de cancelamento antes dos 12 meses (está entre colchetes nos Termos)
- [ ] Renovação do domínio a partir do 2º ano: inclusa ou cobrada?
- [ ] O que é entregue quando o cliente cancela
- [ ] Texto da página Sobre: "nasceu dentro de uma agência que cria sites..." (sem citar a Matilab). Quer citar?

## 6. Jurídico

- [ ] Revisar Termos e Privacidade e preencher os colchetes: endereço, inadimplência, foro, encarregado (DPO), nomes dos provedores.
- [ ] Validar o direito de arrependimento (art. 49 do CDC) e a fidelidade.
- [ ] Conferir as referências aos conselhos nos artigos do blog (CFO 196/2019, CFM 2.336/2023, OAB Provimento 205/2021).

## 7. Google e IAs (depois do DNS)

- [ ] Search Console: verificar supporta.com.br e enviar `/sitemap.xml`
- [ ] Bing Webmaster Tools: importar do Search Console
- [ ] Perfil da Empresa no Google com o mesmo nome, telefone e site do rodapé
- [ ] Rich Results Test na Home, Planos, um modelo, um artigo e o Glossário
- [ ] PageSpeed (celular) e GTmetrix na URL final

## 8. Prospector Matilab

- [ ] `SUPPORTA_URL=https://supporta.com.br` no `.env` do VPS
- [ ] Criar o custom field `link_supporta` no Snov e pôr a linha sugerida na campanha 2 (`prompts/sequencia-snov.md`)

## 9. Conteúdo que só você tem

- [ ] Primeiros cases reais em `lib/cases.ts` (notas medidas antes e depois, depoimento autorizado por escrito)
- [ ] Fotos reais para os modelos, se quiser trocar as formas abstratas das demos

## Cobrança mensal ou anual, multa e desconto (out/2026)

- Regras em `lib/plans.ts` (`billing`): prazo mínimo 12 meses, multa de 30% sobre as mensalidades que faltam, 10% de desconto a partir do 13º mês, anual = 10 mensalidades por 12 meses. Mudar ali atualiza site, checkout, Termos e llms.txt. **Confirmar os números e passar os Termos pela revisão jurídica.**
- Banco: aplicar `supabase/migrations/0002_ciclo_e_fidelidade.sql` (coluna `ciclo`, `desconto_fidelidade_em`, e-mail opcional nos leads do diagnóstico).
- Asaas: nada a configurar; o anual usa `cycle: YEARLY` e o desconto troca o valor da assinatura sozinho depois da 12ª mensalidade (ou da 1ª anuidade).
- Stripe: criar os Prices anuais (`STRIPE_PRICE_*_ANUAL`) e um cupom de 10% "forever" (`STRIPE_COUPON_FIDELIDADE`).
- A multa de cancelamento antecipado não é cobrada automaticamente: ao receber um pedido de cancelamento antes de 12 meses, calcular pelo exemplo dos Termos e cobrar pelo provedor.
