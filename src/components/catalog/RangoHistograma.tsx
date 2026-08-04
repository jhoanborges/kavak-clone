"use client";

import { useEffect, useMemo, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const BARRAS = 28;

/**
 * Rango con histograma de la distribución real, al estilo del filtro de precios
 * de Airbnb.
 *
 * Las barras salen de los precios (o kilometrajes) que devuelve la API para el
 * contexto actual: si ya filtraste por Audi, la distribución es la de los Audi.
 * NO se recalculan al mover el control — si se aplicase el propio rango, las
 * barras desaparecerían bajo el cursor mientras arrastras.
 *
 * Las barras dentro del rango van en petróleo y las de fuera en gris, así que
 * el efecto del filtro se ve antes de soltar.
 */
export function RangoHistograma({
  valores,
  min,
  max,
  step,
  format,
  parse,
  desde,
  hasta,
  onCommit,
  etiquetaMin = "Mínimo",
  etiquetaMax = "Máximo",
}: {
  valores: number[];
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  parse: (s: string) => number;
  desde?: string;
  hasta?: string;
  onCommit: (min: number, max: number) => void;
  etiquetaMin?: string;
  etiquetaMax?: string;
}) {
  const inicial: [number, number] = [
    desde ? Number(desde) : min,
    hasta ? Number(hasta) : max,
  ];
  const [valor, setValor] = useState<[number, number]>(inicial);
  const [editando, setEditando] = useState<"min" | "max" | null>(null);
  const [borrador, setBorrador] = useState("");

  // Resincroniza cuando la URL cambia por fuera: chip eliminado, "Limpiar",
  // botón atrás.
  useEffect(() => {
    setValor([desde ? Number(desde) : min, hasta ? Number(hasta) : max]);
  }, [desde, hasta, min, max]);

  const barras = useMemo(() => {
    if (valores.length === 0) return [];
    const ancho = (max - min) / BARRAS;
    const cubos = new Array<number>(BARRAS).fill(0);
    for (const v of valores) {
      const i = Math.min(Math.floor((v - min) / ancho), BARRAS - 1);
      if (i >= 0) cubos[i] += 1;
    }
    const tope = Math.max(...cubos, 1);
    return cubos.map((n, i) => ({
      // Altura mínima visible para los cubos con 1 unidad: a 2px se pierden.
      alto: n === 0 ? 0 : Math.max((n / tope) * 100, 12),
      inicio: min + i * ancho,
      fin: min + (i + 1) * ancho,
      total: n,
    }));
  }, [valores, min, max]);

  const commit = (nuevo: [number, number]) => {
    const lo = Math.max(min, Math.min(nuevo[0], nuevo[1]));
    const hi = Math.min(max, Math.max(nuevo[0], nuevo[1]));
    setValor([lo, hi]);
    onCommit(lo, hi);
  };

  const campo = (cual: "min" | "max") => {
    const actual = cual === "min" ? valor[0] : valor[1];
    const enEdicion = editando === cual;

    return (
      <label className="flex flex-1 flex-col gap-1">
        <span className="text-caption text-ink-600">
          {cual === "min" ? etiquetaMin : etiquetaMax}
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={enEdicion ? borrador : format(actual)}
          onFocus={() => {
            setEditando(cual);
            setBorrador(String(actual));
          }}
          onChange={(e) => setBorrador(e.target.value)}
          onBlur={() => {
            const n = parse(borrador);
            setEditando(null);
            if (Number.isFinite(n)) {
              commit(cual === "min" ? [n, valor[1]] : [valor[0], n]);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setEditando(null);
              e.currentTarget.blur();
            }
          }}
          className="w-full rounded-4xl border border-border bg-card px-4 py-2.5 text-center text-body-2 tabular-nums outline-none transition-colors focus-visible:border-brand-petrol focus-visible:ring-2 focus-visible:ring-brand-aqua"
        />
      </label>
    );
  };

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="relative px-1.5">
        {/* Decorativo: la misma información está en los dos campos de texto,
            que sí son accesibles y editables. */}
        <div
          aria-hidden
          className="flex h-16 items-end gap-[2px]"
        >
          {barras.map((b) => {
            const dentro = b.fin > valor[0] && b.inicio < valor[1];
            return (
              <span
                key={b.inicio}
                style={{ height: `${b.alto}%` }}
                className={cn(
                  "flex-1 rounded-t-[2px] transition-colors",
                  b.total === 0
                    ? "bg-transparent"
                    : dentro
                      ? "bg-brand-petrol"
                      : "bg-ink-400"
                )}
              />
            );
          })}
        </div>

        <Slider
          min={min}
          max={max}
          step={step}
          value={valor}
          onValueChange={(v) => setValor([v[0] ?? min, v[1] ?? max])}
          onValueCommit={(v) => commit([v[0] ?? min, v[1] ?? max])}
          className="mt-1"
        />
      </div>

      <div className="flex items-end gap-3">
        {campo("min")}
        <span aria-hidden className="pb-2.5 text-ink-500">
          –
        </span>
        {campo("max")}
      </div>
    </div>
  );
}
