import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { cases } from "@/lib/cases";
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
    page("/quanto-custa-um-site", 0.8),
    page("/comparativo", 0.7),
    page("/perguntas-frequentes", 0.7),
    page("/glossario", 0.6),
    page("/sobre", 0.5),
    page("/contato", 0.5),
    page("/blog", 0.6, "weekly"),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(`${p.date}T12:00:00Z`), changeFrequency: "yearly" as const, priority: 0.6 })),
    ...(cases.length ? [page("/cases", 0.6)] : []),
    page("/termos", 0.2, "yearly"),
    page("/privacidade", 0.2, "yearly"),
  ];
}
