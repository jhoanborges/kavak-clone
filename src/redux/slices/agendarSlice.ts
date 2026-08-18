import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Canal, PreferenciaContacto } from "@/lib/agendar";

/**
 * Datos del embudo de "Agendar una cita", persistidos.
 *
 * QUÉ SE GUARDA: lo que la persona escribió. Cambiar de teléfono a correo, o
 * volver un paso atrás, no debe borrar nada - reescribir lo mismo es la forma
 * más rápida de que alguien abandone.
 *
 * QUÉ NO SE GUARDA, A PROPÓSITO: el código de verificación. Es un secreto de un
 * solo uso y con caducidad; dejarlo en localStorage lo expondría a cualquier
 * script de la página y a quien use el mismo equipo después. Vive sólo en el
 * estado local del componente y muere al recargar.
 *
 * `telefono` y `email` son campos SEPARADOS aunque sólo se use uno para
 * verificar: si compartieran campo, alternar entre canales borraría el otro.
 */
export type AgendarState = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  canal: Canal;
  preferencias: PreferenciaContacto[];
};

const initialState: AgendarState = {
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  canal: "telefono",
  preferencias: ["whatsapp"],
};

const agendarSlice = createSlice({
  name: "agendar",
  initialState,
  reducers: {
    setCampo(
      state,
      action: PayloadAction<{
        campo: keyof Omit<AgendarState, "preferencias" | "canal">;
        valor: string;
      }>
    ) {
      state[action.payload.campo] = action.payload.valor;
    },
    setCanal(state, action: PayloadAction<Canal>) {
      state.canal = action.payload;
    },
    togglePreferencia(state, action: PayloadAction<PreferenciaContacto>) {
      const p = action.payload;
      state.preferencias = state.preferencias.includes(p)
        ? state.preferencias.filter((x) => x !== p)
        : [...state.preferencias, p];
    },
    /** Tras enviar el lead: la siguiente solicitud empieza limpia. */
    limpiarAgendar() {
      return initialState;
    },
  },
});

export const { setCampo, setCanal, togglePreferencia, limpiarAgendar } =
  agendarSlice.actions;
export default agendarSlice.reducer;
