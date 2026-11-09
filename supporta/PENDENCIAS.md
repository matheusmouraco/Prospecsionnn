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

## Autoatendimento do cliente (out/2026)

- Banco: aplicar `supabase/migrations/0003_etapas_e_autoatendimento.sql` (`npm run db:migrate`). Cria as etapas do site, a prévia, o modelo escolhido, a tabela `solicitacoes` e o cancelamento agendado.
- Fluxo: "Quero um assim" no modelo abre `/planos?tema=<modelo>` e o modelo segue até o checkout (o cliente também pode escolher lá). No painel (`/admin`), cada cliente tem **Etapa do site**: ao salvar "Prévia com o cliente" com o link, ele recebe e-mail e aprova ou pede mudanças na área do cliente; ao salvar "No ar" com o endereço, recebe o aviso de site publicado. Pedidos de revisão, troca de plano e cancelamento aparecem em **Pedidos dos clientes**.
- Domínio: o briefing pergunta se já tem domínio registrado. Se tiver, pede o domínio; se não, até 3 opções para buscar no registro.br. Nos dois casos o cliente tem um botão para o WhatsApp com a mensagem pronta, e o aviso de briefing para a equipe traz as opções.
- Troca de plano: subir vale na hora (novo valor na próxima cobrança, sem proporcional); descer só depois dos 12 meses. Com Stripe configurado, troca sozinha; sem provedor, vira pedido no painel.
- Cancelamento: mostra a multa e até quando o site fica no ar antes de confirmar. Com Stripe, cobra a multa no cartão e cancela no fim do período pago; o cron diário `/api/cron/cancelamentos` (10h23 UTC) desliga o cliente depois dessa data e avisa a equipe para tirar o site do ar. Anual dentro dos 12 meses vira pedido (a devolução proporcional é calculada por você).
- Stripe: ativar o **Customer Portal** (Settings > Billing > Customer portal) para o botão "Trocar cartão". Deixe desligadas no portal as opções de cancelar e trocar de plano, porque isso já é feito pela área do cliente com as regras do contrato.
- Asaas (se usar): a multa vira uma fatura com link (Pix, boleto ou cartão), porque o Asaas não cobra o cartão salvo fora da assinatura.
- Nota fiscal: manual por enquanto (decisão sua). As FAQs continuam dizendo que a nota é emitida a cada cobrança.

## Criador automático com IA (nov/2026)

O cliente joga o criador em `/criar`, a IA do VPS monta a home, ele vê a prévia em `/criar/<token>`, escolhe o plano e paga; o VPS gera as páginas do plano e publica em `<nome>.supporta.com.br`. Sem essas configurações, o criador oferece mandar as respostas pelo WhatsApp.

- [x] Banco: schema `supporta` criado no Supabase do Prospector (`metodo-tracao`), com as migrations 0001 a 0004 e o bucket público `supporta-sites`.
- [ ] Vercel (`supportasite` > Settings > Environment Variables), tipo sensitive:
  - `SUPABASE_DB_URL`: Supabase > Project Settings > Database > Connection string > Transaction pooler (porta 6543), com a senha do banco.
  - `SUPABASE_URL` = `https://bzarlpqkbbvhuwmmdzem.supabase.co` e `SUPABASE_SERVICE_ROLE_KEY` (Project Settings > API Keys > service_role).
  - `SESSION_SECRET` (`openssl rand -base64 48`).
  - `SUPPORTA_WORKER_SECRET` (`openssl rand -hex 24`): o mesmo valor vai no `.env` do VPS.
  - Depois, Redeploy.
- [ ] DNS na Hostinger (zona supporta.com.br): registro `CNAME` com nome `*` apontando para `cname.vercel-dns.com`. É o que faz cada `nome.supporta.com.br` abrir.
- [ ] VPS (`/opt/prospector/.env`): `SUPPORTA_URL=https://supporta.com.br` e `SUPPORTA_WORKER_SECRET=<o mesmo da Vercel>`. Depois, no Mac: `bash deploy/enviar-para-vps.sh` e `ssh root@72.61.57.12 'pm2 restart agendador'`.
- [ ] Teste real: jogar o criador com os seus dados, esperar a prévia (uns 6 minutos), assinar e conferir o site no subdomínio.
- Custo: cerca de US$ 1 por prévia (inclusive de quem não assina), mais uns US$ 0,30 por página interna depois do pagamento.

## Preço único (nov/2026)

- Modelo: site R$99 pago uma vez (pronto em até 2h); endereço nome.supporta.com.br incluso no 1º ano e R$45/ano a partir do 2º; domínio próprio opcional R$75/ano desde o 1º; alterações sem custo por 30 dias depois da entrega e R$50 cada depois. Valores em `lib/plans.ts` (`pricing`).
- Stripe: não precisa mais cadastrar preços no painel (o checkout cria os preços na hora). Basta `STRIPE_SECRET_KEY`, o webhook (`checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`) e o Customer Portal para troca de cartão. A cobrança cria uma assinatura anual com 365 dias de carência: hoje cobra o site (e o 1º ano do domínio, se pedido) e a renovação começa no 2º ano.
- Banco: migration `0005_preco_unico.sql` aplicada (domínio próprio e valor anual na assinatura; valor e link de cobrança nas alterações).
- Links antigos `/assinar/start` e `/assinar/premium` redirecionam para `/criar`.
- Confirmar nos Termos a regra de propriedade: com a hospedagem encerrada, o código e o design ficam com a Supporta; conteúdo e domínio são do cliente.
