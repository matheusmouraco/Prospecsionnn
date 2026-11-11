import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app lives inside another repo with its own lockfile.
  turbopack: { root: process.cwd() },
  images: {
    loader: "custom",
    loaderFile: "./lib/unsplash-loader.ts",
  },
  experimental: {
    // ~25 KB of CSS: inlining it removes the only render-blocking request.
    inlineCss: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
