import type { Metadata } from "next";

import { APP_NAME } from "@/lib/config";

/**
 * Origen público canónico. Viene de NEXT_PUBLIC_APP_URL (ver .env.*), que el
 * Dockerfile hornea en build según BUILD_ENV. Sin él, los canonical y las URLs
 * OG saldrían relativas y Google las trataría como duplicados.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_DESCRIPTION =
  "Compra o vende tu auto seminuevo certificado. Financiamiento a tu medida y entrega en toda la República.";

/** Convierte una ruta interna en URL absoluta para canonical / OG / JSON-LD. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type BuildMetadataArgs = {
  title: string;
  description?: string;
  /** Ruta interna, p. ej. "/compra". Genera el canonical y la URL OG. */
  path: string;
  images?: string[];
  /** Páginas transaccionales o internas que no deben indexarse. */
  noindex?: boolean;
  type?: "website" | "article";
};

/**
 * Única fuente de metadata por página: título, descripción, canonical
 * autorreferencial, Open Graph y Twitter Card. Usar SIEMPRE esto en lugar de
 * escribir el objeto Metadata a mano, para que ninguna página se quede sin
 * canonical (la causa #1 de contenido duplicado).
 */
export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  images,
  noindex = false,
  type = "website",
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = path === "/" ? title : `${title} | ${APP_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
    openGraph: {
      type,
      url,
      siteName: APP_NAME,
      title: fullTitle,
      description,
      locale: "es_MX",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(images ? { images } : {}),
    },
  };
}

/** Rutas transaccionales: útiles para el usuario, ruido para el índice. */
export const NOINDEX_ROUTES = [
  "/login",
  "/forgot-password",
  "/registro",
  "/design-system",
] as const;
