/**
 * reCAPTCHA v3 - configuración compartida.
 *
 * REPARTO DE CLAVES, y es importante:
 *  - NEXT_PUBLIC_RECAPTCHA_SITE_KEY es pública por diseño: viaja en el HTML y
 *    Google la espera visible.
 *  - RECAPTCHA_SECRET_KEY es SÓLO DE SERVIDOR. No lleva el prefijo
 *    NEXT_PUBLIC_ a propósito: con él, Next la hornearía en el bundle del
 *    cliente y quedaría publicada. Sólo la lee el route handler.
 *
 * El interruptor RECAPTCHA_ENABLED existe para poder desplegar sin claves. Con
 * él apagado no se carga el script de Google ni se verifica nada; el código
 * queda listo para encenderlo cambiando una variable.
 */

/** Público: decide si el cliente carga el script y pide un token. */
export const RECAPTCHA_ENABLED =
  process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";

export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

/**
 * Umbral de score. v3 devuelve 0.0 (casi seguro un bot) a 1.0 (casi seguro
 * humano); Google recomienda 0.5 como punto de partida.
 */
export const RECAPTCHA_UMBRAL = 0.5;

/** Acciones declaradas. Verificar la acción evita reutilizar un token de otro formulario. */
export const RECAPTCHA_ACCIONES = {
  agendar: "agendar_cita",
  contacto: "enviar_contacto",
} as const;

export type RecaptchaAccion =
  (typeof RECAPTCHA_ACCIONES)[keyof typeof RECAPTCHA_ACCIONES];

export type VerificacionRecaptcha =
  | { ok: true; score: number | null; omitido?: boolean }
  | { ok: false; error: string };

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

let cargando: Promise<void> | null = null;

/** Carga el script de Google una sola vez, bajo demanda. */
function cargarScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha) return Promise.resolve();
  if (cargando) return cargando;

  cargando = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar reCAPTCHA."));
    document.head.appendChild(script);
  });

  return cargando;
}

/**
 * Obtiene un token para la acción indicada.
 *
 * Devuelve `null` cuando reCAPTCHA está desactivado - el llamante lo trata como
 * "sin token" y el servidor decide qué hacer. Nunca inventa un token falso.
 *
 * El script SÓLO se carga aquí, no en el layout: si estuviera en el layout,
 * cada visita al sitio descargaría reCAPTCHA aunque nadie abriera un formulario.
 */
export async function obtenerTokenRecaptcha(
  accion: RecaptchaAccion
): Promise<string | null> {
  if (!RECAPTCHA_ENABLED || !RECAPTCHA_SITE_KEY) return null;

  await cargarScript();
  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) throw new Error("reCAPTCHA no está disponible.");

  return new Promise<string>((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action: accion })
        .then(resolve)
        .catch(reject);
    });
  });
}

/**
 * Pide al servidor que valide el token contra Google.
 *
 * La verificación NO puede hacerse en el cliente: exige el secreto, y cualquier
 * comprobación que corra en el navegador se puede saltar.
 */
export async function verificarRecaptcha(
  token: string | null,
  accion: RecaptchaAccion
): Promise<VerificacionRecaptcha> {
  const res = await fetch("/api/recaptcha/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, accion }),
  });

  return (await res.json()) as VerificacionRecaptcha;
}
