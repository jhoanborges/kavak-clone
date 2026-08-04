import { NextResponse } from "next/server";

import {
  RECAPTCHA_ACCIONES,
  RECAPTCHA_UMBRAL,
  type VerificacionRecaptcha,
} from "@/lib/recaptcha";

/**
 * Verificación de reCAPTCHA v3 contra Google.
 *
 * Corre EN SERVIDOR obligatoriamente. La verificación necesita el secreto, y
 * cualquier comprobación hecha en el navegador se salta editando el JavaScript.
 *
 * Nunca se devuelve el secreto ni la respuesta cruda de Google: sólo si pasó,
 * el score y, en desarrollo, los códigos de error. Filtrar los detalles de
 * Google le diría a un atacante exactamente qué ajustar.
 */

/** Nunca cachear: cada token es de un solo uso. */
export const dynamic = "force-dynamic";

const ACCIONES_VALIDAS = new Set<string>(Object.values(RECAPTCHA_ACCIONES));

export async function POST(request: Request) {
  const habilitado = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";
  const secreto = process.env.RECAPTCHA_SECRET_KEY ?? "";

  let body: { token?: unknown; accion?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<VerificacionRecaptcha>(
      { ok: false, error: "Petición inválida." },
      { status: 400 }
    );
  }

  const accion = typeof body.accion === "string" ? body.accion : "";
  if (!ACCIONES_VALIDAS.has(accion)) {
    return NextResponse.json<VerificacionRecaptcha>(
      { ok: false, error: "Acción no reconocida." },
      { status: 400 }
    );
  }

  // Apagado: se deja pasar de forma EXPLÍCITA, marcándolo. Así el cliente
  // distingue "no se comprobó" de "se comprobó y pasó", y los logs no dan a
  // entender que hubo verificación.
  if (!habilitado) {
    return NextResponse.json<VerificacionRecaptcha>({
      ok: true,
      score: null,
      omitido: true,
    });
  }

  if (!secreto) {
    // Encendido pero sin clave: se rechaza. Dejar pasar aquí convertiría un
    // error de configuración en un agujero silencioso.
    console.error(
      "[recaptcha] NEXT_PUBLIC_RECAPTCHA_ENABLED=true pero falta RECAPTCHA_SECRET_KEY."
    );
    return NextResponse.json<VerificacionRecaptcha>(
      { ok: false, error: "La verificación no está disponible." },
      { status: 503 }
    );
  }

  const token = typeof body.token === "string" ? body.token : "";
  if (!token) {
    return NextResponse.json<VerificacionRecaptcha>(
      { ok: false, error: "Falta el token de verificación." },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({ secret: secreto, response: token });

    // La IP ayuda a Google a puntuar, pero sólo se envía si viene de una
    // cabecera que el proxy realmente controla.
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    if (ip) params.set("remoteip", ip);

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return NextResponse.json<VerificacionRecaptcha>(
        {
          ok: false,
          error:
            process.env.NODE_ENV === "production"
              ? "No pudimos verificar que eres una persona."
              : `reCAPTCHA rechazó el token: ${(data["error-codes"] ?? []).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // La acción DEBE coincidir. Sin esta comprobación, un token obtenido en un
    // formulario cualquiera valdría para otro.
    if (data.action && data.action !== accion) {
      return NextResponse.json<VerificacionRecaptcha>(
        { ok: false, error: "La verificación no corresponde a este formulario." },
        { status: 400 }
      );
    }

    const score = typeof data.score === "number" ? data.score : 0;
    if (score < RECAPTCHA_UMBRAL) {
      return NextResponse.json<VerificacionRecaptcha>(
        { ok: false, error: "No pudimos verificar que eres una persona." },
        { status: 403 }
      );
    }

    return NextResponse.json<VerificacionRecaptcha>({ ok: true, score });
  } catch (error) {
    const expiró = error instanceof Error && error.name === "TimeoutError";
    console.error("[recaptcha] fallo al verificar:", expiró ? "timeout" : error);
    return NextResponse.json<VerificacionRecaptcha>(
      { ok: false, error: "No pudimos completar la verificación." },
      { status: 502 }
    );
  }
}
