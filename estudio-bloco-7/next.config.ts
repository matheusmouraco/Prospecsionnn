import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The repo root has its own lockfile; keep Next scoped to this app.
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  images: {
    // Unsplash photos go through the Next optimizer, so they are served from this origin
    // (no extra connection on mobile) as AVIF/WebP at the exact widths of the srcset.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/photo-*' }],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [420, 640, 750, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [96, 128, 160, 256, 384],
    qualities: [55, 60, 65, 70],
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
