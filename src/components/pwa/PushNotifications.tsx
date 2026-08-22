"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Interruptor de notificaciones push (PWA). Registra el service worker, suscribe
 * el navegador con la clave VAPID pública y manda la suscripción al backend vía
 * /api/push/subscribe (arquitectura B: el backend guarda y envía).
 *
 * iOS: las push SOLO funcionan con la app instalada en pantalla de inicio
 * (iOS 16.4+). Si el usuario está en Safari sin instalar, mostramos el paso a
 * seguir en lugar del interruptor.
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

/** La clave VAPID viaja en base64url; PushManager la pide como Uint8Array. */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  // Respaldo explícito en ArrayBuffer (no SharedArrayBuffer) para que el tipo
  // encaje con applicationServerKey (BufferSource).
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function esIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !("MSStream" in window)
  );
}

function esStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS marca la PWA instalada con navigator.standalone (no estándar).
    ("standalone" in navigator &&
      (navigator as { standalone?: boolean }).standalone === true)
  );
}

type Estado = "cargando" | "no-soportado" | "ios-instalar" | "listo" | "sin-config";

export default function PushNotifications() {
  const [estado, setEstado] = useState<Estado>("cargando");
  const [suscrito, setSuscrito] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const soporta =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    if (!soporta) {
      // iOS solo soporta push tras instalar: distínguelo del "no soportado".
      setEstado(esIOS() && !esStandalone() ? "ios-instalar" : "no-soportado");
      return;
    }
    if (!VAPID_PUBLIC_KEY) {
      setEstado("sin-config");
      return;
    }

    let cancelado = false;
    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        const sub = await reg.pushManager.getSubscription();
        if (cancelado) return;
        setSuscrito(sub !== null);
        setEstado("listo");
      } catch {
        if (!cancelado) setEstado("no-soportado");
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  const suscribir = useCallback(async () => {
    setError(null);
    setOcupado(true);
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") {
        setError("Permiso de notificaciones denegado.");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY as string),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      if (!res.ok) {
        // El backend rechazó: deshaz la suscripción del navegador para no
        // quedar suscrito sin que nadie pueda enviarte.
        await sub.unsubscribe();
        const { error: msg } = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(msg || "No se pudo activar las notificaciones.");
        return;
      }
      setSuscrito(true);
    } catch {
      setError("No se pudo activar las notificaciones.");
    } finally {
      setOcupado(false);
    }
  }, []);

  const desuscribir = useCallback(async () => {
    setError(null);
    setOcupado(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
      }
      setSuscrito(false);
    } catch {
      setError("No se pudo desactivar las notificaciones.");
    } finally {
      setOcupado(false);
    }
  }, []);

  const descripcion = (() => {
    switch (estado) {
      case "ios-instalar":
        return 'En iPhone: toca Compartir y "Añadir a inicio" para recibir avisos.';
      case "no-soportado":
        return "Tu navegador no admite notificaciones push.";
      case "sin-config":
        return "Notificaciones no configuradas en este entorno.";
      default:
        return "Avisos de citas, bajadas de precio y novedades.";
    }
  })();

  const interactivo = estado === "listo";

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-body-2 font-medium text-foreground">
          Notificaciones push
        </p>
        <p className="text-caption text-ink-600">{descripcion}</p>
        {error && (
          <p className="mt-1 text-caption text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      {interactivo ? (
        <button
          type="button"
          role="switch"
          aria-checked={suscrito}
          aria-label="Notificaciones push"
          disabled={ocupado}
          onClick={suscrito ? desuscribir : suscribir}
          className={cn(
            "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60",
            suscrito ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 flex size-5 items-center justify-center rounded-full bg-background transition-transform",
              suscrito && "translate-x-5"
            )}
          >
            {ocupado && (
              <Loader2 className="size-3 animate-spin text-ink-600" />
            )}
            {!ocupado && suscrito && (
              <Check className="size-3 text-primary" />
            )}
          </span>
        </button>
      ) : (
        <span className="shrink-0 text-caption text-ink-500">
          {estado === "cargando" ? "…" : "No disponible"}
        </span>
      )}
    </div>
  );
}
