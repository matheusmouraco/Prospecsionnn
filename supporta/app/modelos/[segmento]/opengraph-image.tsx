import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { getSegment, segments } from "@/lib/segments";

export const alt = "Modelo de site Supporta";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return segments.map((s) => ({ segmento: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ segmento: string }> }) {
  const seg = getSegment((await params).segmento);
  return ogImage({ label: `Modelo ${seg?.tab ?? ""}`, title: seg?.title ?? "Modelos de site" });
}
