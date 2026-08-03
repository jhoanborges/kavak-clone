"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Vehiculo } from "@/lib/api/vehiculos";

const mxn = (n: number | null) =>
  n == null ? "—" : `$${n.toLocaleString("es-MX")}`;

/**
 * Tarjeta de vehículo con carrusel Embla para la galería.
 *
 * Las flechas y los puntos sólo se montan si hay más de una imagen: unos
 * controles que no llevan a ningún sitio son ruido, y con una sola foto el
 * carrusel entero sobra.
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

      <div className="flex flex-1 flex-col gap-1 p-5">
        <p className="font-label text-caption uppercase tracking-wide text-ink-600">
          {[vehiculo.anio, vehiculo.segmento].filter(Boolean).join(" · ")}
        </p>

        {/*
          Combinación de las dos familias del DS: la marca en Raleway pequeña y
          espaciada, el modelo en Avenir. Antes iban juntos en un solo bloque de
          texto grande y el conjunto pesaba demasiado.

          `line-clamp-2` es la red de seguridad: aunque el dato venga sucio, el
          título nunca pasa de dos líneas y todas las tarjetas conservan la misma
          altura.

          El enlace envuelve marca y modelo: un solo destino accesible, con el
          nombre completo, en vez de duplicar el link en imagen y texto.
        */}
        <h3 className="leading-snug">
          <Link
            href={vehiculo.href}
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="block font-label text-caption font-semibold uppercase tracking-[0.12em] text-ink-600">
              {vehiculo.marca}
            </span>
            <span className="line-clamp-2 font-heading text-h4 font-medium">
              {vehiculo.modelo}
            </span>
          </Link>
        </h3>

        {vehiculo.version && (
          <p className="line-clamp-1 text-caption text-ink-600">
            {vehiculo.version}
          </p>
        )}

        {/* mt-auto empuja el bloque de precio al fondo: con títulos de una o dos
            líneas, los precios de la fila quedan igualmente alineados. */}
        <p className="mt-auto pt-3 font-label text-h3 font-bold tabular-nums text-brand-petrol">
          {mxn(vehiculo.precio)}
        </p>
        {vehiculo.mensualidad != null && (
          <p className="text-caption text-ink-600">
            o {mxn(vehiculo.mensualidad)}/mes
            {vehiculo.meses ? ` a ${vehiculo.meses} meses` : ""}
          </p>
        )}
        <p className="mt-1 text-caption text-ink-600">
          {[
            vehiculo.km != null && `${vehiculo.km.toLocaleString("es-MX")} km`,
            vehiculo.transmision,
            vehiculo.combustible,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </article>
  );
}
