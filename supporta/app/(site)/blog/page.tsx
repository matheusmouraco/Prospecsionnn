import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { formatDate, posts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog: Google, IAs e sites para pequenas empresas | Supporta",
  description: "Artigos simples sobre SEO, AEO, GEO e como fazer o site da sua empresa aparecer no Google e ser citado pelas IAs.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Blog", path: "/blog" }]}
        label="Blog"
        title="Como ser encontrado no Google e nas IAs"
        lead="Guias curtos, sem jargão, para quem tem uma empresa e quer ser achado pelos clientes."
      />
      <section aria-label="Artigos" className="pb-20 pt-12 md:pb-28 md:pt-16">
        <ul className="container-site grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="flex h-full flex-col rounded-[2rem] border border-line bg-white p-7 transition-colors hover:border-ink">
                <p className="label-mono text-graphite">
                  <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min
                </p>
                <h2 className="mt-5 text-2xl tracking-[-0.04em]">
                  <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 relative">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 leading-relaxed text-graphite">{post.description}</p>
                <span aria-hidden className="mt-6 inline-flex items-center gap-2 font-medium">
                  Ler artigo <ArrowRight strokeWidth={1.75} className="h-4 w-4" />
                </span>
              </article>
            </li>
          ))}
        </ul>
      </section>
      <FinalCta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog da Supporta",
          url: absoluteUrl("/blog"),
          inLanguage: "pt-BR",
          blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(`/blog/${p.slug}`), datePublished: p.date })),
        }}
      />
    </>
  );
}
