import { NextResponse } from "next/server";

import { PUSH_BACKEND_ORIGIN } from "@/lib/env";

/**
 * Baja de una suscripción push. El cliente ya llamó a `subscription.unsubscribe()`
 * en el navegador; este proxy le dice al backend que la borre de su almacén para
 * no seguir enviando a un endpoint muerto.
 *
 * Contrato con el backend: POST {PUSH_BACKEND_URL}/subscriptions/unsubscribe
 *   body: { endpoint: string }
 */

export const dynamic = "force-dynamic";

type Body = { endpoint?: unknown };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const endpoint =
    typeof body.endpoint === "string" && body.endpoint.startsWith("https://")
      ? body.endpoint
      : null;
  if (!endpoint) {
    return NextResponse.json({ error: "Endpoint inválido." }, { status: 400 });
  }

  if (!PUSH_BACKEND_ORIGIN) {
    return NextResponse.json(
      { error: "El servicio de notificaciones no está configurado." },
      { status: 503 }
    );
  }

  const token = process.env.PUSH_BACKEND_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Servicio no disponible: falta PUSH_BACKEND_TOKEN." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(`${PUSH_BACKEND_ORIGIN}/subscriptions/unsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ endpoint }),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `El backend de push respondió ${res.status}.` },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "El backend de push tardó demasiado."
          : "No se pudo contactar al backend de push.",
      },
      { status: 504 }
    );
  }
}
