import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { pricing } from "@/lib/plans";

export const alt = `Site profissional por R$${pricing.site}, pago uma vez.`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ label: "Preço", title: `Site profissional por R$${pricing.site}, pago uma vez.` });
}
