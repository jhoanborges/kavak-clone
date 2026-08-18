"use client";

import { useCallback, useMemo, useRef } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

import {
  buildVehiculosUrl,
  catalogoQuery,
  normalizeRespuesta,
  VEHICULOS_PRESETS,
  type FiltrosRaw,
  type FiltrosSeleccionados,
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
  filtros,
  cantidad = 12,
}: {
  busqueda?: string;
  filtros?: FiltrosSeleccionados;
  cantidad?: number;
} = {}) {
  // Serializado para que sirva de dependencia estable: un objeto nuevo en cada
  // render invalidaría getKey y recargaría el listado sin motivo.
  const filtrosKey = JSON.stringify(filtros ?? {});
  const getKey = useCallback(
    (index: number, previous: unknown) => {
      const pagina = index + 1;

      if (previous) {
        const prev = normalizeRespuesta(previous);
        // Ya se sirvió la última página según el propio backend.
        if (pagina > prev.paginas) return null;
      }

      return buildVehiculosUrl(
        catalogoQuery({
          busqueda,
          filtros: JSON.parse(filtrosKey) as FiltrosSeleccionados,
          pagina,
          cantidad,
        })
      );
    },
    [busqueda, filtrosKey, cantidad]
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
  // Facetas que devuelve la API (marcas, años, colores…) con sus conteos.
  // Se llama `facetas` para no chocar con los filtros SELECCIONADOS que entran
  // por parámetro.
  const facetas: FiltrosRaw | null = primera?.filtros ?? null;

  // useSWRInfinite NO soporta keepPreviousData. Al cambiar de filtro o búsqueda
  // la clave cambia, `data` pasa a `undefined` y el listado parpadearía a
  // blanco. Guardamos el último resultado bueno y lo seguimos mostrando
  // mientras llegan los datos del filtro nuevo: la data no desaparece.
  const hayDatos = (data?.length ?? 0) > 0;
  const ultimo = useRef<{
    vehiculos: Vehiculo[];
    total: number;
    totalPaginas: number;
    facetas: FiltrosRaw | null;
  } | null>(null);

  if (hayDatos) {
    ultimo.current = { vehiculos, total, totalPaginas, facetas };
  }

  const previo = ultimo.current;
  // Hay datos viejos en pantalla y se están pidiendo los nuevos: es un cambio
  // de filtro/búsqueda, no la primera carga (que no tiene nada que mostrar).
  const cambiandoFiltros = !hayDatos && previo != null;

  const vista = hayDatos
    ? { vehiculos, total, totalPaginas, facetas }
    : previo ?? { vehiculos, total, totalPaginas, facetas };

  return {
    vehiculos: vista.vehiculos,
    total: vista.total,
    filtros: vista.facetas,
    hasMore: size < vista.totalPaginas && !error,
    // Primera carga real: sin nada previo que mostrar → skeleton completo.
    isLoading: isLoading && !cambiandoFiltros,
    // Datos previos visibles mientras llega el filtro nuevo → skeleton solo en
    // productos, el sidebar se queda y sus conteos hacen fade.
    cambiandoFiltros,
    // `isValidating` con datos ya cargados = está trayendo la página siguiente.
    isLoadingMore: isValidating && hayDatos,
    loadMore: () => setSize((s) => s + 1),
    error: error as Error | undefined,
  };
}

/**
 * Valores de un campo numérico en todo el inventario que casa con los filtros
 * ACTUALES, salvo el propio rango que se está editando.
 *
 * Sirve para dibujar el histograma del filtro de precio/kilometraje: las barras
 * deben mostrar la distribución del contexto (por ejemplo, sólo Audis) pero NO
 * encogerse mientras se arrastra el control - si se aplicase el propio rango,
 * las barras desaparecerían bajo el cursor.
 *
 * OJO CON LA ESCALA: pide todo el inventario de una vez. Hoy son 29 unidades y
 * la API las devuelve en una sola respuesta. Si el catálogo creciera a miles,
 * esto habría que sustituirlo por un endpoint que devuelva el histograma ya
 * agregado.
 */
export function useDistribucion({
  busqueda = "",
  filtros = {},
  campo,
  max = 500,
}: {
  busqueda?: string;
  filtros?: FiltrosSeleccionados;
  campo: "precio" | "km";
  max?: number;
}) {
  const sinRangoPropio: FiltrosSeleccionados = { ...filtros };
  delete sinRangoPropio[`${campo}_min` as keyof FiltrosSeleccionados];
  delete sinRangoPropio[`${campo}_max` as keyof FiltrosSeleccionados];

  const url = buildVehiculosUrl(
    catalogoQuery({ busqueda, filtros: sinRangoPropio, pagina: 1, cantidad: max })
  );
  const { data, isLoading } = useSWR(url);

  const valores = useMemo(() => {
    const { vehiculos } = normalizeRespuesta(data);
    return vehiculos
      .map((v) => (campo === "precio" ? v.precio : v.km))
      .filter((n): n is number => typeof n === "number" && n > 0)
      .sort((a, b) => a - b);
  }, [data, campo]);

  return { valores, isLoading };
}
