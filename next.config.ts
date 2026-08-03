import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for Docker (.next/standalone/server.js).
  // The Dockerfile runner stage copies this — without it there is no server.js.
  output: "standalone",
  images: {
    // The standalone runner image has no sharp/optimizer. Serve next/image
    // assets directly instead of via /_next/image (which 400s/404s there).
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.valueautos.com.mx" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.prd.kavak.io" },
      { protocol: "https", hostname: "images.kavak.services" },
    ],
  },
};

export default nextConfig;
