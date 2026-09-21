import { NextResponse } from "next/server";

import { CatalogoError } from "@/lib/api/catalogo";
import type { VehiculosQuery } from "@/lib/api/vehiculos";
import { listadoRaw } from "@/lib/api/vehiculos-server";
import { logUpstreamError } from "@/lib/log";

/**
 * Endpoint del catálogo. Traduce la query pública a la API del catálogo
 * (LISTADO_CAT_VEHICULOS) y devuelve la forma cruda que consume el cliente.
 *
 * POR QUÉ EXISTE: la API vive en una IP interna. El navegador no puede llamarla;
 * este handler hace de puente servidor-a-servidor y esconde el host.
 *
 * SEGURIDAD: sólo se leen los parámetros conocidos; el resto se ignora. El
 * destino está fijado en el cliente, el cliente no elige URL (no SSRF).
 */

export const revalidate = 300;

/** Un valor de query o cadena vacía. */
const q = (params: URLSearchParams, key: string) => params.get(key) ?? "";

export async function GET(request: Request) {
  const p = new URL(request.url).searchParams;

  const query: VehiculosQuery = {
    busqueda: q(p, "busqueda"),
    marca: q(p, "marca"),
    anio: q(p, "anio"),
    segmento: q(p, "segmento"),
    transmision: q(p, "transmision"),
    color: q(p, "color"),
    precio_min: q(p, "precio_min"),
    precio_max: q(p, "precio_max"),
    km_min: q(p, "km_min"),
    km_max: q(p, "km_max"),
    pagina: Number(p.get("pagina")) || 1,
    cantidad: Number(p.get("cantidad")) || 12,
  };

  try {
    const data = await listadoRaw(query);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=600`,
      },
    });
  } catch (error) {
    if (error instanceof CatalogoError) {
      // Ya se logueó el detalle upstream dentro de pedir(); aquí sólo se mapea.
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    // Error inesperado (no del webservice): se loguea entero, se veía como 502 mudo.
    logUpstreamError({
      servicio: "vehiculos",
      metodo: "GET",
      url: new URL(request.url).pathname,
      payload: query,
      error,
    });
    return NextResponse.json(
      { error: "No se pudo contactar al catálogo." },
      { status: 502 }
    );
  }
}
