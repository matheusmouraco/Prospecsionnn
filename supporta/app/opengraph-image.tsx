import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Supporta: seu site no ar. Todo mês.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ label: "Sites por assinatura", title: "Seu site no ar. Todo mês." });
}
