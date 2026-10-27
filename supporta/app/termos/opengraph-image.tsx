import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Termos de Uso e da Assinatura";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ label: "Termos", title: "Termos de Uso e da Assinatura" });
}
