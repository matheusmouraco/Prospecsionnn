import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "De R$49,90 a R$149,90 por mês, sem custo de criação.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ label: "Planos", title: "De R$49,90 a R$149,90 por mês, sem custo de criação." });
}
