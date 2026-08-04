import { NextResponse } from "next/server";

import { UPSTREAM_ORIGIN, VEHICULOS_PARAMS } from "@/lib/api/vehiculos";

/**
 * Proxy servidor-a-servidor para /api/vehiculos.
 *
 * POR QUÉ EXISTE: el origen de Value no manda `Access-Control-Allow-Origin`,
 * así que el navegador bloquea cualquier fetch directo. CORS es una política
 * del NAVEGADOR: una petición servidor-a-servidor no la aplica. Este handler
 * hace de puente.
 *
 * ES UN PARCHE, NO LA SOLUCIÓN. Lo correcto es que Value añada la cabecera CORS
 * con nuestro dominio; entonces se apaga `NEXT_PUBLIC_API_PROXY` y se vuelve a
 * llamada directa, sin tocar una línea de componente.
 *
 * SEGURIDAD — esto NO es un proxy abierto:
 *  - La URL de destino está fijada (UPSTREAM_ORIGIN + ruta fija). El cliente no
 *    puede elegir a dónde se conecta el servidor (eso sería un SSRF de manual).
 *  - Sólo se reenvían los parámetros de la allowlist; cualquier otro se ignora.
 *  - Sólo GET. No se propagan cabeceras del cliente (ni cookies ni auth).
 */

/** El upstream sí puede bloquear por IP (WAF de Imperva), así que no cacheamos errores. */
export const revalidate = 300;

export async function GET(request: Request) {
  if (!UPSTREAM_ORIGIN) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL no está configurado en el servidor." },
      { status: 500 }
    );
  }

  const incoming = new URL(request.url).searchParams;

  // Allowlist estricta: sólo los parámetros que el endpoint conoce. Se
  // reenvían TODOS los valores de cada uno, y también la variante `clave[]`
  // que el sitio original usa para selección múltiple.
  const forwarded = new URLSearchParams();
  for (const key of VEHICULOS_PARAMS) {
    for (const value of incoming.getAll(key)) forwarded.append(key, value);
    for (const value of incoming.getAll(`${key}[]`))
      forwarded.append(`${key}[]`, value);
  }

  const upstream = `${UPSTREAM_ORIGIN}/api/vehiculos?${forwarded.toString()}`;

  try {
    const res = await fetch(upstream, {
      headers: { Accept: "application/json" },
      // Cachea en el servidor: varias pestañas pidiendo lo mismo no golpean
      // el upstream (que además está tras un WAF sensible al volumen).
      next: { revalidate },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      // 403 aquí = Imperva bloqueó la IP DEL SERVIDOR, no la del usuario.
      return NextResponse.json(
        {
          error: `El origen respondió ${res.status}.`,
          hint:
            res.status === 403
              ? "El WAF de Value bloquea la IP de este servidor. Pide que la pongan en allowlist."
              : undefined,
        },
        { status: res.status === 403 ? 502 : res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=600`,
      },
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "El origen tardó demasiado en responder."
          : "No se pudo contactar al origen.",
      },
      { status: 504 }
    );
  }
}
