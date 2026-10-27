import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Qual a nota do seu site no Google?";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ label: "Ferramenta grátis", title: "Qual a nota do seu site no Google?" });
}
