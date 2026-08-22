import { NextResponse } from "next/server";

import { PUSH_BACKEND_ORIGIN } from "@/lib/env";

/**
 * Alta de una suscripción push. El cliente manda su PushSubscription; este proxy
 * la reenvía al backend (que la guarda y luego enviará las push con web-push).
 *
 * Arquitectura B: Next NO almacena nada ni tiene la clave VAPID privada. Solo
 * traslada la suscripción al backend autenticándose con PUSH_BACKEND_TOKEN, que
 * nunca viaja al navegador.
 *
 * Contrato con el backend: POST {PUSH_BACKEND_URL}/subscriptions
 *   body: { subscription: PushSubscription, endpoint: string }
 */

export const dynamic = "force-dynamic";

type Body = { subscription?: unknown };

function endpointDe(sub: unknown): string | null {
  if (sub && typeof sub === "object" && "endpoint" in sub) {
    const ep = (sub as { endpoint?: unknown }).endpoint;
    if (typeof ep === "string" && ep.startsWith("https://")) return ep;
  }
  return null;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const endpoint = endpointDe(body.subscription);
  if (!endpoint) {
    return NextResponse.json(
      { error: "Suscripción inválida." },
      { status: 400 }
    );
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
    const res = await fetch(`${PUSH_BACKEND_ORIGIN}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ subscription: body.subscription, endpoint }),
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
