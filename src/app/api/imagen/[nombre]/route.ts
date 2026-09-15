import { NextResponse } from "next/server";

import { DEMO_IMAGE_BASE, DEMO_MODE } from "@/lib/api/demo-data";
import { TRADEIN_ORIGIN } from "@/lib/env";

/**
 * Proxy de las imágenes del catálogo.
 *
 * POR QUÉ EXISTE: la API devuelve NOMBRES DE ARCHIVO ("10959-1-CHEVROLET.jpg"),
 * no URLs, y el host real es una IP interna (no alcanzable desde el navegador
 * del usuario). Este handler las sirve desde nuestro propio origen: el cliente
 * pide /api/imagen/<nombre> y el servidor las trae de {TRADEIN}/thumbnail.
 *
 * DEMO: en vez de la IP interna, tira de valueautos.com.mx (público, tras
 * Incapsula) con headers de navegador. Si el WAF lo bloquea, en lugar de una
 * imagen rota se sirve un placeholder local — así el demo SIEMPRE renderiza.
 *
 * SEGURIDAD: el `nombre` se valida contra una lista blanca de caracteres antes
 * de interpolarlo. Sin barras ni "..": no se puede empujar una ruta arbitraria
 * contra el host (SSRF / path traversal).
 */

export const revalidate = 86400;

/** Sólo nombre de archivo plano: letras, dígitos, punto, guion y guion bajo. */
const NOMBRE_VALIDO = /^[A-Za-z0-9._-]+$/;

/** SVG de respaldo (silueta de auto). Se sirve si el origen falla en demo. */
const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" role="img" aria-label="Imagen no disponible">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f1f5f9"/><stop offset="1" stop-color="#e2e8f0"/>
  </linearGradient></defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <g fill="none" stroke="#94a3b8" stroke-width="14" stroke-linejoin="round" stroke-linecap="round" transform="translate(160,220)">
    <path d="M20 120 L60 50 Q70 30 95 30 L330 30 Q355 30 375 55 L420 110 L455 120 Q480 126 480 152 L480 190 Q480 200 470 200 L430 200"/>
    <path d="M90 200 L370 200"/>
    <path d="M30 200 L20 200 Q10 200 10 190 L10 135"/>
    <circle cx="130" cy="200" r="42" fill="#f8fafc"/>
    <circle cx="400" cy="200" r="42" fill="#f8fafc"/>
    <path d="M70 110 L200 110 L200 55 L120 55 Z"/>
    <path d="M230 55 L230 110 L360 110 L320 55 Z"/>
  </g>
  <text x="400" y="520" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="30" fill="#94a3b8">Imagen no disponible</text>
</svg>`;

/** Respuesta con el placeholder. Caché corta: reintenta el origen pronto. */
function placeholder(): Response {
  return new Response(PLACEHOLDER, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ nombre: string }> }
) {
  const { nombre } = await params;

  if (!NOMBRE_VALIDO.test(nombre)) {
    return NextResponse.json({ error: "Nombre de imagen inválido." }, { status: 400 });
  }

  const origen = DEMO_MODE ? DEMO_IMAGE_BASE : `${TRADEIN_ORIGIN}/thumbnail`;

  if (!DEMO_MODE && !TRADEIN_ORIGIN) {
    return NextResponse.json(
      { error: "TRADEIN_URL no está configurado en el servidor." },
      { status: 500 }
    );
  }

  try {
    // En demo se imita una petición nacida DENTRO de valueautos (Referer/Origin +
    // sec-fetch same-origin): así no parece hotlink externo, que es lo que el <img>
    // no podía enviar y por lo que Incapsula cerraba la conexión.
    const headers: Record<string, string> = DEMO_MODE
      ? {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
          Referer: "https://www.valueautos.com.mx/",
          Origin: "https://www.valueautos.com.mx",
          "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "image",
          "sec-fetch-mode": "no-cors",
          "sec-fetch-site": "same-origin",
          ...(process.env.DEMO_IMAGE_COOKIE
            ? { Cookie: process.env.DEMO_IMAGE_COOKIE }
            : {}),
        }
      : {};

    const res = await fetch(`${origen}/${nombre}`, {
      headers,
      next: { revalidate },
      signal: AbortSignal.timeout(15_000),
    });

    const contentType = res.headers.get("Content-Type") ?? "";
    const esImagen = res.ok && !!res.body && contentType.startsWith("image/");

    if (!esImagen) {
      // Demo: el WAF bloqueó (403 / HTML de challenge / conexión cerrada). En vez
      // de imagen rota, placeholder. Prod: error real, como antes.
      if (DEMO_MODE) return placeholder();
      return NextResponse.json(
        { error: `El origen respondió ${res.status}.` },
        { status: res.status === 404 ? 404 : 502 }
      );
    }

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType || "image/jpeg",
        "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=604800`,
      },
    });
  } catch (error) {
    // Red caída, timeout, o conexión cerrada por el WAF.
    if (DEMO_MODE) return placeholder();
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "El origen tardó demasiado en responder."
          : "No se pudo contactar al origen de imágenes.",
      },
      { status: 504 }
    );
  }
}
