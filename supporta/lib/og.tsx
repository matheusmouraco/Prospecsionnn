import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf")),
  readFile(join(process.cwd(), "assets/fonts/GeistMono-Regular.ttf")),
]);

/** Imagem Open Graph no sistema Camadas: fundo ink, barras do logo, rótulo mono e título. */
export async function ogImage({ label, title }: { label: string; title: string }) {
  const [sans, mono] = await fonts;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0B0B0F", color: "#F5F5F2", padding: 72, fontFamily: "Geist" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="56" height="56" viewBox="0 0 48 48">
            <rect x="16" y="8" width="26" height="8" rx="4" fill="#F5F5F2" />
            <rect x="9" y="20" width="30" height="8" rx="4" fill="#FF3D71" />
            <rect x="6" y="32" width="26" height="8" rx="4" fill="#F5F5F2" />
          </svg>
          <span style={{ fontSize: 40, letterSpacing: "-0.045em" }}>supporta</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "Geist Mono", fontSize: 24, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A6A6B0" }}>{label}</span>
          <span style={{ marginTop: 20, fontSize: title.length > 48 ? 64 : 80, lineHeight: 1.02, letterSpacing: "-0.05em", maxWidth: 1000 }}>{title}</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 160, height: 18, borderRadius: 999, background: "#F5F5F2" }} />
          <div style={{ width: 200, height: 18, borderRadius: 999, background: "#FF3D71" }} />
          <div style={{ width: 160, height: 18, borderRadius: 999, background: "#F5F5F2" }} />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: sans, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
