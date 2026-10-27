# O que fica com você (Moura)

Lista do que só você pode fazer para a Supporta funcionar 100%. Marque conforme for resolvendo.
O site já está publicado na Vercel (projeto `supportasite`). Enquanto o DNS não mudar, o supporta.com.br continua mostrando o que está na Hostinger.

## 1. Domínio supporta.com.br (para o site novo aparecer)

- [ ] No painel da Hostinger, em DNS do supporta.com.br, trocar **só** estes registros (não mexa em MX, TXT de e-mail nem nos servidores de nome):
  - `A` do `@` (raiz) para o IP que a Vercel mostrar no projeto `supportasite` (Settings > Domains).
  - `CNAME` do `www` para `cname.vercel-dns.com` (o www redireciona para supporta.com.br).
- [ ] Esperar a Vercel marcar o domínio como "Valid Configuration" e o SSL ficar ativo.
- [ ] Conferir depois da troca: https://supporta.com.br, https://supporta.com.br/teleprompter/ e https://supporta.com.br/casafirme/.
  - O teleprompter e o casafirme foram copiados da Hostinger sem nenhuma alteração para `public/teleprompter` e `public/casafirme`, e saem com `X-Robots-Tag: noindex, nofollow`.
  - **Se você mudar algum deles na Hostinger, a mudança não aparece mais no ar.** Copie a pasta nova para `supporta/public/` e publique de novo.
- [ ] Se tinha outra pasta ou arquivo na Hostinger que precisa continuar no ar, me avise antes de trocar o DNS: só copiei esses dois.

## 2. Banco de dados

- [ ] Decidir o projeto Supabase. Recomendo um projeto novo só da Supporta, porque guarda dados de clientes pagantes. Alternativa: schema `supporta` no `metodo-tracao`.
- [ ] Rodar `npm run db:migrate` com `SUPABASE_DB_URL` (URL do pooler, porta 6543).
- [ ] Na Vercel, cadastrar `SUPABASE_DB_URL`, `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (tipo sensitive).

## 3. Chaves e contas (variáveis na Vercel, projeto `supportasite`)

Já cadastradas por mim: `NEXT_PUBLIC_SITE_URL`, `SESSION_SECRET` e `CRON_SECRET` (aleatórios, você não precisa saber o valor).

- [ ] `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_RAZAO_SOCIAL`, `NEXT_PUBLIC_CNPJ` (enquanto não preencher, o site mostra os colchetes no rodapé e no contato)
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
