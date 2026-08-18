/**
 * Identificador público de una unidad.
 *
 * Convierte el `id_partida` de la API en un token corto y opaco para la URL:
 *   11953  ->  "k3f9m"
 *
 * QUÉ ES Y QUÉ NO ES
 *
 * Esto es COSMÉTICO, no seguridad. La transformación es reversible sin secreto
 * alguno y cualquiera puede deducirla leyendo este archivo, que va en el bundle
 * del cliente. Sirve para que la URL no exhiba un contador de base de datos -
 * que además revela cuántas unidades hay y permite recorrerlas de una en una -
 * pero NO protege nada.
 *
 * Si en algún momento hay algo que proteger de verdad, la respuesta es control
 * de acceso en el servidor, no ofuscar el identificador.
 *
 * El id sigue siendo visible en la ficha y en la tarjeta ("ID 11953"): es el
 * dato que la gente dicta al llamar por teléfono. Ocultarlo del todo sería
 * incoherente.
 *
 * La URL conserva el slug descriptivo delante (`audi-a5-k3f9m`) para no perder
 * las palabras clave, que es lo que Google lee.
 */

/**
 * Desplazamiento fijo antes de pasar a base 36. Sólo evita que el token sea el
 * número en otra base; no aporta seguridad.
 */
const OFFSET = 948_271;

/** Token público a partir del id numérico de la API. */
export function encodeVehiculoId(id: string | number): string {
  const n = Number(id);
  if (!Number.isFinite(n) || n <= 0) return String(id);
  return (n + OFFSET).toString(36);
}

/**
 * Devuelve el id numérico a partir del token.
 *
 * Acepta también un id crudo: las URLs que ya circulan con el número siguen
 * funcionando, y romper enlaces publicados es peor que la incoherencia.
 */
export function decodeVehiculoId(token: string): string | null {
  if (/^\d+$/.test(token)) return token;

  const n = Number.parseInt(token, 36);
  if (!Number.isFinite(n)) return null;

  const id = n - OFFSET;
  return id > 0 ? String(id) : null;
}

/**
 * Extrae el token del último segmento de un slug tipo "audi-a5-k3f9m"
 * y lo traduce al id de la API.
 */
export function idDesdeSlugPublico(slug: string): string | null {
  const ultimo = slug.split("-").pop();
  return ultimo ? decodeVehiculoId(ultimo) : null;
}
