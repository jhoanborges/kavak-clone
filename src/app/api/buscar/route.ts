import { NextResponse } from "next/server";

import { busqueda, TradeinError } from "@/lib/api/tradein";

/**
 * Autocomplete del buscador. Traduce ?q=<texto> al webservice TRADEIN
 * (LISTADO_BUSQUEDA) y devuelve una lista plana de sugerencias.
 *
 * POR QUÉ EXISTE: TRADEIN exige Bearer (token secreto, sólo servidor) e IP
 * interna. El navegador no puede llamarlo; este handler hace de puente.
 */

export const dynamic = "force-dynamic";

export type Sugerencia = { texto: string; tipo: "marca" | "modelo" };

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim();

  // Menos de 2 caracteres no vale la pena consultar.
  if (q.length < 2) return NextResponse.json({ sugerencias: [] });

  try {
    const resp = await busqueda(q);

    const vistas = new Set<string>();
    const sugerencias: Sugerencia[] = [];
    const push = (texto: string, tipo: Sugerencia["tipo"]) => {
      const limpio = texto.trim();
      const clave = limpio.toLowerCase();
      if (!limpio || vistas.has(clave)) return;
      vistas.add(clave);
      sugerencias.push({ texto: limpio, tipo });
    };

    for (const m of resp.Posibles_Marcas ?? []) push(m.marca, "marca");
    for (const r of resp.Posibles_Resultados ?? []) push(r.descripcion, "modelo");

    return NextResponse.json(
      { sugerencias: sugerencias.slice(0, 8) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof TradeinError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "No se pudo consultar el buscador." },
      { status: 502 }
    );
  }
}
