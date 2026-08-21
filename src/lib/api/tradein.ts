/**
 * Cliente del WEBSERVICE AUTOMOTRIZ TRADEIN (catálogo de autos + citas).
 *
 * Transcrito de "Webservice API EXT VALUE TRADEIN" v1.1.
 *
 * Contrato COMÚN:
 *  - Método: GET (sólo LISTADO_CAT_COMPLETO) o POST (el resto).
 *  - Cabeceras: Authorization: Bearer <token>, Content-Type: application/json.
 *  - Cuerpo POST: { "Content": base64(JSON) }.
 *  - Respuesta: base64(JSON) con forma { "Status": 1, ... } | { "Status": 0, "Body": "<error>" }.
 *    (En algunos entornos ya llega como JSON plano; se soportan ambos.)
 *
 * SÓLO SERVIDOR: el token es secreto y el host es IP interna. El cliente nunca
 * llama aquí directo; pasa por los route handlers de /api que envuelven esto.
 *
 * El HOST sale de TRADEIN_ORIGIN (ver src/lib/env.ts). Aquí viven las RUTAS, el
 * armado base64/Bearer y los tipos crudos de la respuesta.
 */

import { TRADEIN_ORIGIN } from "@/lib/env";

/** Rutas del webservice. */
export const TRADEIN_ENDPOINTS = {
  /** GET · catálogo completo de facetas (sin filtrar). */
  catalogoCompleto: "/ENCABEZADO/LISTADO_CAT_COMPLETO",
  /** POST · listado filtrado + facetas + imágenes. */
  listado: "/ENCABEZADO/LISTADO_CAT_VEHICULOS",
  /** POST · autocomplete por texto. */
  busqueda: "/ENCABEZADO/LISTADO_BUSQUEDA",
  /**
   * POST · alta de cita. PENDIENTE de conectar: el agendado irá a Odoo (ERP aún
   * no disponible), es lógica distinta pendiente de aprobación. Aquí queda la
   * ruta documentada; el cliente no la llama todavía.
   */
  agendarCita: "/ENCABEZADO/AGENDAR_CITA",
  /** POST · ficha de detalle + tabla de plazos. */
  detalle: "/DETALLE/VEHICULO",
} as const;

/* ─────────────────────────── tipos crudos (PDF) ──────────────────────────── */

export type TradeinCatalogos = {
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

export type TradeinVehiculo = {
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

export type TradeinImagen = {
  id_partida: number;
  id_image: number;
  nombre_imagen: string;
  clave_categoria_imagen: number | null;
  clave_tipo_acc_imagen: number | null;
};

export type TradeinListadoResp = {
  Status: number;
  Catalogos: TradeinCatalogos;
  Listado: { Total: number; Vehiculos: TradeinVehiculo[]; Imagenes: TradeinImagen[] };
};

export type TradeinCatCompletoResp = { Status: number; Catalogos: TradeinCatalogos };

export type TradeinBusquedaResp = {
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
export type TradeinDetallePrecio = {
  id_partida: number;
  precio_estimado_venta: number;
  enganche: number | null;
  monto_mes: number;
  num_mes: number;
};

export type TradeinDetalle = TradeinVehiculo & {
  clave_traccion: number | null;
  traccion: string | null;
  puertas: number | null;
  interiores: string | null;
  equipo_sonido: string | null;
  llanta_refaccion: string | null;
  clima: string | null;
  nivel_gas: number | null;
};

export type TradeinDetalleResp = {
  Status: number;
  Precio: TradeinDetallePrecio[];
  Detalle: TradeinDetalle[];
};

/* ─────────────────────────────── transporte ──────────────────────────────── */

/** Error con status HTTP para que los route handlers decidan el código. */
export class TradeinError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "TradeinError";
    this.status = status;
  }
}

/** Decodifica la respuesta: JSON plano o base64 -> JSON. */
function parseRespuesta(texto: string): unknown {
  const intento = (s: string) => {
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };
  const directo = intento(texto);
  if (directo !== undefined) return directo;
  try {
    return intento(Buffer.from(texto, "base64").toString("utf8"));
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
 * Petición cruda al webservice. Devuelve el objeto ya decodificado.
 * Lanza TradeinError si falta config, la red falla, o el HTTP no es 2xx.
 */
async function pedir(path: string, opts: PedirOpts = {}): Promise<unknown> {
  if (!TRADEIN_ORIGIN) {
    throw new TradeinError(
      "El catálogo TRADEIN no está configurado: falta TRADEIN_URL.",
      500
    );
  }
  const token = process.env.TRADEIN_TOKEN;
  if (!token) {
    throw new TradeinError(
      "Servicio no disponible: falta TRADEIN_TOKEN en el servidor.",
      503
    );
  }

  const esPost = opts.payload !== undefined;
  const init: RequestInit & { next?: { revalidate: number } } = {
    method: esPost ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(esPost ? { "Content-Type": "application/json" } : {}),
    },
    signal: AbortSignal.timeout(20_000),
    ...(opts.revalidate === undefined
      ? { cache: "no-store" as const }
      : { next: { revalidate: opts.revalidate } }),
  };
  if (esPost) {
    const Content = Buffer.from(JSON.stringify(opts.payload)).toString("base64");
    init.body = JSON.stringify({ Content });
  }

  let res: Response;
  try {
    res = await fetch(`${TRADEIN_ORIGIN}${path}`, init);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    throw new TradeinError(
      timedOut
        ? "El webservice tardó demasiado en responder."
        : "No se pudo contactar al webservice TRADEIN.",
      504
    );
  }

  if (!res.ok) {
    throw new TradeinError(
      `El webservice respondió ${res.status}.`,
      res.status === 403 ? 502 : res.status
    );
  }

  const data = parseRespuesta(await res.text());
  if (data == null || typeof data !== "object") {
    throw new TradeinError("Respuesta ilegible del webservice.");
  }
  return data;
}

/* ──────────────────────────────── métodos ────────────────────────────────── */

/** Filtros del listado, en claves numéricas (ver contrato del PDF). */
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
): Promise<TradeinListadoResp> {
  const payload = {
    Registro_Incial: f.registroInicial ?? 0,
    Registro_Final: f.registroFinal ?? 0,
    Anio: f.anio ?? [],
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
  return (await pedir(TRADEIN_ENDPOINTS.listado, {
    payload,
    revalidate: opts.revalidate,
  })) as TradeinListadoResp;
}

/** GET LISTADO_CAT_COMPLETO: todas las facetas sin filtrar. */
export async function catalogoCompleto(
  opts: { revalidate?: number } = {}
): Promise<TradeinCatCompletoResp> {
  return (await pedir(TRADEIN_ENDPOINTS.catalogoCompleto, {
    revalidate: opts.revalidate,
  })) as TradeinCatCompletoResp;
}

/** POST LISTADO_BUSQUEDA: autocomplete por texto. */
export async function busqueda(termino: string): Promise<TradeinBusquedaResp> {
  return (await pedir(TRADEIN_ENDPOINTS.busqueda, {
    payload: { busqueda: termino },
  })) as TradeinBusquedaResp;
}

/** POST DETALLE/VEHICULO: ficha + tabla de plazos. */
export async function detalleVehiculo(
  idPartida: number,
  opts: { revalidate?: number } = {}
): Promise<TradeinDetalleResp> {
  return (await pedir(TRADEIN_ENDPOINTS.detalle, {
    payload: { id_partida: idPartida },
    revalidate: opts.revalidate,
  })) as TradeinDetalleResp;
}
