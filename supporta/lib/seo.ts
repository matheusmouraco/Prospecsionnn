import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

type PageMeta = { title: string; description: string; path: string; type?: "website" | "article"; noindex?: boolean };

// Rotas que têm opengraph-image.tsx próprio. As demais (checkout, obrigado) usam a imagem da raiz.
const ownOg = [/^\/$/, /^\/planos$/, /^\/modelos(\/[^/]+)?$/, /^\/geo$/, /^\/diagnostico$/, /^\/blog(\/[^/]+)?$/, /^\/termos$/, /^\/privacidade$/];

function ogImageFor(path: string, title: string) {
  const own = ownOg.some((re) => re.test(path));
  const url = own && path !== "/" ? `${path}/opengraph-image` : "/opengraph-image";
  return { url, width: 1200, height: 630, alt: title };
}

/** Metadata padrão de página: title até 60 caracteres, description até 155, canonical e Open Graph. */
export function pageMetadata({ title, description, path, type = "website", noindex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  const image = ogImageFor(path, title);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, locale: site.locale, type, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
