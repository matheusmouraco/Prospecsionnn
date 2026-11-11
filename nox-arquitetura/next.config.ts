import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This app lives inside another repo: keep tracing and Turbopack scoped to this folder.
  outputFileTracingRoot: __dirname,
  turbopack: { root: __dirname },
  images: {
    // Unsplash is an imgix CDN: resizing, AVIF/WebP and the night grade happen there.
    loader: "custom",
    loaderFile: "./lib/unsplash-loader.ts",
    deviceSizes: [480, 640, 828, 1080, 1440, 1920, 2560],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Content-Type-Options", value: "nosniff" }],
      },
    ];
  },
};

export default nextConfig;
