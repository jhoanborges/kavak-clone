/**
 * Resolución central de los orígenes (hosts) de las APIs. Todo server-side.
 * El tráfico pasa por route handlers propios (proxy servidor-a-servidor): el
 * cliente golpea /api/*, nunca la IP interna.
 */

/** Quita la barra final para poder concatenar rutas sin duplicarla. */
const trimSlash = (url: string | undefined): string => (url ?? "").replace(/\/$/, "");

/**
 * Origen de la API del catálogo de vehículos (listado, filtros, detalle).
 * Server-only: sin NEXT_PUBLIC_, el cliente nunca lo ve (va tras el proxy).
 */
export const CATALOGO_ORIGIN = trimSlash(process.env.CATALOGO_URL);

/**
 * Origen del WEBSERVICE pre-estudio / BC (crédito). Backend DISTINTO al catálogo.
 * En dev/prod es una IP interna (ver .env.*).
 */
export const PREESTUDIO_ORIGIN = trimSlash(process.env.NEXT_PUBLIC_PREESTUDIO_URL);

/**
 * Backend que guarda las suscripciones push y dispara los envíos (web-push).
 * Server-only: el cliente manda su PushSubscription a /api/push/*, y el proxy
 * la reenvía aquí con PUSH_BACKEND_TOKEN. Así la URL interna y el secreto nunca
 * viajan al navegador. La clave VAPID PÚBLICA sí es pública (va en el bundle):
 * NEXT_PUBLIC_VAPID_PUBLIC_KEY.
 */
export const PUSH_BACKEND_ORIGIN = trimSlash(process.env.PUSH_BACKEND_URL);
