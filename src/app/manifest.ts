import type { MetadataRoute } from "next";

import { APP_NAME } from "@/lib/config";
import { SITE_DESCRIPTION } from "@/lib/seo";

/**
 * Web App Manifest, forma nativa de Next 16 (convención de fichero en `app/`).
 *
 * Next sirve esto en `/manifest.webmanifest` e inyecta el
 * `<link rel="manifest">` automáticamente: por eso el layout ya NO declara
 * `manifest:` en su metadata (duplicaría el enlace). Sustituye al antiguo
 * `public/site.webmanifest` estático.
 *
 * `id` / `start_url` / `scope` fijan la identidad de la app instalada: sin
 * ellos el navegador no reconoce reaperturas como la misma PWA y el prompt de
 * instalación puede no aparecer.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: APP_NAME,
    short_name: APP_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "es-MX",
    dir: "ltr",
    theme_color: "#0D1F26",
    background_color: "#EEF1F1",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
