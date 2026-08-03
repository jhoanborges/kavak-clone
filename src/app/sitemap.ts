import type { MetadataRoute } from "next";

import { POSTS } from "@/data/blog";
import { CARS, carSlug } from "@/data/cars";
import { absoluteUrl } from "@/lib/seo";

/**
 * Sólo URLs canónicas e indexables. Las rutas transaccionales (/login,
 * /registro, /forgot-password) y /design-system quedan fuera a propósito:
 * están en el Disallow de robots.ts, y listar en sitemap algo bloqueado
 * genera un aviso de "URL enviada bloqueada por robots.txt" en Search Console.
 */
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/compra", changeFrequency: "daily", priority: 0.9 },
  { path: "/cotizar", changeFrequency: "monthly", priority: 0.8 },
  { path: "/nosotros", changeFrequency: "monthly", priority: 0.7 },
  { path: "/ubicaciones", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contacto", changeFrequency: "yearly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // El inventario es estático hoy. Cuando venga de una API, usar la fecha real
  // de actualización de cada ficha en lugar de la del build.
  const lastModified = new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...POSTS.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...CARS.map((car) => ({
      url: absoluteUrl(`/compra/${carSlug(car)}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
