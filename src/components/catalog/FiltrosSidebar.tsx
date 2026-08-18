"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CircleX, X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { RangoHistograma } from "@/components/catalog/RangoHistograma";
import { useDistribucion } from "@/hooks/useVehiculos";
import type { FiltrosRaw, FiltrosSeleccionados } from "@/lib/api/vehiculos";
import { marcaLogo } from "@/lib/marcas";
import { segmentoIcono } from "@/lib/segmentos";
import { cn } from "@/lib/utils";

/**
 * Sidebar de filtros del catálogo.
 *
 * Las facetas y los contadores vienen de la API en cada respuesta: la lista
 * refleja siempre el inventario real, no una lista fija.
 *
 * El estado vive en la URL, no en React: los filtros se pueden compartir, el
 * botón "atrás" funciona y recargar no los pierde.
 *
 * Selección ÚNICA por grupo - el endpoint sólo acepta un valor por parámetro.
 * Volver a pulsar la opción activa la quita.
 *
 * No hay filtro de modelo: el parámetro `modelo` hace que el origen responda
 * 500 con cualquier valor. Ver docs/api-vehiculos.md.
 */

const PRECIO_TOPE = 2_000_000;
const KM_TOPE = 500_000;

const FILTRO_PARAMS = [
  "marca",
  "anio",
  "segmento",
  "transmision",
  "color",
  "precio_min",
  "precio_max",
  "km_min",
  "km_max",
] as const;

const mxn = (n: number) => `$${n.toLocaleString("es-MX")}`;

export default function FiltrosSidebar({
  facetas,
  seleccion,
  busqueda,
  isLoading,
}: {
  facetas: FiltrosRaw | null;
  seleccion: FiltrosSeleccionados;
  busqueda?: string;
  isLoading?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Distribución para los histogramas. Se pide sin el propio rango aplicado,
  // para que las barras no se desvanezcan mientras se arrastra el control.
  const { valores: precios } = useDistribucion({
    busqueda,
    filtros: seleccion,
    campo: "precio",
  });
  const { valores: kms } = useDistribucion({
    busqueda,
    filtros: seleccion,
    campo: "km",
  });

  /** Escribe parámetros en la URL. `null` los borra. */
  const setParams = useCallback(
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

  const toggle = (key: keyof FiltrosSeleccionados, valor: string) =>
    setParams({ [key]: seleccion[key] === valor ? null : valor });

  const limpiarTodo = () =>
    setParams(
      Object.fromEntries([
        ...FILTRO_PARAMS.map((k) => [k, null]),
        ["busqueda", null],
      ])
    );

  const hayFiltros =
    Boolean(busqueda) || FILTRO_PARAMS.some((k) => Boolean(seleccion[k]));

  if (isLoading && !facetas) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={`f-${i}`} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!facetas) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <h2 className="font-heading text-h4 font-medium">Filtros</h2>
        {hayFiltros && (
          <button
            type="button"
            onClick={limpiarTodo}
            className="inline-flex cursor-pointer items-center gap-1.5 text-body-2 text-ink-600 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <CircleX aria-hidden className="size-4" />
            Limpiar
          </button>
        )}
      </div>

      {hayFiltros && (
        <ul className="flex flex-wrap gap-1.5 px-4 pb-3.5">
          {busqueda && (
            <ChipActivo
              label={`Búsqueda: ${busqueda}`}
              onRemove={() => setParams({ busqueda: null })}
            />
          )}
          {FILTRO_PARAMS.filter((k) => seleccion[k]).map((k) => (
            <ChipActivo
              key={k}
              label={etiquetaFiltro(k, seleccion[k] as string, facetas)}
              onRemove={() => setParams({ [k]: null })}
            />
          ))}
        </ul>
      )}

      <Accordion type="single" collapsible defaultValue="segmento">
        <Grupo titulo="Tipo" value="segmento">
          <Opciones>
            {facetas.segmentos.map((s) => (
              <Opcion
                key={s.clave_segmento}
                label={s.segmento}
                total={s.total_clave_segmento}
                icono={segmentoIcono(s.segmento)}
                activo={seleccion.segmento === String(s.clave_segmento)}
                onClick={() => toggle("segmento", String(s.clave_segmento))}
              />
            ))}
          </Opciones>
        </Grupo>

        <Grupo titulo="Transmisión" value="transmision">
          <Opciones>
            {facetas.transmisiones.map((t) => (
              <Opcion
                key={t.clave_transmision}
                label={t.transmision}
                total={t.total_clave_transmision}
                activo={seleccion.transmision === String(t.clave_transmision)}
                onClick={() => toggle("transmision", String(t.clave_transmision))}
              />
            ))}
          </Opciones>
        </Grupo>

        {/* "Marca" a secas, no "Marca y modelo": el parámetro `modelo` rompe la
            API, así que prometer el modelo sería mentir. */}
        <Grupo titulo="Marca" value="marca">
          <Opciones>
            {facetas.marcas.map((m) => (
              <Opcion
                key={m.clave_marca}
                label={m.marca}
                total={m.total_clave_marca}
                icono={marcaLogo(m.marca)}
                activo={seleccion.marca === String(m.clave_marca)}
                onClick={() => toggle("marca", String(m.clave_marca))}
              />
            ))}
          </Opciones>
        </Grupo>

        <Grupo titulo="Precio" value="precio">
          <RangoHistograma
            valores={precios}
            min={0}
            max={PRECIO_TOPE}
            step={10_000}
            format={mxn}
            parse={(t) => Number(t.replace(/[^\d]/g, ""))}
            desde={seleccion.precio_min}
            hasta={seleccion.precio_max}
            onCommit={(min, max) =>
              setParams({ precio_min: String(min), precio_max: String(max) })
            }
          />
        </Grupo>

        <Grupo titulo="Año" value="anio">
          <Opciones>
            {[...facetas.anios]
              .sort((a, b) => Number(a.anio) - Number(b.anio))
              .map((a) => (
                <Opcion
                  key={a.anio}
                  label={a.anio}
                  total={a.total_anio}
                  activo={seleccion.anio === a.anio}
                  onClick={() => toggle("anio", a.anio)}
                />
              ))}
          </Opciones>
        </Grupo>

        <Grupo titulo="Kilometraje" value="km">
          <RangoHistograma
            valores={kms}
            min={0}
            max={KM_TOPE}
            step={5_000}
            format={(n) => `${n.toLocaleString("es-MX")} km`}
            parse={(t) => Number(t.replace(/[^\d]/g, ""))}
            desde={seleccion.km_min}
            hasta={seleccion.km_max}
            onCommit={(min, max) =>
              setParams({ km_min: String(min), km_max: String(max) })
            }
          />
        </Grupo>

        <Grupo titulo="Color" value="color">
          <Opciones>
            {facetas.colores.map((c) => (
              <Opcion
                key={c.clave_color}
                label={c.color}
                total={c.total_clave_color}
                activo={seleccion.color === String(c.clave_color)}
                onClick={() => toggle("color", String(c.clave_color))}
              />
            ))}
          </Opciones>
        </Grupo>
      </Accordion>
    </div>
  );
}

/* ─────────────────────────────── piezas ─────────────────────────────────── */

function ChipActivo({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <li>
      <span className="inline-flex items-center gap-1.5 rounded-sm bg-ink-600 py-1 pr-1.5 pl-2.5 text-caption text-white">
        {label}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Quitar ${label}`}
          className="cursor-pointer rounded-sm transition-colors hover:text-brand-neon focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-neon"
        >
          <X aria-hidden className="size-3.5" />
        </button>
      </span>
    </li>
  );
}

/** Cabecera que se rellena de petróleo al abrirse, como el diseño original. */
function Grupo({
  titulo,
  value,
  children,
}: {
  titulo: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={value} className="border-border">
      <AccordionTrigger className="px-4 font-sans text-body-2 hover:no-underline data-open:bg-brand-petrol data-open:text-white">
        {titulo}
      </AccordionTrigger>
      <AccordionContent className="bg-background px-3 pt-3 pb-4">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function Opciones({ children }: { children: React.ReactNode }) {
  return (
    // Altura acotada: con 18 marcas la lista empujaría el resto de grupos fuera
    // de la pantalla.
    <ul className="flex max-h-[320px] flex-col gap-2 overflow-y-auto scrollbar-minimal">
      {children}
    </ul>
  );
}

function Opcion({
  label,
  total,
  icono,
  activo,
  onClick,
}: {
  label: string;
  total: number;
  icono?: string | null;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={activo}
        className={cn(
          "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-left transition-colors",
          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          activo
            ? "bg-brand-aqua font-medium text-brand-ink"
            : "bg-card hover:bg-brand-aqua/25"
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          {/* Sin icono para esta opción, sólo se pinta el texto: nunca un hueco
              ni una imagen rota. */}
          {icono && (
            <Image
              src={icono}
              alt=""
              width={32}
              height={24}
              className="h-6 w-8 shrink-0 object-contain"
            />
          )}
          <span className="truncate text-body-2">{label}</span>
        </span>
        <span
          className={cn(
            "shrink-0 tabular-nums text-caption",
            activo ? "text-brand-ink/70" : "text-ink-600"
          )}
        >
          {total}
        </span>
      </button>
    </li>
  );
}

/** Traduce la clave numérica de la URL al nombre que ve la persona. */
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
      return `Desde ${mxn(Number(value))}`;
    case "precio_max":
      return `Hasta ${mxn(Number(value))}`;
    case "km_min":
      return `Desde ${Number(value).toLocaleString("es-MX")} km`;
    case "km_max":
      return `Hasta ${Number(value).toLocaleString("es-MX")} km`;
    default:
      return value;
  }
}
