import { NextResponse } from "next/server";
import { PREESTUDIO_ENDPOINTS } from "@/lib/api/preestudio";
import { DEMO_MODE, PREESTUDIO_ORIGIN } from "@/lib/env";

/**
 * Proxy server-a-servidor para el cotizador (método MENSUALIDADES).
 *
 * POR QUÉ EXISTE:
 *  - CORS: el webservice SEMINUEVOS no manda Access-Control-Allow-Origin, así
 *    que el navegador bloquea el fetch directo. Servidor-a-servidor no lo sufre.
 *  - Token: MENSUALIDADES exige Authorization: Bearer. El token es SECRETO y
 *    vive sólo en el servidor (PREESTUDIO_TOKEN, sin prefijo NEXT_PUBLIC_).
 *  - Formato: el webservice recibe el JSON envuelto en base64 dentro de
 *    { "Content": "<bs64>" } y responde en base64. Ese armado queda aquí.
 *
 * SEGURIDAD: la URL de destino está fijada (PREESTUDIO_ORIGIN + ruta constante).
 * El cliente no elige a dónde se conecta el servidor (evita SSRF). Sólo se
 * reenvían los tres campos numéricos del cuerpo.
 */

export const dynamic = "force-dynamic";

type Body = {
  numeroRentas?: unknown;
  montoCapitalTotal?: unknown;
  montoEnganche?: unknown;
};

/** Convierte a entero positivo o null. */
function entero(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

/** Decodifica la respuesta: viene en base64; si ya es JSON plano, se parsea igual. */
function parseRespuesta(texto: string): unknown {
  const intento = (s: string) => {
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };
  // Primero como JSON directo (algunos entornos ya lo devuelven plano).
  const directo = intento(texto);
  if (directo !== undefined) return directo;
  // Si no, base64 -> texto -> JSON.
  try {
    return intento(Buffer.from(texto, "base64").toString("utf8"));
  } catch {
    return undefined;
  }
}

/**
 * Cotización SIMULADA para DEMO_MODE: no pega al webservice interno (que exige
 * VPN + token). Escala el caso de referencia del sitio real
 * (valor 440000, enganche 88000, 6 meses -> $74,313.61) por monto financiado y
 * por plazo, así la tabla y la calculadora dan cifras plausibles y distintas.
 */
function fakeCotizacion(numeroRentas: number, valor: number, enganche: number) {
  const REF_PAGO = 74313.61;
  const REF_FINANCIADO = 352000;
  const REF_MESES = 6;
  const financiado = valor - enganche;
  const pagoMensual =
    Math.round(
      REF_PAGO *
        (financiado / REF_FINANCIADO) *
        (REF_MESES / numeroRentas) *
        100
    ) / 100;

  return {
    numeroRentas,
    pagoMensual,
    totalAPagar: Math.round((enganche + pagoMensual * numeroRentas) * 100) / 100,
  };
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const numero_rentas = entero(body.numeroRentas);
  const monto_capital_total = entero(body.montoCapitalTotal);
  const monto_enganche = entero(body.montoEnganche);

  if (!numero_rentas || !monto_capital_total || monto_enganche == null) {
    return NextResponse.json(
      { error: "Faltan datos: plazo, valor del auto o enganche." },
      { status: 400 }
    );
  }
  if (monto_enganche >= monto_capital_total) {
    return NextResponse.json(
      { error: "El enganche debe ser menor al valor del auto." },
      { status: 400 }
    );
  }

  // DEMO: se responde una cotización simulada, sin token ni red interna.
  if (DEMO_MODE) {
    return NextResponse.json(
      fakeCotizacion(numero_rentas, monto_capital_total, monto_enganche)
    );
  }

  if (!PREESTUDIO_ORIGIN) {
    return NextResponse.json(
      { error: "El webservice de financiamiento no está configurado." },
      { status: 500 }
    );
  }

  const token = process.env.PREESTUDIO_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Cotizador no disponible: falta PREESTUDIO_TOKEN en el servidor.",
      },
      { status: 503 }
    );
  }

  const inner = { numero_rentas, monto_capital_total, monto_enganche };
  const Content = Buffer.from(JSON.stringify(inner)).toString("base64");
  const upstream = `${PREESTUDIO_ORIGIN}${PREESTUDIO_ENDPOINTS.precotizacion.mensualidades}`;

  try {
    const res = await fetch(upstream, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ Content }),
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `El webservice respondió ${res.status}.` },
        { status: res.status === 403 ? 502 : res.status }
      );
    }

    const data = parseRespuesta(await res.text()) as
      | {
          Status?: number;
          Body?: string;
          Cotizacion?: Array<{ pago_mensual_total?: number }>;
          Total_Mensualidades?: { total_a_pagar?: number };
        }
      | undefined;

    if (data?.Status !== 1) {
      return NextResponse.json(
        { error: data?.Body || "El webservice rechazó la cotización." },
        { status: 502 }
      );
    }

    const pagoMensual = data.Cotizacion?.[0]?.pago_mensual_total;
    const totalAPagar = data.Total_Mensualidades?.total_a_pagar;

    if (typeof pagoMensual !== "number") {
      return NextResponse.json(
        { error: "Respuesta sin pago mensual." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      numeroRentas: numero_rentas,
      pagoMensual,
      totalAPagar: typeof totalAPagar === "number" ? totalAPagar : null,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "El webservice tardó demasiado en responder."
          : "No se pudo contactar al webservice de financiamiento.",
      },
      { status: 504 }
    );
  }
}
