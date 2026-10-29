import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/home/FinalCta";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatDate, getPost, posts } from "@/lib/blog";
import { articleSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadata({ title: post.metaTitle, description: post.description, path: `/blog/${post.slug}`, type: "article" });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { default: Content } = await import(`@/content/blog/${slug}.mdx`);
  const others = posts.filter((p) => p.slug !== slug);

  return (
    <>
      <article className="pb-20 pt-8 md:pb-28 md:pt-12">
        <div className="container-site">
          <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
          <div className="mx-auto mt-6 max-w-3xl">
            <SectionLabel>
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min de leitura
            </SectionLabel>
            <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] tracking-[-0.055em]">{post.title}</h1>
            <div className="mt-8 [&>p:first-child]:text-xl [&>p:first-child]:text-ink">
              <Content />
            </div>
            <div className="mt-14 rounded-[2rem] bg-ink p-7 text-paper md:p-9">
              <p className="text-2xl font-semibold tracking-[-0.04em]">Seu site está pronto pro Google e pras IAs?</p>
              <p className="mt-2 text-mist">Descubra em menos de um minuto, de graça.</p>
              <Button href="/diagnostico" variant="paper" size="lg" className="mt-6">
                Fazer o diagnóstico <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
              </Button>
            </div>
            <nav aria-label="Outros artigos" className="mt-14">
              <p className="label-mono text-graphite">Leia também</p>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="flex items-center justify-between gap-4 py-5 text-lg font-medium tracking-[-0.02em] hover:underline">
                      {p.title} <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </article>
      <FinalCta />
      <JsonLd data={articleSchema({ title: post.title, description: post.description, path: `/blog/${post.slug}`, date: post.date })} />
    </>
  );
}
