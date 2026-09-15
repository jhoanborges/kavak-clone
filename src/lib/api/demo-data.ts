/**
 * DEMO MODE — catálogo simulado, sin red ni VPN.
 *
 * Con NEXT_PUBLIC_DEMO_MODE=true el cliente TRADEIN (src/lib/api/tradein.ts) NO
 * llama al webservice interno: responde con estos fixtures. Sirve para levantar
 * el sitio en local sin acceso a la IP interna ni al token.
 *
 * Los datos son una muestra real del catálogo público de Value (mismo shape que
 * devuelve TRADEIN). Para más autos en el demo, añade objetos a DEMO_VEHICULOS
 * (con sus imágenes en DEMO_IMAGENES); las facetas de filtros se recalculan solas.
 *
 * Las IMÁGENES no salen de aquí: en demo, imagenUrl() (src/lib/api/vehiculos.ts)
 * las apunta a https://www.valueautos.com.mx/thumbnail/<nombre>.
 */

import type {
  TradeinBusquedaResp,
  TradeinCatalogos,
  TradeinCatCompletoResp,
  TradeinDetalle,
  TradeinDetalleResp,
  TradeinImagen,
  TradeinListadoResp,
  TradeinVehiculo,
  ListadoFiltros,
} from "@/lib/api/tradein";

/** ¿Está activo el demo mode? Público: legible en cliente y servidor. */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/** Base pública de las imágenes en demo (fuera del proxy /api/imagen). */
export const DEMO_IMAGE_BASE = "https://www.valueautos.com.mx/thumbnail";

/* ─────────────────────────────── inventario ──────────────────────────────── */

/** Autos de muestra (shape crudo TRADEIN). Ampliable. */
export const DEMO_VEHICULOS: TradeinVehiculo[] = [
  {
    id_partida: 12577,
    anio: "2016",
    clave_marca: 2,
    marca: "CHEVROLET",
    clave_modelo: 6,
    modelo: "SUBURBAN",
    modelo_string: "SUBURBAN",
    clave_tipo: 5,
    tipo: "5p HD V8/6.0 Aut 4WD",
    kms: 115118,
    precio_estimado_venta: 440000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 10,
    color: "PLATA",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 11586.63,
    meses: 36,
  },
  {
    id_partida: 13423,
    anio: "2023",
    clave_marca: 4,
    marca: "FORD",
    clave_modelo: 31,
    modelo: "TERRITORY",
    modelo_string: "TERRITORY",
    clave_tipo: 1,
    tipo: "5p Ambient L4/1.8/T Aut",
    kms: 38277,
    precio_estimado_venta: 380000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 2,
    color: "ROJO",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 10014.29,
    meses: 36,
  },
  {
    id_partida: 13425,
    anio: "2022",
    clave_marca: 5,
    marca: "HONDA",
    clave_modelo: 3,
    modelo: "CIVIC",
    modelo_string: "CIVIC",
    clave_tipo: 5,
    tipo: "4p i-Style L4/2.0 Aut",
    kms: 60993,
    precio_estimado_venta: 380000,
    clave_segmento: 3,
    segmento: "Sedan",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 9,
    color: "GRIS",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 10014.29,
    meses: 36,
  },
  {
    id_partida: 13435,
    anio: "2022",
    clave_marca: 2,
    marca: "CHEVROLET",
    clave_modelo: 8,
    modelo: "CAPTIVA",
    modelo_string: "CAPTIVA",
    clave_tipo: 7,
    tipo: "5p LT L4/1.5/T Aut 7 Pasajeros",
    kms: 98516,
    precio_estimado_venta: 260000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 2,
    color: "ROJO",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 6869.61,
    meses: 36,
  },
  {
    id_partida: 13440,
    anio: "2021",
    clave_marca: 2,
    marca: "CHEVROLET",
    clave_modelo: 40,
    modelo: "TAHOE",
    modelo_string: "TAHOE",
    clave_tipo: 3,
    tipo: "5p Premier V8/5.3 Aut 4WD",
    kms: 54800,
    precio_estimado_venta: 720000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 8,
    color: "NEGRO",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 18000,
    meses: 36,
  },
  {
    id_partida: 13441,
    anio: "2022",
    clave_marca: 21,
    marca: "TOYOTA",
    clave_modelo: 7,
    modelo: "RAV 4",
    modelo_string: "RAV 4",
    clave_tipo: 2,
    tipo: "5p XLE L4/2.5 Aut",
    kms: 41200,
    precio_estimado_venta: 480000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 11,
    color: "BLANCO",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 12000,
    meses: 36,
  },
  {
    id_partida: 13442,
    anio: "2021",
    clave_marca: 21,
    marca: "TOYOTA",
    clave_modelo: 5,
    modelo: "CAMRY",
    modelo_string: "CAMRY",
    clave_tipo: 4,
    tipo: "4p XSE L4/2.5 Aut",
    kms: 62300,
    precio_estimado_venta: 430000,
    clave_segmento: 3,
    segmento: "Sedan",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 9,
    color: "GRIS",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 10750,
    meses: 36,
  },
  {
    id_partida: 13443,
    anio: "2020",
    clave_marca: 31,
    marca: "JEEP",
    clave_modelo: 1,
    modelo: "WRANGLER",
    modelo_string: "WRANGLER",
    clave_tipo: 6,
    tipo: "5p Sahara V6/3.6 Aut 4WD",
    kms: 71500,
    precio_estimado_venta: 690000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 8,
    color: "NEGRO",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 17250,
    meses: 36,
  },
  {
    id_partida: 13444,
    anio: "2023",
    clave_marca: 30,
    marca: "MAZDA",
    clave_modelo: 39,
    modelo: "CX30",
    modelo_string: "CX30",
    clave_tipo: 2,
    tipo: "5p i Grand Touring L4/2.5 Aut",
    kms: 21800,
    precio_estimado_venta: 410000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 2,
    color: "ROJO",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 10250,
    meses: 36,
  },
  {
    id_partida: 13445,
    anio: "2021",
    clave_marca: 5,
    marca: "HONDA",
    clave_modelo: 15,
    modelo: "HR-V",
    modelo_string: "HR-V",
    clave_tipo: 3,
    tipo: "5p Touring L4/1.8 CVT",
    kms: 48700,
    precio_estimado_venta: 360000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 10,
    color: "PLATA",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 9000,
    meses: 36,
  },
  {
    id_partida: 13446,
    anio: "2022",
    clave_marca: 57,
    marca: "HYUNDAI",
    clave_modelo: 5,
    modelo: "GRAND I10",
    modelo_string: "GRAND I10",
    clave_tipo: 1,
    tipo: "5p GLS L4/1.2 Man",
    kms: 35400,
    precio_estimado_venta: 240000,
    clave_segmento: 12,
    segmento: "Hatchback",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 11,
    color: "BLANCO",
    clave_transmision: 2,
    transmision: "Manual",
    monto_mes: 6000,
    meses: 36,
  },
  {
    id_partida: 13447,
    anio: "2020",
    clave_marca: 13,
    marca: "BMW",
    clave_modelo: 61,
    modelo: "X2",
    modelo_string: "X2",
    clave_tipo: 5,
    tipo: "5p sDrive20i L4/2.0/T Aut",
    kms: 58900,
    precio_estimado_venta: 560000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 8,
    color: "NEGRO",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 14000,
    meses: 36,
  },
  {
    id_partida: 13448,
    anio: "2019",
    clave_marca: 11,
    marca: "AUDI",
    clave_modelo: 4,
    modelo: "Q5",
    modelo_string: "Q5",
    clave_tipo: 5,
    tipo: "5p Elite L4/2.0/T Aut",
    kms: 76200,
    precio_estimado_venta: 610000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 9,
    color: "GRIS",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 15250,
    meses: 36,
  },
  {
    id_partida: 13449,
    anio: "2020",
    clave_marca: 15,
    marca: "MERCEDES BENZ",
    clave_modelo: 4,
    modelo: "C 200",
    modelo_string: "C 200",
    clave_tipo: 4,
    tipo: "4p CGI L4/2.0/T Aut",
    kms: 64100,
    precio_estimado_venta: 590000,
    clave_segmento: 3,
    segmento: "Sedan",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 8,
    color: "NEGRO",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 14750,
    meses: 36,
  },
  {
    id_partida: 13450,
    anio: "2021",
    clave_marca: 8,
    marca: "GMC",
    clave_modelo: 2,
    modelo: "ACADIA",
    modelo_string: "ACADIA",
    clave_tipo: 3,
    tipo: "5p Denali V6/3.6 Aut AWD",
    kms: 52400,
    precio_estimado_venta: 650000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 11,
    color: "BLANCO",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 16250,
    meses: 36,
  },
  {
    id_partida: 13451,
    anio: "2022",
    clave_marca: 27,
    marca: "PEUGEOT",
    clave_modelo: 11,
    modelo: "3008",
    modelo_string: "3008",
    clave_tipo: 2,
    tipo: "5p GT Line L4/1.6/T Aut",
    kms: 30100,
    precio_estimado_venta: 470000,
    clave_segmento: 1,
    segmento: "SUVs",
    clave_tipo_combustible: 1,
    tipo_combustible: "Gasolina",
    clave_color: 2,
    color: "ROJO",
    clave_transmision: 1,
    transmision: "Automático",
    monto_mes: 11750,
    meses: 36,
  },
];

/**
 * Imágenes. Las de valueautos.com.mx no son alcanzables (Incapsula cierra la
 * conexión), así que el demo usa fotos reales de auto de Unsplash (host ya
 * permitido en next.config remotePatterns). Son URLs absolutas: imagenUrl() las
 * pasa tal cual, sin proxy ni WAF.
 *
 * Cada auto recibe 3 fotos rotando el pool por su posición en DEMO_VEHICULOS, así
 * los autos nuevos obtienen imágenes sin mantener un mapa por id.
 */
const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=1200&q=75&auto=format&fit=crop`;

const DEMO_IMG_POOL = [
  U("photo-1552519507-da3b142c6e3d"),
  U("photo-1503376780353-7e6692767b70"),
  U("photo-1494976388531-d1058494cdd8"),
  U("photo-1583121274602-3e2820c69888"),
  U("photo-1541899481282-d53bffe3c35d"),
  U("photo-1493238792000-8113da705763"),
  U("photo-1550355291-bbee04a92027"),
];

export const DEMO_IMAGENES: Record<number, string[]> = Object.fromEntries(
  DEMO_VEHICULOS.map((v, i) => [
    v.id_partida,
    [0, 1, 2].map((k) => DEMO_IMG_POOL[(i + k) % DEMO_IMG_POOL.length]),
  ])
);

/* ─────────────────────────────── facetas ─────────────────────────────────── */

/** Cuenta ocurrencias por clave, conservando el primer valor de etiqueta. */
function contar<T, K extends string | number>(
  items: T[],
  clave: (x: T) => K,
  etiqueta: (x: T) => Record<string, unknown>
): Array<Record<string, unknown> & { total: number }> {
  const map = new Map<K, Record<string, unknown> & { total: number }>();
  for (const it of items) {
    const k = clave(it);
    const prev = map.get(k);
    if (prev) prev.total += 1;
    else map.set(k, { ...etiqueta(it), total: 1 });
  }
  return [...map.values()];
}

/** Construye las facetas TRADEIN a partir de un conjunto de vehículos. */
function construirCatalogos(vs: TradeinVehiculo[]): TradeinCatalogos {
  return {
    Anio: contar(
      vs,
      (v) => v.anio,
      (v) => ({ anio: v.anio })
    ).map((r) => ({ anio: r.anio as string, total_anio: r.total })),
    Color: contar(
      vs,
      (v) => v.clave_color,
      (v) => ({ clave_color: v.clave_color, color: v.color })
    ).map((r) => ({
      clave_color: r.clave_color as number,
      color: r.color as string,
      total_clave_color: r.total,
    })),
    Marca: contar(
      vs,
      (v) => v.clave_marca,
      (v) => ({ clave_marca: v.clave_marca, marca: v.marca })
    ).map((r) => ({
      clave_marca: r.clave_marca as number,
      marca: r.marca as string,
      total_clave_marca: r.total,
    })),
    Modelo: contar(
      vs,
      (v) => `${v.clave_marca}:${v.clave_modelo}`,
      (v) => ({
        clave_marca: v.clave_marca,
        marca: v.marca,
        clave_modelo: v.clave_modelo,
        modelo: v.modelo,
      })
    ).map((r) => ({
      clave_marca: r.clave_marca as number,
      marca: r.marca as string,
      clave_modelo: r.clave_modelo as number,
      modelo: r.modelo as string,
      total_clave_modelo: r.total,
    })),
    Segmento: contar(
      vs,
      (v) => v.clave_segmento,
      (v) => ({ clave_segmento: v.clave_segmento, segmento: v.segmento })
    ).map((r) => ({
      clave_segmento: r.clave_segmento as number,
      segmento: r.segmento as string,
      total_clave_segmento: r.total,
    })),
    Transmision: contar(
      vs,
      (v) => v.clave_transmision,
      (v) => ({ clave_transmision: v.clave_transmision, transmision: v.transmision })
    ).map((r) => ({
      clave_transmision: r.clave_transmision as number,
      transmision: r.transmision as string,
      total_clave_transmision: r.total,
    })),
  };
}

/* ─────────────────────────────── filtrado ────────────────────────────────── */

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Aplica los filtros del listado sobre el inventario demo. */
function filtrar(f: ListadoFiltros): TradeinVehiculo[] {
  return DEMO_VEHICULOS.filter((v) => {
    if (f.anio?.length && !f.anio.includes(v.anio)) return false;
    if (f.color?.length && !f.color.includes(v.clave_color)) return false;
    if (f.marca?.length && !f.marca.includes(v.clave_marca)) return false;
    if (f.segmento?.length && !f.segmento.includes(v.clave_segmento)) return false;
    if (f.transmision?.length && !f.transmision.includes(v.clave_transmision))
      return false;
    if (
      f.modelo?.length &&
      !f.modelo.some(
        (m) => m.clave_marca === v.clave_marca && m.clave_modelo === v.clave_modelo
      )
    )
      return false;
    if (f.precioMin !== undefined && v.precio_estimado_venta < f.precioMin)
      return false;
    if (f.precioMax !== undefined && v.precio_estimado_venta > f.precioMax)
      return false;
    if (f.kmsMin !== undefined && v.kms < f.kmsMin) return false;
    if (f.kmsMax !== undefined && v.kms > f.kmsMax) return false;
    if (f.texto) {
      const t = norm(f.texto);
      const heno = norm(`${v.marca} ${v.modelo} ${v.tipo ?? ""} ${v.anio}`);
      if (!heno.includes(t)) return false;
    }
    return true;
  });
}

/** Imágenes (shape TRADEIN) de un conjunto de vehículos. */
function imagenesDe(vs: TradeinVehiculo[]): TradeinImagen[] {
  const out: TradeinImagen[] = [];
  for (const v of vs) {
    (DEMO_IMAGENES[v.id_partida] ?? []).forEach((nombre, i) => {
      out.push({
        id_partida: v.id_partida,
        id_image: i + 1,
        nombre_imagen: nombre,
        clave_categoria_imagen: null,
        clave_tipo_acc_imagen: null,
      });
    });
  }
  return out;
}

/* ─────────────────────────── respuestas simuladas ────────────────────────── */

/** LISTADO_CAT_VEHICULOS simulado: filtra, pagina y adjunta facetas + imágenes. */
export function demoListado(f: ListadoFiltros): TradeinListadoResp {
  const filtrados = filtrar(f);
  const inicial = f.registroInicial ?? 0;
  // Registro_Final = 0 significa "sin corte" en el contrato; aquí = todos.
  const final = f.registroFinal && f.registroFinal > inicial ? f.registroFinal : undefined;
  const pagina = final === undefined ? filtrados : filtrados.slice(inicial, final);

  return {
    Status: 1,
    Catalogos: construirCatalogos(DEMO_VEHICULOS),
    Listado: {
      Total: filtrados.length,
      Vehiculos: pagina,
      Imagenes: imagenesDe(pagina),
    },
  };
}

/** LISTADO_CAT_COMPLETO simulado: todas las facetas sin filtrar. */
export function demoCatalogoCompleto(): TradeinCatCompletoResp {
  return { Status: 1, Catalogos: construirCatalogos(DEMO_VEHICULOS) };
}

const PLAZOS_DEMO = [6, 12, 18, 24, 36];

/** DETALLE/VEHICULO simulado: ficha + tabla de plazos sintética. */
export function demoDetalle(idPartida: number): TradeinDetalleResp {
  const v = DEMO_VEHICULOS.find((x) => x.id_partida === idPartida);
  if (!v) return { Status: 0, Precio: [], Detalle: [] };

  const detalle: TradeinDetalle = {
    ...v,
    clave_traccion: null,
    traccion: null,
    puertas: null,
    interiores: null,
    equipo_sonido: null,
    llanta_refaccion: null,
    clima: null,
    nivel_gas: null,
  };

  const Precio = PLAZOS_DEMO.map((m) => ({
    id_partida: v.id_partida,
    precio_estimado_venta: v.precio_estimado_venta,
    enganche: null,
    monto_mes: Math.round(v.precio_estimado_venta / m),
    num_mes: m,
  }));

  return { Status: 1, Precio, Detalle: [detalle] };
}

/** LISTADO_BUSQUEDA simulado: autocomplete por texto. */
export function demoBusqueda(termino: string): TradeinBusquedaResp {
  const t = norm(termino);
  const hits = DEMO_VEHICULOS.filter((v) =>
    norm(`${v.marca} ${v.modelo} ${v.tipo ?? ""}`).includes(t)
  );
  const marcasVistas = new Map<string, string>();
  for (const v of hits) marcasVistas.set(String(v.clave_marca), v.marca);

  return {
    Status: 1,
    Cadena_a_Buscar: termino,
    Posibles_Marcas: [...marcasVistas].map(([clave_marca, marca]) => ({
      clave_marca,
      marca,
    })),
    Posibles_Resultados: hits.map((v) => ({
      anio: v.anio,
      clave_marca: String(v.clave_marca),
      marca: v.marca,
      clave_modelo: String(v.clave_modelo),
      modelo: v.modelo,
      clave_tipo: v.clave_tipo === null ? null : String(v.clave_tipo),
      tipo: v.tipo,
      descripcion: `${v.marca} ${v.modelo} ${v.anio} ${v.tipo ?? ""}`.trim(),
    })),
  };
}
