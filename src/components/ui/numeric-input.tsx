"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

/**
 * Input numérico con formato mexicano (es-MX): coma para miles, punto para
 * decimales. Formatea EN VIVO mientras se escribe y entrega al padre el valor
 * numérico limpio vía `onValueChange`, no la cadena con comas.
 *
 * Es el input a usar para cualquier cifra de la app (precios, enganches, etc.):
 * centraliza el formato para que todos los campos se vean y se parseen igual.
 */

/** Agrupa la parte entera de miles con coma. */
const agruparMiles = (entero: string) =>
  entero.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** Formatea un número ya conocido, sin forzar decimales (88000 -> "88,000"). */
function formatearNumero(n: number, maxDecimales: number): string {
  return n.toLocaleString("es-MX", { maximumFractionDigits: maxDecimales });
}

/**
 * Interpreta lo tecleado: descarta todo lo que no sea dígito o punto, respeta
 * un solo punto decimal y agrupa los miles. Devuelve el texto ya formateado y
 * el número correspondiente (undefined si queda vacío).
 */
function interpretar(
  crudo: string,
  maxDecimales: number
): { display: string; value: number | undefined } {
  let s = crudo.replace(/[^\d.]/g, "");

  // Un solo punto: el primero manda, el resto se descarta.
  const primerPunto = s.indexOf(".");
  if (primerPunto !== -1) {
    s =
      s.slice(0, primerPunto + 1) +
      s.slice(primerPunto + 1).replace(/\./g, "");
  }

  if (s === "") return { display: "", value: undefined };

  const tienePunto = s.includes(".");
  const [enteroRaw = "", decRaw = ""] = s.split(".");
  const entero = enteroRaw.replace(/^0+(?=\d)/, ""); // sin ceros a la izquierda
  const dec = decRaw.slice(0, maxDecimales);

  const enteroFmt = entero === "" ? (tienePunto ? "0" : "") : agruparMiles(entero);
  const display = enteroFmt + (tienePunto ? `.${dec}` : "");

  const value = Number(`${entero || "0"}${dec ? `.${dec}` : ""}`);
  return { display, value: Number.isFinite(value) ? value : undefined };
}

type Props = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
> & {
  value: number | undefined;
  onValueChange: (value: number | undefined) => void;
  /** Máximo de decimales admitidos. Por defecto 2. */
  maxDecimals?: number;
};

export function NumericInput({
  value,
  onValueChange,
  maxDecimals = 2,
  ...props
}: Props) {
  const [display, setDisplay] = React.useState(() =>
    value == null ? "" : formatearNumero(value, maxDecimals)
  );

  // Si el valor cambia desde fuera (reset, cálculo, etc.) y no coincide con lo
  // mostrado, se reformatea. Al teclear no se dispara: el número ya coincide.
  React.useEffect(() => {
    const mostrado = interpretar(display, maxDecimals).value;
    if (value !== mostrado) {
      setDisplay(value == null ? "" : formatearNumero(value, maxDecimals));
    }
    // display se deriva de value; no debe reejecutar por sí mismo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, maxDecimals]);

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={display}
      onChange={(e) => {
        const { display: d, value: v } = interpretar(e.target.value, maxDecimals);
        setDisplay(d);
        onValueChange(v);
      }}
    />
  );
}
