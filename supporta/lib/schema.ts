import type { Faq } from "./faqs";
import { billing, plans, priceFor } from "./plans";
import { absoluteUrl, site } from "./site";

const orgId = `${site.url}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: site.name,
    legalName: site.razaoSocial,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    slogan: site.tagline,
    description: site.description,
    email: site.email,
    taxID: site.cnpj,
    areaServed: { "@type": "Country", name: "Brasil" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: site.whatsapp,
      email: site.email,
      availableLanguage: "Portuguese",
    },
    ...(site.instagram ? { sameAs: [site.instagram] } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "pt-BR",
    publisher: { "@id": orgId },
  };
}

/** Service com uma Offer por plano, preço mensal recorrente em BRL. */
export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Site profissional por assinatura",
    serviceType: "Criação, hospedagem e manutenção de sites com SEO e GEO",
    description: site.description,
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "Brasil" },
    offers: plans.map((plan) => ({
      "@type": "Offer",
      name: `Plano ${plan.name}`,
      description: plan.features.join("; "),
      url: absoluteUrl(`/assinar/${plan.id}`),
      price: plan.price.toFixed(2),
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: plan.price.toFixed(2),
        priceCurrency: "BRL",
        unitCode: "MON",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
      eligibleDuration: { "@type": "QuantitativeValue", value: 12, unitCode: "MON" },
    })).concat(
      plans.map((plan) => ({
        "@type": "Offer",
        name: `Plano ${plan.name} anual`,
        description: `${plan.features.join("; ")}. Pagamento anual: ${billing.annualMonthsCharged} mensalidades por 12 meses.`,
        url: absoluteUrl(`/assinar/${plan.id}?ciclo=anual`),
        price: priceFor(plan, "anual").toFixed(2),
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: priceFor(plan, "anual").toFixed(2),
          priceCurrency: "BRL",
          unitCode: "ANN",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "ANN" },
        },
        eligibleDuration: { "@type": "QuantitativeValue", value: 12, unitCode: "MON" },
      })),
    ),
  };
}

export function faqSchema(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  const all = [{ name: "Início", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(post: { title: string; description: string; path: string; date: string; updated?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "pt-BR",
    mainEntityOfPage: absoluteUrl(post.path),
    image: absoluteUrl(`${post.path}/opengraph-image`),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@id": orgId },
  };
}
