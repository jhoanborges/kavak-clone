"use client";

import { useState } from "react";
import Link from "next/link";

import { SectionHeading } from "@/components/ds";
import VehiculoCarousel from "@/components/catalog/VehiculoCarousel";
import VehiculoCardSkeleton from "@/components/catalog/VehiculoCardSkeleton";
import {
  VehiculosDisclaimer,
  VehiculosError,
  VehiculosVacio,
} from "@/components/catalog/VehiculosEstado";
import { Button } from "@/components/ui/button";
import { useVehiculos } from "@/hooks/useVehiculos";
import { cn } from "@/lib/utils";

/**
 * "Explora por segmento" del home: tabs de carrocería (SUVs, Sedan, Pickup…) que
 * filtran un carrusel de autos.
 *
 * Las tabs salen de las FACETAS de la API (una consulta ligera que devuelve los
 * segmentos con su conteo). Al elegir una, se pide ese segmento filtrado. El
 * botón "Ver más" lleva al listado completo ya filtrado por el segmento activo.
 */
export default function PorSegmento({ cantidad = 12 }: { cantidad?: number }) {
  // Consulta ligera sólo para las facetas (segmentos + conteos).
  const { filtros } = useVehiculos({ pagina: 1, cantidad: 1 });
  const segmentos = filtros?.segmentos ?? [];

  const [activa, setActiva] = useState<number | null>(null);
  const claveActiva = activa ?? segmentos[0]?.clave_segmento ?? null;

  const { vehiculos, isLoading, error } = useVehiculos({
    segmento: claveActiva != null ? String(claveActiva) : "",
    pagina: 1,
    cantidad,
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          overline="Carrocería"
          title="Explora por segmento"
          lead="Encuentra el tipo de auto que buscas."
          className="mb-0"
        />
        <Button variant="petrol" size="cta" asChild>
          <Link
            href={
              claveActiva != null
                ? `/vehiculos?segmento=${claveActiva}`
                : "/vehiculos"
            }
          >
            Ver más
          </Link>
        </Button>
      </div>

      {segmentos.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {segmentos.map((s) => {
            const activo = s.clave_segmento === claveActiva;
            return (
              <button
                key={s.clave_segmento}
                type="button"
                onClick={() => setActiva(s.clave_segmento)}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-1.5 text-label font-medium transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-neon",
                  activo
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-ink-700 hover:border-primary/50 hover:text-foreground"
                )}
              >
                {s.segmento}
                <span className="ml-1.5 tabular-nums opacity-70">
                  {s.total_clave_segmento}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {error ? (
        <VehiculosError error={error} />
      ) : isLoading ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <li key={i}>
              <VehiculoCardSkeleton />
            </li>
          ))}
        </ul>
      ) : vehiculos.length === 0 ? (
        <VehiculosVacio />
      ) : (
        <>
          <VehiculoCarousel vehiculos={vehiculos} />
          <VehiculosDisclaimer meses={vehiculos[0]?.meses ?? 36} />
        </>
      )}
    </section>
  );
}
