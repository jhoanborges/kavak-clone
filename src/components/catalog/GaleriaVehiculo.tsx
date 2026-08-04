"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GrupoFotos } from "@/lib/api/vehiculos";
import { cn } from "@/lib/utils";

/**
 * Galería de la ficha con lightbox.
 *
 * Mosaico: la primera foto grande y el resto en rejilla. Al pulsar cualquiera
 * se abre a pantalla completa, con miniaturas laterales para saltar entre ellas
 * y navegación con teclado.
 *
 * La API agrupa las fotos por categoría (exterior, interior, detalles), y el
 * lightbox conserva esa agrupación: saber si estás viendo el interior o la
 * carrocería es información, no adorno.
 */
export function GaleriaVehiculo({
  grupos,
  titulo,
}: {
  grupos: GrupoFotos[];
  titulo: string;
}) {
  // Lista plana para navegar; cada entrada recuerda su categoría.
  const fotos = grupos.flatMap((g) =>
    g.fotos.map((src) => ({ src, categoria: g.categoria }))
  );

  const [abierto, setAbierto] = useState(false);
  const [indice, setIndice] = useState(0);

  const ir = useCallback(
    (delta: number) =>
      setIndice((i) => (i + delta + fotos.length) % fotos.length),
    [fotos.length]
  );

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, ir]);

  if (fotos.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl bg-muted text-ink-500">
        <ImageOff aria-hidden className="size-10" />
        <p className="text-body-2">Sin fotografías disponibles</p>
      </div>
    );
  }

  const abrir = (i: number) => {
    setIndice(i);
    setAbierto(true);
  };

  const principal = fotos[0];
  const secundarias = fotos.slice(1, 5);
  const restantes = fotos.length - 5;

  return (
    <>
      {/* Mosaico: una principal + hasta cuatro. Cinco es el máximo que se
          reconoce de un vistazo; el resto se ve en el lightbox. */}
      <div className="grid gap-2 md:grid-cols-2">
        <button
          type="button"
          onClick={() => abrir(0)}
          className="group/foto relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Image
            src={principal.src}
            alt={`${titulo} — ${principal.categoria}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover/foto:scale-105"
          />
          <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-4xl bg-brand-ink/70 px-3 py-1.5 text-caption text-white backdrop-blur-sm">
            <Expand aria-hidden className="size-3.5" />
            Ver {fotos.length} fotos
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          {secundarias.map((foto, i) => {
            const esUltima = i === secundarias.length - 1 && restantes > 0;
            return (
              <button
                key={foto.src}
                type="button"
                onClick={() => abrir(i + 1)}
                className="group/foto relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Image
                  src={foto.src}
                  alt={`${titulo} — ${foto.categoria}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover/foto:scale-105"
                />
                {esUltima && (
                  <span className="absolute inset-0 flex items-center justify-center bg-brand-ink/65 font-label text-h3 font-bold text-white">
                    +{restantes}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="max-w-[min(96vw,1200px)] gap-0 overflow-hidden p-0 sm:max-w-[min(96vw,1200px)]">
          <DialogTitle className="sr-only">
            {titulo} — fotografía {indice + 1} de {fotos.length}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Usa las flechas del teclado para moverte entre las fotografías.
          </DialogDescription>

          <div className="relative aspect-[4/3] w-full bg-brand-ink md:aspect-[16/9]">
            <Image
              src={fotos[indice].src}
              alt={`${titulo} — ${fotos[indice].categoria}`}
              fill
              sizes="96vw"
              className="object-contain"
            />

            {fotos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Foto anterior"
                  onClick={() => ir(-1)}
                  className="absolute top-1/2 left-3 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-4xl bg-brand-ink/60 text-white backdrop-blur-sm transition-colors hover:bg-brand-aqua hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-neon"
                >
                  <ChevronLeft aria-hidden className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Foto siguiente"
                  onClick={() => ir(1)}
                  className="absolute top-1/2 right-3 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-4xl bg-brand-ink/60 text-white backdrop-blur-sm transition-colors hover:bg-brand-aqua hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-neon"
                >
                  <ChevronRight aria-hidden className="size-5" />
                </button>
              </>
            )}

            <span className="absolute bottom-3 left-3 rounded-4xl bg-brand-ink/70 px-3 py-1.5 font-label text-caption text-white backdrop-blur-sm">
              {fotos[indice].categoria} · {indice + 1}/{fotos.length}
            </span>
          </div>

          {fotos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto bg-card p-3 scrollbar-minimal">
              {fotos.map((foto, i) => (
                <button
                  key={foto.src}
                  type="button"
                  onClick={() => setIndice(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-current={i === indice}
                  className={cn(
                    "relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-sm transition-all",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    i === indice
                      ? "ring-2 ring-brand-petrol"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={foto.src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
