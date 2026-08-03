import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** Cuántas búsquedas recientes se conservan. Las más viejas se descartan. */
export const MAX_RECENT_SEARCHES = 10;

export type RecentSearch = {
  term: string;
  /** Epoch en ms. Se guarda como número para que redux-persist lo serialice. */
  at: number;
};

export type SearchesState = {
  recent: RecentSearch[];
};

const initialState: SearchesState = {
  recent: [],
};

/** Normaliza para comparar: sin acentos, sin mayúsculas, sin espacios extra. */
function normalize(term: string): string {
  return term
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

const searchesSlice = createSlice({
  name: "searches",
  initialState,
  reducers: {
    /**
     * Registra una búsqueda. Más reciente primero.
     *
     * Deduplica de forma laxa —"Audi", "audi " y "AUDÍ" son la misma— pero
     * conserva el texto tal cual lo escribió la persona: es lo que espera ver
     * al volver. Repetir una búsqueda la sube al principio en vez de duplicarla.
     */
    addSearch: {
      reducer(state, action: PayloadAction<RecentSearch>) {
        const term = action.payload.term.trim();
        if (!term) return;

        const key = normalize(term);
        state.recent = [
          action.payload,
          ...state.recent.filter((s) => normalize(s.term) !== key),
        ].slice(0, MAX_RECENT_SEARCHES);
      },
      /**
       * `Date.now()` va aquí, en el prepare, y no dentro del reducer: los
       * reducers deben ser puros para que las devtools y el replay funcionen.
       */
      prepare(term: string) {
        return { payload: { term, at: Date.now() } };
      },
    },

    removeSearch(state, action: PayloadAction<string>) {
      const key = normalize(action.payload);
      state.recent = state.recent.filter((s) => normalize(s.term) !== key);
    },

    clearSearches(state) {
      state.recent = [];
    },
  },
});

export const { addSearch, removeSearch, clearSearches } = searchesSlice.actions;
export default searchesSlice.reducer;
