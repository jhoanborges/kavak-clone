import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CarsFilters {
  brands: string[];
  bodyTypes: string[];
  years: number[];
  priceMin: number;
  priceMax: number;
  transmission: string;
  fuels: string[];
  search: string;
}

export interface CarsState {
  filters: CarsFilters;
  selectedCarId: number | null;
  sortBy: string;
  favorites: number[];
}

const initialState: CarsState = {
  filters: {
    brands: [],
    bodyTypes: [],
    years: [],
    priceMin: 0,
    priceMax: 0,
    transmission: "",
    fuels: [],
    search: "",
  },
  selectedCarId: null,
  sortBy: "relevance",
  favorites: [],
};

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    toggleBrand(state, action: PayloadAction<string>) {
      const idx = state.filters.brands.indexOf(action.payload);
      if (idx >= 0) {
        state.filters.brands.splice(idx, 1);
      } else {
        state.filters.brands.push(action.payload);
      }
    },
    toggleBodyType(state, action: PayloadAction<string>) {
      const idx = state.filters.bodyTypes.indexOf(action.payload);
      if (idx >= 0) {
        state.filters.bodyTypes.splice(idx, 1);
      } else {
        state.filters.bodyTypes.push(action.payload);
      }
    },
    toggleYear(state, action: PayloadAction<number>) {
      const idx = state.filters.years.indexOf(action.payload);
      if (idx >= 0) {
        state.filters.years.splice(idx, 1);
      } else {
        state.filters.years.push(action.payload);
      }
    },
    setPriceMin(state, action: PayloadAction<number>) {
      state.filters.priceMin = action.payload;
    },
    setPriceMax(state, action: PayloadAction<number>) {
      state.filters.priceMax = action.payload;
    },
    setTransmission(state, action: PayloadAction<string>) {
      state.filters.transmission = action.payload;
    },
    toggleFuel(state, action: PayloadAction<string>) {
      const idx = state.filters.fuels.indexOf(action.payload);
      if (idx >= 0) {
        state.filters.fuels.splice(idx, 1);
      } else {
        state.filters.fuels.push(action.payload);
      }
    },
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    setSortBy(state, action: PayloadAction<string>) {
      state.sortBy = action.payload;
    },
    setSelectedCar(state, action: PayloadAction<number | null>) {
      state.selectedCarId = action.payload;
    },
    toggleFavorite(state, action: PayloadAction<number>) {
      const idx = state.favorites.indexOf(action.payload);
      if (idx >= 0) {
        state.favorites.splice(idx, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
  },
});

export const {
  toggleBrand,
  toggleBodyType,
  toggleYear,
  setPriceMin,
  setPriceMax,
  setTransmission,
  toggleFuel,
  setSearch,
  setSortBy,
  setSelectedCar,
  toggleFavorite,
  clearFilters,
} = carsSlice.actions;

export default carsSlice.reducer;
