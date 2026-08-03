"use client";

import { SWRConfig } from "swr";

import { fetchVehiculos } from "@/lib/api/vehiculos";

/**
 * Configuración global de SWR.
 *
 * Va en el root layout para que cualquier `useSWR(url)` funcione sin repetir el
 * fetcher. Los defaults están elegidos para un catálogo de autos, donde el
 * inventario cambia por horas, no por segundos:
 *
 * - `revalidateOnFocus: false` — volver a la pestaña no debería relanzar todas
 *   las peticiones ni hacer saltar el listado bajo el cursor.
 * - `dedupingInterval` 1 min — varias tarjetas pidiendo la misma URL en el mismo
 *   render disparan una sola petición.
 * - `errorRetryCount: 2` — la API está tras un WAF; reintentar sin límite ante
 *   un 403 sólo empeora las cosas.
 * - `keepPreviousData` — al paginar o buscar, la lista anterior se mantiene
 *   visible en lugar de vaciarse. Evita el salto de layout (CLS).
 */
export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: fetchVehiculos,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 60_000,
        errorRetryCount: 2,
        keepPreviousData: true,
        shouldRetryOnError: (err: unknown) => {
          // 4xx no se arregla reintentando; 5xx y red sí.
          const status = (err as { status?: number })?.status;
          return !status || status >= 500;
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
