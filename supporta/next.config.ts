import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Apps antigos que já estavam no supporta.com.br (copiados sem alteração em public/). Ficam no ar, mas fora do Google.
const legacyApps = ["teleprompter", "casafirme"];

const nextConfig: NextConfig = {
  // Os apps antigos usam caminhos relativos e precisam da barra no fim (/teleprompter/).
  // O proxy.ts cuida das demais barras finais.
  skipTrailingSlashRedirect: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: { root: import.meta.dirname },
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      ...legacyApps.flatMap((app) => [
        { source: `/${app}`, headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
        { source: `/${app}/:path*`, headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      ]),
      // Modelos de demonstração: navegáveis, mas fora do Google (conteúdo de template).
      { source: "/vitrine/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        ...legacyApps.map((app) => ({ source: `/${app}/`, destination: `/${app}/index.html` })),
        // Páginas internas dos modelos exportados (pasta/index.html).
        { source: "/vitrine/:path+/", destination: "/vitrine/:path+/index.html" },
      ],
      afterFiles: [],
      fallback: [{ source: "/vitrine/:path+", destination: "/vitrine/:path+/index.html" }],
    };
  },
};

const withMDX = createMDX({
  options: { remarkPlugins: [["remark-gfm", {}]] },
});

export default withMDX(nextConfig);
