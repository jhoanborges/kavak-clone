import { NextResponse } from "next/server";

import { busqueda, CatalogoError } from "@/lib/api/catalogo";

/**
 * Autocomplete del buscador. Traduce ?q=<texto> a la API del catálogo
 * (LISTADO_BUSQUEDA) y devuelve una lista plana de sugerencias.
 *
 * POR QUÉ EXISTE: la API vive en una IP interna. El navegador no puede llamarla;
 * este handler hace de puente.
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
    if (error instanceof CatalogoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "No se pudo consultar el buscador." },
      { status: 502 }
    );
  }
}
