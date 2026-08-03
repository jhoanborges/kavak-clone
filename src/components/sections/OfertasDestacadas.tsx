"use client";

import Link from "next/link";

import { SectionHeading } from "@/components/ds";
import VehiculoCard from "@/components/catalog/VehiculoCard";
import VehiculoCardSkeleton from "@/components/catalog/VehiculoCardSkeleton";
import {
  VehiculosError,
  VehiculosVacio,
} from "@/components/catalog/VehiculosEstado";
import { Button } from "@/components/ui/button";
import { useVehiculosDestacados } from "@/hooks/useVehiculos";

/**
 * "Ofertas destacadas" del home.
 *
 * OJO con el nombre: el endpoint no tiene ningún concepto de destacado. Esto es
 * una búsqueda SIN filtros recortada a 4 resultados — el orden lo decide el
 * backend. Ver docs/api-vehiculos.md. Si se quiere una curaduría real hace
 * falta un campo nuevo en la API.
 */
export default function OfertasDestacadas({ cantidad = 4 }: { cantidad?: number }) {
  const { vehiculos, isLoading, error } = useVehiculosDestacados(cantidad);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          overline="Inventario"
          title="Ofertas destacadas"
          lead="Unidades certificadas, listas para entrega."
          className="mb-0"
        />
        <Button variant="petrol" size="cta" asChild>
          <Link href="/compra">Ver autos</Link>
        </Button>
      </div>

      {error ? (
        <VehiculosError error={error} />
      ) : isLoading ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: cantidad }, (_, i) => (
            <li key={i}>
              <VehiculoCardSkeleton />
            </li>
          ))}
        </ul>
      ) : vehiculos.length === 0 ? (
        <VehiculosVacio />
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {vehiculos.map((v, i) => (
            <li key={v.id || `${v.marca}-${v.modelo}-${i}`}>
              <VehiculoCard vehiculo={v} priority={i < 2} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
