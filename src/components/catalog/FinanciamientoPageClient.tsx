"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertCircle, Loader2 } from "lucide-react";

import { FinanciamientoStepper } from "@/components/catalog/FinanciamientoFlow";
import { cotizar, type CotizacionResultado } from "@/lib/api/financiamiento";
import { saveFinanciamiento } from "@/redux/slices/financiamientoSlice";
import type { AppDispatch, RootState } from "@/redux/store";

type Vehiculo = {
  id: string;
  marca: string;
  modelo: string;
  anio: number | null;
  color: string;
  precio: number | null;
};

type Props = {
  vehiculo: Vehiculo;
  valorAuto: number;
  enganche: number;
  plazo: number;
};

/**
 * Recalcula el financiamiento al cargar la vista compartible (los inputs vienen
 * de la URL). Usa la caché de Redux como valor inicial para evitar parpadeo al
 * navegar internamente, pero SIEMPRE recotiza porque el link pudo abrirse en
 * frío. En demo la respuesta es simulada (instantánea).
 */
export function FinanciamientoPageClient({
  vehiculo,
  valorAuto,
  enganche,
  plazo,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const cache = useSelector((s: RootState) => s.financiamiento.byId[vehiculo.id]);
  const [resultado, setResultado] = React.useState<CotizacionResultado | null>(
    cache?.cotizacion ?? null
  );
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelado = false;
    cotizar({ numeroRentas: plazo, montoCapitalTotal: valorAuto, montoEnganche: enganche })
      .then((r) => {
        if (cancelado) return;
        setResultado(r);
        dispatch(
          saveFinanciamiento({ id: vehiculo.id, vehiculo, enganche, cotizacion: r })
        );
      })
      .catch((e) => {
        if (!cancelado)
          setError(e instanceof Error ? e.message : "No se pudo calcular el financiamiento.");
      });
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valorAuto, enganche, plazo, vehiculo.id]);

  if (error) {
    return (
      <div
        role="alert"
        className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-body-2 text-destructive"
      >
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-16 text-body-2 text-ink-600">
        <Loader2 className="size-5 animate-spin text-primary" />
        Calculando tu financiamiento...
      </div>
    );
  }

  return (
    <FinanciamientoStepper
      valorAuto={valorAuto}
      enganche={enganche}
      plazo={plazo}
      resultado={resultado}
      vehiculo={{
        id: vehiculo.id,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        anio: vehiculo.anio,
        color: vehiculo.color,
      }}
    />
  );
}
