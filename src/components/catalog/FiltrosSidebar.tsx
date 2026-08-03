"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { FiltrosRaw, FiltrosSeleccionados } from "@/lib/api/vehiculos";
import { marcaLogo } from "@/lib/marcas";
import { cn } from "@/lib/utils";

/**
 * Sidebar de filtros del catálogo.
 *
 * Las facetas NO están hardcodeadas: la API las devuelve en cada respuesta,
 * con el conteo de unidades por opción, así que la lista siempre refleja el
 * inventario real.
 *
 * El estado vive en la URL, no en React: así el filtro se puede compartir, el
 * botón "atrás" funciona y recargar no lo pierde.
 *
 * Selección ÚNICA por grupo — el endpoint sólo acepta un valor por parámetro.
 * Volver a pulsar la opción activa la quita.
 *
 * No hay filtro de modelo: el parámetro `modelo` hace que el origen responda
 * 500 con cualquier valor. Ver docs/api-vehiculos.md.
 */

const RANGOS_PRECIO = [
  { label: "Hasta $250,000", min: "0", max: "250000" },
  { label: "$250,000 – $400,000", min: "250000", max: "400000" },
  { label: "$400,000 – $600,000", min: "400000", max: "600000" },
  { label: "Más de $600,000", min: "600000", max: "9999999" },
];

const RANGOS_KM = [
  { label: "Hasta 20,000 km", min: "0", max: "20000" },
  { label: "20,000 – 50,000 km", min: "20000", max: "50000" },
  { label: "50,000 – 100,000 km", min: "50000", max: "100000" },
  { label: "Más de 100,000 km", min: "100000", max: "999999" },
];

type Opcion = { valor: string; label: string; total: number; logo?: string | null };

export default function FiltrosSidebar({
  facetas,
  seleccion,
  isLoading,
}: {
  facetas: FiltrosRaw | null;
  seleccion: FiltrosSeleccionados;
  isLoading?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** Escribe un parámetro en la URL. `null` lo borra. Siempre vuelve a página 1. */
  const setParam = useCallback(
    (cambios: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(cambios)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const toggle = (key: string, valor: string) =>
    setParam({ [key]: seleccion[key as keyof FiltrosSeleccionados] === valor ? null : valor });

  const activos = Object.entries(seleccion).filter(([, v]) => Boolean(v));

  const limpiarTodo = () => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of [
      "marca",
      "anio",
      "segmento",
      "transmision",
      "color",
      "precio_min",
      "precio_max",
      "km_min",
      "km_max",
    ]) {
      params.delete(key);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  function Grupo({
    titulo,
    param,
    opciones,
  }: {
    titulo: string;
    param: keyof FiltrosSeleccionados;
    opciones: Opcion[];
  }) {
    if (opciones.length === 0) return null;

    return (
      <AccordionItem value={param}>
        <AccordionTrigger className="font-label text-label">
          {titulo}
        </AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-col gap-1 pb-2">
            {opciones.map((o) => {
              const activo = seleccion[param] === o.valor;
              return (
                <li key={o.valor}>
                  <button
                    type="button"
                    onClick={() => toggle(param, o.valor)}
                    aria-pressed={activo}
                    className={cn(
                      "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-sm px-3 text-left text-body-2 transition-colors",
                      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                      activo
                        ? "bg-brand-aqua font-medium text-brand-ink"
                        : "hover:bg-muted"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      {/* Sólo tenemos logo de algunas marcas. Sin fallback
                          textual, el resto quedaría invisible. */}
                      {o.logo && (
                        <Image
                          src={o.logo}
                          alt=""
                          width={24}
                          height={24}
                          className="size-6 shrink-0 object-contain"
                        />
                      )}
                      <span className="truncate">{o.label}</span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 tabular-nums text-caption",
                        activo ? "text-brand-ink/70" : "text-ink-500"
                      )}
                    >
                      {o.total}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>
    );
  }

  /** Los rangos no vienen de las facetas: la API no expone histograma de precio. */
  function GrupoRango({
    titulo,
    param,
    rangos,
  }: {
    titulo: string;
    param: "precio" | "km";
    rangos: typeof RANGOS_PRECIO;
  }) {
    const minKey = `${param}_min` as keyof FiltrosSeleccionados;
    const maxKey = `${param}_max` as keyof FiltrosSeleccionados;

    return (
      <AccordionItem value={param}>
        <AccordionTrigger className="font-label text-label">
          {titulo}
        </AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-col gap-1 pb-2">
            {rangos.map((r) => {
              const activo =
                seleccion[minKey] === r.min && seleccion[maxKey] === r.max;
              return (
                <li key={r.label}>
                  <button
                    type="button"
                    aria-pressed={activo}
                    onClick={() =>
                      setParam(
                        activo
                          ? { [minKey]: null, [maxKey]: null }
                          : { [minKey]: r.min, [maxKey]: r.max }
                      )
                    }
                    className={cn(
                      "flex min-h-11 w-full cursor-pointer items-center rounded-sm px-3 text-left text-body-2 transition-colors",
                      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                      activo
                        ? "bg-brand-aqua font-medium text-brand-ink"
                        : "hover:bg-muted"
                    )}
                  >
                    {r.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>
    );
  }

  if (isLoading && !facetas) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={`f-${i}`} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!facetas) return null;

  return (
    <div className="flex flex-col gap-4">
      {activos.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-label text-overline uppercase text-ink-600">
              Filtros activos
            </span>
            <button
              type="button"
              onClick={limpiarTodo}
              className="cursor-pointer text-caption text-brand-petrol underline-offset-4 hover:underline"
            >
              Limpiar
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activos.map(([key, value]) => (
              <Badge key={key} variant="secondary" className="gap-1">
                {etiquetaFiltro(key, value, facetas)}
                <button
                  type="button"
                  onClick={() => setParam({ [key]: null })}
                  aria-label={`Quitar filtro ${key}`}
                  className="cursor-pointer"
                >
                  <X aria-hidden className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card px-4">
        <Accordion type="multiple" defaultValue={["marca", "segmento"]}>
          <Grupo
            titulo="Marca"
            param="marca"
            opciones={facetas.marcas.map((m) => ({
              valor: String(m.clave_marca),
              label: m.marca,
              total: m.total_clave_marca,
              logo: marcaLogo(m.marca),
            }))}
          />
          <Grupo
            titulo="Carrocería"
            param="segmento"
            opciones={facetas.segmentos.map((s) => ({
              valor: String(s.clave_segmento),
              label: s.segmento,
              total: s.total_clave_segmento,
            }))}
          />
          <Grupo
            titulo="Año"
            param="anio"
            opciones={[...facetas.anios]
              .sort((a, b) => Number(b.anio) - Number(a.anio))
              .map((a) => ({
                valor: a.anio,
                label: a.anio,
                total: a.total_anio,
              }))}
          />
          <Grupo
            titulo="Transmisión"
            param="transmision"
            opciones={facetas.transmisiones.map((t) => ({
              valor: String(t.clave_transmision),
              label: t.transmision,
              total: t.total_clave_transmision,
            }))}
          />
          <Grupo
            titulo="Color"
            param="color"
            opciones={facetas.colores.map((c) => ({
              valor: String(c.clave_color),
              label: c.color,
              total: c.total_clave_color,
            }))}
          />
          <GrupoRango titulo="Precio" param="precio" rangos={RANGOS_PRECIO} />
          <GrupoRango titulo="Kilometraje" param="km" rangos={RANGOS_KM} />
        </Accordion>
      </div>
    </div>
  );
}

/** Traduce la clave numérica guardada en la URL al nombre que ve la persona. */
function etiquetaFiltro(
  key: string,
  value: string,
  facetas: FiltrosRaw
): string {
  switch (key) {
    case "marca":
      return facetas.marcas.find((m) => String(m.clave_marca) === value)?.marca ?? value;
    case "segmento":
      return (
        facetas.segmentos.find((s) => String(s.clave_segmento) === value)?.segmento ?? value
      );
    case "transmision":
      return (
        facetas.transmisiones.find((t) => String(t.clave_transmision) === value)
          ?.transmision ?? value
      );
    case "color":
      return facetas.colores.find((c) => String(c.clave_color) === value)?.color ?? value;
    case "anio":
      return value;
    case "precio_min":
      return `Desde $${Number(value).toLocaleString("es-MX")}`;
    case "precio_max":
      return `Hasta $${Number(value).toLocaleString("es-MX")}`;
    case "km_min":
      return `Desde ${Number(value).toLocaleString("es-MX")} km`;
    case "km_max":
      return `Hasta ${Number(value).toLocaleString("es-MX")} km`;
    default:
      return value;
  }
}
