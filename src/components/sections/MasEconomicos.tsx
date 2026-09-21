"use client";

import { useMemo } from "react";
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

/**
 * "Los más económicos" del home: los N autos de menor precio, en carrusel.
 *
 * La API no ordena por precio, así que se pide un lote grande y se ordena en
 * cliente por `precio` ascendente. El botón "Ver más" lleva al listado completo.
 */
export default function MasEconomicos({
  cantidad = 10,
  lote = 60,
}: {
  cantidad?: number;
  lote?: number;
}) {
  const { vehiculos, isLoading, error } = useVehiculos({ pagina: 1, cantidad: lote });

  const baratos = useMemo(
    () =>
      vehiculos
        .filter((v) => typeof v.precio === "number")
        .sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0))
        .slice(0, cantidad),
    [vehiculos, cantidad]
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          overline="Precio"
          title="Los más económicos"
          lead="Las unidades de menor precio del inventario."
          className="mb-0"
        />
        <Button variant="petrol" size="cta" asChild>
          <Link href="/vehiculos">Ver más</Link>
        </Button>
      </div>

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
      ) : baratos.length === 0 ? (
        <VehiculosVacio />
      ) : (
        <>
          <VehiculoCarousel vehiculos={baratos} />
          <VehiculosDisclaimer meses={baratos[0]?.meses ?? 36} />
        </>
      )}
    </section>
  );
}
