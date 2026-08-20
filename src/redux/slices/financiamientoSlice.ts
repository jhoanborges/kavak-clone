import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CotizacionResultado } from "@/lib/api/financiamiento";

/**
 * Caché del financiamiento por vehículo.
 *
 * NO es el mecanismo para compartir: un link abierto en otro navegador no tiene
 * este estado. La fuente de verdad es la URL (id en la ruta + enganche/plazo en
 * query). Esto solo evita el re-cálculo y el parpadeo al navegar internamente
 * desde el cotizador de la ficha a la vista de financiamiento.
 */

export type VehiculoCache = {
  id: string;
  marca: string;
  modelo: string;
  anio: number | null;
  color: string;
  precio: number | null;
};

export type FinanciamientoEntry = {
  vehiculo: VehiculoCache;
  enganche: number;
  cotizacion: CotizacionResultado;
};

export type FinanciamientoState = {
  /** Keyed por id público del vehículo. */
  byId: Record<string, FinanciamientoEntry>;
};

const initialState: FinanciamientoState = { byId: {} };

const financiamientoSlice = createSlice({
  name: "financiamiento",
  initialState,
  reducers: {
    saveFinanciamiento(
      state,
      action: PayloadAction<{ id: string } & FinanciamientoEntry>
    ) {
      const { id, ...entry } = action.payload;
      state.byId[id] = entry;
    },
  },
});

export const { saveFinanciamiento } = financiamientoSlice.actions;
export default financiamientoSlice.reducer;
