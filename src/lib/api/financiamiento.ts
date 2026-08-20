/**
 * Cotizador rápido de financiamiento.
 *
 * Consume el método MENSUALIDADES del webservice SEMINUEVOS
 * (POST /PRECOTIZACION/MENSUALIDADES, ver src/lib/api/preestudio.ts) a través
 * de nuestro proxy server-a-servidor /api/financiamiento, que envuelve el
 * cuerpo en base64 y adjunta el token Bearer. El navegador NO habla directo con
 * el webservice: no manda CORS y el token no debe salir al cliente.
 */

/** Plazos que ofrece el cotizador, en meses (numero_rentas). */
export const PLAZOS_MESES = [6, 12, 18, 24, 36] as const;

/** Enganche por defecto de la TABLA comparativa: 30% del valor. */
export const ENGANCHE_TABLA_PCT = 0.3;

/** Lo que el proxy espera del cliente. */
export type CotizacionInput = {
  /** Plazo en meses. */
  numeroRentas: number;
  /** Valor del auto (monto_capital_total). */
  montoCapitalTotal: number;
  /** Enganche en pesos (monto_enganche). */
  montoEnganche: number;
};

/** Resultado ya normalizado de una cotización. */
export type CotizacionResultado = {
  numeroRentas: number;
  /** Pago mensual con IVA (Cotizacion[0].pago_mensual_total). */
  pagoMensual: number;
  /** Total a pagar del plan (Total_Mensualidades.total_a_pagar). */
  totalAPagar: number;
};

/** Formatea a pesos MXN enteros. */
export const pesos = (n: number | null | undefined) =>
  n == null ? "-" : `$${Math.round(n).toLocaleString("es-MX")}`;

/** Formatea a pesos con dos decimales (para el pago mensual). */
export const pesosDecimal = (n: number | null | undefined) =>
  n == null
    ? "-"
    : `$${n.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

/**
 * Pide una cotización al proxy. Lanza en error para que el llamador muestre el
 * estado. La firma (una entrada -> un resultado) refleja que MENSUALIDADES sólo
 * cotiza un plazo por llamada; la tabla hace varias en paralelo.
 */
export async function cotizar(
  input: CotizacionInput,
  signal?: AbortSignal
): Promise<CotizacionResultado> {
  const res = await fetch("/api/financiamiento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  const data = (await res.json().catch(() => ({}))) as
    | CotizacionResultado
    | { error?: string };

  if (!res.ok || !("pagoMensual" in data)) {
    const msg =
      "error" in data && data.error
        ? data.error
        : `El cotizador respondió ${res.status}.`;
    throw new Error(msg);
  }

  return data;
}
