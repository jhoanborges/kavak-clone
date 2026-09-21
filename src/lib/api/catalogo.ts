/**
 * Cliente de la API del catálogo de vehículos.
 *
 * Contrato COMÚN:
 *  - Método: GET (sólo LISTADO_CAT_COMPLETO) o POST (el resto).
 *  - Cabeceras: Content-Type: application/json (Bearer opcional; el backend no lo
 *    valida y el token va vacío).
 *  - Cuerpo POST: { "Content": base64(JSON) }.
 *  - Respuesta: base64(JSON) con forma { "Status": 1, ... } | { "Status": 0, "Body": "<error>" }.
 *    (En algunos entornos ya llega como JSON plano; se soportan ambos.)
 *
 * SÓLO SERVIDOR: el host es IP interna. El cliente nunca llama aquí directo; pasa
 * por los route handlers de /api que envuelven esto.
 *
 * El HOST sale de CATALOGO_ORIGIN (ver src/lib/env.ts). Aquí viven las RUTAS, el
 * armado base64 y los tipos crudos de la respuesta.
 */

import { CATALOGO_ORIGIN } from "@/lib/env";
import { logUpstreamError } from "@/lib/log";

/** Rutas de la API. */
export const CATALOGO_ENDPOINTS = {
  /** GET · catálogo completo de facetas (sin filtrar). */
  catalogoCompleto: "/ENCABEZADO/LISTADO_CAT_COMPLETO",
  /** POST · listado filtrado + facetas + imágenes. */
  listado: "/ENCABEZADO/LISTADO_CAT_VEHICULOS",
  /** POST · autocomplete por texto. */
  busqueda: "/ENCABEZADO/LISTADO_BUSQUEDA",
  /** POST · ficha de detalle + tabla de plazos. */
  detalle: "/DETALLE/VEHICULO",
} as const;

/* ─────────────────────────── tipos crudos ────────────────────────────────── */

export type CatalogoFacetas = {
  Anio: Array<{ anio: string; total_anio: number }>;
  Color: Array<{ clave_color: number; color: string; total_clave_color: number }>;
  Marca: Array<{ clave_marca: number; marca: string; total_clave_marca: number }>;
  Modelo: Array<{
    clave_marca: number;
    marca: string;
    clave_modelo: number;
    modelo: string;
    total_clave_modelo: number;
  }>;
  Segmento: Array<{
    clave_segmento: number;
    segmento: string;
    total_clave_segmento: number;
  }>;
  Transmision: Array<{
    clave_transmision: number;
    transmision: string;
    total_clave_transmision: number;
  }>;
};

export type CatalogoVehiculo = {
  id_partida: number;
  anio: string;
  clave_marca: number;
  marca: string;
  clave_modelo: number;
  modelo: string;
  modelo_string: string;
  clave_tipo: number | null;
  tipo: string | null;
  kms: number;
  precio_estimado_venta: number;
  clave_segmento: number;
  segmento: string;
  clave_tipo_combustible: number;
  tipo_combustible: string;
  clave_color: number;
  color: string;
  clave_transmision: number;
  transmision: string;
  monto_mes: number;
  meses: number;
};

export type CatalogoImagen = {
  id_partida: number;
  id_image: number;
  nombre_imagen: string;
  clave_categoria_imagen: number | null;
  clave_tipo_acc_imagen: number | null;
};

export type CatalogoListadoResp = {
  Status: number;
  Catalogos: CatalogoFacetas;
  Listado: { Total: number; Vehiculos: CatalogoVehiculo[]; Imagenes: CatalogoImagen[] };
};

export type CatalogoCompletoResp = { Status: number; Catalogos: CatalogoFacetas };

export type CatalogoBusquedaResp = {
  Status: number;
  Cadena_a_Buscar: string;
  Posibles_Marcas: Array<{ clave_marca: string; marca: string }>;
  Posibles_Resultados: Array<{
    anio: string;
    clave_marca: string;
    marca: string;
    clave_modelo: string;
    modelo: string;
    clave_tipo: string | null;
    tipo: string | null;
    descripcion: string;
  }>;
};

/** Una fila de la tabla de plazos que devuelve el detalle. */
export type CatalogoDetallePrecio = {
  id_partida: number;
  precio_estimado_venta: number;
  enganche: number | null;
  monto_mes: number;
  num_mes: number;
};

export type CatalogoDetalle = CatalogoVehiculo & {
  clave_traccion: number | null;
  traccion: string | null;
  puertas: number | null;
  interiores: string | null;
  equipo_sonido: string | null;
  llanta_refaccion: string | null;
  clima: string | null;
  nivel_gas: number | null;
};

export type CatalogoDetalleResp = {
  Status: number;
  Precio: CatalogoDetallePrecio[];
  Detalle: CatalogoDetalle[];
};

/* ─────────────────────────────── transporte ──────────────────────────────── */

/** Error con status HTTP para que los route handlers decidan el código. */
export class CatalogoError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "CatalogoError";
    this.status = status;
  }
}

/**
 * Decodifica la respuesta. La API puede mandar tres formas:
 *  1. JSON plano -> { Status, ... }
 *  2. base64 CRUDO de un JSON -> "eyJ..." sin comillas.
 *  3. base64 ENVUELTO en comillas JSON -> `"eyJ..."` (el caso real de esta API).
 * Devuelve el objeto ya decodificado, o undefined si ninguna forma cuaja.
 */
function parseRespuesta(texto: string): unknown {
  const intento = (s: string) => {
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };

  const directo = intento(texto);
  // Caso 1: ya es un objeto JSON.
  if (directo !== null && typeof directo === "object") return directo;

  // Caso 3: JSON.parse dio un string (base64 entre comillas). Caso 2: no parseó,
  // el texto crudo es el base64. En ambos, se decodifica base64 -> JSON.
  const b64 = typeof directo === "string" ? directo : texto;
  try {
    return intento(Buffer.from(b64, "base64").toString("utf8"));
  } catch {
    return undefined;
  }
}

type PedirOpts = {
  /** JSON interno a envolver en { Content: base64 }. Ausente = GET sin cuerpo. */
  payload?: unknown;
  /** Segundos de caché del data-cache de Next. Sin valor = no-store. */
  revalidate?: number;
};

/**
 * Petición cruda a la API. Devuelve el objeto ya decodificado.
 * Lanza CatalogoError si falta config, la red falla, o el HTTP no es 2xx.
 */
async function pedir(path: string, opts: PedirOpts = {}): Promise<unknown> {
  if (!CATALOGO_ORIGIN) {
    throw new CatalogoError(
      "El catálogo no está configurado: falta CATALOGO_URL.",
      500
    );
  }

  const esPost = opts.payload !== undefined;
  const init: RequestInit & { next?: { revalidate: number } } = {
    method: esPost ? "POST" : "GET",
    // El contrato pide application/json en GET y POST.
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    signal: AbortSignal.timeout(20_000),
    ...(opts.revalidate === undefined
      ? { cache: "no-store" as const }
      : { next: { revalidate: opts.revalidate } }),
  };
  if (esPost) {
    const Content = Buffer.from(JSON.stringify(opts.payload)).toString("base64");
    init.body = JSON.stringify({ Content });
  }

  const url = `${CATALOGO_ORIGIN}${path}`;

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (error) {
    // Fallo de red o timeout: no hubo respuesta. Se loguea el throw crudo.
    logUpstreamError({
      servicio: "CATALOGO",
      metodo: init.method ?? "GET",
      url,
      payload: opts.payload,
      error,
    });
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    throw new CatalogoError(
      timedOut
        ? "La API tardó demasiado en responder."
        : "No se pudo contactar a la API del catálogo.",
      504
    );
  }

  // Se lee el cuerpo SIEMPRE (una sola vez): en fallo sirve para el log; en éxito
  // para parsearlo. Sin esto, el motivo del fallo del backend se perdía.
  const texto = await res.text();

  if (!res.ok) {
    logUpstreamError({
      servicio: "CATALOGO",
      metodo: init.method ?? "GET",
      url,
      status: res.status,
      body: texto,
      payload: opts.payload,
    });
    throw new CatalogoError(
      `La API respondió ${res.status}.`,
      res.status === 403 ? 502 : res.status
    );
  }

  const data = parseRespuesta(texto);
  if (data == null || typeof data !== "object") {
    logUpstreamError({
      servicio: "CATALOGO",
      metodo: init.method ?? "GET",
      url,
      status: res.status,
      body: texto,
      payload: opts.payload,
    });
    throw new CatalogoError("Respuesta ilegible de la API.");
  }

  // La API señala fallo de negocio con { Status: 0, Body: "<error>" } y HTTP 200.
  // Se loguea el detalle pero NO se lanza: cada método decide qué hacer con Status.
  const status = (data as { Status?: number }).Status;
  if (status !== undefined && status !== 1) {
    logUpstreamError({
      servicio: "CATALOGO",
      metodo: init.method ?? "GET",
      url,
      status: res.status,
      body: texto,
      payload: opts.payload,
    });
  }

  return data;
}

/* ──────────────────────────────── métodos ────────────────────────────────── */

/** Filtros del listado, en claves numéricas. */
export type ListadoFiltros = {
  registroInicial?: number;
  registroFinal?: number;
  anio?: string[];
  color?: number[];
  marca?: number[];
  modelo?: Array<{ clave_marca: number; clave_modelo: number }>;
  segmento?: number[];
  transmision?: number[];
  precioMin?: number;
  precioMax?: number;
  kmsMin?: number;
  kmsMax?: number;
  texto?: string;
};

const PRECIO_TOPE = 99999999;
const KMS_TOPE = 99999999;

/** POST LISTADO_CAT_VEHICULOS: listado filtrado + facetas + imágenes. */
export async function listadoVehiculos(
  f: ListadoFiltros = {},
  opts: { revalidate?: number } = {}
): Promise<CatalogoListadoResp> {
  const payload = {
    Registro_Incial: f.registroInicial ?? 0,
    Registro_Final: f.registroFinal ?? 0,
    // El backend espera Anio como ENTEROS (Nullable<Int32>), no strings: mandar
    // ["2020"] da Status:0 "could not be converted to System.Nullable`1[Int32]".
    Anio: (f.anio ?? []).map(Number).filter(Number.isFinite),
    Color: f.color ?? [],
    Marca: f.marca ?? [],
    Modelo: f.modelo ?? [],
    Segmento: f.segmento ?? [],
    Transmision: f.transmision ?? [],
    Precio: {
      precio_minimo: f.precioMin ?? 0,
      precio_maximo: f.precioMax ?? PRECIO_TOPE,
    },
    Kms: { kms_minimo: f.kmsMin ?? 0, kms_maximo: f.kmsMax ?? KMS_TOPE },
    Texto_Busqueda: f.texto ?? "",
  };
  return (await pedir(CATALOGO_ENDPOINTS.listado, {
    payload,
    revalidate: opts.revalidate,
  })) as CatalogoListadoResp;
}

/** GET LISTADO_CAT_COMPLETO: todas las facetas sin filtrar. */
export async function catalogoCompleto(
  opts: { revalidate?: number } = {}
): Promise<CatalogoCompletoResp> {
  return (await pedir(CATALOGO_ENDPOINTS.catalogoCompleto, {
    revalidate: opts.revalidate,
  })) as CatalogoCompletoResp;
}

/** POST LISTADO_BUSQUEDA: autocomplete por texto. */
export async function busqueda(termino: string): Promise<CatalogoBusquedaResp> {
  return (await pedir(CATALOGO_ENDPOINTS.busqueda, {
    payload: { busqueda: termino },
  })) as CatalogoBusquedaResp;
}

/** POST DETALLE/VEHICULO: ficha + tabla de plazos. */
export async function detalleVehiculo(
  idPartida: number,
  opts: { revalidate?: number } = {}
): Promise<CatalogoDetalleResp> {
  return (await pedir(CATALOGO_ENDPOINTS.detalle, {
    payload: { id_partida: idPartida },
    revalidate: opts.revalidate,
  })) as CatalogoDetalleResp;
}
