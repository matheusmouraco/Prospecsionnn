import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { posts } from "./blog";
import { glossary } from "./glossary";
import { billingFaq, geoFaq, homeFaq, type Faq } from "./faqs";
import { plans } from "./plans";
import { segments } from "./segments";
import { absoluteUrl, site } from "./site";

const faqMd = (items: Faq[]) => items.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n");

const plansMd = () =>
  plans.map((p) => `### Plano ${p.name}: R$${p.price}/mês\n\n${p.pitch}\n\n${p.features.map((f) => `- ${f}`).join("\n")}`).join("\n\n");

/** /llms.txt: resumo curto da empresa, planos e páginas principais. */
export function llmsTxt() {
  return `# ${site.name}

> ${site.name} vende sites profissionais por assinatura mensal para pequenas e médias empresas do Brasil. ${site.description} ${site.signature}

Público: dentistas, clínicas, advogados, arquitetos, restaurantes, prestadores de serviço e comércio local.
Regras comerciais: pagamento recorrente no cartão de crédito, fidelidade de 12 meses (é o que permite não cobrar a criação do site), sem custo de criação.
Contato: WhatsApp ${site.whatsapp}, e-mail ${site.email}.

## Planos

${plans.map((p) => `- Plano ${p.name}, R$${p.price}/mês: ${p.features.join("; ")}.`).join("\n")}

## Páginas principais

- [Início](${absoluteUrl("/")}): o que é a Supporta, planos, modelos e perguntas frequentes.
- [Planos](${absoluteUrl("/planos")}): preços, tabela comparativa completa e dúvidas de cobrança.
- [Modelos](${absoluteUrl("/modelos")}): modelos de site por segmento.
${segments.map((s) => `- [${s.title}](${absoluteUrl(`/modelos/${s.slug}`)}): ${s.metaDescription}`).join("\n")}
- [GEO](${absoluteUrl("/geo")}): guia simples sobre SEO, AEO, GEO e llms.txt.
- [Quanto custa um site](${absoluteUrl("/quanto-custa-um-site")}): o que entra no preço de um site e calculadora de custo em 1 a 3 anos.
- [Comparativo](${absoluteUrl("/comparativo")}): construtor de sites, freelancer, agência e assinatura Supporta.
- [Perguntas frequentes](${absoluteUrl("/perguntas-frequentes")}): todas as dúvidas sobre assinatura, pagamento e GEO.
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

${site.name} vende sites profissionais por assinatura mensal para pequenas e médias empresas do Brasil. Site, hospedagem, manutenção e GEO numa assinatura só, sem custo de criação.

Como funciona: 01 Assina. 02 Preenche o briefing (10 minutos). 03 Aprova e publica.

As 3 camadas: SEO (aparecer no Google), AEO (virar a resposta direta) e GEO (ser citado pelas IAs).

## Perguntas frequentes

${faqMd(homeFaq)}

# Planos

URL: ${absoluteUrl("/planos")}

Pagamento recorrente no cartão de crédito, fidelidade de 12 meses, sem custo de criação. A fidelidade é o que permite não cobrar a criação do site.

${plansMd()}

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
