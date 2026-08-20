/**
 * Resolución central de orígenes (hosts) de las APIs.
 *
 * Hay DOS backends distintos y NO se deben mezclar:
 *
 *  1. Catálogo de autos  -> valueautos.com.mx  (sirve /api/vehiculos, /api/leads)
 *  2. Webservice SEMINUEVOS (pre-estudio de crédito) -> IP interna :5001/SEMINUEVOS
 *     (sirve /CATALOGOS, /PRECOTIZACION, /BC ...)
 *
 * Un solo interruptor los reubica: NEXT_PUBLIC_DEMO_MODE.
 *  - true : TODO apunta al sitio público de Value, para poder conectar desde
 *           una máquina de demo/dev sin VPN a la red interna.
 *  - false: cada backend usa su host real (el interno es IP privada).
 *
 * Va con prefijo NEXT_PUBLIC_ a propósito: así el mismo valor lo leen cliente
 * (base de imágenes en el navegador) Y servidor (proxy /api/vehiculos).
 */

/** Origen público de Value: el destino cuando estamos en demo. */
const DEMO_ORIGIN = "https://www.valueautos.com.mx";

/** Quita la barra final para poder concatenar rutas sin duplicarla. */
const trimSlash = (url: string | undefined): string => (url ?? "").replace(/\/$/, "");

/** ¿Modo demo? Un único flag para cliente y servidor. */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/**
 * Origen del CATÁLOGO de autos (valueautos.com.mx).
 * En demo se fuerza al público aunque NEXT_PUBLIC_API_URL apunte a otro sitio.
 */
export const CATALOG_ORIGIN = DEMO_MODE
  ? DEMO_ORIGIN
  : trimSlash(process.env.NEXT_PUBLIC_API_URL);

/**
 * Origen del WEBSERVICE SEMINUEVOS (pre-estudio de crédito).
 * En real es una IP interna (dev/prod, ver .env.*). En demo cae al público
 * para poder alcanzarlo sin VPN.
 */
export const PREESTUDIO_ORIGIN = DEMO_MODE
  ? DEMO_ORIGIN
  : trimSlash(process.env.NEXT_PUBLIC_PREESTUDIO_URL);

/**
 * Base de las imágenes del catálogo. La API devuelve NOMBRES DE ARCHIVO sueltos
 * ("12577-1_2_0-3-DEFAULT.JPG"), no URLs, así que hay que prefijarlos.
 * En demo apunta al thumbnail público; si no, a NEXT_PUBLIC_IMAGES_URL.
 */
export const IMAGES_ORIGIN = DEMO_MODE
  ? `${DEMO_ORIGIN}/thumbnail`
  : trimSlash(process.env.NEXT_PUBLIC_IMAGES_URL) || `${CATALOG_ORIGIN}/img/autos`;
