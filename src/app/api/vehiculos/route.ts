import { NextResponse } from "next/server";

import { TradeinError } from "@/lib/api/tradein";
import type { VehiculosQuery } from "@/lib/api/vehiculos";
import { listadoRaw } from "@/lib/api/vehiculos-server";

/**
 * Endpoint del catálogo. Traduce la query pública al webservice TRADEIN
 * (LISTADO_CAT_VEHICULOS) y devuelve la forma cruda que consume el cliente.
 *
 * POR QUÉ EXISTE: TRADEIN exige Bearer (token SECRETO, sólo servidor) y vive en
 * una IP interna. El navegador no puede llamarlo; este handler hace de puente
 * servidor-a-servidor y esconde token + host.
 *
 * SEGURIDAD: sólo se leen los parámetros conocidos; el resto se ignora. El
 * destino está fijado en el cliente TRADEIN, el cliente no elige URL (no SSRF).
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
    if (error instanceof TradeinError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "No se pudo contactar al catálogo." },
      { status: 502 }
    );
  }
}
