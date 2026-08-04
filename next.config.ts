import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for Docker (.next/standalone/server.js).
  // The Dockerfile runner stage copies this — without it there is no server.js.
  output: "standalone",

  /**
   * /compra pasó a llamarse /vehiculos. El 308 conserva cualquier enlace
   * externo o marcador que ya apuntase a la ruta vieja, y le dice a Google que
   * traslade la autoridad en lugar de tratarla como una URL rota.
   */
  async redirects() {
    return [
      { source: "/compra", destination: "/vehiculos", permanent: true },
      {
        source: "/compra/:slug",
        destination: "/vehiculos/:slug",
        permanent: true,
      },
    ];
  },
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
