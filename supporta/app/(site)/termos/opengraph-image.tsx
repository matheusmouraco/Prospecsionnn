import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Termos de Uso";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ label: "Termos", title: "Termos de Uso" });
}
