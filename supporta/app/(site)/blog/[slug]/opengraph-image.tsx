import { getPost, posts } from "@/lib/blog";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Artigo do blog da Supporta";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return ogImage({ label: "Blog", title: post?.title ?? "Blog da Supporta" });
}
