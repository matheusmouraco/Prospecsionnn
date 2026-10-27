import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "SEO, AEO e GEO: como ser citado pelas IAs.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ label: "Guia simples", title: "SEO, AEO e GEO: como ser citado pelas IAs." });
}
