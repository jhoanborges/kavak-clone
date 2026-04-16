import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.prd.kavak.io" },
      { protocol: "https", hostname: "images.kavak.services" },
    ],
  },
};

export default nextConfig;
