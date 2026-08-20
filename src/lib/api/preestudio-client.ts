/**
 * Cliente del webservice pre-estudio / BC (vía proxy /api/preestudio).
 *
 * Cada función mapea un método de la doc. El proxy resuelve token, base64 y
 * CORS; aquí solo van tipos + el desempaquetado de { Status, Body }.
 *
 * ERRORES: el webservice usa { Status: 0, Body: "<mensaje>" } para fallos.
 * `call` los convierte en Error(mensaje) para que la UI los muestre tal cual.
 */

export type Pais = { clave_pais: number; pais: string };
export type Estado = {
  clave_estado: number;
  estado: string;
  clave_entidad_para_curp: number;
  clave_pais: number;
};
export type Municipio = {
  clave_municipio: number;
  municipio: string;
  clave_pais: number;
  clave_estado: number;
};
export type Colonia = {
  clave_colonia: number;
  colonia: string;
  codigo_postal: string;
  tipo_asenta: string;
  zona: string;
  clave_pais: number;
  clave_estado: number;
  clave_municipio: number;
};
export type TipoDocumento = { clave_tipo_documento: number; documento: string };

export type ResultadoPreestudio = {
  Clave_Preestudio: number;
  Clave_Prospecto: number;
  /** 1 = prospecto guardado; 0 = rechazado (ver Mensaje_Prospecto). */
  Resultado_Prospecto: number;
  Mensaje_Prospecto: string;
};

type SobreStatus = { Status?: number; Body?: unknown };

/** Llama al proxy y desempaqueta. Lanza con el mensaje de la API si Status != 1. */
async function call<T extends object>(
  endpoint: string,
  payload?: unknown
): Promise<T> {
  const res = await fetch("/api/preestudio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint, payload }),
  });

  const data = (await res.json().catch(() => ({}))) as SobreStatus & {
    error?: string;
  } & Record<string, unknown>;

  if (!res.ok) {
    throw new Error(data.error || `El servicio respondió ${res.status}.`);
  }
  if (data.Status !== 1) {
    const msg = typeof data.Body === "string" ? data.Body : "La solicitud no fue aceptada.";
    throw new Error(msg);
  }
  return data as unknown as T;
}

/* ── Catálogos ─────────────────────────────────────────────────────────────── */

export const getPaises = () =>
  call<{ Body: Pais[] }>("catalogos.pais").then((d) => d.Body);

export const getEstados = (clave_pais: number) =>
  call<{ Body: Estado[] }>("catalogos.estado", { clave_pais }).then((d) => d.Body);

export const getMunicipios = (clave_pais: number, clave_estado: number) =>
  call<{ Body: Municipio[] }>("catalogos.municipio", { clave_pais, clave_estado }).then(
    (d) => d.Body
  );

export const getColonias = (
  clave_pais: number,
  clave_estado: number,
  clave_municipio: number
) =>
  call<{ Body: Colonia[] }>("catalogos.colonia", {
    clave_pais,
    clave_estado,
    clave_municipio,
  }).then((d) => d.Body);

export const getColoniasPorCp = (cp: string) =>
  call<{ Body: Colonia[] }>("catalogos.cp", { cp }).then((d) => d.Body);

/* ── RFC / CURP ────────────────────────────────────────────────────────────── */

export type DatosGeneraId = {
  nombre_completo: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento_anio: number;
  fecha_nacimiento_mes: number;
  fecha_nacimiento_dia: number;
};

export const generaRfc = (d: DatosGeneraId & { tipo_persona?: "F" | "M" }) =>
  call<{ Body: string }>("precotizacion.generaRfc", {
    tipo_persona: "F",
    ...d,
  }).then((r) => r.Body);

export const generaCurp = (
  d: DatosGeneraId & { genero: "H" | "M"; clave_entidad_estado: number }
) => call<{ Body: string }>("precotizacion.generaCurp", d).then((r) => r.Body);

/* ── Prospecto (pre-estudio) ───────────────────────────────────────────────── */

/** El objeto grande de PROSPECTO. Se arma en la UI a partir de los 3 pasos. */
export type PayloadPreestudio = Record<string, unknown>;

export const enviaPreestudio = (payload: PayloadPreestudio) =>
  call<ResultadoPreestudio>("precotizacion.prospecto", payload);

/* ── Buró ──────────────────────────────────────────────────────────────────── */

export const creaAutorizacionBuro = (
  clave_prospecto_persona: number,
  comentarios = ""
) =>
  call<{ Folio_Autorizacion: number }>("buro.autorizacion", {
    clave_prospecto_persona,
    comentarios,
  }).then((d) => d.Folio_Autorizacion);

export const consultaBuro = (d: {
  clave_preestudio: number;
  clave_prospecto_persona: number;
  folio_autorizacion: number;
}) => call<{ Body: string }>("buro.consulta", d).then((r) => r.Body);

/* ── Documentos ────────────────────────────────────────────────────────────── */

export const listaDocumentos = () =>
  call<{ Body: TipoDocumento[] }>("precotizacion.documentosListar", {
    tipo_persona: 1,
    tipo_personalidad: 1,
  }).then((d) => d.Body);

export const subeDocumento = (d: {
  clave_preestudio: number;
  clave_tipo_documento: number;
  nombre_documento: string;
  BS64: string;
}) => call<{ Body: string }>("precotizacion.documentosSubir", d).then((r) => r.Body);
