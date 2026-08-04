import { NextResponse } from "next/server";

import { UPSTREAM_ORIGIN } from "@/lib/api/vehiculos";

/**
 * Proxy de la galería de un vehículo.
 *
 * Existe por lo mismo que /api/vehiculos: el origen no manda
 * Access-Control-Allow-Origin, así que el navegador bloquea el fetch directo.
 * Ver docs/api-vehiculos.md.
 *
 * SEGURIDAD: el `id` se valida como entero antes de interpolarlo. Sin eso,
 * cualquiera podría empujar una ruta arbitraria contra el origen (SSRF).
 */
export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { error: "El identificador debe ser numérico." },
      { status: 400 }
    );
  }

  if (!UPSTREAM_ORIGIN) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL no está configurado en el servidor." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${UPSTREAM_ORIGIN}/api/vehiculos/${id}/imagenes`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `El origen respondió ${res.status}.`,
          hint:
            res.status === 403
              ? "El WAF de Value bloquea la IP de este servidor."
              : undefined,
        },
        { status: res.status === 403 ? 502 : res.status }
      );
    }

    return NextResponse.json(await res.json(), {
      headers: {
        "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=86400`,
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
