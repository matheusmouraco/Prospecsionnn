import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Política de Privacidade";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ label: "Privacidade", title: "Política de Privacidade" });
}
