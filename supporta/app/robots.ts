import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Buscadores e robôs de IA liberados de propósito: é o que faz a Supporta poder ser citada.
const bots = ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"];
const disallow = ["/api/", "/assinar/", "/obrigado"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [...bots.map((userAgent) => ({ userAgent, allow: "/", disallow })), { userAgent: "*", allow: "/", disallow }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
