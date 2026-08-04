"use client";

import { useEffect, useRef } from "react";

import { SectionHeading } from "@/components/ds";
import VehiculoCard from "@/components/catalog/VehiculoCard";
import VehiculoCardSkeleton from "@/components/catalog/VehiculoCardSkeleton";
import {
  VehiculosDisclaimer,
  VehiculosError,
  VehiculosVacio,
} from "@/components/catalog/VehiculosEstado";
import { Button } from "@/components/ui/button";
import FiltrosSidebar from "@/components/catalog/FiltrosSidebar";
import { SearchForm } from "@/components/sections/SearchForm";
import { useVehiculosInfinito } from "@/hooks/useVehiculos";
import type { FiltrosSeleccionados } from "@/lib/api/vehiculos";

/**
 * Listado completo con scroll infinito.
 *
 * El centinela con IntersectionObserver carga la página siguiente al
 * aproximarse, pero el botón "Cargar más" se renderiza SIEMPRE, no como
 * fallback oculto: el scroll infinito puro deja sin acceso a quien navega con
 * teclado y hace inalcanzable cualquier cosa que vaya debajo. El observer es
 * la comodidad; el botón es el mecanismo accesible.
 */
export default function CatalogoInfinito({
  busqueda = "",
  filtros,
  cantidad = 12,
  titulo = "Todo nuestro inventario",
}: {
  busqueda?: string;
  filtros?: FiltrosSeleccionados;
  cantidad?: number;
  titulo?: string;
}) {
  const {
    vehiculos,
    total,
    filtros: facetas,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    error,
  } = useVehiculosInfinito({ busqueda, filtros, cantidad });

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      // Se adelanta media pantalla para que la carga no se note.
      { rootMargin: "50% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          overline="Catálogo"
          title={busqueda ? `Resultados para “${busqueda}”` : titulo}
          lead={
            total > 0
              ? `${total.toLocaleString("es-MX")} ${total === 1 ? "unidad disponible" : "unidades disponibles"}.`
              : undefined
          }
          className="mb-0"
        />
        {/* Sin buscador aquí, llegar a /vehiculos?busqueda=… sería un callejón
            sin salida: no habría forma de cambiar el término sin volver al home. */}
        <SearchForm
          size="compact"
          defaultValue={busqueda}
          className="lg:max-w-[420px]"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
        {/* El sidebar se pega al hacer scroll: con scroll infinito, tener que
            volver arriba para cambiar un filtro es una fricción absurda. */}
        <aside
          aria-label="Filtros"
          className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto scrollbar-minimal"
        >
          <FiltrosSidebar
            facetas={facetas}
            seleccion={filtros ?? {}}
            busqueda={busqueda}
            isLoading={isLoading}
          />
        </aside>

        <div>
      {error && vehiculos.length === 0 ? (
        <VehiculosError error={error} />
      ) : !isLoading && vehiculos.length === 0 ? (
        <VehiculosVacio busqueda={busqueda} />
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {vehiculos.map((v, i) => (
              <li key={v.id || `${v.marca}-${v.modelo}-${i}`} className="flex">
                <VehiculoCard vehiculo={v} priority={i < 4} />
              </li>
            ))}

            {(isLoading || isLoadingMore) &&
              Array.from({ length: cantidad }, (_, i) => (
                <li key={`sk-${i}`}>
                  <VehiculoCardSkeleton />
                </li>
              ))}
          </ul>

          {/* Anuncia el progreso a lectores de pantalla, que no ven el spinner. */}
          <p aria-live="polite" className="sr-only">
            {isLoadingMore
              ? "Cargando más vehículos"
              : `${vehiculos.length} vehículos cargados`}
          </p>

          <div ref={sentinelRef} aria-hidden className="h-px" />

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="petrol"
                size="cta"
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Cargando…" : "Cargar más autos"}
              </Button>
            </div>
          )}

          <VehiculosDisclaimer meses={vehiculos[0]?.meses ?? 36} />

          {error && vehiculos.length > 0 && (
            <p role="alert" className="mt-6 text-center text-body-2 text-ink-800">
              No pudimos cargar más resultados. Inténtalo de nuevo.
            </p>
          )}
        </>
      )}
        </div>
      </div>
    </section>
  );
}
