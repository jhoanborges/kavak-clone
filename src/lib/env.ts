/**
 * Resolución central de los orígenes (hosts) de las APIs. Todo server-side.
 *
 * Hay DOS backends distintos y NO se mezclan:
 *
 *  1. Catálogo TRADEIN (autos + citas) -> servicio_api_value_tdin
 *     Sirve /ENCABEZADO/* y /DETALLE/*. Host en TRADEIN_URL, token en TRADEIN_TOKEN.
 *  2. Webservice pre-estudio / BC (crédito) -> servicio_api_value_pe_bc
 *     Sirve /CATALOGOS, /PRECOTIZACION, /BC. Host en NEXT_PUBLIC_PREESTUDIO_URL,
 *     token en PREESTUDIO_TOKEN.
 *
 * Ambos son IP interna (requieren VPN/LAN), Bearer + payload en base64. Los
 * TOKENS son SECRETOS: viven sólo en el servidor, sin prefijo NEXT_PUBLIC_, y el
 * navegador nunca los ve. Por eso todo el tráfico pasa por route handlers propios
 * (proxy servidor-a-servidor): el cliente golpea /api/*, no la IP interna.
 */

/** Quita la barra final para poder concatenar rutas sin duplicarla. */
const trimSlash = (url: string | undefined): string => (url ?? "").replace(/\/$/, "");

/**
 * Origen del catálogo TRADEIN (autos, filtros, detalle, agendar cita).
 * Server-only: sin NEXT_PUBLIC_, el cliente nunca lo ve (va tras el proxy).
 */
export const TRADEIN_ORIGIN = trimSlash(process.env.TRADEIN_URL);

/**
 * Origen del WEBSERVICE pre-estudio / BC (crédito). Backend DISTINTO al catálogo.
 * En dev/prod es una IP interna (ver .env.*).
 */
export const PREESTUDIO_ORIGIN = trimSlash(process.env.NEXT_PUBLIC_PREESTUDIO_URL);
