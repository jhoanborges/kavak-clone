import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/**
 * Rutas que no aportan nada al índice: flujos transaccionales (el usuario llega
 * por la app, no por búsqueda), la doc interna del design system y las APIs.
 * NO bloquear /_next/static: Google necesita el CSS/JS para renderizar.
 */
const DISALLOW = [
  "/api/",
  "/design-system",
  "/login",
  "/forgot-password",
  "/registro",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      /**
       * Crawlers de buscadores con IA. Se permiten a propósito: un Disallow
       * aquí saca al sitio de las citas de ChatGPT / Perplexity / AI Overviews.
       * Si legal pide excluirse, cambiar `allow` por `disallow: "/"` por bot.
       */
      {
        userAgent: ["OAI-SearchBot", "PerplexityBot", "ClaudeBot", "GoogleOther"],
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
