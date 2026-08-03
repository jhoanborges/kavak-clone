"use client";

import { useCallback, useMemo } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

import {
  buildVehiculosUrl,
  normalizeRespuesta,
  VEHICULOS_PRESETS,
  type FiltrosRaw,
  type Vehiculo,
  type VehiculosQuery,
} from "@/lib/api/vehiculos";

/** Una página de resultados. El fetcher global vive en SWRProvider. */
export function useVehiculos(query: VehiculosQuery) {
  const { data, error, isLoading } = useSWR(buildVehiculosUrl(query));
  const res = useMemo(() => normalizeRespuesta(data), [data]);

  return {
    vehiculos: res.vehiculos,
    total: res.total,
    paginas: res.paginas,
    filtros: res.filtros,
    isLoading,
    error: error as Error | undefined,
  };
}

/** Home · "Ofertas destacadas" (que en realidad es una búsqueda sin filtros). */
export function useVehiculosDestacados(cantidad = 4) {
  return useVehiculos(VEHICULOS_PRESETS.destacados(cantidad));
}

/**
 * Listado con scroll infinito.
 *
 * `useSWRInfinite` en vez de acumular estado a mano: cada página queda cacheada
 * por su URL, así volver desde una ficha no vuelve a pedir lo ya cargado.
 *
 * El final se detecta con `paginas` (que la API devuelve de verdad), no
 * infiriéndolo de una página incompleta.
 */
export function useVehiculosInfinito({
  busqueda = "",
  cantidad = 12,
}: { busqueda?: string; cantidad?: number } = {}) {
  const getKey = useCallback(
    (index: number, previous: unknown) => {
      const pagina = index + 1;

      if (previous) {
        const prev = normalizeRespuesta(previous);
        // Ya se sirvió la última página según el propio backend.
        if (pagina > prev.paginas) return null;
      }

      return buildVehiculosUrl(
        busqueda
          ? VEHICULOS_PRESETS.busqueda(busqueda, pagina, cantidad)
          : VEHICULOS_PRESETS.listado(pagina, cantidad)
      );
    },
    [busqueda, cantidad]
  );

  const { data, error, size, setSize, isLoading, isValidating } =
    useSWRInfinite(getKey, { revalidateFirstPage: false });

  const paginasData = useMemo(
    () => (data ?? []).map(normalizeRespuesta),
    [data]
  );

  const vehiculos: Vehiculo[] = useMemo(
    () => paginasData.flatMap((p) => p.vehiculos),
    [paginasData]
  );

  const primera = paginasData[0];
  const total = primera?.total ?? 0;
  const totalPaginas = primera?.paginas ?? 0;
  const filtros: FiltrosRaw | null = primera?.filtros ?? null;

  return {
    vehiculos,
    total,
    filtros,
    hasMore: size < totalPaginas && !error,
    isLoading,
    // `isValidating` con datos ya cargados = está trayendo la página siguiente.
    isLoadingMore: isValidating && (data?.length ?? 0) > 0,
    loadMore: () => setSize((s) => s + 1),
    error: error as Error | undefined,
  };
}
