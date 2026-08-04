"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Fuel, Gauge, ImageOff, Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Vehiculo } from "@/lib/api/vehiculos";
import { cn } from "@/lib/utils";

const mxn = (n: number | null) =>
  n == null ? "—" : `$${n.toLocaleString("es-MX")}`;

/**
 * Tarjeta de vehículo con carrusel Embla para la galería.
 *
 * La MENSUALIDAD es el dato protagonista, no el precio de contado. Es la
 * decisión del sitio original y tiene sentido comercial: "$8,442 al mes" se
 * lee como alcanzable, "$320,000" como una barrera. El contado sigue visible,
 * pero en segundo plano.
 *
 * Ese protagonismo obliga al descargo legal que acompaña a la rejilla
 * (<VehiculosDisclaimer>): mostrar una mensualidad sin decir plazo, enganche y
 * que está sujeta a aprobación crediticia es publicidad financiera incompleta.
 *
 * Las flechas y los puntos sólo se montan si hay más de una imagen: unos
 * controles que no llevan a ningún sitio son ruido.
 */
export default function VehiculoCard({
  vehiculo,
  priority = false,
}: {
  vehiculo: Vehiculo;
  priority?: boolean;
}) {
  const imagenes = vehiculo.imagenes;
  const multiple = imagenes.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    // Respeta prefers-reduced-motion: sin duration el scroll es instantáneo.
    duration: 22,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Sin llamada síncrona a onSelect(): dispararía un setState dentro del
    // efecto y una render en cascada. El estado inicial ya es 0, que es el
    // snap con el que Embla arranca; "reInit" cubre los cambios de tamaño.
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const titulo = [vehiculo.marca, vehiculo.modelo].filter(Boolean).join(" ");

  return (
    // `relative` es necesario para el enlace estirado del título (after:inset-0).
    <article className="group/card relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[4/3] bg-muted">
        {imagenes.length === 0 ? (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-ink-500">
            <ImageOff aria-hidden className="size-8" />
            <span className="text-caption">Sin imagen</span>
          </div>
        ) : (
          <>
            <div className="size-full overflow-hidden" ref={emblaRef}>
              <div className="flex size-full">
                {imagenes.map((src, i) => (
                  <div
                    key={src}
                    className="relative size-full min-w-0 shrink-0 grow-0 basis-full"
                  >
                    <Image
                      src={src}
                      alt={
                        i === 0
                          ? `${titulo} ${vehiculo.version}`.trim()
                          : `${titulo} — imagen ${i + 1} de ${imagenes.length}`
                      }
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={priority && i === 0}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>

            {multiple && (
              <>
                {/*
                  z-20 es OBLIGATORIO: el enlace estirado del título
                  (`after:inset-0`) va después en el DOM y, sin z-index, se
                  pinta encima de estas flechas y se traga el clic — pulsar
                  "siguiente" abría la ficha del auto.

                  Círculo visible de 32px, pero el área de clic sigue siendo de
                  44px gracias al `before:-inset-1.5` (invisible, sólo captura
                  el puntero). Reducir el objetivo táctil de verdad rompería la
                  usabilidad en móvil.
                */}
                <button
                  type="button"
                  aria-label="Imagen anterior"
                  onClick={() => emblaApi?.scrollPrev()}
                  className={cn(
                    "absolute top-1/2 left-2 z-20 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-4xl",
                    "before:absolute before:-inset-1.5 before:content-['']",
                    "bg-brand-ink/30 text-white/90 backdrop-blur-sm transition-all",
                    "hover:bg-brand-ink/60 hover:text-white",
                    "focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-neon",
                    "md:opacity-0 md:group-hover/card:opacity-100"
                  )}
                >
                  <ChevronLeft aria-hidden className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Imagen siguiente"
                  onClick={() => emblaApi?.scrollNext()}
                  className={cn(
                    "absolute top-1/2 right-2 z-20 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-4xl",
                    "before:absolute before:-inset-1.5 before:content-['']",
                    "bg-brand-ink/30 text-white/90 backdrop-blur-sm transition-all",
                    "hover:bg-brand-ink/60 hover:text-white",
                    "focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-neon",
                    "md:opacity-0 md:group-hover/card:opacity-100"
                  )}
                >
                  <ChevronRight aria-hidden className="size-4" />
                </button>

                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5"
                >
                  {imagenes.map((src, i) => (
                    <span
                      key={src}
                      className={cn(
                        "h-1.5 rounded-4xl transition-all duration-200",
                        i === selected ? "w-6 bg-brand-neon" : "w-1.5 bg-white/60"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Marca + año en la misma línea: al escanear una rejilla, el año es de
            lo primero que se compara entre unidades. */}
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate font-label text-label font-bold uppercase tracking-[0.08em]">
            {vehiculo.marca}
          </span>
          {vehiculo.anio && (
            <span className="shrink-0 font-label text-label font-bold tabular-nums">
              {vehiculo.anio}
            </span>
          )}
        </div>

        <div className="mt-0.5 flex items-start justify-between gap-3">
          <h3 className="min-w-0">
            <Link
              href={vehiculo.href}
              className="line-clamp-2 font-heading text-h4 font-medium after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {vehiculo.modelo}
            </Link>
          </h3>
          {/* El ID es el que usa la gente al llamar para preguntar por una
              unidad concreta; por eso va visible y no sólo en la URL. */}
          {vehiculo.id && (
            <Badge variant="secondary" className="shrink-0 tabular-nums">
              ID {vehiculo.id}
            </Badge>
          )}
        </div>

        {vehiculo.version && (
          <p className="mt-1 line-clamp-1 text-caption text-ink-600">
            {vehiculo.version}
          </p>
        )}

        {/*
          Dos columnas, no tres. La silueta genérica de carrocería iba en medio
          y robaba el ancho: en una tarjeta estrecha partía "$4,773 / mes*" en
          dos líneas. Además era redundante — arriba está la foto real del auto,
          y la carrocería ya se lee en el overline.

          `whitespace-nowrap` en la cifra: el importe y su sufijo son una sola
          unidad de lectura y nunca deben separarse.
        */}
        <div className="mt-auto flex items-end justify-between gap-4 pt-4">
          <div className="min-w-0">
            {vehiculo.mensualidad != null ? (
              <>
                <p className="text-caption text-ink-600">Desde:</p>
                <p className="whitespace-nowrap font-label text-h3 font-bold tabular-nums text-brand-petrol">
                  {mxn(vehiculo.mensualidad)}
                  <span className="ml-1 text-caption font-normal text-ink-600">
                    /mes*
                  </span>
                </p>
              </>
            ) : (
              <>
                <p className="text-caption text-ink-600">Contado:</p>
                <p className="whitespace-nowrap font-label text-h3 font-bold tabular-nums text-brand-petrol">
                  {mxn(vehiculo.precio)}
                </p>
              </>
            )}
          </div>

          {vehiculo.mensualidad != null && vehiculo.precio != null && (
            <div className="shrink-0 text-right">
              <p className="text-caption text-ink-600">Contado:</p>
              <p className="whitespace-nowrap font-label text-body-2 font-semibold tabular-nums">
                {mxn(vehiculo.precio)}
              </p>
            </div>
          )}
        </div>

        {/* Iconos en vez de texto separado por puntos: la fila se escanea de un
            vistazo y cada dato queda identificable sin leerlo entero. */}
        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-caption text-ink-800">
          {vehiculo.km != null && (
            <li className="flex items-center gap-1.5">
              <Gauge aria-hidden className="size-4 text-brand-petrol" />
              <span className="tabular-nums">
                {vehiculo.km.toLocaleString("es-MX")} km
              </span>
            </li>
          )}
          {vehiculo.combustible && (
            <li className="flex items-center gap-1.5">
              <Fuel aria-hidden className="size-4 text-brand-petrol" />
              {vehiculo.combustible}
            </li>
          )}
          {vehiculo.transmision && (
            <li className="flex items-center gap-1.5">
              <Settings2 aria-hidden className="size-4 text-brand-petrol" />
              {vehiculo.transmision}
            </li>
          )}
        </ul>
      </div>
    </article>
  );
}
