/**
 * Cliente de la API de vehículos de Value Autos.
 *
 * Base: NEXT_PUBLIC_API_URL (ver .env.*). Todo lo demás se concatena aquí, así
 * que si cambia el host no hay que tocar ningún componente.
 *
 * El contrato de abajo está transcrito de una respuesta REAL del endpoint.
 * La API es pública y responde bien desde un navegador; sólo bloquea peticiones
 * desde IPs de datacenter (WAF de Imperva), así que no se puede probar desde
 * CI/sandbox — pero sí desde el navegador del usuario final.
 */

/** Origen real de Value. El proxy del servidor lo usa como destino fijo. */
export const UPSTREAM_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/$/,
  ""
);

/**
 * ¿Pasamos por nuestro route handler en vez de llamar directo?
 *
 * El origen de Value NO manda `Access-Control-Allow-Origin`, así que el
 * navegador bloquea el fetch directo. CORS sólo lo aplica el navegador: una
 * petición servidor-a-servidor no lo sufre, y por eso existe el proxy en
 * src/app/api/vehiculos/route.ts.
 *
 * Es un parche. Cuando Value añada la cabecera CORS con nuestro dominio, se
 * pone NEXT_PUBLIC_API_PROXY=false y se vuelve a llamada directa sin tocar
 * ningún componente.
 */
export const USE_PROXY = process.env.NEXT_PUBLIC_API_PROXY !== "false";

/**
 * Base contra la que se construyen las URLs del cliente.
 * Con proxy queda vacía a propósito: la URL sale relativa y pega a nuestro
 * propio origen, que es justo lo que queremos en ese modo.
 */
export const API_BASE = USE_PROXY ? "" : UPSTREAM_ORIGIN;

/** Parámetros que el endpoint acepta. El proxy sólo reenvía éstos. */
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
 * Base de las imágenes. `imagenes` devuelve NOMBRES DE ARCHIVO sueltos
 * ("12577-1_2_0-3-DEFAULT.JPG"), no URLs, así que hay que prefijarlos.
 *
 * ⚠️ La ruta real está SIN CONFIRMAR — no se pudo inspeccionar el HTML del
 * sitio. Sacarla del `src` de cualquier <img> del catálogo original y ponerla
 * en NEXT_PUBLIC_IMAGES_URL.
 */
export const IMAGES_BASE = (
  process.env.NEXT_PUBLIC_IMAGES_URL ?? `${UPSTREAM_ORIGIN}/img/autos`
).replace(/\/$/, "");

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

/**
 * Construye la URL del endpoint.
 *
 * El `_=<timestamp>` del sitio original es el cache-buster de jQuery. NO lo
 * añadimos: cambiaría la clave de SWR en cada render y mataría la caché y la
 * deduplicación. Si el backend cacheara de más se controla con Cache-Control.
 */
export function buildVehiculosUrl(query: VehiculosQuery = {}): string {
  // En modo directo la base es obligatoria: sin ella la URL saldría relativa y
  // pegaría a nuestro propio host devolviendo 404 sin explicar por qué.
  // Ojo con la precedencia de Next: .env.local gana sobre .env.development.
  if (!USE_PROXY && !UPSTREAM_ORIGIN) {
    throw new Error(
      "NEXT_PUBLIC_API_URL está vacío y el proxy está desactivado. " +
        "Revisa .env.local (tiene prioridad sobre .env.development)."
    );
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    // Se mandan también los vacíos: el sitio original lo hace así
    // (?precio_min=&precio_max=…) y no conviene desviarse del contrato.
    params.set(key, value === undefined || value === null ? "" : String(value));
  }
  return `${API_BASE}/api/vehiculos?${params.toString()}`;
}

export const VEHICULOS_PRESETS = {
  /** Home · "Ofertas destacadas" — en realidad una búsqueda sin filtros. */
  destacados: (cantidad = 4): VehiculosQuery => ({
    busqueda: "",
    segmento: "",
    transmision: "",
    marca: "",
    modelo: "",
    anio: "",
    color: "",
    precio_min: 0,
    precio_max: 9999999,
    km_min: 0,
    km_max: 999999,
    pagina: 1,
    cantidad,
  }),

  /** Listado paginado / scroll infinito. */
  listado: (pagina = 1, cantidad = 12): VehiculosQuery => ({
    precio_min: "",
    precio_max: "",
    km_min: "",
    km_max: "",
    pagina,
    cantidad,
  }),

  /** Búsqueda por texto libre. */
  busqueda: (termino: string, pagina = 1, cantidad = 12): VehiculosQuery => ({
    busqueda: termino,
    precio_min: "",
    precio_max: "",
    km_min: "",
    km_max: "",
    pagina,
    cantidad,
  }),
} as const;

/* ──────────────────────── respuesta cruda (real) ─────────────────────────── */

/** Un auto tal como lo devuelve la API. */
export type AutoRaw = {
  id_row: number;
  id_partida: number;
  anio: string;
  clave_marca: number;
  marca: string;
  clave_modelo: number;
  modelo: string;
  modelo_string: string;
  clave_tipo: number;
  /** Versión / trim. Ej. "5p HD V8/6.0 Aut 4WD". */
  tipo: string;
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
  /** Mensualidad estimada. Viene con ruido de coma flotante (11586.6299999…). */
  monto_mes: number;
  meses: number;
  /** Nombres de archivo, NO URLs. Se prefijan con IMAGES_BASE. */
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
  filters: number;
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

/** Prefija un nombre de archivo con la base de imágenes. */
export function imagenUrl(nombre: string): string {
  if (/^https?:\/\//i.test(nombre)) return nombre;
  return `${IMAGES_BASE}/${nombre.replace(/^\//, "")}`;
}

export function normalizeVehiculo(raw: AutoRaw): Vehiculo {
  const anio = Number(raw.anio);

  return {
    id: String(raw.id_partida),
    marca: raw.marca ?? "",
    modelo: raw.modelo_string || raw.modelo || "",
    version: raw.tipo ?? "",
    anio: Number.isFinite(anio) ? anio : null,
    precio: typeof raw.precio_estimado_venta === "number" ? raw.precio_estimado_venta : null,
    km: typeof raw.kms === "number" ? raw.kms : null,
    transmision: raw.transmision ?? "",
    combustible: raw.tipo_combustible ?? "",
    color: raw.color ?? "",
    segmento: raw.segmento ?? "",
    // monto_mes llega con ruido de float (11586.629999999999): a pesos enteros.
    mensualidad: typeof raw.monto_mes === "number" ? Math.round(raw.monto_mes) : null,
    meses: typeof raw.meses === "number" ? raw.meses : null,
    imagenes: (raw.imagenes ?? []).filter(Boolean).map(imagenUrl),
    href: `/compra/${slugify(`${raw.marca}-${raw.modelo_string || raw.modelo}-${raw.id_partida}`)}`,
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
    throw Object.assign(
      new Error(`La API de vehículos respondió ${res.status}`),
      { status: res.status }
    );
  }

  return res.json();
}
