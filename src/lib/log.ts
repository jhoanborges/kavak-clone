/**
 * Logger de servidor, consciente del entorno.
 *
 * OBJETIVO: en dev/development ver TODO lo que el backend devuelve y por qué
 * falló (status + cuerpo crudo del webservice, no sólo el mensaje limpio que se
 * manda al cliente). En producción se calla el detalle: sólo un error breve.
 *
 * SÓLO SERVIDOR: se importa desde route handlers y clientes server-side (catalogo,
 * preestudio, instrumentation). Nunca desde componentes cliente (filtraría URLs
 * internas y cuerpos de error al navegador).
 *
 * Detección de entorno: NODE_ENV !== "production" cuenta como dev. Se puede
 * forzar con API_DEBUG=1 (útil para depurar contra un build de prod local).
 */

export const IS_DEV = process.env.NODE_ENV !== "production";

/** Log detallado activo en dev, o siempre que API_DEBUG esté encendido. */
export const DEBUG = IS_DEV || process.env.API_DEBUG === "1";

/** Recorta cuerpos largos para no inundar la consola. */
function recorta(texto: string, max = 2000): string {
  return texto.length > max ? `${texto.slice(0, max)}… [+${texto.length - max} chars]` : texto;
}

/** Quita el Bearer de las cabeceras antes de loguear. */
function saneaHeaders(headers?: HeadersInit): Record<string, string> {
  const out: Record<string, string> = {};
  new Headers(headers).forEach((v, k) => {
    out[k] = k.toLowerCase() === "authorization" ? "Bearer ***" : v;
  });
  return out;
}

type UpstreamInfo = {
  /** Nombre del backend, ej. "CATALOGO" o "PREESTUDIO". */
  servicio: string;
  metodo: string;
  url: string;
  /** Status HTTP de la respuesta upstream (si hubo respuesta). */
  status?: number;
  /** Cuerpo crudo de la respuesta (texto), tal cual lo mandó el backend. */
  body?: string;
  /** Payload que ENVIAMOS (para reproducir el fallo). */
  payload?: unknown;
  /** El error capturado, si fue fallo de red/timeout (no hubo respuesta). */
  error?: unknown;
};

/**
 * Loguea un fallo de una llamada upstream con TODO el contexto en dev.
 * En prod no imprime el cuerpo (puede traer datos internos), sólo status + url.
 */
export function logUpstreamError(info: UpstreamInfo): void {
  const etiqueta = `[api:${info.servicio}] ${info.metodo} ${info.url}`;

  if (!DEBUG) {
    // Prod: una línea, sin cuerpo.
    console.error(`${etiqueta} → ${info.status ?? "ERR"}`);
    return;
  }

  console.error(`\n──────── ${etiqueta} ────────`);
  if (info.status !== undefined) console.error(`  status : ${info.status}`);
  if (info.payload !== undefined) {
    console.error(`  payload: ${recorta(JSON.stringify(info.payload))}`);
  }
  if (info.body !== undefined) console.error(`  body   : ${recorta(info.body)}`);
  if (info.error !== undefined) {
    console.error(`  throw  : ${fmtError(info.error)}`);
    // undici (fetch de Node) envuelve el motivo REAL en error.cause: cert TLS,
    // ECONNREFUSED, ETIMEDOUT, DNS… El "TypeError: fetch failed" de arriba es
    // genérico; la causa es la que dice qué falló de verdad.
    let causa: unknown = info.error instanceof Error ? info.error.cause : undefined;
    for (let i = 0; causa !== undefined && i < 5; i++) {
      console.error(`  cause  : ${fmtError(causa)}`);
      causa = causa instanceof Error ? causa.cause : undefined;
    }
    if (info.error instanceof Error && info.error.stack) console.error(info.error.stack);
  }
  console.error("────────────────────────────────────────\n");
}

/** Formatea un error incluyendo su `code` (ej. UNABLE_TO_VERIFY_LEAF_SIGNATURE). */
function fmtError(e: unknown): string {
  if (!(e instanceof Error)) return String(e);
  const code = (e as { code?: string }).code;
  return `${e.name}: ${e.message}${code ? ` (code: ${code})` : ""}`;
}

/** Log de éxito (sólo en debug) para trazar qué se llamó y con qué latencia. */
export function logUpstreamOk(servicio: string, metodo: string, url: string, ms?: number): void {
  if (!DEBUG) return;
  console.log(`[api:${servicio}] ${metodo} ${url} → 200${ms !== undefined ? ` (${ms}ms)` : ""}`);
}

export { saneaHeaders };
