import { idDesdeSlugPublico, encodeVehiculoId } from "@/lib/api/id-publico";

/**
 * Contrato del catálogo, lado CLIENTE.
 *
 * Este módulo es seguro para el bundle del navegador: sólo tipos, construcción
 * de query, normalizadores y el fetcher de SWR. NO importa el cliente TRADEIN
 * (token + Buffer + IP interna): eso vive en `vehiculos-server.ts` y sólo corre
 * en el servidor.
 *
 * El cliente siempre pega a NUESTRO route handler `/api/vehiculos`, que traduce
 * la query al webservice TRADEIN y devuelve la forma cruda que se normaliza aquí.
 * Así, si cambia el backend, el componente no se entera.
 */

/* ────────────────────────────── petición ────────────────────────────────── */

export type VehiculosQuery = {
  busqueda?: string;
  segmento?: string;
  transmision?: string;
  marca?: string;
  modelo?: string;
  anio?: string | number;
  color?: string;
  precio_min?: string | number;
  precio_max?: string | number;
  km_min?: string | number;
  km_max?: string | number;
  pagina?: number;
  cantidad?: number;
};

/** Parámetros que el route handler conoce y reenvía. */
export const VEHICULOS_PARAMS = [
  "busqueda",
  "segmento",
  "transmision",
  "marca",
  "modelo",
  "anio",
  "color",
  "precio_min",
  "precio_max",
  "km_min",
  "km_max",
  "pagina",
  "cantidad",
] as const;

/**
 * Construye la URL de NUESTRO endpoint. Siempre relativa: pega a nuestro propio
 * origen, que es quien habla con TRADEIN.
 */
export function buildVehiculosUrl(query: VehiculosQuery = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    // Se mandan también los vacíos: el route handler los interpreta como
    // "sin filtro" y así la clave de SWR es estable.
    params.set(key, value === undefined || value === null ? "" : String(value));
  }
  return `/api/vehiculos?${params.toString()}`;
}

/**
 * Filtros del catálogo, ya en el formato que espera la API.
 *
 * `marca`, `segmento`, `transmision` y `color` van por CLAVE NUMÉRICA (no por
 * nombre); `anio` va como el año literal ("2023"). `precio_*` y `km_*` se mandan
 * como par; el route handler rellena el tope que falte.
 */
export type FiltrosSeleccionados = {
  marca?: string;
  anio?: string;
  segmento?: string;
  transmision?: string;
  color?: string;
  precio_min?: string;
  precio_max?: string;
  km_min?: string;
  km_max?: string;
};

/** Claves de filtro que se reflejan en la URL. */
export const FILTRO_KEYS = [
  "marca",
  "anio",
  "segmento",
  "transmision",
  "color",
  "precio_min",
  "precio_max",
  "km_min",
  "km_max",
] as const;

const PRECIO_TOPE = 9999999;
const KM_TOPE = 999999;

/** Consulta del catálogo: búsqueda opcional + filtros + paginación. */
export function catalogoQuery({
  busqueda = "",
  filtros = {},
  pagina = 1,
  cantidad = 12,
}: {
  busqueda?: string;
  filtros?: FiltrosSeleccionados;
  pagina?: number;
  cantidad?: number;
}): VehiculosQuery {
  const tienePrecio = Boolean(filtros.precio_min || filtros.precio_max);
  const tieneKm = Boolean(filtros.km_min || filtros.km_max);

  return {
    busqueda,
    segmento: filtros.segmento ?? "",
    transmision: filtros.transmision ?? "",
    marca: filtros.marca ?? "",
    anio: filtros.anio ?? "",
    color: filtros.color ?? "",
    precio_min: tienePrecio ? (filtros.precio_min || 0) : "",
    precio_max: tienePrecio ? (filtros.precio_max || PRECIO_TOPE) : "",
    km_min: tieneKm ? (filtros.km_min || 0) : "",
    km_max: tieneKm ? (filtros.km_max || KM_TOPE) : "",
    pagina,
    cantidad,
  };
}

export const VEHICULOS_PRESETS = {
  /** Home · "Ofertas destacadas" - una búsqueda sin filtros. */
  destacados: (cantidad = 4): VehiculosQuery => ({
    busqueda: "",
    pagina: 1,
    cantidad,
  }),

  /** Listado paginado / scroll infinito. */
  listado: (pagina = 1, cantidad = 12): VehiculosQuery => ({ pagina, cantidad }),

  /** Búsqueda por texto libre. */
  busqueda: (termino: string, pagina = 1, cantidad = 12): VehiculosQuery => ({
    busqueda: termino,
    pagina,
    cantidad,
  }),
} as const;

/* ──────────────────────── respuesta cruda (del route) ────────────────────── */

/**
 * Un auto tal como lo devuelve NUESTRO route handler (traducido de TRADEIN).
 * Las `clave_*` llegan como número (TRADEIN las manda como float, ej. 1.0).
 */
export type AutoRaw = {
  id_partida: number;
  anio: string;
  clave_marca: number;
  marca: string;
  clave_modelo: number;
  modelo: string;
  modelo_string: string;
  clave_tipo: number | null;
  /** Versión / trim. */
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
  /** Mensualidad estimada. */
  monto_mes: number;
  meses: number;
  /** Nombres de archivo, NO URLs. Se prefijan con imagenUrl(). */
  imagenes: string[];
};

/** Facetas para construir los filtros del catálogo, con conteos. */
export type FiltrosRaw = {
  marcas: Array<{
    clave_marca: number;
    marca: string;
    total_clave_marca: number;
    modelos: Array<{
      clave_marca: number;
      marca: string;
      clave_modelo: number;
      modelo: string;
      total_clave_modelo: number;
    }>;
  }>;
  anios: Array<{ anio: string; total_anio: number }>;
  segmentos: Array<{
    clave_segmento: number;
    segmento: string;
    total_clave_segmento: number;
  }>;
  transmisiones: Array<{
    clave_transmision: number;
    transmision: string;
    total_clave_transmision: number;
  }>;
  colores: Array<{ clave_color: number; color: string; total_clave_color: number }>;
};

export type VehiculosRespuestaRaw = {
  query: string;
  autos: AutoRaw[];
  total_autos: number;
  /** Total de páginas = ceil(total_autos / cantidad). */
  paginas: number;
  filtros: FiltrosRaw;
};

/* ─────────────────────── forma normalizada (para la UI) ──────────────────── */

export type Vehiculo = {
  id: string;
  marca: string;
  modelo: string;
  /** Versión / trim (campo `tipo` de la API). */
  version: string;
  anio: number | null;
  precio: number | null;
  km: number | null;
  transmision: string;
  combustible: string;
  color: string;
  segmento: string;
  /** Mensualidad ya redondeada a pesos. */
  mensualidad: number | null;
  meses: number | null;
  imagenes: string[];
  /** Ruta de detalle en NUESTRO sitio. */
  href: string;
};

export type VehiculosRespuesta = {
  vehiculos: Vehiculo[];
  total: number;
  paginas: number;
  filtros: FiltrosRaw | null;
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Prefija un nombre de archivo con nuestro proxy de imágenes.
 * TRADEIN devuelve nombres sueltos ("10959-1-CHEVROLET.jpg") servidos desde una
 * IP interna; el proxy /api/imagen los trae server-side.
 */
export function imagenUrl(nombre: string): string {
  if (/^https?:\/\//i.test(nombre)) return nombre;
  return `/api/imagen/${encodeURIComponent(nombre.replace(/^\//, ""))}`;
}

export function normalizeVehiculo(raw: AutoRaw): Vehiculo {
  const anio = Number(raw.anio);

  return {
    id: String(raw.id_partida),
    marca: raw.marca ?? "",
    // `modelo` antes que `modelo_string`: el segundo NO es fiable (a veces trae
    // la descripción comercial completa, con la marca repetida). `modelo` limpio.
    modelo: raw.modelo || raw.modelo_string || "",
    version: raw.tipo ?? "",
    anio: Number.isFinite(anio) ? anio : null,
    precio: typeof raw.precio_estimado_venta === "number" ? raw.precio_estimado_venta : null,
    km: typeof raw.kms === "number" ? raw.kms : null,
    transmision: raw.transmision ?? "",
    combustible: raw.tipo_combustible ?? "",
    color: raw.color ?? "",
    segmento: raw.segmento ?? "",
    // monto_mes puede llegar con ruido de float: a pesos enteros.
    mensualidad: typeof raw.monto_mes === "number" ? Math.round(raw.monto_mes) : null,
    meses: typeof raw.meses === "number" ? raw.meses : null,
    imagenes: (raw.imagenes ?? []).filter(Boolean).map(imagenUrl),
    href: `/vehiculos/${slugify(`${raw.marca}-${raw.modelo || raw.modelo_string}`)}-${encodeVehiculoId(raw.id_partida)}`,
  };
}

export function normalizeRespuesta(data: unknown): VehiculosRespuesta {
  const d = (data ?? {}) as Partial<VehiculosRespuestaRaw>;
  const autos = Array.isArray(d.autos) ? d.autos : [];

  return {
    vehiculos: autos.map(normalizeVehiculo),
    total: typeof d.total_autos === "number" ? d.total_autos : autos.length,
    paginas: typeof d.paginas === "number" ? d.paginas : 1,
    filtros: d.filtros ?? null,
  };
}

/** Fetcher para SWR. Lanza en no-2xx para que SWR exponga `error`. */
export async function fetchVehiculos(url: string): Promise<unknown> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) {
    throw Object.assign(new Error(`La API de vehículos respondió ${res.status}`), {
      status: res.status,
    });
  }

  return res.json();
}

/* ─────────────────────────── ficha de detalle ───────────────────────────── */

export type GrupoFotos = { categoria: string; fotos: string[] };

/** Una fila de la tabla de plazos (de DETALLE/VEHICULO). */
export type Plazo = {
  meses: number;
  /** Mensualidad ya redondeada a pesos. */
  mensualidad: number;
  enganche: number | null;
};

/**
 * Traduce el último segmento del slug al id de la API.
 * Acepta el token público ("k3f9m") y un id crudo heredado.
 */
export function idDesdeSlug(slug: string): string | null {
  return idDesdeSlugPublico(slug);
}
