/**
 * Respuestas SIMULADAS del webservice pre-estudio para DEMO_MODE.
 *
 * El webservice real vive en IP interna (requiere VPN + token), así que en demo
 * devolvemos datos plausibles con la MISMA forma que la doc, para poder mostrar
 * el flujo completo (catálogos, RFC/CURP, prospecto, buró, documentos) sin red.
 *
 * Solo se usa en el servidor (route handler). No importar desde el cliente.
 */

const PAISES = [
  { clave_pais: 1, pais: "MEXICO" },
  { clave_pais: 2, pais: "ESTADOS UNIDOS" },
];

const ESTADOS = [
  { clave_estado: 1, estado: "NUEVO LEON", clave_entidad_para_curp: 19, clave_pais: 1 },
  { clave_estado: 2, estado: "CIUDAD DE MEXICO", clave_entidad_para_curp: 9, clave_pais: 1 },
  { clave_estado: 3, estado: "JALISCO", clave_entidad_para_curp: 14, clave_pais: 1 },
];

const MUNICIPIOS = [
  { clave_municipio: 973, municipio: "MONTERREY", clave_pais: 1, clave_estado: 1 },
  { clave_municipio: 975, municipio: "APODACA", clave_pais: 1, clave_estado: 1 },
  { clave_municipio: 1000, municipio: "SAN NICOLAS DE LOS GARZA", clave_pais: 1, clave_estado: 1 },
  { clave_municipio: 2000, municipio: "GUADALAJARA", clave_pais: 1, clave_estado: 3 },
];

const COLONIAS = [
  { clave_colonia: 86397, colonia: "PRIVADAS DE ANAHUAC SECTOR NIZA", codigo_postal: "66059", tipo_asenta: "Fraccionamiento", zona: "Urbano", clave_pais: 1, clave_estado: 1, clave_municipio: 975 },
  { clave_colonia: 86399, colonia: "PRIVADAS DEL CANADA", codigo_postal: "66059", tipo_asenta: "Fraccionamiento", zona: "Urbano", clave_pais: 1, clave_estado: 1, clave_municipio: 975 },
  { clave_colonia: 88954, colonia: "CERRADAS DE CASA BLANCA", codigo_postal: "66220", tipo_asenta: "Fraccionamiento", zona: "Urbano", clave_pais: 1, clave_estado: 1, clave_municipio: 1000 },
  { clave_colonia: 90001, colonia: "CENTRO", codigo_postal: "64000", tipo_asenta: "Colonia", zona: "Urbano", clave_pais: 1, clave_estado: 1, clave_municipio: 973 },
];

const DOCUMENTOS = [
  { clave_tipo_documento: 1, documento: "Identificacion Oficial" },
  { clave_tipo_documento: 2, documento: "Comprobante Domicilio" },
  { clave_tipo_documento: 3, documento: "Constancia Situacion Fiscal" },
];

type Payload = Record<string, unknown>;
const num = (v: unknown) => Number(v);

/** Devuelve la respuesta simulada para un endpoint del proxy. */
export function fakePreestudio(endpoint: string, payload: Payload = {}): unknown {
  switch (endpoint) {
    case "catalogos.pais":
      return { Status: 1, Body: PAISES };

    case "catalogos.estado":
      return {
        Status: 1,
        Body: ESTADOS.filter((e) => e.clave_pais === num(payload.clave_pais)),
      };

    case "catalogos.municipio":
      return {
        Status: 1,
        Body: MUNICIPIOS.filter(
          (m) => m.clave_estado === num(payload.clave_estado)
        ),
      };

    case "catalogos.colonia":
      return {
        Status: 1,
        Body: COLONIAS.filter(
          (c) => c.clave_municipio === num(payload.clave_municipio)
        ),
      };

    case "catalogos.cp":
      return {
        Status: 1,
        Body: COLONIAS.filter((c) => c.codigo_postal === String(payload.cp)),
      };

    case "precotizacion.generaRfc":
      return { Status: 1, Body: fakeRfc(payload) };

    case "precotizacion.generaCurp":
      return { Status: 1, Body: fakeCurp(payload) };

    case "precotizacion.prospecto":
      return {
        Status: 1,
        Clave_Preestudio: 17,
        Clave_Prospecto: 10461,
        Resultado_Prospecto: 1,
        Mensaje_Prospecto: "",
      };

    case "precotizacion.documentosListar":
      return { Status: 1, Body: DOCUMENTOS };

    case "precotizacion.documentosSubir":
      return { Status: 1, Body: "Documento guardado exitosamente" };

    case "buro.autorizacion":
      return { Status: 1, Folio_Autorizacion: 1 };

    case "buro.consulta":
      return { Status: 1, Body: "ESTUDIO DE CREDITO: APROBADO" };

    default:
      return { Status: 0, Body: `Endpoint demo no soportado: ${endpoint}` };
  }
}

/** RFC simulado a partir de apellidos + fecha (formato plausible, no oficial). */
function fakeRfc(p: Payload): string {
  const ap = String(p.apellido_paterno ?? "XX").toUpperCase();
  const am = String(p.apellido_materno ?? "X").toUpperCase();
  const nom = String(p.nombre_completo ?? "X").toUpperCase();
  const yy = String(p.fecha_nacimiento_anio ?? "2000").slice(-2);
  const mm = String(p.fecha_nacimiento_mes ?? "1").padStart(2, "0");
  const dd = String(p.fecha_nacimiento_dia ?? "1").padStart(2, "0");
  return `${ap.slice(0, 2)}${am[0] ?? "X"}${nom[0] ?? "X"}${yy}${mm}${dd}A01`;
}

/** CURP simulada (formato plausible, no oficial). */
function fakeCurp(p: Payload): string {
  const base = fakeRfc(p).slice(0, 10);
  const sexo = String(p.genero ?? "H").toUpperCase() === "M" ? "M" : "H";
  return `${base}${sexo}NLXXX09`;
}
