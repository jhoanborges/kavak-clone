import { NextResponse } from "next/server";

import { TRADEIN_ORIGIN } from "@/lib/env";

/**
 * Proxy de las imágenes del catálogo TRADEIN.
 *
 * POR QUÉ EXISTE: la API devuelve NOMBRES DE ARCHIVO ("10959-1-CHEVROLET.jpg"),
 * no URLs, y el host real es una IP interna (no alcanzable desde el navegador
 * del usuario). Este handler las sirve desde nuestro propio origen: el cliente
 * pide /api/imagen/<nombre> y el servidor las trae de {TRADEIN}/thumbnail.
 *
 * SEGURIDAD: el `nombre` se valida contra una lista blanca de caracteres antes
 * de interpolarlo. Sin barras ni "..": no se puede empujar una ruta arbitraria
 * contra el host interno (SSRF / path traversal).
 */

export const revalidate = 86400;

/** Sólo nombre de archivo plano: letras, dígitos, punto, guion y guion bajo. */
const NOMBRE_VALIDO = /^[A-Za-z0-9._-]+$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ nombre: string }> }
) {
  const { nombre } = await params;

  if (!NOMBRE_VALIDO.test(nombre)) {
    return NextResponse.json(
      { error: "Nombre de imagen inválido." },
      { status: 400 }
    );
  }

  if (!TRADEIN_ORIGIN) {
    return NextResponse.json(
      { error: "TRADEIN_URL no está configurado en el servidor." },
      { status: 500 }
    );
  }

  try {
    // El /thumbnail no exige token (asset estático). Si algún día lo pide, se
    // añade aquí el header Authorization con TRADEIN_TOKEN.
    const res = await fetch(`${TRADEIN_ORIGIN}/thumbnail/${nombre}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok || !res.body) {
      return NextResponse.json(
        { error: `El origen respondió ${res.status}.` },
        { status: res.status === 404 ? 404 : 502 }
      );
    }

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
        "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=604800`,
      },
    });
  } catch (error) {
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
