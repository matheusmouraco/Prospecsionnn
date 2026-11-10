import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { posts } from "./blog";
import { glossary } from "./glossary";
import { billingFaq, geoFaq, homeFaq, type Faq } from "./faqs";
import { chargesFor, customProject, priceLabel, priceRows, pricing, site99 } from "./plans";
import { segments } from "./segments";
import { absoluteUrl, site } from "./site";

const pricingMd = () =>
  `Preço: site profissional por ${priceLabel(pricing.site)}, pago uma vez, pronto em até ${pricing.prazoHoras}h. O endereço nome.supporta.com.br, com hospedagem e SSL, vem incluso no 1º ano e renova por ${priceLabel(pricing.endereco)} por ano a partir do 2º ano. Domínio próprio .com.br é opcional, por ${priceLabel(pricing.dominio)} por ano desde o 1º ano (com ele, a renovação fica em ${priceLabel(chargesFor(true).anual)} por ano). Alterações sem custo nos primeiros ${pricing.diasAlteracaoGratis} dias depois da entrega; depois, ${priceLabel(pricing.alteracao)} por alteração. Sem mensalidade, sem prazo mínimo e sem multa: a renovação anual pode ser cancelada quando o cliente quiser, e o site fica no ar até o fim do ano pago. Pagamento no cartão de crédito. Arrependimento em até 7 dias após o pagamento, com reembolso integral. Projeto personalizado: falar com o Matheus pelo WhatsApp ${customProject.whatsapp}.`;

const faqMd = (items: Faq[]) => items.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n");

const productMd = () =>
  `### ${site99.name}: ${priceLabel(site99.price)}, pago uma vez\n\n${site99.pitch}\n\n${site99.features.map((f) => `- ${f}`).join("\n")}\n\n### Tudo o que você paga\n\n${priceRows.map((r) => `- ${r.item}: ${priceLabel(r.value)}${r.per} (${r.detail})`).join("\n")}`;

/** /llms.txt: resumo curto da empresa, planos e páginas principais. */
export function llmsTxt() {
  return `# ${site.name}

> ${site.name} cria sites profissionais com IA para pequenas e médias empresas do Brasil, por ${priceLabel(pricing.site)} pagos uma vez. ${site.description} ${site.signature}

Público: dentistas, clínicas, advogados, arquitetos, restaurantes, prestadores de serviço e comércio local.
Modelo: ${pricingMd()}
Contato: WhatsApp ${site.whatsapp}, e-mail ${site.email}.

## Preço

- ${site99.name}, ${priceLabel(site99.price)} pago uma vez: ${site99.features.join("; ")}.
${priceRows.slice(1).map((r) => `- ${r.item}: ${priceLabel(r.value)}${r.per}, ${r.detail}.`).join("\n")}

## Páginas principais

- [Início](${absoluteUrl("/")}): o que é a Supporta, preço, modelos e perguntas frequentes.
- [Preço](${absoluteUrl("/planos")}): o que está incluso, quanto custa cada item e dúvidas de pagamento.
- [Modelos](${absoluteUrl("/modelos")}): modelos de site por segmento.
${segments.map((s) => `- [${s.title}](${absoluteUrl(`/modelos/${s.slug}`)}): ${s.metaDescription}`).join("\n")}
- [GEO](${absoluteUrl("/geo")}): guia simples sobre SEO, AEO, GEO e llms.txt.
- [Quanto custa um site](${absoluteUrl("/quanto-custa-um-site")}): o que entra no preço de um site e calculadora de custo em 1 a 3 anos.
- [Comparativo](${absoluteUrl("/comparativo")}): construtor de sites, freelancer, agência e Supporta.
- [Perguntas frequentes](${absoluteUrl("/perguntas-frequentes")}): todas as dúvidas sobre preço, pagamento, renovação e GEO.
- [Glossário](${absoluteUrl("/glossario")}): SEO, AEO, GEO, llms.txt, dados estruturados e outros termos explicados.
- [Sobre](${absoluteUrl("/sobre")}) e [Contato](${absoluteUrl("/contato")}).
- [Diagnóstico grátis](${absoluteUrl("/diagnostico")}): ferramenta que mede a nota do site no PageSpeed (celular) e checa título, descrição, dados estruturados, llms.txt e robots.txt.

## Blog

${posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.description}`).join("\n")}

## Opcional

- [Conteúdo completo em markdown](${absoluteUrl("/llms-full.txt")})
- [Termos de Uso](${absoluteUrl("/termos")})
- [Política de Privacidade](${absoluteUrl("/privacidade")})
`;
}

/** /llms-full.txt: o conteúdo das páginas em markdown. */
export async function llmsFullTxt() {
  const articles = await Promise.all(
    posts.map(async (p) => {
      const body = await readFile(join(process.cwd(), "content/blog", `${p.slug}.mdx`), "utf8");
      return `## ${p.title}\n\nURL: ${absoluteUrl(`/blog/${p.slug}`)}\n\n${body.replace(/^## /gm, "### ").trim()}`;
    }),
  );

  return `# ${site.name}: conteúdo completo

> ${site.description} ${site.signature}

# Início

URL: ${absoluteUrl("/")}

${site.name} cria sites profissionais com IA para pequenas e médias empresas do Brasil. Site de uma página completa, hospedagem com SSL e GEO por ${priceLabel(pricing.site)} pagos uma vez, com o endereço nome.supporta.com.br incluso no 1º ano.

Como funciona, 100% automático: 01 O cliente chama a Supporta no WhatsApp e responde umas perguntas (nome, serviços, cidade, logo e fotos; pode mandar o link do Instagram ou do site). 02 A IA monta o site e ele vê a prévia antes de pagar. 03 Paga ${priceLabel(pricing.site)} uma vez e o site entra no ar em até ${pricing.prazoHoras}h em nome.supporta.com.br. O domínio próprio é combinado pelo WhatsApp.

As 3 camadas: SEO (aparecer no Google), AEO (virar a resposta direta) e GEO (ser citado pelas IAs).

## Perguntas frequentes

${faqMd(homeFaq)}

# Preço

URL: ${absoluteUrl("/planos")}

${pricingMd()}

${productMd()}

## Dúvidas sobre pagamento

${faqMd(billingFaq)}

# Modelos por segmento

${segments
  .map(
    (s) => `## ${s.title}

URL: ${absoluteUrl(`/modelos/${s.slug}`)}

${s.intro}

${s.sections.map((sec) => `### ${sec.heading}\n\n${sec.body}`).join("\n\n")}

O que vem no modelo: ${s.includes.join("; ")}.

${faqMd(s.faq)}`,
  )
  .join("\n\n")}

# GEO

URL: ${absoluteUrl("/geo")}

${faqMd(geoFaq)}

# Glossário

${glossary.map((t) => `- **${t.term}**: ${t.definition}`).join("\n")}

# Blog

${articles.join("\n\n")}
`;
}
