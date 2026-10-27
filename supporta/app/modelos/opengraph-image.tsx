import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Modelos de site para cada segmento.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ label: "Modelos", title: "Modelos de site para cada segmento." });
}
