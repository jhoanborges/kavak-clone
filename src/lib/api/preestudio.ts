/**
 * Endpoints del webservice SEMINUEVOS (pre-estudio de crédito).
 *
 * Transcrito de "Webservice API EXT VALUE SEMINUEVOS" v1.3.
 *
 * Contrato COMÚN a todos:
 *  - Método: POST
 *  - Cabeceras: Authorization: Bearer <token>, Content-Type: application/json
 *  - Cuerpo:    { "Content": base64(JSON) }   (los métodos sin entrada no lo llevan)
 *  - Respuesta: base64(JSON) con forma { "Status": 1, ... } | { "Status": 0, "Body": "<error>" }
 *
 * El HOST sale de PREESTUDIO_ORIGIN (ver src/lib/env.ts), que ya aplica el
 * cambio dev/prod. Aquí sólo viven las RUTAS.
 */

import { PREESTUDIO_ORIGIN } from "@/lib/env";

export const PREESTUDIO_ENDPOINTS = {
  /** Catálogos para armar la dirección del prospecto (dropdowns encadenados). */
  catalogos: {
    pais: "/CATALOGOS/PAIS",
    estado: "/CATALOGOS/ESTADO",
    municipio: "/CATALOGOS/MUNICIPIO",
    colonia: "/CATALOGOS/COLONIA",
    cp: "/CATALOGOS/CP",
  },

  /** Flujo de precotización / pre-estudio. */
  precotizacion: {
    /** Autogenera el RFC a partir de nombre + fecha de nacimiento. */
    generaRfc: "/PRECOTIZACION/GENERA_RFC",
    /** Autogenera la CURP (requiere clave_entidad_estado del catálogo de estados). */
    generaCurp: "/PRECOTIZACION/GENERA_CURP",
    /** Simulador de mensualidades (rentas, capital, enganche). */
    mensualidades: "/PRECOTIZACION/MENSUALIDADES",
    /** Alta del prospecto = envío del pre-estudio. Devuelve clave_preestudio. */
    prospecto: "/PRECOTIZACION/PROSPECTO",
    /** Lista los tipos de documento requeridos. */
    documentosListar: "/PRECOTIZACION/SEL/DOCUMENTOS",
    /** Sube un documento (nombre + archivo en base64). */
    documentosSubir: "/PRECOTIZACION/INS/DOCUMENTOS",
  },

  /** Buró de crédito: autorización, firma FDD y consulta. */
  buro: {
    /** Crea la autorización de consulta de buró. Devuelve folio_autorizacion. */
    autorizacion: "/PRECOTIZACION/BC/AUTORIZACION",
    /** Inicia la Firma Digital de Documentos (FDD). Devuelve link de autologin. */
    fddInicia: "/PRECOTIZACION/BC/PF/FDD",
    /** Estatus de la FDD: FIRM | PROF | EXPI | RECH. */
    fddEstatus: "/PRECOTIZACION/BC/PF/FDD/ESTATUS",
    /** Cierra la FDD y valida los datos contra la identificación. */
    fddFin: "/PRECOTIZACION/BC/PF/FDD/FIN",
    /** Consulta final de buró: APROBADO | NO APROBADO. */
    consulta: "/PRECOTIZACION/BC/CONSULTA",
  },
} as const;

/** Une PREESTUDIO_ORIGIN con una ruta del mapa de endpoints. */
export function preestudioUrl(path: string): string {
  if (!PREESTUDIO_ORIGIN) {
    throw new Error(
      "PREESTUDIO_ORIGIN está vacío: define NEXT_PUBLIC_PREESTUDIO_URL en .env."
    );
  }
  return `${PREESTUDIO_ORIGIN}${path}`;
}
