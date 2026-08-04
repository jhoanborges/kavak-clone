/**
 * Captura de lead para "Agendar una cita".
 *
 * ⚠️ LAS TRES FUNCIONES DE ABAJO SON STUBS. No hay backend todavía: no se envía
 * ningún SMS ni correo, y `verificarCodigo` acepta cualquier código de 6
 * dígitos. La interfaz completa funciona para poder revisarla, pero NO PONER
 * ESTO EN PRODUCCIÓN sin conectar los endpoints reales.
 *
 * Un OTP que valida cualquier cosa es peor que no tener OTP: aparenta
 * verificación y no verifica nada.
 *
 * Al conectar el backend, cambiar sólo este archivo — el flujo consume estas
 * tres funciones y nada más.
 */

export type Canal = "telefono" | "email";

export type PreferenciaContacto = "whatsapp" | "llamada" | "email";

export type LeadIdentidad = {
  canal: Canal;
  /** Teléfono a 10 dígitos o correo, según `canal`. */
  valor: string;
};

export type LeadDatos = {
  nombre: string;
  apellido: string;
  email: string;
  preferencias: PreferenciaContacto[];
  /** Id del vehículo que originó la solicitud, si venía de una ficha. */
  vehiculoId?: string;
};

export type ResultadoStub = { ok: true } | { ok: false; error: string };

/** Espera artificial para que los estados de carga se puedan revisar. */
const fingirLatencia = () => new Promise((r) => setTimeout(r, 700));

/** TODO: POST real al endpoint que dispara el SMS o el correo. */
export async function enviarCodigo(
  _identidad: LeadIdentidad
): Promise<ResultadoStub> {
  await fingirLatencia();
  return { ok: true };
}

/**
 * TODO: POST real de verificación.
 *
 * Hoy sólo comprueba el formato. Deliberadamente NO acepta "000000" ni
 * "123456": si alguien prueba el flujo con un código obvio y pasa, es fácil
 * creer que la verificación funciona.
 */
export async function verificarCodigo(
  _identidad: LeadIdentidad,
  codigo: string
): Promise<ResultadoStub> {
  await fingirLatencia();

  if (!/^\d{6}$/.test(codigo)) {
    return { ok: false, error: "El código debe tener 6 dígitos." };
  }
  if (codigo === "000000" || codigo === "123456") {
    return { ok: false, error: "Ese código no es válido. Revisa el que te enviamos." };
  }
  return { ok: true };
}

/** TODO: POST real que crea el lead en el CRM. */
export async function registrarLead(
  _identidad: LeadIdentidad,
  _datos: LeadDatos
): Promise<ResultadoStub> {
  await fingirLatencia();
  return { ok: true };
}

/* ──────────────────────────────── formato ───────────────────────────────── */

/** Teléfono mexicano a 10 dígitos: 81 1234 5678 */
export function formatearTelefono(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
}

export function telefonoValido(valor: string): boolean {
  return valor.replace(/\D/g, "").length === 10;
}

export function emailValido(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}

/** Cómo se muestra el destino en la pantalla del código. */
export function destinoLegible(identidad: LeadIdentidad): string {
  return identidad.canal === "telefono"
    ? `+52 ${formatearTelefono(identidad.valor)}`
    : identidad.valor;
}
