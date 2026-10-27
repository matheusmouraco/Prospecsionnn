import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { segments } from "@/lib/segments";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/planos", 0.9),
    page("/modelos", 0.8),
    ...segments.map((s) => page(`/modelos/${s.slug}`, 0.8)),
    page("/diagnostico", 0.8),
    page("/geo", 0.8),
    page("/blog", 0.6, "weekly"),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(`${p.date}T12:00:00Z`), changeFrequency: "yearly" as const, priority: 0.6 })),
    page("/termos", 0.2, "yearly"),
    page("/privacidade", 0.2, "yearly"),
  ];
}
