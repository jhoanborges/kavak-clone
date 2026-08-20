import { NextResponse } from "next/server";

import { PREESTUDIO_ENDPOINTS } from "@/lib/api/preestudio";
import { fakePreestudio } from "@/lib/api/preestudio-fakes";
import { DEMO_MODE, PREESTUDIO_ORIGIN } from "@/lib/env";

/**
 * Proxy genérico del webservice pre-estudio / BC.
 *
 * Un solo handler para todos los métodos (catálogos, RFC/CURP, prospecto, buró,
 * documentos). Centraliza lo repetitivo de la doc:
 *  - CORS: servidor-a-servidor, el navegador no lo bloquea.
 *  - Token: Authorization Bearer desde PREESTUDIO_TOKEN (secreto, solo servidor).
 *  - Formato: envuelve el payload en base64 dentro de { Content } y decodifica
 *    la respuesta (que viene en base64).
 *  - DEMO: responde datos simulados sin red ni token.
 *
 * SEGURIDAD: el destino sale de una ALLOWLIST (ENDPOINTS), el cliente solo manda
 * una clave de endpoint + payload; no puede elegir URL arbitraria (evita SSRF).
 */

export const dynamic = "force-dynamic";

/** Allowlist: clave del cliente -> ruta real del webservice. */
const ENDPOINTS: Record<string, string> = {
  "catalogos.pais": PREESTUDIO_ENDPOINTS.catalogos.pais,
  "catalogos.estado": PREESTUDIO_ENDPOINTS.catalogos.estado,
  "catalogos.municipio": PREESTUDIO_ENDPOINTS.catalogos.municipio,
  "catalogos.colonia": PREESTUDIO_ENDPOINTS.catalogos.colonia,
  "catalogos.cp": PREESTUDIO_ENDPOINTS.catalogos.cp,
  "precotizacion.generaRfc": PREESTUDIO_ENDPOINTS.precotizacion.generaRfc,
  "precotizacion.generaCurp": PREESTUDIO_ENDPOINTS.precotizacion.generaCurp,
  "precotizacion.prospecto": PREESTUDIO_ENDPOINTS.precotizacion.prospecto,
  "precotizacion.documentosListar": PREESTUDIO_ENDPOINTS.precotizacion.documentosListar,
  "precotizacion.documentosSubir": PREESTUDIO_ENDPOINTS.precotizacion.documentosSubir,
  "buro.autorizacion": PREESTUDIO_ENDPOINTS.buro.autorizacion,
  "buro.consulta": PREESTUDIO_ENDPOINTS.buro.consulta,
};

type Body = { endpoint?: unknown; payload?: unknown };

/** Decodifica la respuesta: base64 -> JSON, o JSON plano si ya viene así. */
function parseRespuesta(texto: string): unknown {
  const intento = (s: string) => {
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };
  const directo = intento(texto);
  if (directo !== undefined) return directo;
  try {
    return intento(Buffer.from(texto, "base64").toString("utf8"));
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const endpoint = String(body.endpoint ?? "");
  const path = ENDPOINTS[endpoint];
  if (!path) {
    return NextResponse.json(
      { error: `Endpoint no permitido: ${endpoint}` },
      { status: 400 }
    );
  }

  const payload =
    body.payload && typeof body.payload === "object" ? body.payload : {};

  // DEMO: respuesta simulada, sin token ni red interna.
  if (DEMO_MODE) {
    return NextResponse.json(fakePreestudio(endpoint, payload as Record<string, unknown>));
  }

  if (!PREESTUDIO_ORIGIN) {
    return NextResponse.json(
      { error: "El webservice de pre-estudio no está configurado." },
      { status: 500 }
    );
  }

  const token = process.env.PREESTUDIO_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Servicio no disponible: falta PREESTUDIO_TOKEN en el servidor." },
      { status: 503 }
    );
  }

  const Content = Buffer.from(JSON.stringify(payload)).toString("base64");

  try {
    const res = await fetch(`${PREESTUDIO_ORIGIN}${path}`, {
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

    const data = parseRespuesta(await res.text());
    if (data == null || typeof data !== "object") {
      return NextResponse.json(
        { error: "Respuesta ilegible del webservice." },
        { status: 502 }
      );
    }

    // Se reenvía tal cual (incluye Status 0/1 y Body con el mensaje de error de
    // negocio). El cliente decide cómo mostrarlo.
    return NextResponse.json(data);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "El webservice tardó demasiado en responder."
          : "No se pudo contactar al webservice de pre-estudio.",
      },
      { status: 504 }
    );
  }
}
