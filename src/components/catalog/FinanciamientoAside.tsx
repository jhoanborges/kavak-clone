"use client";

import * as React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { ArrowRight, Calculator, Coins, MessageCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfettiBurst } from "@/components/ui/confetti-burst";
import { NumericInput } from "@/components/ui/numeric-input";
import { saveFinanciamiento } from "@/redux/slices/financiamientoSlice";
import type { AppDispatch } from "@/redux/store";
import { cn } from "@/lib/utils";
import {
  AYUDA,
  CAMPO,
  CAMPO_SELECT,
  CAMPO_STACK,
  ETIQUETA,
  ERROR as ERROR_TXT,
} from "@/lib/form-styles";
import {
  cotizar,
  ENGANCHE_TABLA_PCT,
  pesos,
  pesosDecimal,
  PLAZOS_MESES,
  type CotizacionResultado,
} from "@/lib/api/financiamiento";
import { CONTACT, whatsappHref } from "@/lib/site";

type FilaTabla =
  | { plazo: number; estado: "cargando" }
  | { plazo: number; estado: "ok"; pago: number }
  | { plazo: number; estado: "error" };

type Props = {
  precio: number | null;
  titulo: string;
  vehiculoId: string;
  /** Slug actual, para armar el link a la vista compartible de financiamiento. */
  slug: string;
  /** Datos del vehículo para el embudo de pre-estudio (objeto PROSPECTO). */
  vehiculo: { marca: string; modelo: string; anio: number | null; color: string };
};

/**
 * Cotizador rápido de financiamiento (método MENSUALIDADES del webservice
 * SEMINUEVOS, vía /api/financiamiento).
 *
 * Dos partes:
 *  - Tabla comparativa: un pago mensual por plazo, con enganche fijo del 30%.
 *  - Calculadora: el usuario mete su enganche y plazo y cotiza a la medida.
 *
 * NO inventa tasas: cada cifra viene del webservice. Si el cotizador no está
 * disponible (falta token, red interna, etc.) lo dice, no rellena con números
 * falsos: es un producto financiero.
 */
export function FinanciamientoAside({
  precio,
  titulo,
  vehiculoId,
  slug,
  vehiculo,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const engancheTabla = precio != null ? Math.round(precio * ENGANCHE_TABLA_PCT) : 0;

  // ── Tabla comparativa ──────────────────────────────────────────────────────
  const [filas, setFilas] = React.useState<FilaTabla[]>(
    PLAZOS_MESES.map((plazo) => ({ plazo, estado: "cargando" }))
  );

  React.useEffect(() => {
    if (precio == null) return;
    const ctrl = new AbortController();

    Promise.all(
      PLAZOS_MESES.map(async (plazo): Promise<FilaTabla> => {
        try {
          const r = await cotizar(
            {
              numeroRentas: plazo,
              montoCapitalTotal: precio,
              montoEnganche: engancheTabla,
            },
            ctrl.signal
          );
          return { plazo, estado: "ok", pago: r.pagoMensual };
        } catch {
          return { plazo, estado: "error" };
        }
      })
    ).then((res) => {
      if (!ctrl.signal.aborted) setFilas(res);
    });

    return () => ctrl.abort();
  }, [precio, engancheTabla]);

  const tablaDisponible = filas.some((f) => f.estado === "ok");
  const tablaCargando = filas.some((f) => f.estado === "cargando");

  // ── Calculadora a la medida ────────────────────────────────────────────────
  const [enganche, setEnganche] = React.useState<number | undefined>(
    precio != null ? Math.round(precio * 0.2) : undefined
  );
  const [plazo, setPlazo] = React.useState<string>("");
  const [calculando, setCalculando] = React.useState(false);
  const [resultado, setResultado] = React.useState<CotizacionResultado | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  // Cambia en cada cotización exitosa para relanzar el confeti (remonta por key).
  const [burstKey, setBurstKey] = React.useState(0);

  const engancheNum = enganche ?? 0;
  const pctEnganche =
    precio && engancheNum > 0 ? (engancheNum / precio) * 100 : 0;

  async function onCalcular(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResultado(null);

    if (precio == null) return;
    if (!plazo) {
      setError("Elige un plazo.");
      return;
    }
    if (!(engancheNum > 0) || engancheNum >= precio) {
      setError("El enganche debe ser mayor a cero y menor al valor del auto.");
      return;
    }

    setCalculando(true);
    try {
      const r = await cotizar({
        numeroRentas: Number(plazo),
        montoCapitalTotal: precio,
        montoEnganche: Math.round(engancheNum),
      });
      setResultado(r);
      setBurstKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cotizar.");
    } finally {
      setCalculando(false);
    }
  }

  const contactoHref = CONTACT.whatsapp
    ? whatsappHref(
        CONTACT.whatsapp,
        `Hola, quiero información de contado del ${titulo} (ID ${vehiculoId}).`
      )
    : "/contacto";

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Cabecera con acento de marca. */}
      <header className="flex items-center gap-3 border-b border-border bg-muted/40 px-6 py-5 md:px-8">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Coins className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-heading text-h4 font-medium leading-tight">
            Financiamiento
          </h2>
          <p className="text-caption text-ink-600">
            Elige plazo y enganche a tu medida.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-6 p-6 md:p-8">
        {/* Valor del auto: dato destacado, no un input. */}
        {precio != null && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/15 bg-primary/5 px-5 py-4">
            <span className="font-label text-label font-medium uppercase tracking-wide text-ink-600">
              Valor del auto
            </span>
            <span className="font-label text-h2 font-bold leading-none tabular-nums text-primary">
              {pesos(precio)}
            </span>
          </div>
        )}

        {/* Tabla comparativa por plazo, enganche 30%. */}
        {precio == null ? (
          <p className={AYUDA}>Sin precio disponible para cotizar.</p>
        ) : (
          <div>
            <p className="mb-2 font-label text-label font-medium text-foreground">
              Pago mensual por plazo
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-body-2">
                <thead>
                  <tr className="bg-muted text-caption uppercase text-ink-600">
                    <th className="px-4 py-2 text-left font-label font-semibold">
                      Meses
                    </th>
                    <th className="px-4 py-2 text-right font-label font-semibold">
                      Pago mensual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f, i) => (
                    <tr
                      key={f.plazo}
                      className={i % 2 ? "bg-muted/40" : "bg-transparent"}
                    >
                      <td className="px-4 py-2.5 tabular-nums">
                        {f.plazo}{" "}
                        <span className="text-caption text-ink-600">meses</span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                        {f.estado === "ok" ? (
                          pesosDecimal(f.pago)
                        ) : f.estado === "cargando" ? (
                          <span className="inline-block h-4 w-20 animate-pulse rounded bg-muted-foreground/20 align-middle" />
                        ) : (
                          <span className="text-ink-600">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`mt-2 ${AYUDA}`}>
              {tablaDisponible || tablaCargando
                ? "*Enganche de 30%, no incluye comisiones ni gastos."
                : "Cotización en línea no disponible por ahora. Contacta a un asesor."}
            </p>
          </div>
        )}

        {/* Calculadora a la medida. */}
        {precio != null && (
          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <h3 className="font-heading text-body-1 font-semibold">
              Calcula el tuyo
            </h3>
            <p className="mt-0.5 mb-4 text-caption text-ink-600">
              Ajusta el enganche y el plazo para tu cotización.
            </p>

            <form onSubmit={onCalcular} className="flex flex-col gap-4">
              <div className={CAMPO_STACK}>
                <label className={ETIQUETA} htmlFor="fin-enganche">
                  Enganche
                </label>
                <div className="relative">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-body-2 font-medium text-ink-600"
                  >
                    $
                  </span>
                  <NumericInput
                    id="fin-enganche"
                    className={cn(CAMPO, "pl-8 bg-card")}
                    value={enganche}
                    onValueChange={setEnganche}
                  />
                </div>
                <p className={AYUDA}>
                  {pctEnganche > 0
                    ? `${pctEnganche.toFixed(2)}% del valor (cubre comisiones y gastos).`
                    : "Cubre comisiones y gastos."}
                </p>
              </div>

              <div className={CAMPO_STACK}>
                <label className={ETIQUETA} htmlFor="fin-plazo">
                  Plazo
                </label>
                <select
                  id="fin-plazo"
                  className={cn(CAMPO_SELECT, "bg-card")}
                  value={plazo}
                  onChange={(e) => setPlazo(e.target.value)}
                  required
                >
                  <option value="">Elegir...</option>
                  {PLAZOS_MESES.map((m) => (
                    <option key={m} value={m}>
                      {m} meses
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className={ERROR_TXT}>{error}</p>}

              <Button
                type="submit"
                variant="petrol"
                size="cta"
                className="w-full"
                disabled={calculando}
              >
                <Calculator data-icon="inline-start" />
                {calculando ? "Calculando..." : "Calcular"}
              </Button>
            </form>

            {resultado && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-brand-aqua/10 p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="size-5" aria-hidden />
                </div>
                <p className="text-body-2 text-ink-600">
                  Tu mensualidad queda en:
                </p>
                <p className="my-1 font-heading text-h1 font-bold leading-none tabular-nums text-primary">
                  ¡{pesosDecimal(resultado.pagoMensual)}!
                </p>
                <p className="text-caption text-ink-600">
                  a {resultado.numeroRentas} meses
                </p>
                <p className="mx-auto mt-3 mb-5 max-w-sm text-body-2 text-ink-600">
                  Te invitamos a ver el detalle de tu cotización y solicitar una
                  preautorización de tu crédito.
                </p>
                <Button variant="petrol" size="cta" asChild>
                  <Link
                    href={`/vehiculos/${slug}/financiamiento?enganche=${engancheNum}&plazo=${resultado.numeroRentas}`}
                    onClick={() =>
                      dispatch(
                        saveFinanciamiento({
                          id: vehiculoId,
                          vehiculo: { id: vehiculoId, precio, ...vehiculo },
                          enganche: engancheNum,
                          cotizacion: resultado,
                        })
                      )
                    }
                  >
                    Ver detalle
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* De contado. */}
        <div className="rounded-xl border border-dashed border-border p-5">
          <h3 className="font-heading text-body-1 font-semibold">
            ¿Lo quieres de contado?
          </h3>
          <p className="mt-0.5 mb-4 text-caption text-ink-600">
            Compra de contado o resuelve dudas con un asesor.
          </p>
          <Button variant="petrol" size="cta" className="w-full" asChild>
            <a
              href={contactoHref}
              target={CONTACT.whatsapp ? "_blank" : undefined}
              rel={CONTACT.whatsapp ? "noopener noreferrer" : undefined}
            >
              <MessageCircle data-icon="inline-start" />
              ¡Sí quiero contactar!
            </a>
          </Button>
        </div>
      </div>

      {/* Confeti al cotizar (se relanza por key en cada cálculo). */}
      {burstKey > 0 && <ConfettiBurst key={burstKey} />}
    </section>
  );
}
