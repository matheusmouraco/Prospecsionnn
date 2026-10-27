import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Como ser encontrado no Google e nas IAs.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ label: "Blog", title: "Como ser encontrado no Google e nas IAs." });
}
