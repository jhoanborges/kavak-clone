import type { MetadataRoute } from "next";

import { POSTS } from "@/data/blog";
import { fetchTodosLosVehiculos } from "@/lib/api/vehiculos";
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
  { path: "/vehiculos", changeFrequency: "daily", priority: 0.9 },
  { path: "/cotizar", changeFrequency: "monthly", priority: 0.8 },
  { path: "/nosotros", changeFrequency: "monthly", priority: 0.7 },
  { path: "/ubicaciones", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contacto", changeFrequency: "yearly", priority: 0.5 },
];

/**
 * Dinámico: el inventario lo decide la API y cambia a diario.
 *
 * Antes salía del array `CARS` hardcodeado, así que el sitemap publicaba 115
 * fichas inventadas que devolvían 404 - enviar 404 a Google quema presupuesto
 * de rastreo y resta confianza al sitemap entero.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const vehiculos = await fetchTodosLosVehiculos();

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
    ...vehiculos.map((v) => ({
      // `href` ya trae el token público, no el id crudo.
      url: absoluteUrl(v.href),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
