"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

import VehiculoCard from "@/components/catalog/VehiculoCard";
import type { Vehiculo } from "@/lib/api/vehiculos";
import { cn } from "@/lib/utils";

/**
 * Carrusel horizontal de tarjetas de vehículo (Embla).
 *
 * Muestra 1/2/3 tarjetas por vista (móvil/tablet/desktop) y avanza de una en una
 * con flechas anterior/siguiente. Con `autoplay` gira solo cada 5 s, pausa al
 * pasar el cursor y NO se detiene tras interactuar (vuelve a girar). `loop` hace
 * el desplazamiento infinito.
 *
 * Reutilizable: lo consumen Ofertas destacadas, Los más económicos y Por segmento.
 */
export default function VehiculoCarousel({
  vehiculos,
  autoplay = false,
}: {
  vehiculos: Vehiculo[];
  autoplay?: boolean;
}) {
  // El plugin debe ser estable entre renders o Embla se reinicializa en bucle.
  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const plugins = useMemo(
    () => (autoplay ? [autoplayRef.current] : []),
    [autoplay]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1, duration: 22 },
    plugins
  );

  // Con loop siempre se puede avanzar, pero si hay menos slides que los visibles
  // Embla desactiva el scroll; reflejamos ese estado en los botones.
  const [puedeScroll, setPuedeScroll] = useState(false);

  const onReInit = useCallback(() => {
    if (emblaApi) setPuedeScroll(emblaApi.canScrollNext() || emblaApi.canScrollPrev());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onReInit();
    emblaApi.on("reInit", onReInit);
    return () => {
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi, onReInit]);

  const flecha = cn(
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full",
    "border border-border bg-card/90 text-foreground shadow-md backdrop-blur-sm transition-all",
    "hover:bg-card hover:shadow-lg",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-neon",
    "disabled:pointer-events-none disabled:opacity-0"
  );

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-5">
          {vehiculos.map((v, i) => (
            <div
              key={v.id || `${v.marca}-${v.modelo}-${i}`}
              className="min-w-0 shrink-0 grow-0 basis-full pl-5 sm:basis-1/2 lg:basis-1/3"
            >
              <VehiculoCard vehiculo={v} priority={i < 3} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Anterior"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!puedeScroll}
        className={cn(flecha, "left-0 -translate-x-1/2 md:-translate-x-1/2")}
      >
        <ChevronLeft aria-hidden className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!puedeScroll}
        className={cn(flecha, "right-0 translate-x-1/2 md:translate-x-1/2")}
      >
        <ChevronRight aria-hidden className="size-5" />
      </button>
    </div>
  );
}
