import { Suspense } from "react";

import CatalogoInfinito from "@/components/sections/CatalogoInfinito";
import { FILTRO_KEYS, type FiltrosSeleccionados } from "@/lib/api/vehiculos";
import { buildMetadata } from "@/lib/seo";

type SearchParams = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<SearchParams> };

/** Un parámetro puede llegar repetido; nos quedamos con el primer valor. */
function primero(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0]?.trim() ?? "";
  return value?.trim() ?? "";
}

function leerFiltros(params: SearchParams): FiltrosSeleccionados {
  const filtros: FiltrosSeleccionados = {};
  for (const key of FILTRO_KEYS) {
    const value = primero(params[key]);
    if (value) filtros[key] = value;
  }
  return filtros;
}

/**
 * El canonical incluye la búsqueda: `/vehiculos?busqueda=audi` es una vista
 * distinta de `/vehiculos`, no un duplicado.
 *
 * Búsquedas y filtros van `noindex`: son combinatorios (una URL por cada cruce
 * posible de marca × año × color…) y agotarían el presupuesto de rastreo sin
 * aportar nada. El catálogo sin filtrar sí se indexa.
 */
export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const termino = primero(params.busqueda);
  const hayFiltros = Object.keys(leerFiltros(params)).length > 0;

  if (!termino && !hayFiltros) {
    return buildMetadata({
      title: "Vehículos — Seminuevos certificados",
      description:
        "Explora nuestro catálogo de seminuevos certificados: unidades revisadas, con garantía y financiamiento. Filtra por marca, carrocería, año, transmisión, color, precio y kilometraje.",
      path: "/vehiculos",
    });
  }

  return buildMetadata({
    title: termino
      ? `Vehículos "${termino}" — Seminuevos certificados`
      : "Vehículos filtrados — Seminuevos certificados",
    description: termino
      ? `Resultados de "${termino}" en nuestro catálogo de seminuevos certificados.`
      : "Resultados filtrados del catálogo de seminuevos certificados.",
    path: termino
      ? `/vehiculos?busqueda=${encodeURIComponent(termino)}`
      : "/vehiculos",
    noindex: true,
  });
}

export default async function VehiculosPage({ searchParams }: Props) {
  const params = await searchParams;
  const busqueda = primero(params.busqueda);
  const filtros = leerFiltros(params);

  // La `key` remonta el listado al cambiar búsqueda o filtros: sin ella,
  // useSWRInfinite conservaría el `size` anterior y arrancaría pidiendo la
  // página 4 de unos resultados recién estrenados.
  const key = `${busqueda}|${JSON.stringify(filtros)}`;

  return (
    <main className="flex-1 bg-muted">
      {/* FiltrosSidebar usa useSearchParams, que exige un límite de Suspense. */}
      <Suspense fallback={null}>
        <CatalogoInfinito
          key={key}
          busqueda={busqueda}
          filtros={filtros}
          cantidad={12}
        />
      </Suspense>
    </main>
  );
}
