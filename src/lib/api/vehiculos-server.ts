import "server-only";

import {
  catalogoCompleto,
  detalleVehiculo,
  listadoVehiculos,
  type TradeinCatalogos,
  type TradeinDetallePrecio,
  type TradeinImagen,
  type TradeinVehiculo,
} from "@/lib/api/tradein";
import {
  type AutoRaw,
  type FiltrosRaw,
  type GrupoFotos,
  imagenUrl,
  normalizeVehiculo,
  type Plazo,
  type Vehiculo,
  type VehiculosQuery,
  type VehiculosRespuestaRaw,
} from "@/lib/api/vehiculos";

/**
 * Catálogo, lado SERVIDOR. Habla con el webservice TRADEIN (token + IP interna)
 * y traduce su forma cruda a los tipos que consume la UI.
 *
 * `import "server-only"` es la barrera: si alguien lo importa desde un componente
 * cliente, el build falla en vez de filtrar el token/Buffer al navegador.
 */

/* ─────────────────────────────── mapeos ──────────────────────────────────── */

/** Índice id_partida -> nombres de archivo de imagen. */
function indexarImagenes(imagenes: TradeinImagen[]): Map<number, string[]> {
  const idx = new Map<number, string[]>();
  for (const img of imagenes ?? []) {
    if (!img?.nombre_imagen) continue;
    const lista = idx.get(img.id_partida) ?? [];
    lista.push(img.nombre_imagen);
    idx.set(img.id_partida, lista);
  }
  return idx;
}

/** Un vehículo del listado TRADEIN -> forma cruda que normaliza la UI. */
function mapVehiculoRaw(v: TradeinVehiculo, imagenes: string[]): AutoRaw {
  return {
    id_partida: v.id_partida,
    anio: v.anio,
    clave_marca: v.clave_marca,
    marca: v.marca,
    clave_modelo: v.clave_modelo,
    modelo: v.modelo,
    modelo_string: v.modelo_string,
    clave_tipo: v.clave_tipo,
    tipo: v.tipo,
    kms: v.kms,
    precio_estimado_venta: v.precio_estimado_venta,
    clave_segmento: v.clave_segmento,
    segmento: v.segmento,
    clave_tipo_combustible: v.clave_tipo_combustible,
    tipo_combustible: v.tipo_combustible,
    clave_color: v.clave_color,
    color: v.color,
    clave_transmision: v.clave_transmision,
    transmision: v.transmision,
    monto_mes: v.monto_mes,
    meses: v.meses,
    imagenes,
  };
}

/** Facetas TRADEIN -> FiltrosRaw (anida los modelos bajo su marca). */
function mapCatalogos(cat: TradeinCatalogos | undefined): FiltrosRaw {
  const c = cat ?? ({} as TradeinCatalogos);
  const modelos = c.Modelo ?? [];

  return {
    marcas: (c.Marca ?? []).map((m) => ({
      clave_marca: m.clave_marca,
      marca: m.marca,
      total_clave_marca: m.total_clave_marca,
      modelos: modelos
        .filter((mo) => mo.clave_marca === m.clave_marca)
        .map((mo) => ({
          clave_marca: mo.clave_marca,
          marca: mo.marca,
          clave_modelo: mo.clave_modelo,
          modelo: mo.modelo,
          total_clave_modelo: mo.total_clave_modelo,
        })),
    })),
    anios: c.Anio ?? [],
    segmentos: c.Segmento ?? [],
    transmisiones: c.Transmision ?? [],
    colores: c.Color ?? [],
  };
}

/* ─────────────────────── traducción de la query ──────────────────────────── */

/** Primer entero de un valor de query ("11" -> 11); vacío -> undefined. */
function claveArr(valor: string | number | undefined): number[] | undefined {
  if (valor === undefined || valor === "") return undefined;
  const n = Number(valor);
  return Number.isFinite(n) ? [n] : undefined;
}

function textoArr(valor: string | number | undefined): string[] | undefined {
  if (valor === undefined || valor === "") return undefined;
  return [String(valor)];
}

/**
 * Traduce nuestra query pública a los filtros de LISTADO_CAT_VEHICULOS y
 * devuelve la forma cruda que consume el cliente (`normalizeRespuesta`).
 */
export async function listadoRaw(
  query: VehiculosQuery
): Promise<VehiculosRespuestaRaw> {
  const pagina = Math.max(1, Number(query.pagina) || 1);
  const cantidad = Math.max(1, Number(query.cantidad) || 12);
  const registroInicial = (pagina - 1) * cantidad;

  const tienePrecio =
    query.precio_min !== undefined && query.precio_min !== "" ||
    query.precio_max !== undefined && query.precio_max !== "";
  const tieneKm =
    query.km_min !== undefined && query.km_min !== "" ||
    query.km_max !== undefined && query.km_max !== "";

  const resp = await listadoVehiculos(
    {
      registroInicial,
      registroFinal: registroInicial + cantidad,
      anio: textoArr(query.anio),
      color: claveArr(query.color),
      marca: claveArr(query.marca),
      segmento: claveArr(query.segmento),
      transmision: claveArr(query.transmision),
      precioMin: tienePrecio ? Number(query.precio_min) || 0 : undefined,
      precioMax: tienePrecio ? Number(query.precio_max) || undefined : undefined,
      kmsMin: tieneKm ? Number(query.km_min) || 0 : undefined,
      kmsMax: tieneKm ? Number(query.km_max) || undefined : undefined,
      texto: query.busqueda ? String(query.busqueda) : undefined,
    },
    { revalidate: 300 }
  );

  const imgIdx = indexarImagenes(resp.Listado?.Imagenes ?? []);
  const autos = (resp.Listado?.Vehiculos ?? []).map((v) =>
    mapVehiculoRaw(v, imgIdx.get(v.id_partida) ?? [])
  );
  const total = resp.Listado?.Total ?? autos.length;

  return {
    query: query.busqueda ? String(query.busqueda) : "",
    autos,
    total_autos: total,
    paginas: Math.max(1, Math.ceil(total / cantidad)),
    filtros: mapCatalogos(resp.Catalogos),
  };
}

/* ─────────────────────────── fetchers de página ──────────────────────────── */

/** Convierte un vehículo crudo del listado en el tipo normalizado de la UI. */
function normalizarListado(v: TradeinVehiculo, imagenes: string[]): Vehiculo {
  return normalizeVehiculo(mapVehiculoRaw(v, imagenes));
}

/**
 * Ficha por id, en SERVIDOR. Usa DETALLE/VEHICULO para specs + precio y una
 * consulta por segmento para las unidades similares.
 */
export async function fetchVehiculoPorId(
  id: string
): Promise<{ vehiculo: Vehiculo | null; similares: Vehiculo[]; plazos: Plazo[] }> {
  const nid = Number(id);
  if (!Number.isFinite(nid)) return { vehiculo: null, similares: [], plazos: [] };

  const detalle = await detalleVehiculo(nid, { revalidate: 300 });
  const d0 = detalle.Detalle?.[0];
  if (!d0) return { vehiculo: null, similares: [], plazos: [] };

  // Tabla de plazos que devuelve DETALLE (6/12/18/24/36 meses), ascendente.
  const plazos: Plazo[] = (detalle.Precio ?? [])
    .map((p) => ({
      meses: p.num_mes,
      mensualidad: Math.round(p.monto_mes),
      enganche: p.enganche,
    }))
    .sort((a, b) => a.meses - b.meses);

  // Pool de la misma carrocería: sirve para similares y para las fotos de la
  // ficha (DETALLE no devuelve imágenes; el listado sí).
  const pool = await listadoVehiculos(
    { segmento: [d0.clave_segmento], registroInicial: 0, registroFinal: 60 },
    { revalidate: 300 }
  );
  const imgIdx = indexarImagenes(pool.Listado?.Imagenes ?? []);

  const vehiculo = normalizarListado(
    { ...d0, ...precioEnVehiculo(d0, detalle.Precio) },
    imgIdx.get(nid) ?? []
  );

  const OBJETIVO = 4;
  const otros = (pool.Listado?.Vehiculos ?? [])
    .filter((v) => v.id_partida !== nid)
    .map((v) => normalizarListado(v, imgIdx.get(v.id_partida) ?? []));

  let similares = otros.slice(0, OBJETIVO);
  if (similares.length < OBJETIVO) {
    const relleno = await fetchTodosLosVehiculos(20);
    const yaHay = new Set([vehiculo.id, ...similares.map((v) => v.id)]);
    similares = [
      ...similares,
      ...relleno.filter((v) => !yaHay.has(v.id)),
    ].slice(0, OBJETIVO);
  }

  return { vehiculo, similares, plazos };
}

/**
 * De la tabla de plazos elige el de mensualidad más baja (plazo más largo) para
 * el "Desde $X/mes" de la ficha. Devuelve sólo los campos que pisa en el crudo.
 */
function precioEnVehiculo(
  d0: TradeinVehiculo,
  precios: TradeinDetallePrecio[] | undefined
): Pick<TradeinVehiculo, "monto_mes" | "meses" | "precio_estimado_venta"> {
  const filas = precios ?? [];
  const mejor = filas.reduce<TradeinDetallePrecio | null>(
    (min, f) => (min === null || f.monto_mes < min.monto_mes ? f : min),
    null
  );
  return {
    precio_estimado_venta: d0.precio_estimado_venta,
    monto_mes: mejor?.monto_mes ?? d0.monto_mes,
    meses: mejor?.num_mes ?? d0.meses,
  };
}

/** Galería de un vehículo, en SERVIDOR. */
export async function fetchImagenes(id: string): Promise<GrupoFotos[]> {
  const nid = Number(id);
  if (!Number.isFinite(nid)) return [];

  const detalle = await detalleVehiculo(nid, { revalidate: 3600 });
  const d0 = detalle.Detalle?.[0];
  if (!d0) return [];

  // Acota por marca + año para traer la partida (no hay filtro por id).
  const pool = await listadoVehiculos(
    { marca: [d0.clave_marca], anio: [d0.anio], registroInicial: 0, registroFinal: 60 },
    { revalidate: 3600 }
  );
  const nombres = (pool.Listado?.Imagenes ?? [])
    .filter((img) => img.id_partida === nid && img.nombre_imagen)
    .map((img) => img.nombre_imagen);

  if (nombres.length === 0) return [];
  return [{ categoria: "Fotos", fotos: nombres.map(imagenUrl) }];
}

/**
 * Inventario, en SERVIDOR. Lo usan el sitemap y llms.txt.
 * Devuelve [] si la API falla: un sitemap incompleto es un inconveniente, uno
 * que revienta el build es peor.
 */
export async function fetchTodosLosVehiculos(cantidad = 500): Promise<Vehiculo[]> {
  try {
    const resp = await listadoVehiculos(
      { registroInicial: 0, registroFinal: cantidad },
      { revalidate: 3600 }
    );
    const imgIdx = indexarImagenes(resp.Listado?.Imagenes ?? []);
    return (resp.Listado?.Vehiculos ?? []).map((v) =>
      normalizarListado(v, imgIdx.get(v.id_partida) ?? [])
    );
  } catch {
    return [];
  }
}

/** Facetas completas (sin filtrar), en SERVIDOR. */
export async function fetchFiltros(): Promise<FiltrosRaw> {
  const resp = await catalogoCompleto({ revalidate: 3600 });
  return mapCatalogos(resp.Catalogos);
}
