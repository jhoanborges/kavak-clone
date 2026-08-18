import { AlertTriangle, SearchX } from "lucide-react";

/**
 * Estados no-felices del catálogo.
 *
 * Existen como componente propio porque el contrato de la API está sin
 * verificar: si los nombres de campo no coinciden, la lista llega vacía y esto
 * lo dice en pantalla en vez de dejar un hueco silencioso que parezca "no hay
 * inventario".
 */

export function VehiculosError({ error }: { error: Error }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-14 text-center"
    >
      <AlertTriangle aria-hidden className="size-8 text-primary" />
      <p className="font-heading text-h4 font-medium">
        No pudimos cargar el inventario
      </p>
      <p className="max-w-[420px] text-body-2 text-ink-800">
        Vuelve a intentarlo en unos momentos. Si el problema sigue,
        escríbenos y te ayudamos a encontrar tu auto.
      </p>
      {process.env.NODE_ENV !== "production" && (
        <p className="mt-2 max-w-[520px] font-mono text-caption text-ink-600">
          {error.message}
        </p>
      )}
    </div>
  );
}

export function VehiculosVacio({ busqueda }: { busqueda?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-14 text-center">
      <SearchX aria-hidden className="size-8 text-ink-500" />
      <p className="font-heading text-h4 font-medium">
        {busqueda ? `Sin resultados para “${busqueda}”` : "Sin unidades disponibles"}
      </p>
      <p className="max-w-[420px] text-body-2 text-ink-800">
        {busqueda
          ? "Prueba con otra marca o modelo, o revisa el catálogo completo."
          : "En cuanto haya nuevas unidades aparecerán aquí."}
      </p>
    </div>
  );
}

/**
 * Descargo legal de las mensualidades.
 *
 * OBLIGATORIO siempre que se muestre una mensualidad. Publicitar "desde $8,442
 * al mes" sin decir el plazo, el enganche y que está sujeta a aprobación
 * crediticia es publicidad financiera incompleta.
 *
 * Verificado contra la API: `monto_mes` financia el 70% del precio (enganche
 * del 30%) a `meses` plazos, con interés - los pagos suman ~1.35 veces lo
 * financiado. El texto refleja eso.
 */
export function VehiculosDisclaimer({ meses = 36 }: { meses?: number }) {
  return (
    <p className="mt-8 text-caption text-ink-600">
      *Las mensualidades están calculadas a un plazo de {meses} meses con un
      enganche del 30%. Crédito sujeto a aprobación de buró de crédito.
    </p>
  );
}
